import { createSticker } from '../../lib/exif.js'

let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  const quoted = m.quoted || m
  const mime = quoted.mimetype || ''

  if (!/webp/i.test(mime)) {
    return m.reply([
      '╭─── ୨୧ UBAH WATERMARK STIKER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა ganti packname & author!',
      '╰──────────────────────────────────╯',
      '',
      `• Balas stiker dengan: *${usedPrefix + command} packname | author*`,
      `• Contoh: *${usedPrefix + command} MyPack | Rubby*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  let packName = global.packname || 'Rubby Multi Device'
  let packPublish = global.author || 'Kyuu'

  if (text) {
    const parts = text.split('|')
    if (parts[0]) packName = parts[0].trim()
    if (parts[1]) packPublish = parts[1].trim()
  }

  await m.reply(global.mess?.wait || '⏳ Mengubah watermark stiker...')

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
    return m.reply(`❌ Gagal mengubah watermark stiker: ${e.message || e}`)
  }
}

handler.help = ['swm <packname | author>']
handler.tags = ['convert']
handler.category = 'convert'
handler.command = ['swm', 'stikerwm', 'stickerwm']
handler.limit = true
handler.register = true

export default handler
