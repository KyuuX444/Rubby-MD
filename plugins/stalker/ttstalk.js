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
		return reply(`*TikTok Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} khaby.lame`)
	}

	const username = text.trim().replace('@', '')
	reply(global.mess.wait)

	try {
		const apiUrl = global.API('kyzz', '/api/stalker/tiktok', { username }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data.status || !data.result) return reply(`❌ Akun TikTok *@${username}* tidak ditemukan.`)
		const res = data.result
		const stats = res.stats || {}
		const avatarObj = res.avatar || {}
		const avatarUrl = typeof avatarObj === 'string' ? avatarObj : (avatarObj.larger || avatarObj.medium || avatarObj.thumb || res.profileUrl)

		const stlkText = `🎵 *TIKTOK STALKER*\n\n` +
			`👤 *Nama:* ${res.nickname || '-'}\n` +
			`🆔 *Username:* @${res.username || username}\n` +
			`📝 *Bio:* ${res.signature || '-'}\n` +
			`👥 *Followers:* ${(stats.followers || 0).toLocaleString('id-ID')}\n` +
			`👤 *Following:* ${(stats.following || 0).toLocaleString('id-ID')}\n` +
			`🎬 *Total Video:* ${(stats.videos || 0).toLocaleString('id-ID')}\n` +
			`🌐 *Region:* ${res.region || '-'}\n` +
			`🔒 *Akun Privat:* ${res.privateAccount ? 'Ya' : 'Tidak'}\n` +
			`🔗 *Profile:* ${res.profileUrl || `https://www.tiktok.com/@${user}`}`

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
										title: `TikTok: @${username}`,
										hasMediaAttachment: true,
										imageMessage: media.imageMessage
									},
									body: { text: '' },
									footer: { text: stlkText },
									nativeFlowMessage: {
										buttons: [{
											name: "cta_url",
											buttonParamsJson: JSON.stringify({
												display_text: "🔗 Buka Profil TikTok",
												url: res.profileUrl || `https://www.tiktok.com/@${username}`
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
				console.warn('[TTSTALK MEDIA WARN]', e.message)
			}
		}

		if (avatarUrl) {
			return await client.sendMessage(m.chat, { image: { url: avatarUrl }, caption: stlkText }, { quoted: m })
		}
		return reply(stlkText)
	} catch (e) {
		console.error('[TIKTOK STALK ERROR]', e.response?.data || e.message)
		return reply('❌ Terjadi kesalahan saat melakukan stalk TikTok.')
	}
}

handler.help = ['ttstalk <username>', 'tiktokstalk <username>']
handler.tags = ['stalker']
handler.command = ['ttstalk', 'tiktokstalk', 'stalktt']
handler.limit = true;
handler.register = true

export default handler
