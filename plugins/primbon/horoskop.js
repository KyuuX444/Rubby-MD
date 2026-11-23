import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (args.length < 2) {
    return m.reply(formatPrimbonUsage('Horoskop', `${usedPrefix}${command} <nama> <tanggal>`, `${usedPrefix}${command} "Budi Santoso" 15-08-1995`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.horoskop(args[0], args[1])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Horoskop', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['horoskop <nama> <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['horoskop', 'zodiak']
handler.limit = true
handler.register = true

export default handler
