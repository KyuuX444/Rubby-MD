import { kusonime } from '../../scrape/kusonime.js'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ KUSONIME ANIME STREAM ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა download anime batch sub indo!',
      '╰──────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul anime>*`,
      `• Contoh: *${usedPrefix + command} Naruto Shippuden*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari anime di Kusonime...')

  try {
    const res = await kusonime(text.trim())
    const list = res?.result || res || []
    if (!list.length) {
      return m.reply('❌ Anime tidak ditemukan di Kusonime.')
    }

    const lines = [
      '╭─── ୨୧ KUSONIME SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა anime batch sub indo!',
      '╰─────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.release) lines.push(`• Rilis: ${item.release}`)
      if (item.genre) lines.push(`• Genre: ${item.genre}`)
      if (item.link || item.url) lines.push(`• Link: ${item.link || item.url}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil data Kusonime: ${e.message || e}`)
  }
}

handler.help = ['kusonime <judul>']
handler.tags = ['streaming']
handler.category = 'streaming'
handler.command = ['kusonime', 'kuso']
handler.limit = true
handler.register = true

export default handler
