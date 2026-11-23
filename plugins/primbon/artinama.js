import { primbon, parseArgs, formatResult, formatPrimbonResponse, formatPrimbonUsage } from '../../scrape/primbon.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const args = parseArgs(text)
  const nama = args.join(' ').trim()
  if (!nama) {
    return m.reply(formatPrimbonUsage('Arti Nama', `${usedPrefix}${command} <nama>`, `${usedPrefix}${command} Angela`))
  }

  await m.reply(global.mess?.wait || '⏳ Sedang diproses...')
  try {
    const res = await primbon.artiNama(nama)
    const out = formatResult(res)
    return m.reply(formatPrimbonResponse('Arti Nama', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['artinama <nama>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['artinama', 'namaku']
handler.limit = true
handler.register = true

export default handler
