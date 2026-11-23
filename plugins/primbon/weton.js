import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  if (!args.length) {
    return m.reply(formatPrimbonUsage('Weton Jawa', `${usedPrefix}${command} <tanggal>`, `${usedPrefix}${command} 17-08-1945`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.wetonJawa(args[0])
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Weton Jawa', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['weton <tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['weton', 'wetonjawa']
handler.limit = true
handler.register = true

export default handler
