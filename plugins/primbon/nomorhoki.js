import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  const nomor = (args[0] || text || '').replace(/[^\d+]/g, '')
  if (!nomor) {
    return m.reply(formatPrimbonUsage('Nomor Hoki', `${usedPrefix}${command} <nomor>`, `${usedPrefix}${command} 081234567890`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.nomorHoki(nomor)
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Nomor Hoki', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['nomorhoki <nomor>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['nomorhoki', 'angkaberuntung']
handler.limit = true
handler.register = true

export default handler
