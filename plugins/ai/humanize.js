import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const content = text || (m.quoted && m.quoted.text)
  if (!content) {
    return m.reply([
      '╭─── ୨୧ HUMANIZE AI TEXT ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა ubah teks ai jadi natural!',
      '╰──────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <teks ai>* atau balas pesan teks.`,
      `• Mengubah gaya tulisan robotik menjadi tulisan alami manusia.`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mengubah teks menjadi gaya natural...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/humanize-text', { text: content.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const result = data?.result || data?.humanized || data?.text
    if (!result) {
      return m.reply('❌ Gagal memproses humanize teks.')
    }

    const textMsg = [
      '╭─── ୨୧ HUMANIZE AI TEXT ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil tulisan natural!',
      '╰──────────────────────────────╯',
      '',
      result.trim(),
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(textMsg)
  } catch (err) {
    return m.reply(`❌ Error: ${err.message || err}`)
  }
}

handler.help = ['humanize <teks>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['humanize', 'humanizetext']
handler.limit = true
handler.register = true

export default handler
