import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (args.length < 2) {
    return m.reply(formatPrimbonUsage('Kecocokan Pasangan', `${usedPrefix}${command} <nama1> <nama2>`, `${usedPrefix}${command} "Budi Santoso" "Ani Putri"`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.kecocokanNamaPasangan(args[0], args[1])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Kecocokan Pasangan', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['cocokpasangan <nama1> <nama2>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['cocokpasangan']
handler.limit = true
handler.register = true

export default handler
