import databaseApi from '../../lib/database.js'
import { getCleanNumber } from '../../lib/economy.js'

const WORD_BANK = [
  { word: 'KOMPUTER', clue: 'Alat elektronik pengolah data' },
  { word: 'SEKOLAH', clue: 'Tempat menuntut ilmu' },
  { word: 'MATAHARI', clue: 'Pusat tata surya' },
  { word: 'PANCASILA', clue: 'Dasar negara Indonesia' },
  { word: 'INDONESIA', clue: 'Negara kepulauan terbesar' },
  { word: 'WHATSAPP', clue: 'Aplikasi perpesanan populer' },
  { word: 'PROGRAMMER', clue: 'Pembuat kode software' },
  { word: 'HANDPHONE', clue: 'Gawai telepon genggam' },
  { word: 'PERPUSTAKAAN', clue: 'Gudang buku bacaan' },
  { word: 'BINTANG', clue: 'Benda langit yang bercahaya' },
  { word: 'PESAWAT', clue: 'Kendaraan transportasi udara' }
]

global.susunKataSessions = global.susunKataSessions || new Map()

let handler = async (m, { text, usedPrefix, command }) => {
  const chatId = m.chat
  const currentSession = global.susunKataSessions.get(chatId)

  if (text && currentSession) {
    const answer = text.toUpperCase().trim()
    if (answer === currentSession.word) {
      const senderNum = getCleanNumber(m.sender)
      databaseApi.addBalance(senderNum, 2500)
      databaseApi.addExp(senderNum, 100)
      clearTimeout(currentSession.timer)
      global.susunKataSessions.delete(chatId)

      return m.reply(`🎉 *BENAR!* Jawaban yang tepat adalah *${currentSession.word}*!\nKamu mendapatkan hadiah *Rp 2.500* dan *+100 EXP*.`)
    } else {
      return m.reply('❌ Jawabanmu salah, ayo coba susun lagi!')
    }
  }

  if (currentSession) {
    return m.reply(`Masih ada sesi tebak susun kata yang belum selesai!\nKata acak: *${currentSession.scrambled}*\nPetunjuk: *${currentSession.clue}*`)
  }

  const selected = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
  const scrambled = selected.word.split('').sort(() => 0.5 - Math.random()).join('')

  const timer = setTimeout(() => {
    if (global.susunKataSessions.has(chatId)) {
      global.susunKataSessions.delete(chatId)
      m.reply(`⏰ *WAKTU HABIS!* Kata yang benar adalah: *${selected.word}*.`)
    }
  }, 60000)

  global.susunKataSessions.set(chatId, {
    word: selected.word,
    scrambled,
    clue: selected.clue,
    timer
  })

  const textMsg = [
    '╭─── ୨୧ GAME SUSUN KATA ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა asah otak seru!',
    '╰─────────────────────────────╯',
    '',
    `🔤 Susun huruf acak berikut:`,
    `👉 *${scrambled}*`,
    '',
    `💡 Petunjuk : *${selected.clue}*`,
    `⏳ Waktu    : 60 detik`,
    `🎁 Hadiah   : Rp 2.500 + 100 EXP`,
    '',
    `Ketik langsung jawabannya di chat!`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg)
}

handler.help = ['susunkata']
handler.tags = ['fun']
handler.category = 'fun'
handler.command = ['susunkata']

export default handler
