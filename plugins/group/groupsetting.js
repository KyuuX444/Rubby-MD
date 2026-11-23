let handler = async (m, { conn, sock, args, usedPrefix, command }) => {
  const client = conn || sock
  const action = (args[0] || '').toLowerCase()

  const validActions = {
    announce: 'announcement',
    tutup: 'announcement',
    close: 'announcement',
    not_announce: 'not_announcement',
    buka: 'not_announcement',
    open: 'not_announcement',
    locked: 'locked',
    kunci: 'locked',
    unlocked: 'unlocked',
    bukakunci: 'unlocked'
  }

  const selected = validActions[action]
  if (!selected) {
    return m.reply([
      '╭─── ୨୧ SETTING GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა pengaturan grup!',
      '╰──────────────────────────╯',
      '',
      'Pilih pengaturan yang ingin diubah:',
      `• *${usedPrefix + command} announce* (Hanya admin kirim pesan)`,
      `• *${usedPrefix + command} not_announce* (Semua peserta kirim pesan)`,
      `• *${usedPrefix + command} locked* (Hanya admin edit info grup)`,
      `• *${usedPrefix + command} unlocked* (Semua peserta edit info grup)`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  try {
    if (selected === 'announcement' || selected === 'not_announcement') {
      await client.groupSettingUpdate(m.chat, selected)
      const desc = selected === 'announcement' ? 'Hanya admin yang dapat mengirim pesan.' : 'Semua peserta dapat mengirim pesan.'
      return m.reply(`✅ Berhasil mengubah setelan chat: *${desc}*`)
    } else {
      await client.groupSettingUpdate(m.chat, selected)
      const desc = selected === 'locked' ? 'Hanya admin yang dapat mengedit info grup.' : 'Semua peserta dapat mengedit info grup.'
      return m.reply(`✅ Berhasil mengubah setelan info grup: *${desc}*`)
    }
  } catch (e) {
    return m.reply(`❌ Gagal mengubah setelan grup: ${e.message || e}`)
  }
}

handler.help = ['groupsetting <announce|not_announce|locked|unlocked>']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['groupsetting', 'setgc', 'grupedit']
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
