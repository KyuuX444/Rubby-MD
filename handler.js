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
┇        ♡ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗜𝗡𝗙𝗢 ♡
┇  ──────── ୨୧ ────────
┇   ↳ Creator  : Kyuu
┇   ↳ GitHub   : github.com/KyuuX444
┇   ↳ YouTube  : MommyKyuu
┇   ↳ Website  : https://api.kyzzz.xyz
┇
┇  ════════ ◇ ════════
┇        📡 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟
┇  ════════ ◇ ════════
┇   ↳ Updates & Announcements
┇   ↳ https://whatsapp.com/channel/0029VbDXYlKDJ6H1D7Dm0f13
┇
┇  ┌─────── ⟡ ───────┐
┇          ⚙️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
┇  └─────── ⟡ ───────┘
┇   • Runtime  : Node.js
┇   • Engine   : Ruby-Baileys
┇   • Platform : Linux
┇   • Mode     : WhatsApp Multi Device
┇
┇  ──────── ♡ ────────
┇          🌷 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦
┇  ──────── ♡ ────────
┇   › Modular ESM Plugins
┇   › Pairing Code Authentication
┇   › Automatic Plugin Loader
┇   › Lightweight & Fast
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serialize } from './lib/serializer.js'
import logger, { maskSensitive } from './lib/logger.js'
import { normalizeJid, normalizeNumber, recordLidMapping, resolveLidToPn } from './lib/utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const disabledDbFile = path.resolve(__dirname, 'database/disabled_plugins.json')

const groupCache = new Map()
const groupMetadataCache = new Map()
const MAX_CACHE_SIZE = 500

function pruneMap(map, maxSize = 500) {
  if (map.size > maxSize) {
    const keys = Array.from(map.keys())
    const toDelete = keys.slice(0, Math.floor(maxSize / 2))
    for (const k of toDelete) map.delete(k)
  }
}

export async function getGroupMetadata(sock, jid, force = false) {
  if (!jid || !jid.endsWith('@g.us')) return null
  const cached = groupMetadataCache.get(jid)
  if (!force && cached && Date.now() - cached.time < 15000) {
    return cached.data
  }
  try {
    const meta = await sock.groupMetadata(jid)
    if (meta) {
      if (meta.participants && Array.isArray(meta.participants)) {
        for (const p of meta.participants) {
          if (p.lid && p.id && !p.id.endsWith('@lid')) {
            recordLidMapping(p.lid, p.id)
          }
        }
      }
      pruneMap(groupMetadataCache, MAX_CACHE_SIZE)
      pruneMap(groupCache, MAX_CACHE_SIZE)
      groupMetadataCache.set(jid, { data: meta, time: Date.now() })
      if (meta.subject) {
        groupCache.set(jid, { subject: meta.subject, time: Date.now() })
      }
      return meta
    }
  } catch (err) {
    if (cached?.data) return cached.data
    throw err
  }
  return cached?.data || null
}

export function isParticipantAdmin(p) {
  return Boolean(p && (p.admin === 'admin' || p.admin === 'superadmin'))
}

export function getParticipantIdentifiers(p) {
  if (!p) return []
  const ids = [
    p.id,
    p.lid,
    p.jid,
    p.phoneNumber
  ].filter(Boolean)
  const numbers = ids.map(id => normalizeNumber(id)).filter(Boolean)
  return [...new Set([...ids, ...numbers])]
}

export function matchParticipant(p, targets) {
  if (!p || !targets || !targets.length) return false
  const pKeys = getParticipantIdentifiers(p)
  for (const t of targets) {
    if (!t) continue
    if (pKeys.includes(t)) return true
    const normT = normalizeNumber(t)
    if (normT && pKeys.includes(normT)) return true
  }
  return false
}

async function getGroupName(sock, jid) {
  if (!jid || !jid.endsWith('@g.us')) return ''
  const cached = groupCache.get(jid)
  if (cached && Date.now() - cached.time < 300000) return cached.subject
  try {
    const meta = await getGroupMetadata(sock, jid)
    if (meta?.subject) {
      pruneMap(groupCache, MAX_CACHE_SIZE)
      groupCache.set(jid, { subject: meta.subject, time: Date.now() })
      return meta.subject
    }
  } catch {}
  return 'WhatsApp Group'
}

function getDisabledPlugins() {
  if (global.db?.getDisabledPlugins) {
    return global.db.getDisabledPlugins()
  }
  return []
}

