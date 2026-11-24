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
import os from 'node:os'
import dns from 'node:dns'
import sharp from 'sharp'
import { ButtonV2 } from 'rubyy-baileys'
import { normalizeNumber, isOwner as checkOwner, isPremium as checkPremium } from '../../lib/utils.js'

dns.setDefaultResultOrder('ipv4first')

function toSmallFont(text) {
  if (!text) return ''
  const map = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
    'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ꞯ', 'r': 'ʀ',
    's': 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
    'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ꞯ', 'R': 'ʀ',
    'S': 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ'
  }
  return String(text).split('').map(c => map[c] || c).join('')
}

function getGreeting() {
  const hours = new Date().getHours()
  if (hours >= 4 && hours < 11) return 'ꜱᴇʟᴀᴍᴀᴛ ᴘᴀɢɪ 🌄'
  if (hours >= 11 && hours < 15) return 'ꜱᴇʟᴀᴍᴀᴛ ꜱɪᴀɴɢ ☀️'
  if (hours >= 15 && hours < 18) return 'ꜱᴇʟᴀᴍᴀᴛ ꜱᴏʀᴇ 🌇'
  return 'ꜱᴇʟᴀᴍᴀᴛ ᴍᴀʟᴀᴍ 🌙'
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

const categoryEmojis = {
  ai: '🤖',
  convert: '🔄',
  downloader: '📥',
  download: '📥',
  example: '💡',
  fun: '🎲',
  group: '👥',
  grup: '👥',
  info: 'ℹ️',
  main: '📌',
  maker: '🎨',
  other: '✨',
  owner: '👑',
  panel: '⚡',
  premium: '💎',
  rpg: '⚔️',
  search: '🔍',
  stalk: '🕵️',
  tools: '🔧',
  webapi: '🌐'
}

const getEmoji = (cat) => categoryEmojis[cat.toLowerCase()] || '📌'

let cachedThumbBuffer = null
async function getThumbBuffer() {
  if (cachedThumbBuffer) return cachedThumbBuffer
  try {
    const localThumbPath = path.resolve('media/thumb.jpg')
    if (fs.existsSync(localThumbPath)) {
      const raw = fs.readFileSync(localThumbPath)
      cachedThumbBuffer = await sharp(raw).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
      return cachedThumbBuffer
    }
    const fallbackPath = global.thumb
    if (fallbackPath && fs.existsSync(fallbackPath)) {
      const raw = fs.readFileSync(fallbackPath)
      cachedThumbBuffer = await sharp(raw).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
      return cachedThumbBuffer
    }
  } catch {}
  return null
}

let handler = async (m, { conn, sock, text, args, usedPrefix, registry }) => {
  const client = conn || sock
  const greeting = getGreeting()
  const senderJid = m.sender || ''
  const rawNum = normalizeNumber(senderJid)
  const senderDisplay = (rawNum && !senderJid.endsWith('@lid')) ? `@${rawNum}` : (m.pushName || 'User')
  const botName = global.botName || 'Rubby Multi Device'
  const prfx = usedPrefix || '.'
  const sub = (args?.[0] || text || '').toLowerCase().trim()

  const isOwner = checkOwner(senderJid)
  const isPremium = checkPremium(senderJid)

  const statusStr = isOwner ? 'ᴏᴡɴᴇʀ' : (isPremium ? 'ᴘʀᴇᴍɪᴜᴍ' : 'ғʀᴇᴇ ᴜsᴇʀ')
  const modeStr = (global.mode === 'self') ? 'ꜱᴇʟꜰ ( ᴏᴡɴᴇʀ ᴏɴʟʏ )' : 'ᴘᴜʙʟɪᴄ'

  const botUptime = process.uptime()
  const serverUptime = os.uptime()
  const uptimeStr = formatUptime(botUptime)
  const serverUptimeStr = formatUptime(serverUptime)

  const menuStructure = registry.getMenuStructure()
  const categories = menuStructure.categories || {}
  const totalFitur = menuStructure.totalCommands || 0

  const formatSection = (catName, cmdList) => {
    if (!cmdList?.length) return ''
    const emoji = getEmoji(catName)
    const sortedCmds = [...new Set(cmdList.map(c => c.name || c))].sort()
    const lines = sortedCmds.map(cmd => `• ${prfx}${toSmallFont(cmd)}`)
    return `${emoji} *${toSmallFont(catName.toUpperCase())}*\n${lines.join('\n')}`
  }

  let menuText = ''

  if (sub === 'all') {
    menuText = `${greeting}, ${senderDisplay} 👋\n${toSmallFont('Ini semua fitur')} *${toSmallFont(botName)}*:\n\n` +
      `• ${toSmallFont('Status')} : *${statusStr}*\n` +
      `• ${toSmallFont('Uptime')} : ${uptimeStr}\n` +
      `• ${toSmallFont('Server Uptime')} : ${serverUptimeStr}\n` +
      `• ${toSmallFont('Mode')} : ${modeStr}\n` +
      `• ${toSmallFont('Prefix')} : ${prfx}\n\n`

    for (const cat of Object.keys(categories).sort()) {
      menuText += formatSection(cat, categories[cat]) + '\n\n'
    }
    menuText += `${toSmallFont('Total')}: ${totalFitur} ${toSmallFont('Commands')}`
  } else if (sub && categories[sub]) {
    menuText = `${greeting}, ${senderDisplay} 👋\n\n` +
      `• ${toSmallFont('Status')} : *${statusStr}*\n` +
      `• ${toSmallFont('Uptime')} : ${uptimeStr}\n` +
      `• ${toSmallFont('Server Uptime')} : ${serverUptimeStr}\n` +
      `• ${toSmallFont('Mode')} : ${modeStr}\n` +
      `• ${toSmallFont('Prefix')} : ${prfx}\n\n` +
      `${formatSection(sub, categories[sub])}`
  } else {
    menuText = `${greeting}, ${senderDisplay} 👋\n${toSmallFont('Selamat Datang di')} *${toSmallFont(botName)}*!\n\n` +
      `• ${toSmallFont('Status')} : *${statusStr}*\n` +
      `• ${toSmallFont('Uptime')} : ${uptimeStr}\n` +
      `• ${toSmallFont('Server Uptime')} : ${serverUptimeStr}\n` +
      `• ${toSmallFont('Mode')} : ${modeStr}\n` +
      `• ${toSmallFont('Prefix')} : ${prfx}\n\n` +
      `${toSmallFont('Pilih kategori di tombol bawah, atau ketik')}:\n${prfx}menu <${toSmallFont('kategori')}>\n${prfx}menu all`
  }

  const categoryRows = [
    {
      title: toSmallFont('semua menu'),
      description: toSmallFont('tampilkan semua perintah bot'),
      id: `${prfx}menu all`
    }
  ]

  for (const cat of Object.keys(categories).sort()) {
    categoryRows.push({
      title: toSmallFont(`menu ${cat.toLowerCase()}`),
      description: toSmallFont(`daftar perintah ${cat.toLowerCase()}`),
      id: `${prfx}menu ${cat.toLowerCase()}`
    })
  }

  const thumbBuf = await getThumbBuffer()

  const btn = new ButtonV2(client)
    .setTitle(botName)
    .setSubtitle(global.website || 'https://api.kyzzz.xyz')
    .setBody(`${botName} in here`)
    .setFooter(menuText)
    .setContextInfo({ mentionedJid: [senderJid] })

  if (thumbBuf) {
    btn.setThumbnail(thumbBuf)
  }

  btn.addRawButton({
    buttonText: { displayText: toSmallFont('pilih menu') },
    buttonId: 'menu',
    type: 1,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: toSmallFont('daftar menu'),
        sections: [
          {
            title: toSmallFont('kategori menu'),
            highlight_label: '',
            rows: categoryRows
          }
        ]
      })
    }
  })

  btn.addButton(`👑 ${toSmallFont('Owner')}`, `${prfx}owner`)

  await btn.send(m.chat, { quoted: m.raw })
}

handler.command = ['menu', 'main', 'help', 'list']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
