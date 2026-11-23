import databaseApi from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antilinkwa || group.antilink)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Link WhatsApp* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antilinkwa: true, antilink: true })
    return m.reply([
      '╭─── ୨୧ ANTI LINK WHATSAPP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა keamanan grup diaktifkan!',
      '╰────────────────────────────────╯',
      '',
      '✅ Fitur *Anti Link WhatsApp* berhasil *DIAKTIFKAN*.',
      'Setiap member (non-admin) yang mengirimkan link grup WhatsApp akan otomatis dihapus.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Link WhatsApp* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antilinkwa: false, antilink: false })
    return m.reply([
      '╭─── ୨୧ ANTI LINK WHATSAPP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა keamanan dinonaktifkan!',
      '╰────────────────────────────────╯',
      '',
      '❌ Fitur *Anti Link WhatsApp* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI LINK WHATSAPP ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status & panduan fitur!',
    '╰────────────────────────────────╯',
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
  if (!group.antilinkwa && !group.antilink) return
  if (isAdmin || m.isOwner) return

  const rawText = m.text.trim()
  const waLinkRegex = /(?:chat\.whatsapp\.com\/[0-9A-Za-z]{20,26})/i
  if (!waLinkRegex.test(rawText)) return

  const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

  if (isBotAdmin) {
    try {
      await sock.sendMessage(m.chat, { delete: m.key })
    } catch {}
  }

  const warningMsg = [
    '╭─── ୨୧ PERINGATAN ANTI LINK ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა pelanggaran link terdeteksi!',
    '╰──────────────────────────────────╯',
    '',
    `⚠️ Peringatan untuk @${senderNum}!`,
    'Dilarang mengirim link grup WhatsApp di dalam grup ini!',
    isBotAdmin ? 'Pesan kamu telah otomatis dihapus oleh sistem.' : 'Jadikan bot admin agar dapat menghapus link otomatis.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(warningMsg, { mentions: [m.sender] })
}

handler.help = ['antilink [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antilink', 'antilinkwa']
handler.group = true
handler.admin = true

export default handler
