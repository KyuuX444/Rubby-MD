import databaseApi from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antilinkall)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Link All* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antilinkall: true })
    return m.reply([
      '╭─── ୨୧ ANTI LINK ALL WEB ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi seluruh link web!',
      '╰───────────────────────────────╯',
      '',
      '✅ Fitur *Anti Link All* berhasil *DIAKTIFKAN*.',
      'Semua tautan web (http/https/t.me/dll) dari member non-admin akan otomatis dihapus.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Link All* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antilinkall: false })
    return m.reply([
      '╭─── ୨୧ ANTI LINK ALL WEB ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi dinonaktifkan!',
      '╰───────────────────────────────╯',
      '',
      '❌ Fitur *Anti Link All* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI LINK ALL WEB ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status & panduan fitur!',
    '╰───────────────────────────────╯',
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
  if (!m.isGroup || m.fromMe || !m.text) return
  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antilinkall) return
  if (isAdmin || m.isOwner) return

  const rawText = m.text.trim()
  const linkRegex = /(https?:\/\/[^\s]+)|(t\.me\/[A-Za-z0-9_]+)/i
  if (!linkRegex.test(rawText)) return

  const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

  if (isBotAdmin) {
    try {
      await sock.sendMessage(m.chat, { delete: m.key })
    } catch {}
  }

  const warningMsg = [
    '╭─── ୨୧ PERINGATAN ANTI LINK ALL ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა tautan web dilarang!',
    '╰──────────────────────────────────────╯',
    '',
    `⚠️ Peringatan untuk @${senderNum}!`,
    'Dilarang menyebarkan link web di grup ini saat proteksi Anti Link All aktif.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(warningMsg, { mentions: [m.sender] })
}

handler.help = ['antilinkall [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antilinkall', 'antilinkany']
handler.group = true
handler.admin = true

export default handler
