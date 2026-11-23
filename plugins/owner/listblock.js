import { normalizeNumber, resolveLidToPn } from '../../lib/utils.js'

let handler = async (m, { conn, sock }) => {
  const client = conn || sock
  try {
    const blocklist = await client.fetchBlocklist()
    if (!blocklist || !blocklist.length) {
      return m.reply('✅ Tidak ada nomor yang diblokir oleh bot.')
    }

    const mentions = []
    const lines = [
      '╭─── ୨୧ DAFTAR NOMOR DIBLOKIR ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა blocked users list!',
      '╰──────────────────────────────────╯',
      '',
      `Total: *${blocklist.length}* pengguna diblokir`,
      ''
    ]

    let i = 1
    for (const jid of blocklist) {
      const realJid = resolveLidToPn(jid)
      const num = normalizeNumber(realJid)
      mentions.push(realJid)
      lines.push(`${i++}. @${num}`)
    }

    lines.push('')
    lines.push('──────── ୨୧ ────────')
    lines.push(`© ${global.botName || 'Rubby Multi Device'} • Kyuu`)

    return await m.reply(lines.join('\n'), { mentions })
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar blokir: ${e.message || e}`)
  }
}

handler.help = ['listblock']
handler.tags = ['owner']
handler.category = 'owner'
handler.command = ['listblock', 'blocklist', 'daftarblock']
handler.owner = true

export default handler
