let handler = async (m) => {
  const textMsg = [
    '╭─── ୨୧ SUSUNAN BACAAN TAHLIL ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა dzikir & doa tahlil lengkap!',
    '╰──────────────────────────────────╯',
    '',
    '1. *Pengantar Al-Fatihah*',
    'إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ...',
    '',
    '2. *Surat Al-Ikhlas (3x)*',
    'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    '',
    '3. *Surat Al-Falaq & An-Nas (1x)*',
    '',
    '4. *Kalimat Thayyibah (33x)*',
    'لَا إِلَهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
    '_Laa ilaaha illallaahu Muhammadur Rasuulullaah._',
    '',
    '5. *Doa Arwah Singkat*',
    'اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ',
    '_Allahummaghfir lahum warhamhum wa \'aafihim wa\'fu \'anhum._',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg)
}

handler.help = ['tahlil']
handler.tags = ['islamic']
handler.category = 'islamic'
handler.command = ['tahlil', 'doatahlil']
handler.register = true

export default handler
