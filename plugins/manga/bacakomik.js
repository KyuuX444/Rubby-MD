import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ BACAKOMIK MANGA ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა baca komik terlengkap sub indo!',
      '╰─────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul komik>*`,
      `• Contoh: *${usedPrefix + command} Jujutsu Kaisen*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari komik di Bacakomik...')

  try {
    const apiUrl = global.API('kyzz', '/api/manga/bacakomik', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Komik tidak ditemukan di Bacakomik.')
    }

    const lines = [
      '╭─── ୨୧ BACAKOMIK SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil komik ditemukan!',
      '╰──────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.type) lines.push(`• Tipe: ${item.type}`)
      if (item.rating) lines.push(`• Rating: ${item.rating}`)
      if (item.link || item.url) lines.push(`• Link: ${item.link || item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil data: ${e.message || e}`)
  }
}

handler.help = ['bacakomik <judul>']
handler.tags = ['manga']
handler.category = 'manga'
handler.command = ['bacakomik', 'bacamanga']
handler.register = true

export default handler
