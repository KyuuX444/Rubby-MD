import { getFamily, saveFamily } from '../../lib/family.js'

let handler = async (m) => {
  const userFam = getFamily(m.sender)
  if (!userFam) return m.reply('❌ Akun kamu belum terdaftar. Ketik *.daftar <nama>* terlebih dahulu!')

  const suitorNum = userFam.family.proposalFrom
  if (!suitorNum) {
    return m.reply('❌ Tidak ada lamaran pernikahan yang sedang menunggu persetujuanmu.')
  }

  userFam.family.proposalFrom = null
  saveFamily(userFam)

  const textMsg = [
    '╭─── ୨୧ TOLAK LAMARAN ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა keputusan hati...',
    '╰───────────────────────────╯',
    '',
    `💔 @${userFam.num} telah menolak lamaran pernikahan dari @${suitorNum}.`,
    'Jangan patah semangat, jodoh terbaik masih menantimu di masa depan!',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [`${suitorNum}@s.whatsapp.net`, `${userFam.num}@s.whatsapp.net`]
  })
}

handler.help = ['tolaklamar']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['tolaklamar', 'tolak']
handler.register = true

export default handler
