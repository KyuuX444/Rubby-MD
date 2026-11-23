import { getFamily, saveFamily } from '../../lib/family.js'
import databaseApi from '../../lib/database.js'
import { formatCurrency } from '../../lib/economy.js'

let handler = async (m, { text, usedPrefix }) => {
  const userFam = getFamily(m.sender)
  if (!userFam || !userFam.family.partner) {
    return m.reply('❌ Kamu belum menikah, tidak bisa mengajukan perceraian!')
  }

  const partnerNum = userFam.family.partner
  const partnerFam = getFamily(partnerNum)

  const fee = 10000
  const user = userFam.user

  if (text?.toLowerCase() !== 'yakin') {
    return m.reply([
      '╭─── ୨୧ KONFIRMASI PERCERAIAN ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა peringatan gugatan cerai!',
      '╰──────────────────────────────────╯',
      '',
      `Apakah kamu yakin ingin bercerai dari pasanganmu @${partnerNum}?`,
      `Biaya administrasi pengadilan agama: *${formatCurrency(fee)}*`,
      '',
      `Ketik: *${usedPrefix}cerai yakin* untuk mengonfirmasi perceraian.`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'), {
      mentions: [`${partnerNum}@s.whatsapp.net`]
    })
  }

  if (user.balance < fee) {
    return m.reply(`❌ Uang kamu tidak cukup untuk membayar biaya perceraian sebesar *${formatCurrency(fee)}*!`)
  }

  databaseApi.updateUser(userFam.num, { balance: user.balance - fee })

  userFam.family.partner = null
  userFam.family.marriedAt = 0
  userFam.family.harmony = 0
  userFam.family.children = []

  if (partnerFam) {
    partnerFam.family.partner = null
    partnerFam.family.marriedAt = 0
    partnerFam.family.harmony = 0
    partnerFam.family.children = []
    saveFamily(partnerFam)
  }

  saveFamily(userFam)

  const textMsg = [
    '╭─── ୨୧ AKTA PERCERAIAN RESMI ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა perpisahan rumah tangga!',
    '╰──────────────────────────────────╯',
    '',
    `💔 Perceraian antara @${userFam.num} dan @${partnerNum} telah resmi diputuskan.`,
    `Biaya pengadilan sebesar *${formatCurrency(fee)}* telah dipotong.`,
    '',
    'Semoga kalian menemukan kebahagiaan di jalan masing-masing.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [`${userFam.num}@s.whatsapp.net`, `${partnerNum}@s.whatsapp.net`]
  })
}

handler.help = ['cerai']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['cerai', 'divorce']

export default handler
