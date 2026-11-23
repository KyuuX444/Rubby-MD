import databaseApi from '../../lib/database.js'

const stkMap = new Map()

let handler = async (m, { args, usedPrefix, command }) => {
  const isEnable = (args[0] || '').toLowerCase()
  const group = databaseApi.getGroup(m.chat)
  const current = Boolean(group.antisticker)

  if (isEnable === 'on' || isEnable === 'enable' || isEnable === '1') {
    if (current) return m.reply('Fitur *Anti Stiker* sudah aktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antisticker: true })
    return m.reply([
      '╭─── ୨୧ ANTI SPAM STIKER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა batasi spam stiker grup!',
      '╰──────────────────────────────╯',
      '',
      '✅ Fitur *Anti Stiker* berhasil *DIAKTIFKAN*.',
      'Pengiriman stiker beruntun secara berlebihan akan otomatis dibatasi.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (isEnable === 'off' || isEnable === 'disable' || isEnable === '0') {
    if (!current) return m.reply('Fitur *Anti Stiker* sudah nonaktif di grup ini sebelumnya.')
    databaseApi.setGroup(m.chat, { antisticker: false })
    return m.reply([
      '╭─── ୨୧ ANTI SPAM STIKER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა fitur dinonaktifkan!',
      '╰──────────────────────────────╯',
      '',
      '❌ Fitur *Anti Stiker* berhasil *DINONAKTIFKAN*.',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  return m.reply([
    '╭─── ୨୧ ANTI SPAM STIKER ୨୧ ───╮',
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
  if (!m.isGroup || m.fromMe) return
  const isSticker = m.mtype === 'stickerMessage' || /webp/i.test(m.mimetype || '')
  if (!isSticker) return

  const group = getGroup ? getGroup(m.chat) : databaseApi.getGroup(m.chat)
  if (!group.antisticker) return
  if (isAdmin || m.isOwner) return

  const now = Date.now()
  const key = `${m.chat}_${m.sender}`
  const timestamps = stkMap.get(key) || []
  const recent = timestamps.filter(t => now - t < 5000)
  recent.push(now)
  stkMap.set(key, recent)

  if (recent.length >= 3) {
    if (isBotAdmin) {
      try {
        await sock.sendMessage(m.chat, { delete: m.key })
      } catch {}
    }

    if (recent.length === 3) {
      const senderNum = (m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
      const warningMsg = [
        '╭─── ୨୧ PERINGATAN ANTI STIKER ୨୧ ───╮',
        '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა spam stiker terdeteksi!',
        '╰────────────────────────────────────╯',
        '',
        `⚠️ @${senderNum}, mohon tidak spam stiker!`,
        'Grup ini mengaktifkan batasan pengiriman stiker beruntun.',
        '',
        '──────── ୨୧ ────────',
        `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
      ].join('\n')

      return await m.reply(warningMsg, { mentions: [m.sender] })
    }
  }
}

handler.help = ['antisticker [on/off]']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antisticker', 'antistiker']
handler.group = true
handler.admin = true

export default handler
