import databaseApi from '../../lib/database.js'

const spamMap = new Map()

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antispam)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Spam* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antispam: true })
    return m.reply([
      '╭─── ୨୧ ANTI SPAM FLOOD ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა cegah flood chat massal!',
      '╰─────────────────────────────╯',
      '',
      '✅ Fitur *Anti Spam* berhasil *DIAKTIFKAN*.',
      'Pengiriman pesan bertubi-tubi dalam waktu singkat akan otomatis dibatasi.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Spam* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antispam: false })
    return m.reply([
      '╭─── ୨୧ ANTI SPAM FLOOD ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა fitur dinonaktifkan!',
      '╰─────────────────────────────╯',
      '',
      '❌ Fitur *Anti Spam* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI SPAM FLOOD ୨୧ ───╮',
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
  if (!m.isGroup || m.fromMe) return
  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antispam) return
  if (isAdmin || m.isOwner) return

  const now = Date.now()
  const key = `${m.chat}_${m.sender}`
  const timestamps = spamMap.get(key) || []
  const recent = timestamps.filter(t => now - t < 3000)
  recent.push(now)
  spamMap.set(key, recent)

  if (recent.length >= 5) {
    if (isBotAdmin) {
      try {
        await sock.sendMessage(m.chat, { delete: m.key })
      } catch {}
    }

    if (recent.length === 5) {
      const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
      const warningMsg = [
        '╭─── ୨୧ PERINGATAN ANTI SPAM ୨୧ ───╮',
        '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა flood chat terdeteksi!',
        '╰──────────────────────────────────╯',
        '',
        `⚠️ @${senderNum}, mohon beri jeda!`,
        'Dilarang mengirim pesan berulang-ulang secara cepat di grup ini.',
        '',
        '──────── ୨୧ ────────',
        `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
      ].join('\n')

      return await m.reply(warningMsg, { mentions: [m.sender] })
    }
  }
}

handler.help = ['antispam [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antispam', 'antiflood']
handler.group = true
handler.admin = true

export default handler
