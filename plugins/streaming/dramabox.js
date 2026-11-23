import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ DRAMABOX SHORT MOVIES ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა nonton serial drama pendek!',
      '╰───────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul drama>*`,
      `• Contoh: *${usedPrefix + command} CEO and Secretary*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari drama di DramaBox...')

  try {
    const apiUrl = global.API('kyzz', '/api/streaming/dramabox', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 })

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Drama tidak ditemukan.')
    }

    const lines = [
      '╭─── ୨୧ HASIL PENCARIAN DRAMABOX ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა serial drama pendek ditemukan!',
      '╰─────────────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.name}*`)
      if (item.episode) lines.push(`• Total Episode: ${item.episode}`)
      if (item.genre) lines.push(`• Genre: ${item.genre}`)
      if (item.url) lines.push(`• Link: ${item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil data DramaBox: ${e.message || e}`)
  }
}

handler.help = ['dramabox <judul>']
handler.tags = ['streaming']
handler.category = 'streaming'
handler.command = ['dramabox', 'dbox']
handler.limit = true
handler.register = true

export default handler
