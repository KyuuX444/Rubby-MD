import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const prompt = text || (m.quoted && m.quoted.text)
  if (!prompt) {
    return m.reply([
      '╭─── ୨୧ META LLAMA 3.3 ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა open weights terbaik meta!',
      '╰────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <pertanyaan / instruksi>*`,
      `• Contoh: *${usedPrefix + command} buat script python scraping html*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Llama sedang memproses...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/llama', { prompt }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const ans = data?.result || data?.answer
    if (!ans) {
      return m.reply('❌ Gagal mendapatkan respon dari Meta Llama.')
    }

    const textMsg = [
      '╭─── ୨୧ META LLAMA 3.3 ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა respon kecerdasan buatan!',
      '╰────────────────────────────╯',
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

handler.help = ['llama <pertanyaan>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['llama', 'llama3']
handler.limit = true
handler.register = true

export default handler
