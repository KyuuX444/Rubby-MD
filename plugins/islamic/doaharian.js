import axios from 'axios'

const DOA_LIST = [
  { nama: 'Doa Sebelum Tidur', arab: 'بِاسْمِكَ اللّهُمَّ أَحْيَا وَأَمُوتُ', latin: 'Bismika Allahumma ahyaa wa amuut.', arti: 'Dengan nama-Mu ya Allah, aku hidup dan aku mati.' },
  { nama: 'Doa Bangun Tidur', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdu lillahilladzi ahyaanaa ba\'da maa amaatanaa wa ilaihin nusyuur.', arti: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami dan kepada-Nya kami kembali.' },
  { nama: 'Doa Sebelum Makan', arab: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ', latin: 'Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa \'adzaaban naar.', arti: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.' },
  { nama: 'Doa Sesudah Makan', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', latin: 'Alhamdu lillahilladzi ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin.', arti: 'Segala puji bagi Allah yang telah memberi makan dan minum kepada kami serta menjadikan kami orang-orang muslim.' },
  { nama: 'Doa Keluar Rumah', arab: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', latin: 'Bismillahi tawakkaltu \'alallah, laa hawla wa laa quwwata illaa billaah.', arti: 'Dengan nama Allah, aku berserah diri kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.' },
  { nama: 'Doa Masuk Masjid', arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allahummaf-tah lii abwaaba rahmatik.', arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.' },
  { nama: 'Doa Kedua Orang Tua', arab: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', latin: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.', arti: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka keduanya sebagaimana mereka telah mendidik aku di waktu kecil.' }
]

let handler = async (m, { text, usedPrefix, command }) => {
  const query = text ? text.toLowerCase().trim() : ''
  let picked = DOA_LIST[0]

  if (query) {
    const found = DOA_LIST.find(d => d.nama.toLowerCase().includes(query))
    if (found) picked = found
  } else {
    picked = DOA_LIST[Math.floor(Math.random() * DOA_LIST.length)]
  }

  const textMsg = [
    `╭─── ୨୧ ${picked.nama.toUpperCase()} ୨୧ ───╮`,
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა doa harian & amalan sunnah!',
    '╰────────────────────────────────────╯',
    '',
    `📜 *Teks Arab:*`,
    picked.arab,
    '',
    `📖 *Latin:*`,
    `_${picked.latin}_`,
    '',
    `💡 *Arti:*`,
    `"${picked.arti}"`,
    '',
    `Ketik *${usedPrefix + command} <nama doa>* untuk mencari doa lain.`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg)
}

handler.help = ['doaharian [nama_doa]']
handler.tags = ['islamic']
handler.category = 'islamic'
handler.command = ['doaharian', 'doa']
handler.register = true

export default handler
