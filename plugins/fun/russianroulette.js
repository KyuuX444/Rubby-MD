import databaseApi from '../../lib/database.js'
import { getCleanNumber, formatCurrency } from '../../lib/economy.js'

let handler = async (m, { args, usedPrefix, command }) => {
  const senderNumber = getCleanNumber(m.sender)
  const user = databaseApi.getUser(senderNumber)
  if (!user || user.registered !== 1) {
    return m.reply(`🌸 Kamu belum terdaftar! Ketik *${usedPrefix}daftar <nama>* untuk bermain roulette.`)
  }

  const bet = parseInt(args[0], 10) || 1000
  if (user.balance < bet) {
    return m.reply(`❌ Uangmu tidak cukup untuk taruhan *${formatCurrency(bet)}*!`)
  }

  const chamber = Math.floor(Math.random() * 6) + 1
  const bulletPosition = Math.floor(Math.random() * 6) + 1

  if (chamber === bulletPosition) {
    const penalty = bet
    databaseApi.updateUser(senderNumber, {
      balance: Math.max(0, user.balance - penalty),
      health: Math.max(1, (user.health || 100) - 40)
    })

    const text = [
      '╭─── ୨୧ RUSSIAN ROULETTE ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა uji nyali ekstrim!',
      '╰──────────────────────────────╯',
      '',
      '*💥💥 DORRRRRRRRR!! 💥💥*',
      '',
      `Peluru aktif berada di ruang *${chamber}*!`,
      `Kamu tertembak dan kehilangan taruhan *${formatCurrency(penalty)}*!`,
      `Darah RPG berkurang -40 HP. Ketik *${usedPrefix}heal* untuk memulihkan diri!`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(text)
  } else {
    const reward = Math.floor(bet * 1.5)
    databaseApi.addBalance(senderNumber, reward - bet)
    databaseApi.addExp(senderNumber, 100)

    const text = [
      '╭─── ୨୧ RUSSIAN ROULETTE ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა uji nyali ekstrim!',
      '╰──────────────────────────────╯',
      '',
      '*... *KLIK* ... (KOSONG!)* 💨',
      '',
      `Pelatuk ditarik pada ruang *${chamber}* dan kosong!`,
      `Selamat, nyawamu selamat dan kamu mendapatkan hadiah *${formatCurrency(reward)}*!`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return await m.reply(text)
  }
}

handler.help = ['roulette <taruhan>']
handler.tags = ['fun']
handler.category = 'fun'
handler.command = ['roulette', 'tembak', 'russianroulette']

export default handler
