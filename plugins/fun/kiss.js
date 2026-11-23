import { resolveLidToPn, normalizeNumber } from '../../lib/utils.js'

let handler = async (m, { text, usedPrefix, command }) => {
  let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : text)
  if (!target) {
    return m.reply(`Tag atau reply orang yang ingin kamu cium!\n\nContoh:\n*${usedPrefix + command} @user*`)
  }

  target = resolveLidToPn(target)
  const targetNum = normalizeNumber(target)
  const senderNum = normalizeNumber(m.sender)

  if (targetNum === senderNum) {
    return m.reply('Kamu mencium cermin sendiri... Lucu sekali ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა')
  }

  const textMsg = [
    '╭─── ୨୧ KECUPAN SAYANG ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა mwahhh sweet!',
    '╰────────────────────────────╯',
    '',
    `💋 *@${senderNum}* memberikan kecupan hangat dan manis ke pipi *@${targetNum}*! ( ˘ ³˘)♥`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [target, m.sender]
  })
}

handler.help = ['kiss @user']
handler.tags = ['fun']
handler.category = 'fun'
handler.command = ['kiss', 'cium']

export default handler
