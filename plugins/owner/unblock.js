import { normalizeNumber, normalizeJid, resolveLidToPn } from '../../lib/utils.js'

let handler = async (m, { conn, sock, text, usedPrefix, command }) => {
  const client = conn || sock
  let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : text)
  if (!target) {
    return m.reply([
      '╭─── ୨୧ BUKA BLOKIR ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა manajemen owner bot!',
      '╰──────────────────────────╯',
      '',
      `• Penggunaan: Tag, reply pesan, atau masukkan nomor target.`,
      `• Contoh: *${usedPrefix + command} @user* atau *${usedPrefix + command} 628xxx*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  target = resolveLidToPn(target)
  const cleanJid = normalizeJid(target)
  const targetNum = normalizeNumber(target)

  if (!cleanJid) return m.reply('❌ Nomor tidak valid.')

  try {
    await client.updateBlockStatus(cleanJid, 'unblock')
    return m.reply([
      '╭─── ୨୧ BUKA BLOKIR ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა status pemblokiran!',
      '╰──────────────────────────╯',
      '',
      `✅ Berhasil membuka blokir *@${targetNum}*.`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'), { mentions: [cleanJid] })
  } catch (e) {
    return m.reply(`❌ Gagal membuka blokir: ${e.message || e}`)
  }
}

handler.help = ['unblock @user/nomor']
handler.tags = ['owner']
handler.category = 'owner'
handler.command = ['unblock', 'bukablokir']
handler.owner = true

export default handler
