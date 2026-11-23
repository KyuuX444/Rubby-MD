import axios from 'axios'

let handler = async (m) => {
  await m.reply(global.mess?.wait || '⏳ Mengambil berita Kompas...')

  try {
    const apiUrl = global.API('kyzz', '/api/news/kompas', {}, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Gagal mengambil berita Kompas.')
    }

    const lines = [
      '╭─── ୨୧ KOMPAS NEWS ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა berita terpercaya indonesia!',
      '╰─────────────────────────╯',
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

handler.help = ['kompas']
handler.tags = ['news']
handler.category = 'news'
handler.command = ['kompas', 'kompasnews']
handler.register = true

export default handler
