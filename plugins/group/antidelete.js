import databaseApi from '../../lib/database.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antidelete)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Delete* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antidelete: true })
    return m.reply([
      '╭─── ୨୧ ANTI DELETE PESAN ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა lacak pesan yang ditarik!',
      '╰───────────────────────────────╯',
      '',
      '✅ Fitur *Anti Delete* berhasil *DIAKTIFKAN*.',
      'Pesan yang dihapus/ditarik oleh member lain akan otomatis dikirim ulang oleh bot.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Delete* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antidelete: false })
    return m.reply([
      '╭─── ୨୧ ANTI DELETE PESAN ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა pelacakan dinonaktifkan!',
      '╰───────────────────────────────╯',
      '',
      '❌ Fitur *Anti Delete* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI DELETE PESAN ୨୧ ───╮',
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

handler.before = async (m, { sock, getGroup }) => {
  if (!m.isGroup || m.fromMe) return

  // Check if message is a protocol revocation (delete message)
  const proto = m.msg || m.message?.protocolMessage
  const isRevoke = (m.mtype === 'protocolMessage' || proto?.type === 0 || proto?.type === 'REVOKE')
  if (!isRevoke) return

  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antidelete) return

  const targetId = proto?.key?.id || m.key?.id
  if (!targetId || !global.msgCache) return

  const cached = global.msgCache.get(`${m.chat}_${targetId}`)
  if (!cached || !cached.text) return

  const senderNum = (cached.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
  const timeStr = new Date(cached.time || Date.now()).toLocaleTimeString('id-ID')

  const textMsg = [
    '╭─── ୨୧ PESAN TERHAPUS TERDETEKSI ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა anti delete recovery!',
    '╰──────────────────────────────────────╯',
    '',
    `👤 *Pengirim:* @${senderNum}`,
    `🕒 *Waktu Kirim:* ${timeStr}`,
    '',
    '💬 *Isi Pesan:*',
    cached.text,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await sock.sendMessage(m.chat, {
    text: textMsg,
    mentions: [cached.sender]
  })
}

handler.help = ['antidelete [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antidelete', 'antitarik']
handler.group = true
handler.admin = true

export default handler
