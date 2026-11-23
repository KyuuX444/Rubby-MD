import { chatgpt } from '../../scrape/chatgpt.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const prompt = text || (m.quoted && m.quoted.text)
  if (!prompt) {
    return m.reply([
      '╭─── ୨୧ CHATGPT 4O AI ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა tanya apapun ke ai!',
      '╰───────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <pertanyaan / prompt>*`,
      `• Contoh: *${usedPrefix + command} jelaskan teori relativitas secara sederhana*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang berpikir...')

  try {
    const res = await chatgpt(prompt)
    if (!res.ok || !res.answer) {
      return m.reply('❌ Gagal mendapatkan balasan dari ChatGPT. Silakan coba lagi.')
    }

    const textMsg = [
      '╭─── ୨୧ CHATGPT 4O AI ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა respon kecerdasan buatan!',
      '╰───────────────────────────╯',
      '',
      res.answer.trim(),
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(textMsg)
  } catch (err) {
    return m.reply(`❌ Error: ${err.message || err}`)
  }
}

handler.help = ['chatgpt <pertanyaan>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['chatgpt', 'openai', 'gpt4']
handler.limit = true
handler.register = true

export default handler
