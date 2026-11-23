import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const prompt = text || (m.quoted && m.quoted.text)
  if (!prompt) {
    return m.reply([
      '╭─── ୨୧ DEEPSEEK REASONING ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა penalaran logika mendalam!',
      '╰────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <soal logika / coding>*`,
      `• Contoh: *${usedPrefix + command} jelaskan algoritma dijkstra step by step*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ DeepSeek sedang berpikir logis...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/deepseek', { prompt }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const ans = data?.result || data?.answer || data?.data
    if (!ans) {
      return m.reply('❌ Gagal mendapatkan respon dari DeepSeek.')
    }

    const textMsg = [
      '╭─── ୨୧ DEEPSEEK REASONING ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა analisis penalaran ai!',
      '╰────────────────────────────────╯',
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

handler.help = ['deepseek <pertanyaan>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['deepseek', 'r1', 'deepsek']
handler.limit = true
handler.register = true

export default handler
