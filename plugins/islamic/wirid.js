let handler = async (m) => {
  const textMsg = [
    '╭─── ୨୧ WIRID SETELAH SHOLAT ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა dzikir ba\'da sholat fardhu!',
    '╰──────────────────────────────────╯',
    '',
    '1. *Istighfar (3x)*',
    'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    '',
    '2. *Tahlil Pendek*',
    'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    '',
    '3. *Tasbih, Tahmid, Takbir (masing-masing 33x)*',
    '• سُبْحَانَ اللَّهِ (33x)',
    '• الْحَمْدُ لِلَّهِ (33x)',
    '• اللَّهُ أَكْبَرُ (33x)',
    '',
    '4. *Ayat Kursi*',
    'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg)
}

handler.help = ['wirid']
handler.tags = ['islamic']
handler.category = 'islamic'
handler.command = ['wirid', 'dzikirsholat']
handler.register = true

export default handler
