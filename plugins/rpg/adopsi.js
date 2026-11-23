import { getFamily, saveFamily } from '../../lib/family.js'
import { resolveLidToPn, normalizeNumber } from '../../lib/utils.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const userFam = getFamily(m.sender)
  if (!userFam || !userFam.family.partner) {
    return m.reply(`❌ Hanya pasangan yang sudah menikah yang dapat mengadopsi anak! Ketik *${usedPrefix}keluarga*.`)
  }

  let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : text)
  if (!target) {
    return m.reply(`Tag atau reply calon anak yang ingin kamu adopsi!\n\nContoh:\n*${usedPrefix + command} @user*`)
  }

  target = resolveLidToPn(target)
  const targetNum = normalizeNumber(target)
  if (!targetNum || targetNum === userFam.num || targetNum === userFam.family.partner) {
    return m.reply('❌ Tidak bisa mengadopsi diri sendiri atau pasangan!')
  }

  const childFam = getFamily(targetNum)
  if (!childFam) return m.reply('❌ Calon anak belum terdaftar di database bot.')

  const partnerFam = getFamily(userFam.family.partner)
  const children = userFam.family.children || []

  if (children.includes(targetNum)) {
    return m.reply(`❌ @${targetNum} sudah menjadi anak dalam keluargamu!`, { mentions: [target] })
  }

  if (children.length >= 5) {
    return m.reply('❌ Maksimal anggota anak yang dapat diadopsi adalah 5 anak.')
  }

  children.push(targetNum)
  userFam.family.children = children
  if (partnerFam) partnerFam.family.children = children

  childFam.family.parents = [userFam.num, userFam.family.partner]

  saveFamily(userFam)
  if (partnerFam) saveFamily(partnerFam)
  saveFamily(childFam)

  const textMsg = [
    '╭─── ୨୧ ADOPSI ANAK RESMI ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა anggota keluarga baru!',
    '╰───────────────────────────────╯',
    '',
    `👶 Selamat! @${targetNum} telah resmi diadopsi menjadi anak oleh:`,
    `👨‍👩‍👧 Orang Tua: @${userFam.num} & @${userFam.family.partner}`,
    '',
    `Bimbing dan sayangi anak kalian dengan baik! Ketik *${usedPrefix}keluarga* untuk melihat daftar anggota.`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [target, `${userFam.num}@s.whatsapp.net`, `${userFam.family.partner}@s.whatsapp.net`]
  })
}

handler.help = ['adopsi @user']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['adopsi', 'adopsianak', 'angkat-anak']

export default handler
