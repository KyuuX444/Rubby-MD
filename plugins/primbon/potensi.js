import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (args.length < 2) {
    return m.reply(formatPrimbonUsage('Potensi Keberuntungan', `${usedPrefix}${command} <nama> <tanggal>`, `${usedPrefix}${command} "Budi Santoso" 15-08-1995`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.potensiKeberuntungan(args[0], args[1])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Potensi Keberuntungan', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['potensi <nama> <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['potensi', 'potensikeberuntungan']
handler.limit = true
handler.register = true

export default handler
