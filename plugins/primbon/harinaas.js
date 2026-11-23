import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (!args.length) {
    return m.reply(formatPrimbonUsage('Hari Naas', `${usedPrefix}${command} <tanggal>`, `${usedPrefix}${command} 15-08-1995`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.hariNaas(args[0])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Hari Naas', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['harinaas <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['harinaas']
handler.limit = true
handler.register = true

export default handler
