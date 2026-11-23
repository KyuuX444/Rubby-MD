import { normalizeNumber, resolveLidToPn } from '../../lib/utils.js'

let handler = async (m, { conn, sock }) => {
  const client = conn || sock
  if (!m.isGroup) return m.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!')

  const meta = await client.groupMetadata(m.chat)
  const participants = meta?.participants || []
  if (participants.length < 3) return m.reply('Jumlah member grup terlalu sedikit.')

  const shuffled = [...participants].sort(() => 0.5 - Math.random()).slice(0, 5)
  const mentions = []

  const lines = [
    '╭─── ୨୧ TOP PALING BUCIN ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა ranking member terbucin!',
    '╰──────────────────────────────╯',
    '',
    `Grup: *${meta.subject || '-'}*`,
    ''
  ]

  const medals = ['🥇', '🥈', '🥉', '✨', '⭐']
  shuffled.forEach((p, idx) => {
    const realJid = resolveLidToPn(p.id)
    const num = normalizeNumber(realJid)
    mentions.push(realJid)
    const score = 100 - (idx * 6) - Math.floor(Math.random() * 5)
    lines.push(`${medals[idx]} Top ${idx + 1}: @${num} (Kebucinan: ${score}%)`)
  })

  lines.push('')
  lines.push('──────── ୨୧ ────────')
  lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

  return await m.reply(lines.join('\n'), { mentions })
}

handler.help = ['topbucin']
handler.tags = ['fun']
handler.category = 'fun'
handler.command = ['topbucin']
handler.group = true

export default handler
