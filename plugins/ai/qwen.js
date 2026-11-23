import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const prompt = text || (m.quoted && m.quoted.text)
  if (!prompt) {
    return m.reply([
      '╭─── ୨୧ QWEN 2.5 ALIBABA ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა model cerdas matematika!',
      '╰──────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <pertanyaan / rumus>*`,
      `• Contoh: *${usedPrefix + command} hitung volume tabung dengan r=7 t=10*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Qwen sedang memproses...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/qwen', { prompt }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const ans = data?.result || data?.answer
    if (!ans) {
      return m.reply('❌ Gagal mendapatkan respon dari Qwen AI.')
    }

    const textMsg = [
      '╭─── ୨୧ QWEN 2.5 ALIBABA ୨୧ ───╮',
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

handler.help = ['qwen <pertanyaan>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['qwen', 'alibabaai']
handler.limit = true
handler.register = true

export default handler
