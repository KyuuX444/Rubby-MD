import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (!args.length) {
    return m.reply(formatPrimbonUsage('Tanggal Pernikahan', `${usedPrefix}${command} <tanggal>`, `${usedPrefix}${command} 15-08-2026`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.tanggalPernikahan(args[0])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Tanggal Pernikahan', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['pernikahan <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['pernikahan', 'tglpernikahan']
handler.limit = true
handler.register = true

export default handler
