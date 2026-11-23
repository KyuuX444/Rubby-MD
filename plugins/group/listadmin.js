import { normalizeNumber, resolveLidToPn } from '../../lib/utils.js'

let handler = async (m, { conn, sock }) => {
  const client = conn || sock
  const meta = await client.groupMetadata(m.chat)
  if (!meta) return m.reply('❌ Gagal mengambil data grup.')

  const participants = meta.participants || []
  const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin')

  if (!admins.length) return m.reply('Tidak ada admin yang ditemukan.')

  const mentions = []
  let text = [
    '╭─── ୨୧ DAFTAR ADMIN GRUP ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა group administrators!',
    '╰───────────────────────────────╯',
    '',
    `Grup: *${meta.subject || '-' }*`,
    `Total Admin: *${admins.length}* admin`,
    ''
  ]

  let i = 1
  for (const a of admins) {
    const pnJid = resolveLidToPn(a.id)
    const num = normalizeNumber(pnJid)
    mentions.push(pnJid)
    const role = a.admin === 'superadmin' ? '👑 Owner Grup' : '⭐ Admin'
    text.push(`${i++}. @${num} - *${role}*`)
  }

  text.push('')
  text.push('──────── ୨୧ ────────')
  text.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

  return await m.reply(text.join('\n'), { mentions })
}

handler.help = ['listadmin']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['listadmin', 'adminlist', 'admins']
handler.group = true

export default handler
