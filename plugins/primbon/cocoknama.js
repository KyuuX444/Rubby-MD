import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (args.length < 2) {
    return m.reply(formatPrimbonUsage('Kecocokan Nama', `${usedPrefix}${command} <nama> <tanggal>`, `${usedPrefix}${command} "Budi Santoso" 15-08-1995`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.kecocokanNama(args[0], args[1])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Kecocokan Nama', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['cocoknama <nama> <tgl>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['cocoknama']
handler.limit = true
handler.register = true

export default handler
