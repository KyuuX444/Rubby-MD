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
  'ai-image': '🪄',
  asupan: '💃',
  audio: '🎧',
  cewerandom: '👧',
  convert: '🔄',
  downloader: '📥',
  download: '📥',
  ephoto: '📸',
  example: '💡',
  fun: '🎲',
  github: '🐙',
  group: '👥',
  grup: '👥',
  info: 'ℹ️',
  islamic: '🌙',
  main: '🎀',
  maker: '🎨',
  manga: '📚',
  news: '📰',
  novel: '📖',
  nsfw: '🔞',
  other: '✨',
  owner: '👑',
  panel: '⚡',
  premium: '💎',
  primbon: '🔮',
  rpg: '⚔️',
  search: '🔍',
  stalk: '🕵️',
  stalker: '🕵️',
  streaming: '🎬',
  tools: '🔧',
  webapi: '🌐'
}

const getEmoji = (cat) => categoryEmojis[cat.toLowerCase()] || '🌸'

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

  const input = (args?.[0] || text || '').toLowerCase().trim()
  let page = 1
  let sub = ''

  const pageMatch = input.match(/^(?:page[:\s]?)?(\d+)$/i) || (args?.[1] && args[0].toLowerCase() === 'page' && args[1].match(/^\d+$/) ? [, args[1]] : null)

  if (pageMatch) {
    page = parseInt(pageMatch[1], 10) || 1
  } else {
    sub = input
  }

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
  const catList = Object.keys(categories).sort()

  const formatSection = (catName, cmdList) => {
    if (!cmdList?.length) return ''
    const emoji = getEmoji(catName)
    const sortedCmds = [...new Set(cmdList.map(c => c.name || c))].sort()
    const lines = sortedCmds.map(cmd => `• ${prfx}${toSmallFont(cmd)}`)
    return `╭━━━〔 ${emoji} *${toSmallFont(catName.toUpperCase())}* 〕━━━╮\n${lines.join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━╯`
  }

  let menuText = ''
  const perPage = 4
  const totalPages = Math.ceil(catList.length / perPage) || 1
  const currentPage = Math.max(1, Math.min(totalPages, page))
  const startIdx = (currentPage - 1) * perPage
  const currentCats = catList.slice(startIdx, startIdx + perPage)

  if (sub === 'all') {
    menuText = `╭━━━〔 ୨ৎ *${toSmallFont(botName.toUpperCase())}* ୨ৎ 〕━━━╮\n` +
      `┇ 🌸 *${greeting}*, ${senderDisplay}\n` +
      `┇ 👑 *Status* : ${statusStr}\n` +
      `┇ ⏳ *Uptime* : ${uptimeStr}\n` +
      `┇ ⚙️ *Mode* : ${modeStr}\n` +
      `┇ 🎯 *Prefix* : [ ${prfx} ]\n` +
      `┇ 📦 *Total* : ${totalFitur} ${toSmallFont('fitur')}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`

    for (const cat of catList) {
      menuText += formatSection(cat, categories[cat]) + '\n\n'
    }
    menuText += `୨ৎ made with love by Kyuu ♡`
  } else if (sub && categories[sub]) {
    menuText = `╭━━━〔 ୨ৎ *MENU ${toSmallFont(sub.toUpperCase())}* ୨ৎ 〕━━━╮\n` +
      `┇ 🌸 *${greeting}*, ${senderDisplay}\n` +
      `┇ 👑 *Status* : ${statusStr}\n` +
      `┇ ⏳ *Uptime* : ${uptimeStr}\n` +
      `┇ 🎯 *Prefix* : [ ${prfx} ]\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `${formatSection(sub, categories[sub])}\n\n` +
      `💡 Ketik *${prfx}menu* untuk kembali ke menu utama.`
  } else {
    menuText = `╭━━━〔 ୨ৎ *${toSmallFont(botName.toUpperCase())}* ୨ৎ 〕━━━╮\n` +
      `┇ 🌸 *${greeting}*, ${senderDisplay}\n` +
      `┇ 👑 *Status* : ${statusStr}\n` +
      `┇ ⏳ *Uptime* : ${uptimeStr}\n` +
      `┇ ⚙️ *Mode* : ${modeStr}\n` +
      `┇ 🎯 *Prefix* : [ ${prfx} ]\n` +
      `┇ 📦 *Total Fitur* : ${totalFitur} ${toSmallFont('fitur')}\n` +
      `┇ 📂 *Kategori* : ${catList.length} ${toSmallFont('kategori')}\n` +
      `┇ 📄 *Halaman* : ${currentPage} / ${totalPages}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `╭━━━〔 📂 *DAFTAR KATEGORI* 〕━━━╮\n`

    for (const cat of currentCats) {
      const count = categories[cat]?.length || 0
      menuText += `┇ ${getEmoji(cat)} *${toSmallFont(cat.toUpperCase())}* (${count} ${toSmallFont('fitur')})\n`
    }

    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `💡 *Petunjuk:*\n` +
      `• Klik tombol di bawah untuk navigasi.\n` +
      `• Ketik *${prfx}menu <kategori>* untuk membuka kategori.\n` +
      `• Ketik *${prfx}menu all* untuk melihat semua fitur.`
  }

  const thumbBuf = await getThumbBuffer()
  const footerText = `© ${botName} • Kyuu`

  try {
    const btn = new ButtonV2(client)
      .setTitle(botName)
      .setSubtitle(global.website || 'https://api.kyzzz.xyz')
      .setBody(menuText)
      .setFooter(footerText)
      .setContextInfo({ mentionedJid: [senderJid] })

    if (thumbBuf) {
      btn.setThumbnail(thumbBuf)
    }

    if (sub && categories[sub]) {
      btn.addButton(`🔙 ${toSmallFont('Kembali')}`, `${prfx}menu`)
      btn.addButton(`📑 ${toSmallFont('Semua Menu')}`, `${prfx}menu all`)
      btn.addButton(`👑 ${toSmallFont('Owner')}`, `${prfx}owner`)
    } else {
      // 1. Max 4 Category Buttons for current page
      for (const cat of currentCats) {
        btn.addButton(`${getEmoji(cat)} ${toSmallFont(cat)}`, `${prfx}menu ${cat.toLowerCase()}`)
      }

      // 2. Navigation Buttons (Prev & Next)
      if (currentPage > 1 && currentPage < totalPages) {
        btn.addButton(`◀️ Prev`, `${prfx}menu page:${currentPage - 1}`)
        btn.addButton(`Next ▶️`, `${prfx}menu page:${currentPage + 1}`)
      } else if (currentPage > 1) {
        btn.addButton(`◀️ Prev`, `${prfx}menu page:${currentPage - 1}`)
      } else if (currentPage < totalPages) {
        btn.addButton(`Next ▶️`, `${prfx}menu page:${currentPage + 1}`)
      }

      // 3. Quick Action Buttons
      btn.addButton(`📑 ${toSmallFont('Semua Menu')}`, `${prfx}menu all`)
      btn.addButton(`👑 ${toSmallFont('Owner')}`, `${prfx}owner`)
    }

    await btn.send(m.chat, { quoted: m.raw })
  } catch (err) {
    await client.sendMessage(m.chat, { text: `${menuText}\n\n_${footerText}_` }, { quoted: m.raw })
  }
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
