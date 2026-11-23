/**
╭━━━〔 ୨ৎ RUBBY MULTI DEVICE ୨ৎ 〕━━━╮
┇
┇       ✦ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗥𝗨𝗕𝗕𝗬 ✦
┇          ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა ♡
┇
┇      ░▒▓█ 𝗥 𝗨 𝗕 𝗕 𝗬 █▓▒░
┇          MULTI DEVICE SYSTEM
┇
┇  ──────── ୨୧ ────────
┇        ♡ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗜𝗡𝗙𝗢 ♡
┇  ──────── ୨୧ ────────
┇   ↳ Creator  : Kyuu
┇   ↳ GitHub   : github.com/KyuuX444
┇   ↳ YouTube  : MommyKyuu
┇   ↳ Website  : https://api.kyzzz.xyz
┇
┇  ════════ ◇ ════════
┇        📡 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟
┇  ════════ ◇ ════════
┇   ↳ Updates & Announcements
┇   ↳ https://whatsapp.com/channel/0029VbDXYlKDJ6H1D7Dm0f13
┇
┇  ┌─────── ⟡ ───────┐
┇          ⚙️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
┇  └─────── ⟡ ───────┘
┇   • Runtime  : Node.js
┇   • Engine   : Ruby-Baileys
┇   • Platform : Linux
┇   • Mode     : WhatsApp Multi Device
┇
┇  ──────── ♡ ────────
┇          🌷 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦
┇  ──────── ♡ ────────
┇   › Modular ESM Plugins
┇   › Pairing Code Authentication
┇   › Automatic Plugin Loader
┇   › Lightweight & Fast
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { Button } from 'rubyy-baileys'

let handler = async (m, { sock, conn, text, usedPrefix, command }) => {
  const client = conn || sock
  const input = (text || '').trim()

  if (!input) {
    return m.reply(`Kirim link saluran untuk mengecek ID!\n\nContoh:\n${usedPrefix}${command} https://whatsapp.com/channel/0029VbDO8tI2phHLTSN2ed0U`)
  }

  let channelId = ''
  let metadata = null

  if (input.endsWith('@newsletter')) {
    channelId = input
    try {
      metadata = await client.newsletterMetadata('jid', input)
    } catch {}
  } else {
    const match = input.match(/(?:whatsapp\.com\/channel\/)?([0-9A-Za-z]{20,28})/)
    if (!match || !match[1]) {
      return m.reply('Link saluran tidak valid. Pastikan format link benar.')
    }
    const inviteCode = match[1]
    try {
      metadata = await client.newsletterMetadata('invite', inviteCode)
      channelId = metadata?.id || ''
    } catch (e) {
      return m.reply(`Gagal mengambil data saluran: ${e.message || e}`)
    }
  }

  if (!channelId) {
    return m.reply('ID Saluran tidak ditemukan.')
  }

  const name = metadata?.name || 'Saluran WhatsApp'
  const subscribers = metadata?.subscribers ? Number(metadata.subscribers).toLocaleString('id-ID') : '-'

  const infoText =
    `╭─「 *ID SALURAN* 」\n` +
    `│ ❃ Nama : *${name}*\n` +
    `│ ❃ ID   : \`${channelId}\`\n` +
    `│ ❃ User : *${subscribers}*\n` +
    `╰──────────────────`

  try {
    const btn = new Button(client)
      .setBody(infoText)
      .addCopy('📋 Salin ID', channelId)

    await btn.send(m.chat, { quoted: m.raw })
  } catch {
    await client.sendMessage(
      m.chat,
      {
        text: infoText,
        buttons: [
          {
            name: 'cta_copy',
            paramsJson: JSON.stringify({
              display_text: '📋 Salin ID',
              copy_code: channelId
            })
          }
        ]
      },
      { quoted: m.raw }
    )
  }
}

handler.command = ['cekidch', 'idch', 'urltoid']
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
