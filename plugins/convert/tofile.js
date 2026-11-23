import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const MIME_MAP = {
  js: 'application/javascript',
  json: 'application/json',
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  md: 'text/markdown',
  py: 'text/x-python',
  sh: 'application/x-sh'
}

let handler = async (m, { conn, sock, args, text, usedPrefix, command }) => {
  const client = conn || sock
  if (!args[0]) {
    return m.reply([
      '╭─── ୨୧ SIMPAN KE DOKUMEN ୨୧ ───╮',
      '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა konversi teks ke file!',
      '╰──────────────────────────────╯',
      '',
      `• Balas pesan teks/kode dengan: *${usedPrefix + command} <namafile.ext>*`,
      `• Contoh: *${usedPrefix + command} script.js*`,
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n'))
  }

  const fileName = args[0].trim()
  const ext = fileName.split('.').pop()?.toLowerCase() || 'txt'
  const messageText = (m.quoted && m.quoted.text) ? m.quoted.text : text.replace(fileName, '').trim()

  if (!messageText) {
    return m.reply('❌ Tidak ada teks yang dapat disimpan ke file.')
  }

  const filePath = path.join(os.tmpdir(), `file_${Date.now()}_${fileName}`)

  try {
    fs.writeFileSync(filePath, messageText, 'utf-8')
    const fileBuffer = fs.readFileSync(filePath)

    const captionMsg = [
      '╭─── ୨୧ FILE GENERATED ୨୧ ───╮',
      `📄 Nama: *${fileName}*`,
      `📦 Ukuran: *${(fileBuffer.length / 1024).toFixed(2)} KB*`,
      '╰───────────────────────────╯',
      '',
      '──────── ୨୧ ────────',
      `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
    ].join('\n')

    await client.sendMessage(m.chat, {
      document: fileBuffer,
      fileName,
      mimetype: MIME_MAP[ext] || 'application/octet-stream',
      caption: captionMsg
    }, { quoted: m.raw })
  } catch (e) {
    return m.reply(`❌ Gagal membuat file: ${e.message || e}`)
  } finally {
    if (fs.existsSync(filePath)) try { fs.unlinkSync(filePath) } catch {}
  }
}

handler.help = ['tofile <namafile.ext>']
handler.tags = ['convert']
handler.category = 'convert'
handler.command = ['tofile', 'tf']
handler.limit = true
handler.register = true

export default handler
