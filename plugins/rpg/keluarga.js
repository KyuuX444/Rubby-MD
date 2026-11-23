import { getFamily, formatFamilyDuration } from '../../lib/family.js'

let handler = async (m, { usedPrefix }) => {
  const userFam = getFamily(m.sender)
  if (!userFam) return m.reply(`❌ Akun kamu belum terdaftar. Ketik *${usedPrefix}daftar <nama>* terlebih dahulu!`)

  const partnerNum = userFam.family.partner
  if (!partnerNum) {
    return m.reply([
      '╭─── ୨୧ KARTU KELUARGA ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status keluarga!',
      '╰────────────────────────────╯',
      '',
      `• Status      : *Lajang / Belum Menikah*`,
      `• Tempat Huni : *${userFam.family.house || 'Gubuk Sederhana'}*`,
      '',
      `💡 Ingin menikah? Lamar pasanganmu dengan:`,
      `*${usedPrefix}lamar @user*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  const marriedDuration = Date.now() - (userFam.family.marriedAt || Date.now())
  const harmony = Math.min(100, Math.max(0, userFam.family.harmony || 0))
  const barFilled = Math.round(harmony / 10)
  const harmonyBar = '❤️ ' + '█'.repeat(barFilled) + '░'.repeat(10 - barFilled) + ` ${harmony}%`

  const children = userFam.family.children || []
  const mentions = [`${partnerNum}@s.whatsapp.net`, ...children.map(c => `${c}@s.whatsapp.net`)]

  const text = [
    '╭─── ୨୧ KARTU KELUARGA RESMI ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა keluarga bahagia!',
    '╰──────────────────────────────────╯',
    '',
    `• Pasangan Sah      : @${partnerNum}`,
    `• Usia Pernikahan   : *${formatFamilyDuration(marriedDuration)}*`,
    `• Keharmonisan      : ${harmonyBar}`,
    `• Tempat Tinggal    : *${userFam.family.house || 'Rumah Sederhana'}*`,
    `• Jumlah Anak       : *${children.length}* anak`,
    children.length ? `• Daftar Anak       : ${children.map(c => '@' + c).join(', ')}` : '',
    '',
    '╭─── ୨୧ FITUR RUMAH TANGGA ୨୧ ───╮',
    `• *${usedPrefix}nafkah <jumlah>* (Beri uang belanja pasangan)`,
    `• *${usedPrefix}kencan* (Pergi kencan romantis)`,
    `• *${usedPrefix}adopsi @user* (Angkat anak ke dalam keluarga)`,
    `• *${usedPrefix}cerai* (Gugat cerai jika tidak cocok)`,
    '╰─────────────────────────────────╯',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].filter(Boolean).join('\n')

  return await m.reply(text, { mentions })
}

handler.help = ['keluarga', 'kk']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['keluarga', 'kk', 'family', 'kartukeluarga']

export default handler
