import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ BACA NOVEL ONLINE ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა cari novel terjemahan sub indo!',
      '╰───────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul novel>*`,
      `• Contoh: *${usedPrefix + command} Lord of Mysteries*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari novel...')

  try {
    const apiUrl = global.API('kyzz', '/api/novel/bacanovel', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Novel tidak ditemukan.')
    }

    const lines = [
      '╭─── ୨୧ HASIL PENCARIAN NOVEL ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა daftar novel ditemukan!',
      '╰──────────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.author) lines.push(`• Penulis: ${item.author}`)
      if (item.status) lines.push(`• Status: ${item.status}`)
      if (item.link || item.url) lines.push(`• Link: ${item.link || item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil novel: ${e.message || e}`)
  }
}

handler.help = ['bacanovel <judul>']
handler.tags = ['novel']
handler.category = 'novel'
handler.command = ['bacanovel', 'novelindo']
handler.register = true

export default handler
