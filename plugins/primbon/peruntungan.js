import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (args.length < 2) {
    return m.reply(formatPrimbonUsage('Ramalan Peruntungan', `${usedPrefix}${command} <nama> <tgl> [tahun]`, `${usedPrefix}${command} "Budi Santoso" 15-08-1995 2026`))
  }

  const tahun = args[2] || new Date().getFullYear()

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.ramalanPeruntungan(args[0], args[1], tahun)
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Ramalan Peruntungan', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['peruntungan <nama> <tgl> <tahun>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['peruntungan', 'ramalanperuntungan']
handler.limit = true
handler.register = true

export default handler
