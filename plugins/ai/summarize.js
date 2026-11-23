import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const content = text || (m.quoted && m.quoted.text)
  if (!content) {
    return m.reply([
      '╭─── ୨୧ AI SUMMARIZER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა ringkas teks & artikel!',
      '╰───────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <teks panjang>* atau balas pesan teks.`,
      `• Contoh: *${usedPrefix + command} Perkembangan kecerdasan buatan saat ini...*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Membaca dan merangkum poin penting...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/summarize', { text: content.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const summary = data?.summary || data?.result || data?.data
    if (!summary) {
      return m.reply('❌ Gagal merangkum teks.')
    }

    const textMsg = [
      '╭─── ୨୧ AI SUMMARIZER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა rangkuman poin penting!',
      '╰───────────────────────────╯',
      '',
      summary.trim(),
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(textMsg)
  } catch (err) {
    return m.reply(`❌ Error: ${err.message || err}`)
  }
}

handler.help = ['summarize <teks>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['summarize', 'ringkas', 'rangkum']
handler.limit = true
handler.register = true

export default handler
