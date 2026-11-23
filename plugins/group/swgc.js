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

import { randomBytes as rb } from 'crypto'
import { PassThrough } from 'stream'
import ffmpeg from 'fluent-ffmpeg'
import { generateWAMessageContent } from 'rubyy-baileys'

const warnaMap = {
  biru: 0x1E88E5,
  hijau: 0x25D366,
  kuning: 0xFFD600,
  jingga: 0xFF9800,
  merah: 0xE53935,
  ungu: 0x8E24AA,
  abu: 0x9E9E9E,
  hitam: 0x000000,
  putih: 0xFFFFFF,
  cyan: 0x00BCD4
}

const toArgb = (c) => (0xFF000000 | c) >>> 0
const emojiRe = /^\p{Extended_Pictographic}/u

async function buildMedia(conn, payload) {
  return generateWAMessageContent(payload, { upload: conn.waUploadToServer })
}

async function toVN(buffer) {
  return new Promise((resolve, reject) => {
    const input = new PassThrough()
    const output = new PassThrough()
    const chunks = []

    input.end(buffer)

    ffmpeg(input)
      .noVideo()
      .audioCodec('libopus')
      .format('ogg')
      .outputOptions(['-hide_banner', '-loglevel error'])
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(output)

    output.on('data', (c) => chunks.push(c))
  })
}

const statusContext = (listName, listEmoji) => ({
  expiration: 86400,
  disappearingMode: { initiator: 0 },
  featureEligibilities: {
    cannotBeRanked: false,
    canBeReshared: true,
    canReceiveMultiReact: true
  },
  statusSourceType: 4,
  statusAttributions: [{ type: 10 }],
  isGroupStatus: true,
  statusAudienceMetadata: {
    audienceType: 2,
    listName,
    listEmoji
  }
})

let handler = async (m, { sock, conn, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted || m
  const mime = quoted.mimetype || m.mimetype || ''
  const hasMedia = /image|video|audio|sticker/i.test(mime)
  let args = (text || '').split(m.quoted ? /[|\s]+/ : '|').map(v => v.trim()).filter(Boolean)

  let teks = ''
  let warna = ''
  let emoji = ''
  let nama = ''
  let target = ''

  for (let v of args) {
    if (/chat\.whatsapp\.com\//i.test(v) || /@g\.us$/.test(v) || /^\d{10,}$/.test(v)) {
      target = v
    } else if (!warna && warnaMap[v.toLowerCase()] !== undefined) {
      warna = v.toLowerCase()
    } else if (!emoji && emojiRe.test(v)) {
      emoji = v
    } else if (!teks && !hasMedia) {
      teks = v
    } else if (!nama) {
      nama = v
    }
  }

  let jid = m.chat

  if (target) {
    if (/chat\.whatsapp\.com\//i.test(target)) {
      const code = target.split('chat.whatsapp.com/')[1]
      try {
        const info = await client.groupGetInviteInfo(code)
        jid = info.id
      } catch {
        return m.reply('Link grup tidak valid atau bot belum join.')
      }
    } else {
      jid = /^\d+$/.test(target) ? target + '@g.us' : target
    }
  }

  const quotedText = m.quoted ? (quoted.text || '') : ''
  const caption = quoted.caption || teks || quotedText || ''

  const bgKeys = Object.keys(warnaMap)
  const pilih = warna || bgKeys[Math.floor(Math.random() * bgKeys.length)]
  const bgColor = toArgb(warnaMap[pilih])
  const textColor = pilih === 'putih' ? 0xFF000000 : 0xFFFFFFFF

  const finalEmoji = emoji || '✨'
  const finalNama = nama || (global.botName || 'Rubby Multi Device')

  if (!caption && !m.quoted) {
    return m.reply(
      `Penggunaan:\n` +
      `${usedPrefix}${command} halo\n` +
      `${usedPrefix}${command} halo|merah\n` +
      `${usedPrefix}${command} halo|merah|😂|MyStatus\n` +
      `${usedPrefix}${command} halo|linkgrup\n\n` +
      `Reply Media (foto/video/audio/sticker):\n` +
      `${usedPrefix}${command}\n` +
      `${usedPrefix}${command} merah|😂|MyStatus\n` +
      `${usedPrefix}${command} linkgrup`
    )
  }

  const contextInfo = statusContext(finalNama, finalEmoji)
  const id = rb(16).toString('hex').toUpperCase()
  const opts = { messageId: id, additionalNodes: [{ tag: 'meta', attrs: { is_group_status: 'true' } }] }
  const messageContextInfo = { messageSecret: rb(32) }

  if (hasMedia) {
    let payload
    let key
    const buffer = typeof quoted.download === 'function' ? await quoted.download() : await m.download()

    if (/image/i.test(mime)) {
      payload = { image: buffer, caption }
      key = 'imageMessage'
    } else if (/video/i.test(mime)) {
      payload = { video: buffer, caption }
      key = 'videoMessage'
    } else if (/audio/i.test(mime)) {
      const vn = await toVN(buffer)
      payload = { audio: vn, ptt: true, mimetype: 'audio/ogg; codecs=opus' }
      key = 'audioMessage'
    } else {
      payload = { sticker: buffer }
      key = 'stickerMessage'
    }

    try {
      const content = await buildMedia(client, payload)
      const media = content[key]
      media.contextInfo = { ...(media.contextInfo || {}), ...contextInfo }
      await client.relayMessage(jid, { [key]: media, messageContextInfo }, opts)
    } catch (e) {
      return m.reply(`Gagal upload status: ${e.message || e}`)
    }
    return m.reply(`Sukses upload status ke grup:\n${jid}`)
  }

  try {
    await client.relayMessage(
      jid,
      {
        extendedTextMessage: {
          text: caption,
          textArgb: textColor,
          backgroundArgb: bgColor,
          font: 7,
          contextInfo
        },
        messageContextInfo
      },
      opts
    )
    return m.reply(`Sukses upload status ke grup:\n${jid}`)
  } catch (e) {
    return m.reply(`Gagal upload status text: ${e.message || e}`)
  }
}

handler.command = ['swgc', 'up']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
