import { createSticker } from '../../lib/exif.js'

let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted || m
  const mime = quoted.mimetype || ''

  if (!/webp/i.test(mime)) {
    return m.reply([
      '╭─── ୨୧ WATERMARK STIKER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა custom nama author stiker!',
      '╰──────────────────────────────╯',
      '',
      `• Balas stiker dengan: *${usedPrefix + command} <nama author>*`,
      `• Contoh: *${usedPrefix + command} Kyuu Official*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  const packName = global.packname || 'Rubby Multi Device'
  const packPublish = text ? text.trim() : (global.author || 'Kyuu')

  await m.reply(global.mess?.wait || '⏳ Mengubah watermark...')

  try {
    const buf = await quoted.download?.()
    if (!buf) throw new Error('Gagal mengunduh stiker')

    const stickerBuffer = await createSticker(buf, {
      packName,
      packPublish,
      isVideo: false
    })

    return await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m.raw })
  } catch (e) {
    return m.reply(`❌ Gagal mengubah watermark: ${e.message || e}`)
  }
}

handler.help = ['wm <author>']
handler.tags = ['convert']
handler.category = 'convert'
handler.command = ['wm', 'watermark']
handler.limit = true
handler.register = true

export default handler
