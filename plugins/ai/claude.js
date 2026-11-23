import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const prompt = text || (m.quoted && m.quoted.text)
  if (!prompt) {
    return m.reply([
      '╭─── ୨୧ CLAUDE HAIKU 3.5 ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა anthropic smart ai!',
      '╰──────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <pertanyaan / instruksi>*`,
      `• Contoh: *${usedPrefix + command} buatkan surat lamaran kerja frontend dev*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Claude sedang menganalisis...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/claude', { prompt }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const ans = data?.result || data?.answer || data?.message
    if (!ans) {
      return m.reply('❌ Gagal mendapatkan respon dari Claude AI.')
    }

    const textMsg = [
      '╭─── ୨୧ CLAUDE HAIKU 3.5 ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა respon kecerdasan buatan!',
      '╰──────────────────────────────╯',
      '',
      ans.trim(),
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(textMsg)
  } catch (err) {
    return m.reply(`❌ Error: ${err.message || err}`)
  }
}

handler.help = ['claude <pertanyaan>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['claude', 'anthropic']
handler.limit = true
handler.register = true

export default handler
