import { getFamily, saveFamily } from '../../lib/family.js'
import databaseApi from '../../lib/database.js'
import { formatCurrency, formatDuration } from '../../lib/economy.js'

const PLACES = [
  { name: 'Pantai Sunset', cost: 1000, harmony: 20, bonus: 3000, exp: 200, desc: 'menikmati deburan ombak dan pemandangan matahari terbenam yang syahdu' },
  { name: 'Restoran Bintang Lima', cost: 2500, harmony: 25, bonus: 5000, exp: 350, desc: 'makan malam romantis dengan lilin temaram dan iringan biola merdu' },
  { name: 'Taman Sakura', cost: 500, harmony: 15, bonus: 2000, exp: 150, desc: 'berjalan santai bergandengan tangan di bawah rintikan bunga sakura yang berguguran' },
  { name: 'Bioskop Premier', cost: 1500, harmony: 20, bonus: 3500, exp: 250, desc: 'menonton film romantis bersama sambil berbagi popcorn hangat' },
  { name: 'Puncak Gunung Berkabut', cost: 2000, harmony: 25, bonus: 4500, exp: 300, desc: 'menyeruput coklat hangat bersama di tengah dinginnya udara malam pegunungan' }
]

let handler = async (m, { usedPrefix }) => {
  const userFam = getFamily(m.sender)
  if (!userFam || !userFam.family.partner) {
    return m.reply(`❌ Fitur kencan hanya untuk pasangan yang sudah menikah! Ketik *${usedPrefix}keluarga*.`)
  }

  const partnerNum = userFam.family.partner
  const partnerFam = getFamily(partnerNum)
  if (!partnerFam) return m.reply('❌ Data pasangan tidak ditemukan.')

  const now = Date.now()
  const cooldown = 30 * 60 * 1000 // 30 menit
  const lastDating = userFam.family.lastDating || 0

  if (now - lastDating < cooldown) {
    const sisa = cooldown - (now - lastDating)
    return m.reply(`⏳ Kalian baru saja kencan! Tunggu *${formatDuration(sisa)}* lagi sebelum mengajak kencan berikutnya.`)
  }

  const place = PLACES[Math.floor(Math.random() * PLACES.length)]
  const user = userFam.user

  if (user.balance < place.cost) {
    return m.reply(`❌ Uangmu tidak cukup untuk biaya kencan ke *${place.name}* (${formatCurrency(place.cost)}). Bekerja dulu dengan *${usedPrefix}work*!`)
  }

  databaseApi.updateUser(userFam.num, { balance: user.balance - place.cost })
  databaseApi.addBalance(userFam.num, place.bonus)
  databaseApi.addBalance(partnerNum, place.bonus)
  databaseApi.addExp(userFam.num, place.exp)
  databaseApi.addExp(partnerNum, place.exp)

  userFam.family.harmony = Math.min(100, (userFam.family.harmony || 0) + place.harmony)
  partnerFam.family.harmony = userFam.family.harmony
  userFam.family.lastDating = now
  partnerFam.family.lastDating = now

  saveFamily(userFam)
  saveFamily(partnerFam)

  const text = [
    '╭─── ୨୧ KENCAN ROMANTIS ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა kencan berdua!',
    '╰─────────────────────────────╯',
    '',
    `Kamu mengajak pasanganmu @${partnerNum} berkencan ke *${place.name}*!`,
    `Momen indah: Kalian ${place.desc}.`,
    '',
    `🎁 Hasil Kencan:`,
    `• Keharmonisan : +${place.harmony}%`,
    `• Hadiah Kasih : ${formatCurrency(place.bonus)} masing-masing`,
    `• Bonus EXP    : +${place.exp} EXP`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(text, {
    mentions: [`${partnerNum}@s.whatsapp.net`]
  })
}

handler.help = ['kencan', 'dating']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['kencan', 'dating']

export default handler
