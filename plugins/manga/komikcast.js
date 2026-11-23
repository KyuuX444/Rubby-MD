import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ KOMIKCAST MANGA ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა baca manga & manhwa sub indo!',
      '╰─────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul komik>*`,
      `• Contoh: *${usedPrefix + command} One Piece*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari komik di Komikcast...')

  try {
    const apiUrl = global.API('kyzz', '/api/manga/komikcast', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Komik tidak ditemukan di Komikcast.')
    }

    const lines = [
      '╭─── ୨୧ KOMIKCAST SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil komik ditemukan!',
      '╰──────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.type) lines.push(`• Tipe: ${item.type}`)
      if (item.chapter) lines.push(`• Chapter: ${item.chapter}`)
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

handler.help = ['komikcast <judul>']
handler.tags = ['manga']
handler.category = 'manga'
handler.command = ['komikcast', 'kcast']
handler.register = true

export default handler
