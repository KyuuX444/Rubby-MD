import { resolveLidToPn, normalizeNumber } from '../../lib/utils.js'

let handler = async (m, { text, usedPrefix, command }) => {
  let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : text)
  if (!target) {
    return m.reply(`Tag atau reply orang yang ingin kamu tampar!\n\nContoh:\n*${usedPrefix + command} @user*`)
  }

  target = resolveLidToPn(target)
  const targetNum = normalizeNumber(target)
  const senderNum = normalizeNumber(m.sender)

  if (targetNum === senderNum) {
    return m.reply('Jangan menampar diri sendiri dong, kasihan pipimu!')
  }

  const textMsg = [
    '╭─── ୨୧ TAMPARAN MAUT ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა plakkkkk!',
    '╰───────────────────────────╯',
    '',
    `👋 *PLAKKKKK!* *@${senderNum}* mendaratkan tamparan keras ke pipi *@${targetNum}* sampai berputar 360 derajat! 😵💫`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [target, m.sender]
  })
}

handler.help = ['slap @user']
handler.tags = ['fun']
handler.category = 'fun'
handler.command = ['slap', 'tampar']

export default handler
