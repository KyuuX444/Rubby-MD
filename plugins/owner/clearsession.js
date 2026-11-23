import fs from 'node:fs'
import path from 'node:path'

let handler = async (m) => {
  const sessionDir = path.resolve('session')
  if (!fs.existsSync(sessionDir)) {
    return m.reply('Folder session tidak ditemukan.')
  }

  await m.reply('⏳ Memindai dan membersihkan session sampah...')

  let deletedCount = 0
  let freedBytes = 0

  try {
    const files = fs.readdirSync(sessionDir)
    for (const f of files) {
      // Strictly protect creds.json and vital session state
      if (f === 'creds.json' || f === 'app-state-sync-key.json') continue

      if (f.startsWith('pre-key-') || f.startsWith('session-') || f.endsWith('.tmp')) {
        const filePath = path.join(sessionDir, f)
        try {
          const stat = fs.statSync(filePath)
          freedBytes += stat.size
          fs.unlinkSync(filePath)
          deletedCount++
        } catch {}
      }
    }

    const freedMB = (freedBytes / (1024 * 1024)).toFixed(2)

    return m.reply([
      '╭─── ୨୧ BERSIHKAN SESSION ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა session cleaner!',
      '╰───────────────────────────────╯',
      '',
      `• File Sampah Dihapus : *${deletedCount}* file`,
      `• Ruang Dibebaskan     : *${freedMB}* MB`,
      `• File Utama           : *creds.json* (Aman ✓)`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  } catch (e) {
    return m.reply(`❌ Gagal membersihkan session: ${e.message || e}`)
  }
}

handler.help = ['clearsession']
handler.tags = ['owner']
handler.category = 'owner'
handler.command = ['clearsession', 'clearsesi', 'delsession']
handler.owner = true

export default handler
