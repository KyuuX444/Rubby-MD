import databaseApi from '../../lib/database.js'

let handler = async (m, { usedPrefix }) => {
  const g = databaseApi.getGroup(m.chat)

  const formatStatus = (val) => Boolean(val) ? '🟢 AKTIF' : '🔴 NONAKTIF'

  const lines = [
    '╭─── ୨୧ STATUS KEAMANAN GRUP ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა kontrol sistem keamanan grup!',
    '╰──────────────────────────────────╯',
    '',
    `• Anti Link WA    : ${formatStatus(g.antilinkwa || g.antilink)}`,
    `• Anti Link All   : ${formatStatus(g.antilinkall)}`,
    `• Anti Virtex     : ${formatStatus(g.antivirtex)}`,
    `• Anti Delete     : ${formatStatus(g.antidelete)}`,
    `• Anti ViewOnce   : ${formatStatus(g.antiviewonce)}`,
    `• Anti Bot Asing  : ${formatStatus(g.antibot)}`,
    `• Anti Toxic Chat : ${formatStatus(g.antitoxic)}`,
    `• Anti Spam Flood : ${formatStatus(g.antispam)}`,
    `• Anti Stiker     : ${formatStatus(g.antisticker)}`,
    `• Anti NSFW 18+   : ${formatStatus(g.antinsfw)}`,
    '',
    '💡 *Cara Mengubah Status:*',
    `Ketik *${usedPrefix}<fitur> on* atau *${usedPrefix}<fitur> off*`,
    `Contoh: *${usedPrefix}antilink on* atau *${usedPrefix}antiviewonce on*`,
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ]

  return await m.reply(lines.join('\n'))
}

handler.help = ['antisettings']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['antisettings', 'listanti', 'cekanti']
handler.group = true

export default handler
