let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  if (!text) {
    return m.reply(`Masukkan pesan broadcast untuk seluruh grup!\n\nContoh:\n*${usedPrefix + command} Halo semua, ada update bot terbaru!*`)
  }

  await m.reply('⏳ Memulai broadcast ke semua grup...')

  try {
    const groups = await client.groupFetchAllParticipating()
    const groupJids = Object.keys(groups || {})

    if (!groupJids.length) {
      return m.reply('❌ Bot tidak bergabung ke dalam grup manapun.')
    }

    let success = 0
    let failed = 0

    const broadcastText = [
      '╭─── ୨୧ BROADCAST BOT ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა pesan owner!',
      '╰───────────────────────────╯',
      '',
      text.trim(),
      '',
      '──────── ୨୧ ────────',
      `📢 Disiarkan oleh Owner Bot`,
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    for (const gid of groupJids) {
      try {
        await client.sendMessage(gid, { text: broadcastText })
        success++
        await new Promise(r => setTimeout(r, 1200))
      } catch {
        failed++
      }
    }

    return m.reply([
      '╭─── ୨୧ HASIL BROADCAST ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა laporan selesai!',
      '╰────────────────────────────╯',
      '',
      `• Total Grup   : *${groupJids.length}*`,
      `• Berhasil     : *${success}*`,
      `• Gagal        : *${failed}*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  } catch (e) {
    return m.reply(`❌ Terjadi kesalahan saat broadcast: ${e.message || e}`)
  }
}

handler.help = ['broadcastgc <pesan>']
handler.tags = ['owner']
handler.category = 'owner'
handler.command = ['broadcastgc', 'bcgc']
handler.owner = true

export default handler
