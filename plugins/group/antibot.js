import databaseApi from '../../lib/database.js'
import { isBotMessage } from '../../src/lib/detectbot.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antibot)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Bot* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antibot: true })
    return m.reply([
      '╭─── ୨୧ ANTI BOT ASING ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi grup dari bot lain!',
      '╰────────────────────────────╯',
      '',
      '✅ Fitur *Anti Bot* berhasil *DIAKTIFKAN*.',
      'Bot lain yang mengirim pesan di grup akan otomatis dikeluarkan oleh bot (memerlukan hak admin).',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Bot* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antibot: false })
    return m.reply([
      '╭─── ୨୧ ANTI BOT ASING ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა fitur dinonaktifkan!',
      '╰────────────────────────────╯',
      '',
      '❌ Fitur *Anti Bot* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI BOT ASING ୨୧ ───╮',
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

handler.before = async (m, { sock, isAdmin, isBotAdmin, getGroup }) => {
  if (!m.isGroup || m.fromMe) return
  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antibot) return
  if (!isBotAdmin) return
  if (isAdmin || m.isOwner) return

  const botDetect = isBotMessage(m, sock)
  const isExternalBot = Boolean(botDetect.isBot || (m.id && (m.id.startsWith('BAE5') || m.id.length === 16)))
  if (!isExternalBot) return

  const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

  try {
    await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    const textMsg = [
      '╭─── ୨୧ ANTI BOT DETECTED ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა bot asing dikeluarkan!',
      '╰──────────────────────────────╯',
      '',
      `🚫 @${senderNum} terdeteksi sebagai bot dan telah dikeluarkan dari grup demi kenyamanan member.`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(textMsg, { mentions: [m.sender] })
  } catch (err) {
    console.error('[ANTIBOT KICK ERROR]', err)
  }
}

handler.help = ['antibot [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antibot']
handler.group = true
handler.admin = true

export default handler
