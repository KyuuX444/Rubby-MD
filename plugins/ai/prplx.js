import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const query = text || (m.quoted && m.quoted.text)
  if (!query) {
    return m.reply([
      '╭─── ୨୧ PERPLEXITY AI SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა riset & pencarian fakta ai!',
      '╰──────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <pertanyaan / topik>*`,
      `• Contoh: *${usedPrefix + command} perkembangan misi artemis nasa terbaru*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Mencari informasi real-time...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/perplexity', { query: query.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const ans = data?.result || data?.answer || data?.response
    if (!ans) {
      return m.reply('❌ Gagal mendapatkan jawaban dari Perplexity AI.')
    }

    const textMsg = [
      '╭─── ୨୧ PERPLEXITY AI SEARCH ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil pencarian & riset!',
      '╰──────────────────────────────────╯',
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

handler.help = ['prplx <query>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['prplx', 'perplexity']
handler.limit = true
handler.register = true

export default handler
