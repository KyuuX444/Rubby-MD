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

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock
	if (!text) {
		return reply(`*NPM Package Stalker (Kyzz API)*\n\nContoh:\n${usedPrefix}${command} express\n${usedPrefix}${command} rubyy-baileys`)
	}

	reply(`⏳ Mengambil data package NPM *"${text}"*...`)

	try {
		const apiUrl = global.API('kyzz', '/api/search/npm', { query: text }, 'apikey')
		const { data } = await axios.get(apiUrl, { timeout: 15000 })

		if (!data || !data.status || !Array.isArray(data.result) || data.result.length === 0) {
			return reply(`❌ Package NPM *"${text}"* tidak ditemukan.`)
		}

		const pkg = data.result[0]
		const caption = `📦 *NPM PACKAGE STALKER*\n\n` +
			`📌 *Nama:* ${pkg.name}\n` +
			`🏷️ *Versi Terbaru:* v${pkg.version || '-'}\n` +
			`📝 *Deskripsi:* ${pkg.description || '-'}\n` +
			`📜 *Lisensi:* ${pkg.license || '-'}\n` +
			`📅 *Terakhir Update:* ${pkg.date ? new Date(pkg.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}\n` +
			`🔗 *NPM Link:* https://www.npmjs.com/package/${pkg.name}`

		return reply(caption)
	} catch (e) {
		console.error('[NPM STALK ERROR]', e.response?.data || e.message)
		return reply('❌ Gagal mengambil info package NPM.')
	}
}

handler.help = ['npmstalk <package_name>', 'npm <package_name>']
handler.tags = ['search', 'tools']
handler.command = ['npmstalk', 'npmsearch', 'npm']
handler.limit = true;
handler.register = true

export default handler
