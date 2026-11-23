import axios from 'axios'
import { createSticker } from '../../lib/exif.js'

let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  if (!text) {
    return m.reply([
      '╭─── ୨୧ TELEGRAM STICKER CONVERT ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა import stiker telegram ke wa!',
      '╰──────────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <link stiker tele>*`,
      `• Contoh: *${usedPrefix + command} https://t.me/addstickers/LineStickers*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mengunduh stiker dari Telegram...')

  try {
    const match = text.match(/addstickers\/([a-zA-Z0-9_-]+)/)
    const packName = match ? match[1] : text.trim()

    const apiUrl = global.API('kyzz', '/api/downloader/telesticker', { url: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const stickers = data?.result || data?.stickers || []
    if (!stickers.length) {
      return m.reply('❌ Tidak dapat mengunduh stiker Telegram tersebut atau link tidak valid.')
    }

    const limitStickers = stickers.slice(0, 5)
    for (const url of limitStickers) {
      const res = await axios.get(url, { responseType: 'arraybuffer' })
      const stikerBuf = await createSticker(Buffer.from(res.data), {
        packName: `TG: ${packName}`,
        packPublish: global.author || 'Kyuu'
      })
      await client.sendMessage(m.chat, { sticker: stikerBuf }, { quoted: m.raw })
    }
  } catch (e) {
    return m.reply(`❌ Gagal memproses stiker Telegram: ${e.message || e}`)
  }
}

handler.help = ['sticketele <url_tele>']
handler.tags = ['convert']
handler.category = 'convert'
handler.command = ['sticketele', 'stele']
handler.limit = true
handler.register = true

export default handler
