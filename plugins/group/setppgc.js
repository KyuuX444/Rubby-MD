import sharp from 'sharp'

let handler = async (m, { conn, sock, usedPrefix, command }) => {
  const client = conn || sock
  const q = m.quoted ? m.quoted : m
  const mime = q.mimetype || q.msg?.mimetype || ''

  if (!mime || !mime.startsWith('image/')) {
    return m.reply([
      '╭─── ୨୧ UBAH FOTO PROFIL GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა update icon avatar grup!',
      '╰───────────────────────────────────╯',
      '',
      `• Penggunaan: Kirim atau reply gambar dengan caption:`,
      `  *${usedPrefix + command}*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mengubah foto profil grup...')

  try {
    const media = await q.download()
    if (!media) return m.reply('❌ Gagal mengunduh gambar.')

    const processed = await sharp(media)
      .resize(640, 640, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer()

    await client.updateProfilePicture(m.chat, processed)
    return m.reply([
      '╭─── ୨୧ UBAH FOTO PROFIL GRUP ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა icon grup diperbarui!',
      '╰───────────────────────────────────╯',
      '',
      '✅ Foto profil grup berhasil diperbarui!',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengubah foto profil grup: ${e.message || e}`)
  }
}

handler.help = ['setppgc']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['setppgc', 'setppgrup', 'setppgroup']
handler.group = true
handler.admin = true
handler.botadmin = true

export default handler
