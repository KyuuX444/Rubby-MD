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

import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import { Button, Carousel } from 'rubyy-baileys'

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
	const client = conn || sock || global.mainSock || global.conn
	if (!text) {
		return reply(`*Pinterest Search Carousel (Kyzz API v2)*\n\nContoh:\n${usedPrefix}${command} aesthetic wallpaper\n${usedPrefix}${command} anime wallpaper`)
	}

	await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

	try {
		const apiUrl = global.API('kyzz', '/api/search/pinterest-v2', { q: text }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 20000 })

		if (!data || !data.status || !Array.isArray(data.result) || data.result.length === 0) {
			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
			return reply(`❌ Tidak ada gambar ditemukan untuk *"${text}"*.`)
		}

		const validItems = data.result.filter(item => item && item.image && typeof item.image === 'string' && item.image.startsWith('http'))
		if (validItems.length === 0) {
			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
			return reply(`❌ Tidak ada URL gambar valid yang dapat dimuat untuk *"${text}"*.`)
		}

		const targetList = validItems.slice(0, 7)

		const cardPromises = targetList.map(async (item, index) => {
			try {
				const cardTitle = item.title && item.title.trim() ? item.title.trim() : text
				const pinnerName = item.pinner || item.username || 'Pinterest User'
				const pinLink = item.link || `https://pinterest.com/search/pins/?q=${encodeURIComponent(text)}`

				const captionBody = `🔍 *Search:* ${text}\n` +
					`🖼️ *Title:* ${cardTitle.length > 45 ? cardTitle.substring(0, 42) + '...' : cardTitle}\n` +
					`👤 *Pinner:* ${pinnerName}` +
					(item.likes ? `\n❤️ *Likes:* ${item.likes.toLocaleString('id-ID')}` : '')

				const card = new Button(client)
					.setImage(item.image)
					.setTitle(`📌 Gambar ${index + 1}/${targetList.length}`)
					.setBody(captionBody)
					.setFooter(`© ${global.botName || 'Rubby Multi Device'} • Pinterest`)
					.addUrl('📌 Buka Pinterest', pinLink)

				return await card.toCard()
			} catch {
				return null
			}
		})

		const resolvedCards = (await Promise.all(cardPromises)).filter(Boolean)

		if (resolvedCards.length === 0) {
			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
			return reply('❌ Gagal menyiapkan media carousel gambar.')
		}

		const carousel = new Carousel(client)
			.setBody(`📌 *PINTEREST CAROUSEL RESULT*\n\nDitemukan *${resolvedCards.length}* gambar presisi untuk *"${text}"*. Geser kesamping ⏩`)
			.setFooter(`© ${global.botName || 'Rubby Multi Device'} • Pinterest`)
			.addCard(resolvedCards)

		await carousel.send(m.chat, { quoted: m.raw })

		await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
	} catch (e) {
		console.error('[PINTEREST CAROUSEL ERROR]', e.response?.data || e.message)
		await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
		return reply('❌ Terjadi kesalahan saat membuat carousel Pinterest.')
	}
}

handler.help = ['pinterest <kata_kunci>', 'pin <kata_kunci>']
handler.tags = ['search']
handler.command = ['pinterest', 'pin']
handler.limit = true
handler.register = true

export default handler
