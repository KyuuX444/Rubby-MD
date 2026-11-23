import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  await m.reply(global.mess?.wait || '⏳ Mengambil cerita pendek...')

  try {
    const apiUrl = global.API('kyzz', '/api/novel/cerpen', { q: (text || '').trim() }, 'apikey')
    const { data } = await axios.get(apiUrl, { timeout: 30000 }).catch(() => ({ data: null }))

    const story = data?.result || data?.cerpen
    if (!story) {
      return m.reply('❌ Cerpen tidak ditemukan atau server sedang sibuk.')
    }

    const textMsg = [
      `╭─── ୨୧ ${(story.title || 'CERITA PENDEK').toUpperCase()} ୨୧ ───╮`,
      `│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა karya: ${story.author || 'Anonim'}`,
      '╰────────────────────────────────────╯',
      '',
      story.content ? story.content.slice(0, 1500) + '...' : (story.story || story.text || '-'),
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(textMsg)
  } catch (e) {
    return m.reply(`❌ Gagal mengambil cerpen: ${e.message || e}`)
  }
}

handler.help = ['cerpen [kategori]']
handler.tags = ['novel']
handler.category = 'novel'
handler.command = ['cerpen', 'ceritapendek']
handler.register = true

export default handler
