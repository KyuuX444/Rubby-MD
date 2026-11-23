import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (!args.length) {
    return m.reply(formatPrimbonUsage('Sifat Usaha Bisnis', `${usedPrefix}${command} <tanggal>`, `${usedPrefix}${command} 15-08-1995`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.sifatUsahaBisnis(args[0])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Sifat Usaha Bisnis', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['usaha <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['usaha', 'bisnis']
handler.limit = true
handler.register = true

export default handler
