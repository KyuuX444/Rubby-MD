import { scrapeHomeArticles } from '../../scrape/okezone.js'

let handler = async (m) => {
  await m.reply(global.mess?.wait || '⏳ Mengambil berita terkini Okezone...')

  try {
    const articles = await scrapeHomeArticles({ limit: 6 })
    if (!articles || !articles.length) {
      return m.reply('❌ Gagal memuat berita Okezone saat ini.')
    }

    const lines = [
      '╭─── ୨୧ OKEZONE NEWS ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა kabar & berita terhangat!',
      '╰──────────────────────────╯',
      ''
    ]

    articles.forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title}*`)
      if (item.url) lines.push(`• Link: ${item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil berita: ${e.message || e}`)
  }
}

handler.help = ['okezone']
handler.tags = ['news']
handler.category = 'news'
handler.command = ['okezone', 'okezonenews']
handler.register = true

export default handler
