import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ MANGATOON NOVEL ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა cerita romantis & fantasi!',
      '╰─────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul cerita>*`,
      `• Contoh: *${usedPrefix + command} Cinta Sang CEO*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari di MangaToon...')

  try {
    const apiUrl = global.API('kyzz', '/api/novel/mangatoon', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Cerita tidak ditemukan di MangaToon.')
    }

    const lines = [
      '╭─── ୨୧ MANGATOON SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა daftar cerita ditemukan!',
      '╰──────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.author) lines.push(`• Penulis: ${item.author}`)
      if (item.link || item.url) lines.push(`• Link: ${item.link || item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil cerita: ${e.message || e}`)
  }
}

handler.help = ['mangatoon <judul>']
handler.tags = ['novel']
handler.category = 'novel'
handler.command = ['mangatoon', 'toonnovel']
handler.register = true

export default handler
