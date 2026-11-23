import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ WATTPAD NOVEL SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა cari cerita wattpad favorit!',
      '╰──────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul cerita>*`,
      `• Contoh: *${usedPrefix + command} Mariposa*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari cerita di Wattpad...')

  try {
    const apiUrl = global.API('kyzz', '/api/novel/wattpad', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Cerita Wattpad tidak ditemukan.')
    }

    const lines = [
      '╭─── ୨୧ WATTPAD SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil cerita ditemukan!',
      '╰────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.reads) lines.push(`• Pembaca: ${item.reads}`)
      if (item.votes) lines.push(`• Vote: ${item.votes}`)
      if (item.url || item.link) lines.push(`• Link: ${item.url || item.link}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil data Wattpad: ${e.message || e}`)
  }
}

handler.help = ['wattpad <judul>']
handler.tags = ['novel']
handler.category = 'novel'
handler.command = ['wattpad', 'ceritawattpad']
handler.register = true

export default handler
