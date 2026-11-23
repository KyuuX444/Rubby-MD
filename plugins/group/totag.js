import { normalizeNumber, resolveLidToPn } from '../../lib/utils.js'

let handler = async (m, { conn, sock, text }) => {
  const client = conn || sock
  const meta = await client.groupMetadata(m.chat)
  if (!meta) return m.reply('❌ Gagal mengambil data member grup.')

  const participants = meta.participants || []
  const mentions = participants.map(p => resolveLidToPn(p.id)).filter(Boolean)

  const quotedMsg = m.quoted ? m.quoted : null
  const content = text || (quotedMsg?.text ? quotedMsg.text : '📢 *PENGUMUMAN GRUP*')

  if (quotedMsg) {
    return await client.sendMessage(
      m.chat,
      { text: content, mentions },
      { quoted: m.quoted.raw || m.raw }
    )
  }

  return await client.sendMessage(
    m.chat,
    { text: content, mentions },
    { quoted: m.raw }
  )
}

handler.help = ['totag <pesan>']
handler.tags = ['group']
handler.category = 'group'
handler.command = ['totag', 'tagulang']
handler.group = true
handler.admin = true

export default handler
