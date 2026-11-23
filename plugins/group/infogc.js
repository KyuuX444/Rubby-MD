import { normalizeNumber, resolveLidToPn } from '../../lib/utils.js'

let handler = async (m, { conn, sock }) => {
  const client = conn || sock
  const meta = await client.groupMetadata(m.chat)
  if (!meta) return m.reply('❌ Gagal memuat informasi grup.')

  const participants = meta.participants || []
  const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin')
  const ownerJid = meta.owner || (participants.find(p => p.admin === 'superadmin')?.id) || ''
  const cleanOwner = resolveLidToPn(ownerJid)
  const ownerNum = normalizeNumber(cleanOwner) || '-'

  const creationDate = meta.creation ? new Date(meta.creation * 1000).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '-'

  const editSetting = meta.restrict ? 'Hanya Admin' : 'Semua Peserta'
  const sendSetting = meta.announce ? 'Hanya Admin' : 'Semua Peserta'

  const mentions = [cleanOwner, ...admins.map(a => resolveLidToPn(a.id))].filter(Boolean)

  const text = [
    '╭─── ୨୧ INFORMASI GRUP ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა detail group!',
    '╰────────────────────────────╯',
    '',
    `• Nama Grup    : *${meta.subject || '-'}*`,
    `• ID Grup      : \`${meta.id}\``,
    `• Pembuat      : ${ownerNum !== '-' ? '@' + ownerNum : '-'}`,
    `• Tanggal Buat : ${creationDate}`,
    `• Total Member : *${participants.length}* member`,
    `• Total Admin  : *${admins.length}* admin`,
    `• Edit Info    : *${editSetting}*`,
    `• Kirim Pesan  : *${sendSetting}*`,
    '',
    '╭─── ୨୧ DESKRIPSI GRUP ୨୧ ───╮',
    meta.desc ? meta.desc.toString() : '_(Tidak ada deskripsi)_',
    '╰────────────────────────────╯',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(text, { mentions })
}

handler.help = ['infogc']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['infogc', 'infogrup', 'groupinfo']
handler.group = true

export default handler
