import databaseApi from '../../lib/database.js'

const NSFW_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'nhentai.net',
  'doujindesu', 'onlyfans.com', 'rule34', 'redtube.com'
]

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antinsfw)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti NSFW* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antinsfw: true })
    return m.reply([
      '╭─── ୨୧ ANTI KONTEN NSFW ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi konten dewasa 18+!',
      '╰──────────────────────────────╯',
      '',
      '✅ Fitur *Anti NSFW* berhasil *DIAKTIFKAN*.',
      'Penyebaran tautan atau konten pornografi akan otomatis dihapus oleh bot.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti NSFW* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antinsfw: false })
    return m.reply([
      '╭─── ୨୧ ANTI KONTEN NSFW ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi dinonaktifkan!',
      '╰──────────────────────────────╯',
      '',
      '❌ Fitur *Anti NSFW* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI KONTEN NSFW ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status & panduan fitur!',
    '╰──────────────────────────────╯',
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
  if (!group.antinsfw) return
  if (isAdmin || m.isOwner) return

  const lower = m.text.toLowerCase()
  const isNsfw = NSFW_DOMAINS.some(d => lower.includes(d))
  if (!isNsfw) return

  const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

  if (isBotAdmin) {
    try {
      await sock.sendMessage(m.chat, { delete: m.key })
    } catch {}
  }

  const warningMsg = [
    '╭─── ୨୧ PERINGATAN ANTI NSFW ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა konten 18+ dilarang!',
    '╰──────────────────────────────────╯',
    '',
    `⚠️ Peringatan untuk @${senderNum}!`,
    'Dilarang membagikan konten atau link pornografi/dewasa di dalam grup ini.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(warningMsg, { mentions: [m.sender] })
}

handler.help = ['antinsfw [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antinsfw', 'antiporno']
handler.group = true
handler.admin = true

export default handler
