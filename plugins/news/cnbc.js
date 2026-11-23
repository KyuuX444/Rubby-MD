import axios from 'axios'

let handler = async (m) => {
  await m.reply(global.mess?.wait || '⏳ Mengambil berita CNBC Indonesia...')

  try {
    const apiUrl = global.API('kyzz', '/api/news/cnbc', {}, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Gagal mengambil berita CNBC.')
    }

    const lines = [
      '╭─── ୨୧ CNBC INDONESIA ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა pasar finansial & ekonomi!',
      '╰───────────────────────────╯',
      ''
    ]

    list.slice(0, 6).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.link || item.url) lines.push(`• Link: ${item.link || item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil berita: ${e.message || e}`)
  }
}

handler.help = ['cnbc']
handler.tags = ['news']
handler.category = 'news'
handler.command = ['cnbc', 'cnbcindonesia']
handler.register = true

export default handler
