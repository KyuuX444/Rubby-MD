import { getFamily, saveFamily } from '../../lib/family.js'
import databaseApi from '../../lib/database.js'
import { formatCurrency } from '../../lib/economy.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const userFam = getFamily(m.sender)
  if (!userFam || !userFam.family.partner) {
    return m.reply(`❌ Fitur ini hanya untuk pengguna yang sudah menikah! Ketik *${usedPrefix}keluarga*.`)
  }

  const amount = parseInt(args[0], 10)
  if (isNaN(amount) || amount <= 0) {
    return m.reply(`Masukkan jumlah uang nafkah yang ingin diberikan!\n\nContoh:\n*${usedPrefix + command} 5000*`)
  }

  const user = userFam.user
  if (user.balance < amount) {
    return m.reply(`❌ Uang kamu tidak cukup! Saldo kamu saat ini: *${formatCurrency(user.balance)}*.`)
  }

  const partnerNum = userFam.family.partner
  const partnerFam = getFamily(partnerNum)
  if (!partnerFam) return m.reply('❌ Data pasangan tidak ditemukan.')

  // Potong saldo & kirim ke pasangan
  databaseApi.updateUser(userFam.num, { balance: user.balance - amount })
  databaseApi.addBalance(partnerNum, amount)
  databaseApi.addExp(userFam.num, 150)
  databaseApi.addExp(partnerNum, 150)

  // Tambah keharmonisan
  userFam.family.harmony = Math.min(100, (userFam.family.harmony || 0) + 15)
  partnerFam.family.harmony = userFam.family.harmony
  userFam.family.lastNafkah = Date.now()

  saveFamily(userFam)
  saveFamily(partnerFam)

  const text = [
    '╭─── ୨୧ NAFKAH KELUARGA ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა tanggung jawab suami/istri!',
    '╰──────────────────────────────╯',
    '',
    `❤️ Berhasil memberikan nafkah sebesar *${formatCurrency(amount)}* kepada pasanganmu @${partnerNum}!`,
    '',
    '• Keharmonisan Keluarga : +15%',
    '• Bonus EXP Rumah Tangga: +150 EXP masing-masing',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(text, {
    mentions: [`${partnerNum}@s.whatsapp.net`]
  })
}

handler.help = ['nafkah <jumlah>']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['nafkah', 'berinafkah']

export default handler
