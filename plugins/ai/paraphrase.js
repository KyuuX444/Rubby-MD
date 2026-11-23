import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  const content = text || (m.quoted && m.quoted.text)
  if (!content) {
    return m.reply([
      '╭─── ୨୧ AI PARAPHRASER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა tulis ulang tanpa ubah makna!',
      '╰────────────────────────────╯',
      '',
      `• Penggunaan: *${usedPrefix + command} <teks>* atau reply pesan teks.`,
      `• Contoh: *${usedPrefix + command} Pendidikan adalah kunci utama kesuksesan.* `,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply(global.mess?.wait || '⏳ Menulis ulang susunan kalimat...')

  try {
    const apiUrl = global.API('kyzz', '/api/ai/paraphrase', { text: content.trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 45000 })

    const result = data?.result || data?.paraphrased || data?.text
    if (!result) {
      return m.reply('❌ Gagal memparafrase teks.')
    }

    const textMsg = [
      '╭─── ୨୧ AI PARAPHRASER ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა hasil parafrase teks!',
      '╰────────────────────────────╯',
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

handler.help = ['paraphrase <teks>']
handler.tags = ['ai']
handler.category = 'ai'
handler.command = ['paraphrase', 'parafrase', 'rewrite']
handler.limit = true
handler.register = true

export default handler
