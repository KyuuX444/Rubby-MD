import databaseApi from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antivirtex)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Virtex* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antivirtex: true })
    return m.reply([
      '╭─── ୨୧ ANTI VIRTEX & BUG ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi crash grup aktif!',
      '╰───────────────────────────────╯',
      '',
      '✅ Fitur *Anti Virtex* berhasil *DIAKTIFKAN*.',
      'Pesan berisi virtex, spam karakter tak terlihat, atau bug crash akan otomatis dimusnahkan.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Virtex* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antivirtex: false })
    return m.reply([
      '╭─── ୨୧ ANTI VIRTEX & BUG ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა proteksi dinonaktifkan!',
      '╰───────────────────────────────╯',
      '',
      '❌ Fitur *Anti Virtex* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI VIRTEX & BUG ୨୧ ───╮',
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
  if (!m.isGroup || m.fromMe) return
  const text = m.text || ''
  if (!text) return

  const isVirtex = text.length > 10000 || (text.match(/[\u200B-\u200D\uFEFF\u061C\u200E\u200F\u202A-\u202E]/g) || []).length > 1500
  if (!isVirtex) return

  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antivirtex) return
  if (isAdmin || m.isOwner) return

  const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

  if (isBotAdmin) {
    try {
      await sock.sendMessage(m.chat, { delete: m.key })
    } catch {}
  }

  const alertMsg = [
    '╭─── ୨୧ PERINGATAN ANTI VIRTEX ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა virtex / bug terdeteksi!',
    '╰────────────────────────────────────╯',
    '',
    `🚫 Terdeteksi pengiriman virtex dari @${senderNum}!`,
    'Pesan berbahaya berhasil dimusnahkan demi keamanan anggota grup.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(alertMsg, { mentions: [m.sender] })
}

handler.help = ['antivirtex [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antivirtex', 'antibug']
handler.group = true
handler.admin = true

export default handler
