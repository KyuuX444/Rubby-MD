import { getFamily, saveFamily } from '../../lib/family.js'
import databaseApi from '../../lib/database.js'
import { formatCurrency } from '../../lib/economy.js'

let handler = async (m) => {
  const userFam = getFamily(m.sender)
  if (!userFam) return m.reply('❌ Akun kamu belum terdaftar. Ketik *.daftar <nama>* terlebih dahulu!')

  const suitorNum = userFam.family.proposalFrom
  if (!suitorNum) {
    return m.reply('❌ Tidak ada lamaran pernikahan yang sedang menunggu persetujuanmu.')
  }

  const suitorFam = getFamily(suitorNum)
  if (!suitorFam) {
    userFam.family.proposalFrom = null
    saveFamily(userFam)
    return m.reply('❌ Pelamar tidak ditemukan atau sudah tidak aktif.')
  }

  // Terima lamaran & resmikan pernikahan
  const now = Date.now()
  userFam.family.partner = suitorNum
  userFam.family.marriedAt = now
  userFam.family.harmony = 100
  userFam.family.proposalFrom = null

  suitorFam.family.partner = userFam.num
  suitorFam.family.marriedAt = now
  suitorFam.family.harmony = 100
  suitorFam.family.proposalFrom = null

  saveFamily(userFam)
  saveFamily(suitorFam)

  // Bonus pernikahan
  const bonus = 10000
  databaseApi.addBalance(userFam.num, bonus)
  databaseApi.addBalance(suitorNum, bonus)
  databaseApi.addExp(userFam.num, 500)
  databaseApi.addExp(suitorNum, 500)

  const textMsg = [
    '╭─── ୨୧ PERNIKAHAN RESMI ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა selamat menempuh hidup baru!',
    '╰──────────────────────────────╯',
    '',
    `🎉 Selamat kepada mempelai baru:`,
    `🤵 Suami / Istri 1 : @${suitorNum}`,
    `👰 Suami / Istri 2 : @${userFam.num}`,
    '',
    `🎁 Hadiah Pernikahan:`,
    `• Uang Tunai : ${formatCurrency(bonus)} masing-masing`,
    `• Bonus EXP  : +500 EXP`,
    `• Keharmonisan Awal : 100%`,
    '',
    '💡 Ketik *.keluarga* untuk melihat kartu keluarga kalian!',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [`${suitorNum}@s.whatsapp.net`, `${userFam.num}@s.whatsapp.net`]
  })
}

handler.help = ['terimalamar']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['terimalamar', 'terima']
handler.register = true

export default handler
