import { primbon, parseArgs, formatPrimbonResponse } from '../../scrape/primbon.js'

let handler = async (m, { text }) => {
  const args = parseArgs(text)
  const input = args[0] || new Date().getFullYear()

  try {
    const res = primbon.shio(input)
    const out = [
      `• Tahun : *${res.tahun}*`,
      `• Shio  : *${res.shio}*`,
      `• Unsur : *${res.unsur}*`
    ].join('\n')

    return m.reply(formatPrimbonResponse('Shio & Unsur', out))
  } catch (e) {
    return m.reply(`❌ *Primbon Error:* ${e.message}`)
  }
}

handler.help = ['shio <tahun/tanggal>']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['shio']
handler.limit = true
handler.register = true

export default handler
