let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  if (!text) {
    return m.reply([
      '╭─── ୨୧ UBAH DESKRIPSI GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა update info deskripsi!',
      '╰──────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <deskripsi baru>*`,
      `• Contoh: *${usedPrefix + command} Selamat datang di grup kami, patuhi peraturan!*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  try {
    await client.groupUpdateDescription(m.chat, text.trim())
    return m.reply([
      '╭─── ୨୧ UBAH DESKRIPSI GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა deskripsi diperbarui!',
      '╰──────────────────────────────────╯',
      '',
      '✅ Berhasil memperbarui deskripsi grup!',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal memperbarui deskripsi grup: ${e.message || e}`)
  }
}

handler.help = ['setdesc <deskripsi>']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['setdesc', 'setdesk', 'setdescription']
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
