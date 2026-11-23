import databaseApi from '../../lib/database.js'
import { getCleanNumber, formatCurrency } from '../../lib/economy.js'

const SYMBOLS = ['🍎', '🍇', '🍉', '🍋', '🍒', '💎', '7️⃣']

let handler = async (m, { args, usedPrefix, command }) => {
  const senderNumber = getCleanNumber(m.sender)
  const user = databaseApi.getUser(senderNumber)
  if (!user || user.registered !== 1) {
    return m.reply(`🌸 Kamu belum terdaftar! Ketik *${usedPrefix}daftar <nama>* untuk bermain slot.`)
  }

  const bet = parseInt(args[0], 10)
  if (isNaN(bet) || bet < 500) {
    return m.reply(`Masukkan jumlah taruhan slot (minimal 500 koin)!\n\nContoh:\n*${usedPrefix + command} 1000*`)
  }

  if (user.balance < bet) {
    return m.reply(`❌ Saldo kamu tidak cukup! Saldo kamu saat ini: *${formatCurrency(user.balance)}*.`)
  }

  // Generate 3x3 reel
  const reel = [
    [SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]],
    [SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]],
    [SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]]
  ]

  const line = reel[1] // Garis pemenang tengah
  let winMultiplier = 0
  let isJackpot = false

  if (line[0] === line[1] && line[1] === line[2]) {
    if (line[0] === '7️⃣') {
      winMultiplier = 10
      isJackpot = true
    } else if (line[0] === '💎') {
      winMultiplier = 7
      isJackpot = true
    } else {
      winMultiplier = 4
    }
  } else if (line[0] === line[1] || line[1] === line[2] || line[0] === line[2]) {
    winMultiplier = 1.5
  }

  let resultMsg = ''
  if (winMultiplier > 0) {
    const prize = Math.floor(bet * winMultiplier)
    const netWin = prize - bet
    databaseApi.addBalance(senderNumber, netWin)
    databaseApi.addExp(senderNumber, Math.floor(prize / 10))

    resultMsg = isJackpot
      ? `🎉 *SUPER JACKPOT!!* Kamu menang *${formatCurrency(prize)}* (x${winMultiplier})!`
      : `✨ *SELAMAT!* Kamu menang *${formatCurrency(prize)}* (x${winMultiplier})!`
  } else {
    databaseApi.updateUser(senderNumber, { balance: user.balance - bet })
    resultMsg = `💔 *KALAH!* Kamu kehilangan taruhan *${formatCurrency(bet)}*.`
  }

  const slotDisplay = [
    '╭─── ୨୧ MESIN SLOT CASINO ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა spin & jackpot!',
    '╰───────────────────────────────╯',
    '',
    `  [ ${reel[0][0]} | ${reel[0][1]} | ${reel[0][2]} ]`,
    `► [ ${reel[1][0]} | ${reel[1][1]} | ${reel[1][2]} ] ◄  <-- Pemenang`,
    `  [ ${reel[2][0]} | ${reel[2][1]} | ${reel[2][2]} ]`,
    '',
    resultMsg,
    `• Sisa Saldo: *${formatCurrency(databaseApi.getUser(senderNumber).balance)}*`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(slotDisplay)
}

handler.help = ['slot <taruhan>']
handler.tags = ['fun', 'rpg']
handler.category = 'fun'
handler.command = ['slot', 'jackpot', 'slots']

export default handler
