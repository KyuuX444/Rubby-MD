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

import { prepareWAMessageMedia } from 'rubyy-baileys';
import { googleImageSearch } from '../../scrape/googleimage.js';
import { Carousel } from '../../src/lib/helper-bails.js';

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock || global.conn;

	if (!text) {
		return reply(
			`🔍 *Google Image Search*\n\n` +
			`Ketik kata kunci gambar yang ingin dicari, sayang~\n\n` +
			`*Contoh:* \`${usedPrefix + command} kucing persia\`\n` +
			`*Contoh:* \`${usedPrefix + command} cyber city wallpaper\``
		);
	}

	await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

	try {
		const results = await googleImageSearch(text.trim());

		if (!results || results.length === 0) {
			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
			return reply(`❌ Gambar tidak ditemukan untuk pencarian *"${text}"*, coba kata kunci lain ya sayang~`);
		}

		// Batasi maksimal 7 kartu untuk carousel agar ringan & responsif
		const displayItems = results.slice(0, 7);

		const cardPromises = displayItems.map(async (item, index) => {
			try {
				const media = await prepareWAMessageMedia(
					{ image: { url: item.url } },
					{ upload: client.waUploadToServer }
				);

				const cardTitle = item.title && item.title.trim() ? item.title.trim() : text;
				const cleanTitle = cardTitle.length > 50 ? cardTitle.substring(0, 47) + '...' : cardTitle;

				return {
					body: {
						text: `🔍 *Query:* ${text}\n` +
							`🖼️ *Judul:* ${cleanTitle}\n` +
							`🌐 *Sumber:* ${item.source ? new URL(item.source).hostname : 'Google'}`
					},
					footer: {
						text: `© ${global.namaBot || 'Rubby Multi Device'} • Google Image`
					},
					header: {
						title: `📸 Gambar ${index + 1}/${displayItems.length}`,
						hasMediaAttachment: true,
						imageMessage: media.imageMessage
					},
					nativeFlowMessage: {
						buttons: [{
							name: 'cta_url',
							buttonParamsJson: JSON.stringify({
								display_text: '🌐 Buka Sumber Gambar',
								url: item.source || item.url
							})
						}]
					}
				};
			} catch (e) {
				return null;
			}
		});

		const cards = (await Promise.all(cardPromises)).filter(Boolean);

		if (cards.length > 0) {
			const carousel = new Carousel(client)
				.setBody(`✨ *HASIL GOOGLE IMAGE SEARCH*\n\nDitemukan *${cards.length}* gambar untuk *"${text}"*.\nGeser ke samping untuk melihat pilihan lainnya ya sayang~ ⏩`)
				.setFooter(`© ${global.namaBot || 'Rubby Multi Device'} • Google Image Search`);

			for (const card of cards) {
				carousel.addCard(card);
			}

			await carousel.send(m.chat, { quoted: m });
			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
		} else {
			// Fallback bila media prepare carousel gagal, kirim langsung 1 gambar utama
			const firstItem = displayItems[0];
			await client.sendMessage(m.chat, {
				image: { url: firstItem.url },
				caption: `✨ *Google Image Search*\n\n🔍 *Query:* ${text}\n🖼️ *Judul:* ${firstItem.title}\n🌐 *Sumber:* ${firstItem.source}`
			}, { quoted: m });
			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
		}
	} catch (err) {
		console.error('[GOOGLE IMAGE SEARCH ERROR]:', err);
		await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		return reply(`❌ Terjadi kesalahan saat mencari gambar: ${err.message}`);
	}
};

handler.help = ['gimage <query>', 'googleimage <query>'];
handler.tags = ['search'];
handler.command = ['gimage', 'googleimage', 'gimg'];
handler.limit = true;
handler.register = true;

export default handler;