const prefixes = ['.', '#', '!', '/', '?', '%', '&', '$', '+', '~']
const processedMessages = new Map()
const DEDUP_TTL_MS = 5 * 60 * 1000

function cleanupDeduplicationCache() {
  const now = Date.now()
  for (const [id, time] of processedMessages.entries()) {
    if (now - time > DEDUP_TTL_MS) {
      processedMessages.delete(id)
    }
  }
  if (processedMessages.size > 2000) {
    const arr = Array.from(processedMessages.keys())
    const toDelete = arr.slice(0, arr.length - 1000)
    for (const id of toDelete) {
      processedMessages.delete(id)
    }
  }
}

function parseCommand(rawText, registry) {
  if (!rawText || typeof rawText !== 'string') {
    return { isCommand: false, usedPrefix: '', command: '', args: [], text: '' }
  }

  const trimmed = rawText.trim()
  let matchedPrefix = ''
  for (const p of prefixes) {
    if (trimmed.startsWith(p)) {
      matchedPrefix = p
      break
    }
  }

  if (matchedPrefix) {
    const withoutPrefix = trimmed.slice(matchedPrefix.length).trim()
    const parts = withoutPrefix.split(/\s+/)
    const command = (parts[0] || '').toLowerCase()
    const args = parts.slice(1)
    const text = args.join(' ')

    return {
      isCommand: Boolean(command),
      usedPrefix: matchedPrefix,
      command,
      args,
      text
    }
  }

  if (registry) {
    const parts = trimmed.split(/\s+/)
    const command = (parts[0] || '').toLowerCase()
    const foundPlugin = registry.getCommand(command)
    if (foundPlugin && foundPlugin.noPrefix !== false) {
      const args = parts.slice(1)
      const text = args.join(' ')
      return {
        isCommand: true,
        usedPrefix: '',
        command,
        args,
        text
      }
    }
  }

  return { isCommand: false, usedPrefix: '', command: '', args: [], text: '' }
}

