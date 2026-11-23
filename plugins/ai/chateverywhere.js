import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const prompt = text || (m.quoted && m.quoted.text)
  if (!prompt) {
    return m.reply([
      '╭─── ୨୧ CHAT EVERYWHERE AI ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა asisten ai serbaguna!',
      '╰────────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <pertanyaan / prompt>*`,
      `• Contoh: *${usedPrefix + command} rekomendasi laptop koding 10 jutaan*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ AI sedang merespons...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/chateverywhere', { prompt: prompt.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const ans = data?.result || data?.answer || data?.response
    if (!ans) {
      return m.reply('❌ Gagal mendapatkan jawaban dari AI.')
    }

    const textMsg = [
      '╭─── ୨୧ CHAT EVERYWHERE AI ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა respon asisten cerdas!',
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

handler.help = ['chateverywhere <prompt>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['chateverywhere', 'aihelper']
handler.limit = true
handler.register = true

export default handler
