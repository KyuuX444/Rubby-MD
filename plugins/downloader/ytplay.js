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

import fs from 'node:fs';
import axios from 'axios';
import sharp from 'sharp';
import { ButtonV2 } from 'rubyy-baileys';

function formatDuration(val) {
	if (!val || val === '-' || val === 'N/A') return '-';
	if (typeof val === 'string' && val.includes(':')) return val;
	const sec = parseInt(val, 10);
	if (isNaN(sec)) return String(val);
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	const s = sec % 60;
	if (h > 0) {
		return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}
	return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function getThumbJpegBuffer(url) {
	if (!url) return null;
	try {
		const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
		const rawBuf = Buffer.from(res.data);
		return await sharp(rawBuf)
			.resize(300, 300, { fit: 'cover' })
			.toFormat('jpeg', { quality: 75 })
			.toBuffer();
	} catch (e) {
		return null;
	}
}

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = sock || conn;
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : '';
	const rawInput = (text || quotedText || '').trim();
	const urlMatch = rawInput.match(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i);
	const targetQuery = urlMatch ? urlMatch[0] : rawInput;

	if (!targetQuery) {
		return reply(`Masukan judul lagu yang ingin dicari atau link YouTube!\n\nContoh: \`${usedPrefix}${command} Evaluasi - Hindia\`\nAtau reply pesan yang berisi judul/link YouTube!`);
	}

	const sendReact = (emoji) => client.sendMessage(m.chat, { react: { text: emoji, key: m.key } }).catch(() => {});

	if (global.mess?.wait) reply(global.mess.wait);
	await sendReact('🕒');

	try {
		const isUrl = /^https?:\/\//i.test(targetQuery);
		let targetUrl = targetQuery;
		let title = '';
		let thumbnail = '';
		let duration = '';
		let channel = '';
		let views = 'N/A';

		if (!isUrl) {
			const searchApi = global.API('kyzz', '/api/search/yts', { q: targetQuery }, 'apikey');
			const searchRes = await axios.get(searchApi, { timeout: 12000 });
			const searchData = searchRes.data;

			if (!searchData?.status || !Array.isArray(searchData?.results) || searchData.results.length === 0) {
				await sendReact('✖️');
				return reply(`Lagu *${targetQuery}* tidak ditemukan.`);
			}

			const first = searchData.results[0];
			targetUrl = first.url || `https://youtu.be/${first.id}`;
			title = first.title || '';
			thumbnail = first.thumbnails && first.thumbnails[0] ? first.thumbnails[0].url : (first.image || '');
			duration = typeof first.duration === 'object' ? (first.duration?.text || '') : String(first.duration || '');
			channel = typeof first.channel === 'object' ? (first.channel?.name || '') : String(first.channel || '');
			views = first.view_count ? Number(first.view_count).toLocaleString() : (first.views || 'N/A');
		}

		const dlApi = global.API('kyzz', '/api/download/ytmp3', { url: targetUrl }, 'apikey');
		const dlRes = await axios.get(dlApi, { timeout: 35000 });
		const dlData = dlRes.data;

		if (!dlData?.status || !dlData?.result?.downloadUrl) {
			await sendReact('✖️');
			return reply(`Gagal mengunduh audio untuk lagu *${title || targetQuery}*.`);
		}

		const audioUrl = dlData.result.downloadUrl;
		const trackTitle = title || dlData.result.title || 'YouTube Music';
		const trackChannel = channel || 'YouTube';
		const rawDuration = duration || dlData.result.duration || 'N/A';
		const trackDuration = formatDuration(rawDuration);
		const finalThumbUrl = thumbnail || dlData.result.thumbnail || '';

		let thumbBuffer = await getThumbJpegBuffer(finalThumbUrl);
		if (!thumbBuffer) {
			try {
				const fallbackThumbPath = './media/thumb.jpg';
				if (fs.existsSync(fallbackThumbPath)) {
					thumbBuffer = await sharp(fallbackThumbPath)
						.resize(300, 300, { fit: 'cover' })
						.toFormat('jpeg', { quality: 80 })
						.toBuffer();
				}
			} catch {}
		}

		const captionText = `🎵 *${trackTitle}*\n\n` +
			`» Channel : ${trackChannel}\n` +
			`» Durasi : ${trackDuration}\n` +
			`» Views : ${views}\n` +
			`» Link : ${targetUrl}`;

		if (thumbBuffer) {
			await client.sendMessage(m.chat, {
				location: {
					degreesLatitude: 0,
					degreesLongitude: 0,
					name: trackTitle,
					address: `Channel: ${trackChannel} • Durasi: ${trackDuration}\nViews: ${views}\n${targetUrl}`,
					jpegThumbnail: thumbBuffer
				}
			}, { quoted: m.raw || m });
		} else {
			await reply(captionText);
		}

		await client.sendMessage(m.chat, {
			audio: { url: audioUrl },
			mimetype: 'audio/mpeg',
			fileName: `${trackTitle.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
			ptt: false
		}, { quoted: m });

		await sendReact('✅');
	} catch (e) {
		console.error('[PLAY ERROR]', e);
		await sendReact('✖️');
		return reply(e.message || String(e));
	}
};

handler.help = ['play <judul>', 'yta <judul>'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytmp3', 'ytplay', 'yta'];
handler.limit = true;
handler.register = true;

export default handler;
