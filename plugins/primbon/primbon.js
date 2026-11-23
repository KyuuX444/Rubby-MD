import { formatPrimbonResponse } from '../../scrape/primbon.js'

let handler = async (m, { usedPrefix }) => {
  const p = usedPrefix || '.'
  const menuText = [
    '୨ৎ *NAMA & MIMPI*',
    `• ${p}artinama <nama>`,
    `• ${p}tafsirmimpi <kata kunci>`,
    '',
    '୨ৎ *JODOH & ASMARA*',
    `• ${p}jodoh <nama1> <tgl1> <nama2> <tgl2>`,
    `• ${p}cocoknama <nama> <tgl>`,
    `• ${p}cocokpasangan <nama1> <nama2>`,
    `• ${p}cinta <nama1> <tgl1> <nama2> <tgl2>`,
    `• ${p}suamiistri <nama1> <tgl1> <nama2> <tgl2>`,
    `• ${p}pernikahan <tanggal>`,
    '',
    '୨ৎ *WETON & REJEKI*',
    `• ${p}weton <tanggal>`,
    `• ${p}rejeki <tanggal>`,
    `• ${p}arahrejeki <tanggal>`,
    `• ${p}usaha <tanggal>`,
    `• ${p}pekerjaan <tanggal>`,
    `• ${p}potensi <nama> <tanggal>`,
    `• ${p}peruntungan <nama> <tgl> [tahun]`,
    '',
    '୨ৎ *RAMALAN LAINNYA*',
    `• ${p}nasib <tanggal>`,
    `• ${p}penyakit <tanggal>`,
    `• ${p}karakter <nama> <tanggal>`,
    `• ${p}horoskop <nama> <tanggal>`,
    `• ${p}shio <tahun/tanggal>`,
    '',
    '୨ৎ *HARI & KEBERUNTUNGAN*',
    `• ${p}haribaik <tanggal>`,
    `• ${p}harinaas <tanggal>`,
    `• ${p}harisangar <tanggal>`,
    `• ${p}nagahari <tanggal>`,
    `• ${p}mancing <tanggal>`,
    `• ${p}nomorhoki <nomor>`,
    '',
    '──────── ୨୧ ────────',
    '୨ৎ *Format Tanggal:* DD-MM-YYYY atau YYYY-MM-DD',
    '୨ৎ *Nama Berspasi:* Gunakan tanda kutip, contoh:',
    `   ${p}artinama "Budi Santoso"`
  ].join('\n')

  return m.reply(formatPrimbonResponse('Primbon Online', menuText))
}

handler.help = ['primbon']
handler.tags = ['primbon']
handler.category = 'primbon'
handler.command = ['primbon']
handler.register = true

export default handler
