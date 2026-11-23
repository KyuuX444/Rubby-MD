import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (!args.length) {
    return m.reply(formatPrimbonUsage('Arah Rejeki', `${usedPrefix}${command} <tanggal>`, `${usedPrefix}${command} 15-08-1995`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.arahRejeki(args[0])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Arah Rejeki', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['arahrejeki <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['arahrejeki']
handler.limit = true
handler.register = true

export default handler
