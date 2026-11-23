import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  const mimpi = args.join(' ').trim()
  if (!mimpi) {
    return m.reply(formatPrimbonUsage('Tafsir Mimpi', `${usedPrefix}${command} <kata kunci>`, `${usedPrefix}${command} ular`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.tafsirMimpi(mimpi)
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Tafsir Mimpi', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['tafsirmimpi <kata kunci>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['tafsirmimpi', 'mimpi']
handler.limit = true
handler.register = true

export default handler
