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

import axios from 'axios'
import { prepareWAMessageMedia } from 'rubyy-baileys'

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*Instagram Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} cristiano`)
	}

	const username = text.trim().replace('@', '')
	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/stalker/ig', { username }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) return reply(`❌ Akun Instagram *@${username}* tidak ditemukan.`)
		const res = data.result
		const meta = res.metadata || res
		const avatarUrl = meta.avatar || meta.profile_pic

		const stlkText = `📸 *INSTAGRAM STALKER*\n\n` +
			`👤 *Nama:* ${meta.fullName || meta.fullname || meta.name || '-'}\n` +
			`🆔 *Username:* @${meta.username || username}\n` +
			`👥 *Followers:* ${meta.followers || '-'}\n` +
			`👤 *Following:* ${meta.following || '-'}\n` +
			`🖼️ *Total Posting:* ${meta.posts || '-'}`

		if (avatarUrl && client.relayMessage) {
			try {
				const media = await prepareWAMessageMedia({ image: { url: avatarUrl } }, { upload: client.waUploadToServer })
				return await client.relayMessage(
					m.chat,
					{
						viewOnceMessage: {
							message: {
								interactiveMessage: {
									header: {
										title: `Instagram: @${username}`,
										hasMediaAttachment: true,
										imageMessage: media.imageMessage
									},
									body: { text: '' },
									footer: { text: stlkText },
									nativeFlowMessage: {
										buttons: [{
											name: "cta_url",
											buttonParamsJson: JSON.stringify({
												display_text: "🔗 Buka Profil Instagram",
												url: `https://www.instagram.com/${username}`
											})
										}]
									}
								}
							}
						}
					},
					{ quoted: m }
				)
			} catch (e) {
				console.warn('[IGSTALK MEDIA WARN]', e.message)
			}
		}

		if (avatarUrl) {
			return await client.sendMessage(m.chat, { image: { url: avatarUrl }, caption: stlkText }, { quoted: m })
		}
		return reply(stlkText)
	} catch (e) {
		console.error('[IG STALK ERROR]', e.response?.data || e.message)
		return reply('❌ Terjadi kesalahan saat melakukan stalk Instagram.')
	}
}

handler.help = ['igstalk <username>', 'instagramstalk <username>']
handler.tags = ['stalker']
handler.command = ['igstalk', 'instagramstalk']
handler.limit = true;
handler.register = true

export default handler
