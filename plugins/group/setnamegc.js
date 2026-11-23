let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  if (!text) {
    return m.reply([
      '╭─── ୨୧ UBAH NAMA GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა update subjek grup!',
      '╰────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <nama baru>*`,
      `• Contoh: *${usedPrefix + command} Rubby Official Community*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  if (text.length > 100) {
    return m.reply('❌ Nama grup maksimal 100 karakter!')
  }

  try {
    await client.groupUpdateSubject(m.chat, text.trim())
    return m.reply([
      '╭─── ୨୧ UBAH NAMA GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა nama grup diperbarui!',
      '╰────────────────────────────╯',
      '',
      `✅ Berhasil mengubah nama grup menjadi:`,
      `*${text.trim()}*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengubah nama grup: ${e.message || e}`)
  }
}

handler.help = ['setnamegc <nama_baru>']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['setnamegc', 'setnamagc', 'setsubject']
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
