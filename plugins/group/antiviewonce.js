import databaseApi from '../../lib/database.js'
import { downloadMediaMessage } from 'rubyy-baileys'

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antiviewonce)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti ViewOnce* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antiviewonce: true })
    return m.reply([
      '╭─── ୨୧ ANTI VIEW ONCE ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა bongkar media sekali lihat!',
      '╰────────────────────────────╯',
      '',
      '✅ Fitur *Anti ViewOnce* berhasil *DIAKTIFKAN*.',
      'Media (gambar/video/audio) sekali lihat akan otomatis dikirim ulang sebagai media biasa.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti ViewOnce* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antiviewonce: false })
    return m.reply([
      '╭─── ୨୧ ANTI VIEW ONCE ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა fitur dinonaktifkan!',
      '╰────────────────────────────╯',
      '',
      '❌ Fitur *Anti ViewOnce* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI VIEW ONCE ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status & panduan fitur!',
    '╰────────────────────────────╯',
    '',
    `• Status Saat Ini : *${current ? '🟢 AKTIF' : '🔴 NONAKTIF'}*`,
    `• Perintah Aktifkan : *${usedPrefix + command} on*`,
    `• Perintah Matikan  : *${usedPrefix + command} off*`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n'))
}

handler.before = async (m, { sock, getGroup }) => {
  if (!m.isGroup || m.fromMe) return

  const raw = m.raw?.message || m.message || {}
  const isVo = Boolean(
    raw.viewOnceMessage ||
    raw.viewOnceMessageV2 ||
    raw.viewOnceMessageV2Extension ||
    m.mtype?.includes('viewOnce')
  )
  if (!isVo) return

  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antiviewonce) return

  try {
    const voContainer = raw.viewOnceMessage?.message || raw.viewOnceMessageV2?.message || raw
    const imgMsg = voContainer.imageMessage
    const vidMsg = voContainer.videoMessage
    const audMsg = voContainer.audioMessage

    const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
    const sender = m.sender

    let buffer = null
    try {
      buffer = await downloadMediaMessage(m.raw, 'buffer', {})
    } catch {}

    if (!buffer && typeof m.download === 'function') {
      try {
        buffer = await m.download()
      } catch {}
    }

    if (!buffer) return

    const captionMsg = [
      '╭─── ୨୧ ANTI VIEW ONCE ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა media sekali lihat dibongkar!',
      '╰────────────────────────────╯',
      '',
      `👤 *Pengirim:* @${senderNum}`,
      (imgMsg?.caption || vidMsg?.caption) ? `💬 *Caption:* ${imgMsg?.caption || vidMsg?.caption}` : '',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].filter(Boolean).join('\n')

    if (imgMsg) {
      return await sock.sendMessage(m.chat, { image: buffer, caption: captionMsg, mentions: [sender] }, { quoted: m.raw })
    } else if (vidMsg) {
      return await sock.sendMessage(m.chat, { video: buffer, caption: captionMsg, mentions: [sender] }, { quoted: m.raw })
    } else if (audMsg) {
      await m.reply(captionMsg, { mentions: [sender] })
      return await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m.raw })
    }
  } catch (err) {
    console.error('[ANTIRVO ERROR]', err)
  }
}

handler.help = ['antiviewonce [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antiviewonce', 'antirvo']
handler.group = true
handler.admin = true

export default handler