export async function messageHandler(sock, chatUpdate, registry) {
  if (!chatUpdate?.messages?.length) return
  if (chatUpdate.type && chatUpdate.type !== 'notify') return

  for (const rawMessage of chatUpdate.messages) {
    if (!rawMessage?.message) continue

    const msgTimestamp = rawMessage.messageTimestamp ? Number(rawMessage.messageTimestamp) * 1000 : 0
    const connectTime = sock?.isJadiBot ? (sock.connectedTime || 0) : (global.connectedTime || 0)
    if (connectTime && msgTimestamp && msgTimestamp < (connectTime - 5000)) {
      continue
    }

    const remoteJid = rawMessage.key?.remoteJid || ''
    if (remoteJid.endsWith('@newsletter') || remoteJid === 'status@broadcast') continue

    const messageId = rawMessage.key?.id
    if (!messageId) continue

    if (processedMessages.has(messageId)) continue
    processedMessages.set(messageId, Date.now())
    cleanupDeduplicationCache()

    const startTime = Date.now()

    const m = await serialize(sock, rawMessage)
    if (!m) continue
    if (m.chat.endsWith('@newsletter') || m.chat === 'status@broadcast') continue

    // Global in-memory cache for anti-delete and quote recovery
    if (!global.msgCache) global.msgCache = new Map()
    if (m.id && (m.text || m.mtype)) {
      global.msgCache.set(`${m.chat}_${m.id}`, {
        text: m.text || '',
        sender: m.sender,
        time: Date.now(),
        mtype: m.mtype || m.type || ''
      })
      if (global.msgCache.size > 2000) {
        const oldest = global.msgCache.keys().next().value
        global.msgCache.delete(oldest)
      }
    }

    const currentBotJid = sock.user?.id ? normalizeJid(sock.user.id) : ''
    const currentBotNumber = normalizeNumber(currentBotJid)

    let isUserAdmin = Boolean(m.isOwner)
    let isBotAdmin = false
    let groupMetadata = null

    if (m.isGroup) {
      try {
        groupMetadata = await getGroupMetadata(sock, m.chat)
        const participants = groupMetadata?.participants || []
        const userTargets = [
          m.sender,
          m.key?.participant,
          m.key?.participantAlt,
          m.raw?.participantAlt,
          m.raw?.key?.participantAlt,
          normalizeNumber(m.sender)
        ].filter(Boolean)

        const botTargets = [
          sock.user?.id,
          sock.user?.lid,
          sock.user?.jid,
          sock.authState?.creds?.me?.id,
          sock.authState?.creds?.me?.lid,
          currentBotJid,
          currentBotNumber,
          global.noBot,
          normalizeNumber(global.noBot)
        ].filter(Boolean)

        const userParticipant = participants.find(p => matchParticipant(p, userTargets))
        isUserAdmin = Boolean(m.isOwner || (userParticipant && isParticipantAdmin(userParticipant)))

        const botParticipant = participants.find(p => matchParticipant(p, botTargets))
        isBotAdmin = Boolean(botParticipant && isParticipantAdmin(botParticipant))
      } catch (err) {
        logger.error('Failed to pre-fetch group metadata for before hook:', err)
      }
    }

    m.isAdmin = isUserAdmin
    m.isBotAdmin = isBotAdmin
    m.groupMetadata = groupMetadata

    if (registry?.plugins) {
      const beforeContext = {
        sock,
        conn: sock,
        registry,
        isOwner: m.isOwner,
        isAdmin: isUserAdmin,
        isBotAdmin: isBotAdmin,
        groupMetadata,
        getGroup: (chatId) => databaseApi.getGroup(chatId || m.chat)
      }

      for (const pluginData of registry.plugins.values()) {
        if (typeof pluginData.handler?.before === 'function') {
          try {
            const stop = await pluginData.handler.before(m, beforeContext)
            if (stop) break
          } catch (err) {
            logger.error(`Error in plugin before hook (${pluginData.relativePath}):`, err)
          }
        }
        if (typeof pluginData.handler?.all === 'function') {
          try {
            await pluginData.handler.all(m, beforeContext)
          } catch (err) {
            logger.error(`Error in plugin all hook (${pluginData.relativePath}):`, err)
          }
        }
      }
    }

    if (!m?.text) continue

    if (m.isOwner) {
      const rawTrimmed = (m.text || '').trim()
      if (rawTrimmed.startsWith('=>') || rawTrimmed.startsWith('>') || rawTrimmed.startsWith('$')) {
        const evalPlugin = registry.getCommand('eval')
        if (evalPlugin) {
          let op = '>'
          let code = ''
          if (rawTrimmed.startsWith('=>')) {
            op = '=>'
            code = rawTrimmed.slice(2).trim()
          } else if (rawTrimmed.startsWith('>')) {
            op = '>'
            code = rawTrimmed.slice(1).trim()
          } else if (rawTrimmed.startsWith('$')) {
            op = '$'
            code = rawTrimmed.slice(1).trim()
          }

          const pluginContext = {
            sock,
            conn: sock,
            args: code ? code.split(/\s+/) : [],
            text: code,
            command: op,
            usedPrefix: op,
            prefix: op,
            registry
          }

          try {
            await evalPlugin.handler(m, pluginContext)
            const responseTime = Date.now() - startTime
            const groupName = m.isGroup ? await getGroupName(sock, m.chat) : ''
            logger.chat({
              isGroup: m.isGroup,
              groupName,
              sender: m.pushName || 'Owner',
              number: normalizeNumber(m.sender),
              message: rawTrimmed,
              command: op,
              responseTime,
              status: 'success ✓'
            })
          } catch (err) {
            const responseTime = Date.now() - startTime
            const groupName = m.isGroup ? await getGroupName(sock, m.chat) : ''
            logger.chat({
              isGroup: m.isGroup,
              groupName,
              sender: m.pushName || 'Owner',
              number: normalizeNumber(m.sender),
              message: rawTrimmed,
              command: op,
              responseTime,
              status: 'error ✗'
            })
            await m.reply(String(err))
          }
          continue
        }
      }
    }

    const parsed = parseCommand(m.text, registry)
    if (!parsed.isCommand || !parsed.command) {
      const groupName = m.isGroup ? await getGroupName(sock, m.chat) : ''
      logger.chat({
        isGroup: m.isGroup,
        groupName,
        sender: m.pushName || (m.isOwner ? 'Owner' : 'User'),
        number: normalizeNumber(m.sender),
        message: m.text,
        command: '-',
        responseTime: Date.now() - startTime,
        status: 'message'
      })
      continue
    }

    const { command, args, text, usedPrefix } = parsed
    const plugin = registry.getCommand(command)

    if (!plugin) {
      if (usedPrefix && command.length >= 2 && typeof registry?.findSimilar === 'function') {
        const suggestion = registry.findSimilar(command, 0.50)
        if (suggestion) {
          try {
            const didYouMeanText =
              `╭─── ୨୧ DID YOU MEAN ୨୧ ───╮\n` +
              `│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა perintah tidak ditemukan!\n` +
              `╰──────────────────────────╯\n\n` +
              `Perintah *${usedPrefix}${command}* tidak ditemukan.\n\n` +
              `Mungkin maksud kamu:\n` +
              `👉 *${usedPrefix}${suggestion}*`

            const footerText = `© ${global.botName || 'Rubby Multi Device'} • Kyuu`

            try {
              const { Button } = await import('rubyy-baileys')
              const btn = new Button(sock)
                .setBody(didYouMeanText)
                .setFooter(footerText)
                .addReply(`👉 ${usedPrefix}${suggestion}`, `${usedPrefix}${suggestion}`)
              await btn.send(m.chat, { quoted: m.raw })
            } catch {
              await m.reply(`${didYouMeanText}\n\n_${footerText}_`)
            }
          } catch {}
        }
      }

      const groupName = m.isGroup ? await getGroupName(sock, m.chat) : ''
      logger.chat({
        isGroup: m.isGroup,
        groupName,
        sender: m.pushName || (m.isOwner ? 'Owner' : 'User'),
        number: normalizeNumber(m.sender),
        message: m.text,
        command: `${usedPrefix}${command}`,
        responseTime: Date.now() - startTime,
        status: 'unhandled'
      })
      continue
    }

    const isSelfMode = sock?.isJadiBot
      ? ((sock.mode || 'public').toLowerCase() === 'self')
      : (global.mode || 'public').toLowerCase() === 'self'
    if (isSelfMode && !m.isOwner) continue

    const senderJid = m.sender
    const senderNumber = normalizeNumber(senderJid)
    const botJid = sock.user?.id ? normalizeJid(sock.user.id) : ''
    const botNumber = normalizeNumber(botJid)

    if (!m.isOwner) {
      const disabledList = getDisabledPlugins()
      if (disabledList.includes(command) || disabledList.includes(plugin.primaryCommand)) {
        await m.reply('Perintah ini sedang dinonaktifkan oleh owner.')
        continue
      }
    }

    if (plugin.owner && !m.isOwner) {
      await m.reply('Perintah ini hanya dapat digunakan oleh *Owner Bot*.')
      continue
    }

    if (plugin.premium && !m.isPremium) {
      await m.reply('Perintah ini khusus untuk *Pengguna Premium*.')
      continue
    }

    if (plugin.group && !m.isGroup) {
      await m.reply('Perintah ini hanya dapat digunakan di dalam *Grup*.')
      continue
    }

    if (plugin.private && m.isGroup) {
      await m.reply('Perintah ini hanya dapat digunakan di *Chat Pribadi*.')
      continue
    }

    const userDb = global.db?.getUser ? global.db.getUser(senderNumber) : null
    m.user = userDb || null
    m.limit = userDb?.limit_count ?? 25

    if (plugin.register && !m.isOwner && (!userDb || userDb.registered !== 1)) {
      await m.reply(`🌸 *AKUN BELUM TERDAFTAR*\n\nKamu harus mendaftar terlebih dahulu untuk menggunakan fitur ini.\nKetik *${usedPrefix}daftar <nama>* untuk mendaftar dan klaim bonus limit serta modal awal!`)
      continue
    }

    let limitDeducted = 0
    if (plugin.limit && !m.isOwner && !m.isPremium) {
      const cost = typeof plugin.limit === 'number' ? Math.max(1, plugin.limit) : 1
      if (global.db?.deductLimit) {
        const deductResult = global.db.deductLimit(senderNumber, cost, `Command ${usedPrefix}${command}`)
        if (!deductResult.success) {
          await m.reply(`❌ Maaf, limit harian kamu sudah habis! (Dibutuhkan: ${cost}, Sisa: ${deductResult.currentLimit || 0})\n\nTunggu reset harian, beli limit dengan *${usedPrefix}buylimit*, atau klaim *${usedPrefix}daily*.`)
          continue
        }
        limitDeducted = cost
        m.limit = deductResult.limit
      } else {
        if (userDb && userDb.limit_count < cost) {
          await m.reply('❌ Maaf, limit harian kamu sudah habis! Tunggu reset atau upgrade ke pengguna premium.')
          continue
        }
      }
    }

    let participants = groupMetadata?.participants || []
    if (m.isGroup) {
      const userTargets = [
        m.sender,
        m.key?.participant,
        m.key?.participantAlt,
        m.raw?.participantAlt,
        m.raw?.key?.participantAlt,
        senderJid,
        senderNumber
      ].filter(Boolean)

      const botTargets = [
        sock.user?.id,
        sock.user?.lid,
        sock.user?.jid,
        sock.authState?.creds?.me?.id,
        sock.authState?.creds?.me?.lid,
        botJid,
        botNumber,
        global.noBot,
        normalizeNumber(global.noBot)
      ].filter(Boolean)

      try {
        groupMetadata = await getGroupMetadata(sock, m.chat)
        participants = groupMetadata?.participants || []

        const userParticipant = participants.find(p => matchParticipant(p, userTargets))
        isUserAdmin = Boolean(m.isOwner || (userParticipant && isParticipantAdmin(userParticipant)))

        const botParticipant = participants.find(p => matchParticipant(p, botTargets))
        isBotAdmin = Boolean(botParticipant && isParticipantAdmin(botParticipant))
      } catch (err) {
        logger.error('Failed to fetch group metadata:', err)
      }

      if (plugin.admin || plugin.botadmin) {
        if (!groupMetadata || !participants.length) {
          try {
            groupMetadata = await getGroupMetadata(sock, m.chat, true)
            participants = groupMetadata?.participants || []
            const userParticipant = participants.find(p => matchParticipant(p, userTargets))
            isUserAdmin = Boolean(m.isOwner || (userParticipant && isParticipantAdmin(userParticipant)))
            const botParticipant = participants.find(p => matchParticipant(p, botTargets))
            isBotAdmin = Boolean(botParticipant && isParticipantAdmin(botParticipant))
          } catch (err) {
            logger.error('Failed to force fetch group metadata for permission check', err)
            await m.reply('Gagal memverifikasi status admin grup.')
            continue
          }
        }

        if (plugin.admin && !isUserAdmin) {
          await m.reply('Perintah ini hanya dapat digunakan oleh *Admin Grup*.')
          continue
        }

        if (plugin.botadmin && !isBotAdmin) {
          await m.reply('Bot harus menjadi *Admin Grup* untuk menjalankan perintah ini.')
          continue
        }
      }
    }

    m.isAdmin = isUserAdmin
    m.isBotAdmin = isBotAdmin
    m.groupMetadata = groupMetadata
    m.participants = participants

    if (plugin.noJadiBot && sock.isJadiBot) {
      await m.reply('Perintah ini tidak dapat dijalankan pada sesi JadiBot.')
      continue
    }

    try {
      const pluginContext = {
        sock,
        conn: sock,
        args,
        text,
        command,
        usedPrefix,
        prefix: usedPrefix,
        registry,
        isOwner: m.isOwner,
        isPremium: m.isPremium,
        isAdmin: isUserAdmin,
        isUserAdmin,
        isBotAdmin,
        user: m.user,
        limit: m.limit,
        groupMetadata,
        participants,
        reply: (text, opt) => m.reply(text, opt),
        react: (emoji) => m.react(emoji)
      }

      await plugin.handler(m, pluginContext)
      const responseTime = Date.now() - startTime
      const groupName = m.isGroup ? await getGroupName(sock, m.chat) : ''
      logger.chat({
        isGroup: m.isGroup,
        groupName,
        sender: m.pushName || (m.isOwner ? 'Owner' : 'User'),
        number: senderNumber,
        message: m.text,
        command: `${usedPrefix}${command}`,
        responseTime,
        status: 'success ✓'
      })
    } catch (err) {
      if (limitDeducted > 0 && global.db?.addLimit) {
        try {
          global.db.addLimit(senderNumber, limitDeducted, `Refund limit gagal eksekusi ${usedPrefix}${command}`)
        } catch {}
      }
      const responseTime = Date.now() - startTime
      const groupName = m.isGroup ? await getGroupName(sock, m.chat) : ''
      logger.chat({
        isGroup: m.isGroup,
        groupName,
        sender: m.pushName || (m.isOwner ? 'Owner' : 'User'),
        number: senderNumber,
        message: m.text,
        command: `${usedPrefix}${command}`,
        responseTime,
        status: 'error ✗'
      })
      logger.error(`Plugin execution failed for command '${usedPrefix}${command}'`, err)
      try {
        const cleanErrMsg = maskSensitive(err?.message || err)
        await m.reply(`Terjadi kesalahan saat mengeksekusi perintah *${usedPrefix}${command}*:\n\`\`\`${cleanErrMsg}\`\`\``)
      } catch {}
    }
  }
}

export default messageHandler

