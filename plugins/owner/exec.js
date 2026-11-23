import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execPromise = promisify(exec)

let handler = async (m, { text }) => {
  if (!text) {
    return m.reply([
      '╭─── ୨୧ TERMINAL EXEC ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა shell command console!',
      '╰───────────────────────────╯',
      '',
      '• Masukkan perintah shell yang ingin dijalankan.',
      '• Contoh: *.exec ls -lh* atau *.sh free -m*',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  await m.reply('⏳ Menjalankan perintah...')

  try {
    const { stdout, stderr } = await execPromise(text, { timeout: 30000 })
    let output = (stdout || stderr || '').trim()
    if (!output) output = '(Perintah berhasil dijalankan tanpa output)'

    if (output.length > 3000) {
      output = output.slice(0, 3000) + '\n...(output terpotong)'
    }

    const textMsg = [
      '╭─── ୨୧ TERMINAL EXEC ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა output hasil perintah!',
      '╰───────────────────────────╯',
      '',
      '```' + output + '```',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    return m.reply(textMsg)
  } catch (err) {
    const errOutput = (err.stderr || err.stdout || err.message || String(err)).trim()
    return m.reply([
      '╭─── ୨୧ TERMINAL EXEC ERROR ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა eksekusi perintah gagal!',
      '╰─────────────────────────────────╯',
      '',
      '```' + errOutput + '```',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }
}

handler.help = ['exec <command>', 'terminal <command>']
handler.tags = ['owner']
handler.category = 'owner'
handler.command = ['exec', 'terminal', 'sh', 'shell']
handler.owner = true

export default handler
