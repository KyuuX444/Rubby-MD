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

import axios from 'axios';
import { prepareWAMessageMedia } from 'rubyy-baileys';

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	if (!text) {
		return reply(`Masukkan kata kunci pencarian Pixiv!\n\nContoh:\n${usedPrefix + command} Anime\n${usedPrefix + command} Genshin`);
	}

	reply('⏳ Sedang mencari di Pixiv...');

	try {
		const apiUrl = global.API('kyzz', '/api/search/pixiv', { query: text.trim(), page: 1, limit: 5 }, 'apikey');
		const { data: res } = await axios.get(apiUrl, { timeout: 30000 });

		if (!res || !res.status || !Array.isArray(res.results) || res.results.length === 0) {
			return reply(`❌ Gambar Pixiv untuk *"${text}"* tidak ditemukan.`);
		}

		const items = res.results.filter(item => item && (item.image || item.thumbnail));
		if (items.length === 0) {
			return reply(`❌ Tidak ada hasil gambar yang valid.`);
		}

		const cardPromises = items.map(async (item, idx) => {
			try {
				const imgUrl = item.image || item.thumbnail;
				const media = await prepareWAMessageMedia(
					{ image: { url: imgUrl } },
					{ upload: client.waUploadToServer }
				);

				const tags = Array.isArray(item.tags) ? item.tags.slice(0, 5).join(', ') : '-';
				const caption = `🎨 *Title:* ${item.title || '-'}\n` +
					`👤 *Author:* ${item.author || '-'}\n` +
					`🏷️ *Tags:* ${tags}`;

				return {
					body: { text: caption },
					footer: { text: `© ${global.botName || 'Rubby Multi Device'} • Pixiv` },
					header: {
						title: `🖼️ Hasil ${idx + 1}/${items.length}`,
						hasMediaAttachment: true,
						imageMessage: media.imageMessage
					},
					nativeFlowMessage: {
						buttons: [{
							name: 'cta_url',
							buttonParamsJson: JSON.stringify({
								display_text: '🌐 Buka di Pixiv',
								url: item.url || `https://www.pixiv.net/en/artworks/${item.id}`
							})
						}]
					}
				};
			} catch (err) {
				return null;
			}
		});

		const cards = (await Promise.all(cardPromises)).filter(Boolean);

		if (cards.length > 0) {
			await client.relayMessage(m.chat, { viewOnceMessage: { message: { interactiveMessage: { body: { text: `Result:` }, footer: { text: `© ${global.botName || "Rubby Multi Device"}` }, carouselMessage: { cards: resolvedCards } } } } }, { quoted: m });
		} else {
			
			const first = items[0];
			await client.sendMessage(m.chat, {
				image: { url: first.image || first.thumbnail },
				caption: `🎨 *${first.title}*\n👤 *Author:* ${first.author}\n🔗 *Link:* ${first.url}`
			}, { quoted: m });
		}
	} catch (e) {
		console.error('[PIXIV SEARCH ERROR]', e.message);
		reply(`❌ Terjadi kesalahan: ${e.response?.data?.message || e.message}`);
	}
};

handler.help = ['pixiv <query>', 'pixivsearch <query>'];
handler.tags = ['search'];
handler.command = ['pixiv', 'pixivsearch'];
handler.limit = true;
handler.register = true;

export default handler;
