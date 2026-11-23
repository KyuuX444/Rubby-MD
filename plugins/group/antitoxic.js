import databaseApi from '../../lib/database.js'

const TOXIC_WORDS = [
  'kontol', 'memek', 'jembut', 'pepek', 'peler', 'itil',
  'ngentot', 'bajingan', 'pantek', 'bangsat', 'babi', 'asu'
]

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antitoxic)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Toxic* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antitoxic: true })
    return m.reply([
      '╭─── ୨୧ ANTI TOXIC CHAT ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა lingkungan grup yang ramah!',
      '╰─────────────────────────────╯',
      '',
      '✅ Fitur *Anti Toxic* berhasil *DIAKTIFKAN*.',
      'Pesan mengandung kata-kata kasar akan otomatis diberi peringatan dan dihapus jika bot admin.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Toxic* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antitoxic: false })
    return m.reply([
      '╭─── ୨୧ ANTI TOXIC CHAT ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi dinonaktifkan!',
      '╰─────────────────────────────╯',
      '',
      '❌ Fitur *Anti Toxic* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI TOXIC CHAT ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status & panduan fitur!',
    '╰─────────────────────────────╯',
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
  if (!group.antitoxic) return
  if (isAdmin || m.isOwner) return

  const lowerText = m.text.toLowerCase()
  const hasToxic = TOXIC_WORDS.some(w => new RegExp(`\\b${w}\\b`, 'i').test(lowerText))
  if (!hasToxic) return

  const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

  if (isBotAdmin) {
    try {
      await sock.sendMessage(m.chat, { delete: m.key })
    } catch {}
  }

  const warningMsg = [
    '╭─── ୨୧ PERINGATAN KATA KASAR ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა jaga kesopanan bersama!',
    '╰──────────────────────────────────╯',
    '',
    `⚠️ @${senderNum}, tolong jaga ketikanmu!`,
    'Grup ini mengaktifkan Anti Toxic. Dilarang menggunakan kata-kata kasar.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(warningMsg, { mentions: [m.sender] })
}

handler.help = ['antitoxic [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antitoxic', 'antikasar']
handler.group = true
handler.admin = true

export default handler
