import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ ANICHIN DONGHUA ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა streaming donghua sub indo!',
      '╰─────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <judul donghua>*`,
      `• Contoh: *${usedPrefix + command} Battle Through the Heavens*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari di Anichin...')

  try {
    const apiUrl = global.API('kyzz', '/api/anime/anichin', { q: text.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 })

    const list = data?.result || data?.data || []
    if (!list.length) {
      return m.reply('❌ Donghua tidak ditemukan di Anichin.')
    }

    const lines = [
      '╭─── ୨୧ ANICHIN SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil streaming donghua!',
      '╰────────────────────────────╯',
      ''
    ]

    list.slice(0, 5).forEach((item, idx) => {
      lines.push(`*${idx + 1}. ${item.title || item.judul}*`)
      if (item.type) lines.push(`• Tipe: ${item.type}`)
      if (item.status) lines.push(`• Status: ${item.status}`)
      if (item.url || item.link) lines.push(`• Link: ${item.url || item.link}`)
      lines.push('')
    })

    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal mengambil data Anichin: ${e.message || e}`)
  }
}

handler.help = ['anichin <judul>']
handler.tags = ['streaming']
handler.category = 'streaming'
handler.command = ['anichin', 'donghua']
handler.limit = true
handler.register = true

export default handler
