/**
╭━━━〔 ୨ৎ RUBBY MULTI DEVICE ୨ৎ 〕━━━╮
┇
┇       ✦ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗥𝗨𝗕𝗕𝗬 ✦
┇          ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა ♡
┇
┇      ░▒▓█ 𝗥 𝗨 𝗕 𝗕 𝗬 █▓▒░
┇          MULTI DEVICE SYSTEM
┇
┇  ──────── ୨୧ ────────
┇        ♡ JADIBOT ENGINE ♡
┇  ──────── ୨୧ ────────
┇   ↳ Modular Multi-Session JadiBot Manager
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import chalk from 'chalk'
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  fetchLatestWaWebVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  Browsers,
  jidDecode,
  Button
} from 'rubyy-baileys'

import bindMessageHelpers from './message.js'
import { messageHandler } from '../handler.js'
import logger from './logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const sessionsDir = path.resolve(__dirname, '../session/jadibot')

if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true })
}

class TTLMap {
  constructor(ttlMs = 300000) {
    this.ttlMs = ttlMs
    this.map = new Map()
  }
  set(key, val) {
    this.map.set(key, { val, exp: Date.now() + this.ttlMs })
  }
  get(key) {
    const item = this.map.get(key)
    if (!item) return null
    if (Date.now() > item.exp) {
      this.map.delete(key)
      return null
    }
    return item.val
  }
  has(key) {
    return this.get(key) !== null
  }
  delete(key) {
    return this.map.delete(key)
  }
  keys() {
    const now = Date.now()
    const valid = []
    for (const [k, v] of this.map.entries()) {
      if (now <= v.exp) valid.push(k)
      else this.map.delete(k)
    }
    return valid
  }
}

const groupCache = new TTLMap(5 * 60 * 1000)
export const bots = new Map()
export const reconnectAttempts = new Map()
export const pairingInProgress = new Set()
let cachedRegistry = null

export function setJadibotRegistry(reg) {
  if (reg) cachedRegistry = reg
}

export function getCleanNumber(num = '') {
  return String(num || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
}

export function getBots() {
  return bots
}

export function hasBot(number) {
  const cleanNumber = getCleanNumber(number)
  return bots.has(cleanNumber)
}

export function getBot(number) {
  const cleanNumber = getCleanNumber(number)
  return bots.get(cleanNumber) || null
}

export function listJadiBots() {
  const list = []
  for (const [number, data] of bots.entries()) {
    list.push({
      number,
      connectedAt: data.connectedAt || 0,
      uptime: data.connectedAt ? Math.floor((Date.now() - data.connectedAt) / 1000) : 0,
      session: data.session
    })
  }
  return list
}

export async function stopJadiBot(number) {
  const cleanNumber = getCleanNumber(number)
  if (!cleanNumber) return { success: false, reason: 'invalid_number' }

  const bot = bots.get(cleanNumber)
  if (!bot) return { success: false, reason: 'not_found' }

  bots.delete(cleanNumber)
  reconnectAttempts.delete(cleanNumber)

  try {
    if (bot.socket) {
      bot.socket.ev?.removeAllListeners()
      await bot.socket.logout()
    }
  } catch {}

  const sessionPath = bot.session || path.join(sessionsDir, cleanNumber)
  if (fs.existsSync(sessionPath)) {
    try {
      fs.rmSync(sessionPath, { recursive: true, force: true })
    } catch (e) {
      logger.error(`[Jadibot] Failed to remove session for ${cleanNumber}:`, e)
    }
  }

  logger.system(`[Jadibot] Stopped and session deleted for: ${cleanNumber}`)
  return { success: true, number: cleanNumber }
}

export async function startJadiBot(number, m = null, isAutoStart = false, customRegistry = null) {
  const cleanNumber = getCleanNumber(number)
  if (!cleanNumber) return null

  if (customRegistry) {
    cachedRegistry = customRegistry
  }

  const sessionPath = path.join(sessionsDir, cleanNumber)
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true })
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  let v = [2, 3000, 1049236237]
  try {
    const waVer = await fetchLatestWaWebVersion().catch(() => null)
    if (waVer?.version) v = waVer.version
    else {
      const bVer = await fetchLatestBaileysVersion().catch(() => null)
      if (bVer?.version) v = bVer.version
    }
  } catch {}

  const rawSock = makeWASocket({
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    version: v,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    defaultQueryTimeoutMs: 60000
  })

  rawSock.isJadiBot = true
  const clients = bindMessageHelpers(rawSock)
  clients.isJadiBot = true
  clients.mode = 'public'
  clients.registry = customRegistry || cachedRegistry || global.registry

  clients.ev.on('creds.update', saveCreds)

  clients.getJid = (jid) => {
    if (!jid?.endsWith('@lid')) return jid
    for (const key of groupCache.keys()) {
      const group = groupCache.get(key)
      const user = group?.participants?.find(p => p.lid === jid || p.id === jid)
      if (user) return user.phoneNumber || user.jid || user.id
    }
    return jid
  }

  clients.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {}
      return (decode.user && decode.server && decode.user + '@' + decode.server) || jid
    }
    return jid
  }

  clients.getCachedGroupMetadata = async (jid) => {
    let metadata = groupCache.get(jid)
    if (!metadata) {
      metadata = await clients.groupMetadata(jid)
      groupCache.set(jid, metadata)
    }
    return metadata
  }

  clients.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'connecting') {
      logger.system(`[Jadibot] Connecting: ${cleanNumber}`)
    }

    if (connection === 'open') {
      logger.system(`[Jadibot] Connected successfully: ${cleanNumber}`)
      reconnectAttempts.set(cleanNumber, 0)
      clients.connectedTime = Date.now()

      bots.set(cleanNumber, {
        socket: clients,
        session: sessionPath,
        connectedAt: Date.now()
      })

      const successText =
        `╭─── ୨ৎ *JADIBOT TERHUBUNG* ୨ৎ ───╮\n` +
        `│\n` +
        `├─ ♡ Nomor  : +${cleanNumber}\n` +
        `├─ ♡ Status : Aktif & Terhubung ✨\n` +
        `└─ ♡ Mode   : Public 🌐\n` +
        `╰─────────────────────────────────╯\n` +
        `🎉 *Jadibot kamu berhasil aktif!*\n` +
        `• Ketik *.menu* untuk melihat fitur\n` +
        `• Ketik *.stopjadibot ${cleanNumber}* untuk mematikan`

      if (m?.chat && !isAutoStart) {
        try {
          const mainSocket = global.conn || global.mainSock || clients
          let sent = false
          try {
            const btn = new Button(mainSocket)
              .setBody(successText)
              .addButton('📋 List Jadibot', '.listjadibot')
              .addButton('⏹️ Stop Jadibot', `.stopjadibot ${cleanNumber}`)
            await btn.send(m.chat, { quoted: m.raw || m })
            sent = true
          } catch {}

          if (!sent) {
            await m.reply(successText)
          }
        } catch {}
      }

      // Kirim konfirmasi langsung ke chat nomor JadiBot sendiri
      try {
        const myJid = clients.user?.id ? clients.decodeJid(clients.user.id) : `${cleanNumber}@s.whatsapp.net`
        await clients.sendMessage(myJid, { text: successText })
      } catch {}
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
      logger.warn(`[Jadibot] Connection closed for ${cleanNumber}: ${reason}`)

      bots.delete(cleanNumber)

      if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.badSession) {
        logger.error(`[Jadibot] Session logged out / bad session for ${cleanNumber}. Purging session directory.`)
        if (fs.existsSync(sessionPath)) {
          try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch {}
        }
        reconnectAttempts.delete(cleanNumber)
        return
      }

      const currentAttempts = (reconnectAttempts.get(cleanNumber) || 0) + 1
      reconnectAttempts.set(cleanNumber, currentAttempts)

      if (currentAttempts > 5) {
        logger.error(`[Jadibot] Max reconnect attempts reached for ${cleanNumber}`)
        reconnectAttempts.delete(cleanNumber)
        return
      }

      const delayMs = Math.min(30000, 5000 * currentAttempts)
      logger.system(`[Jadibot] Reconnecting ${cleanNumber} in ${delayMs / 1000}s (Attempt ${currentAttempts}/5)...`)

      setTimeout(async () => {
        try {
          await startJadiBot(cleanNumber, m, true, cachedRegistry)
        } catch (e) {
          logger.error(`[Jadibot] Reconnect failed for ${cleanNumber}:`, e)
        }
      }, delayMs)
    }
  })

  // Pairing code generator for unregistered session
  if (!state.creds.registered && !pairingInProgress.has(cleanNumber)) {
    pairingInProgress.add(cleanNumber)

    setTimeout(async () => {
      try {
        if (state.creds.registered) return
        const customCode = (global.customPairingCode || 'RUBBYMD1').trim()
        const code = await clients.requestPairingCode(cleanNumber, customCode)
        const formattedCode = code ? code.match(/.{1,4}/g)?.join('-') || code : customCode

        if (m?.chat) {
          const pairingText =
            `╭─── ୨ৎ *PAIRING CODE* ୨ৎ ───╮\n` +
            `│\n` +
            `├─ ♡ Nomor  : +${cleanNumber}\n` +
            `├─ ♡ Kode   : *${formattedCode}*\n` +
            `└─ ♡ Expire : 2 Menit ⏳\n` +
            `╰────────────────────────────╯\n` +
            `Salin kode di bawah lalu masukkan ke WhatsApp:\n` +
            `*Perangkat Tertaut* > *Tautkan dengan nomor telepon*`

          const mainSocket = global.conn || global.mainSock || clients
          let sent = false

          try {
            const btn = new Button(mainSocket)
              .setBody(pairingText)
              .addCopy('📋 Salin Kode Pairing', formattedCode)
            await btn.send(m.chat, { quoted: m.raw || m })
            sent = true
          } catch {}

          if (!sent) {
            try {
              await mainSocket.sendMessage(m.chat, {
                text: pairingText,
                buttons: [
                  {
                    name: 'cta_copy',
                    paramsJson: JSON.stringify({
                      display_text: '📋 Salin Kode Pairing',
                      copy_code: formattedCode
                    })
                  }
                ]
              }, { quoted: m.raw || m })
              sent = true
            } catch {}
          }

          if (!sent) {
            await m.reply(pairingText)
          }
        }
      } catch (e) {
        logger.error(`[Jadibot] Pairing Error for ${cleanNumber}:`, e)
        if (m?.chat) {
          try {
            await m.reply(`❌ *Gagal membuat Pairing Code:*\n${e.message || 'Unknown error'}`)
          } catch {}
        }
        try { await clients.logout() } catch {}
        if (fs.existsSync(sessionPath)) {
          try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch {}
        }
      } finally {
        pairingInProgress.delete(cleanNumber)
      }
    }, 3000)
  }

  // Handle messages on JadiBot socket through Rubby's centralized messageHandler
  clients.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      if (chatUpdate.type !== 'notify') return
      const reg = clients.registry || cachedRegistry || global.registry
      if (reg) {
        await messageHandler(clients, chatUpdate, reg)
      }
    } catch (e) {
      logger.error(`[Jadibot ${cleanNumber}] Message handle error:`, e)
    }
  })

  return clients
}

export const autoStartSavedSessions = async (registry = null) => {
  if (registry) cachedRegistry = registry
  if (!fs.existsSync(sessionsDir)) return

  const folders = fs.readdirSync(sessionsDir).filter(f => {
    const full = path.join(sessionsDir, f)
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'creds.json'))
  })

  if (folders.length > 0) {
    logger.system(`[Jadibot] Auto-reloading ${folders.length} saved jadibot sessions...`)
    for (const folder of folders) {
      if (global.noBot && getCleanNumber(folder) === getCleanNumber(global.noBot)) {
        continue
      }
      try {
        await startJadiBot(folder, null, true, cachedRegistry)
        await new Promise(r => setTimeout(r, 2000))
      } catch (e) {
        logger.error(`[Jadibot] Failed auto-start session ${folder}:`, e)
      }
    }
  }
}

// Delayed auto-start
const autoStartTimer = setTimeout(() => {
  autoStartSavedSessions().catch(() => {})
}, 8000)
if (typeof autoStartTimer.unref === 'function') {
  autoStartTimer.unref()
}

export default {
  startJadiBot,
  stopJadiBot,
  listJadiBots,
  getBot,
  hasBot,
  getBots,
  autoStartSavedSessions,
  setJadibotRegistry,
  sessionsDir
}
