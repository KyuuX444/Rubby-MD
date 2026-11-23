import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ OTAKUDESU ANIME ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა streaming & download anime!',
      '╰─────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul anime>*`,
      `• Contoh: *${usedPrefix + command} Solo Leveling*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari di Otakudesu...')

  try {
    const apiUrl = global.API('kyzz', '/api/anime/otakudesu', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 })

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Anime tidak ditemukan di Otakudesu.')
    }

    const lines = [
      '╭─── ୨୧ OTAKUDESU SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil pencarian anime!',
      '╰──────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.status) lines.push(`• Status: ${item.status}`)
      if (item.rating) lines.push(`• Rating: ${item.rating}`)
      if (item.url || item.link) lines.push(`• Link: ${item.url || item.link}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil data Otakudesu: ${e.message || e}`)
  }
}

handler.help = ['otakudesu <judul>']
handler.tags = ['streaming']
handler.category = 'streaming'
handler.command = ['otakudesu', 'otaku']
handler.limit = true
handler.register = true

export default handler
