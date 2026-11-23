import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ NOVEL RINGAN INDO ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა light novel & webnovel sub indo!',
      '╰───────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul novel>*`,
      `• Contoh: *${usedPrefix + command} Overlord*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari di NovelRingan...')

  try {
    const apiUrl = global.API('kyzz', '/api/novel/novelringan', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Novel tidak ditemukan di NovelRingan.')
    }

    const lines = [
      '╭─── ୨୧ NOVELRINGAN SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა daftar light novel!',
      '╰────────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.genre) lines.push(`• Genre: ${item.genre}`)
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

handler.help = ['novelringan <judul>']
handler.tags = ['novel']
handler.category = 'novel'
handler.command = ['novelringan', 'lnindo']
handler.register = true

export default handler
