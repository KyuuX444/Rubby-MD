import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (args.length < 4) {
    return m.reply(formatPrimbonUsage('Ramalan Jodoh', `${usedPrefix}${command} <nama1> <tgl1> <nama2> <tgl2>`, `${usedPrefix}${command} "Budi" 15-08-1995 "Ani" 20-10-1997`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.ramalanJodoh(args[0], args[1], args[2], args[3])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Ramalan Jodoh', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['jodoh <nama1> <tgl1> <nama2> <tgl2>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['jodoh', 'ramalanjodoh', 'jodohweton', 'kecocokanweton']
handler.limit = true
handler.register = true

export default handler
