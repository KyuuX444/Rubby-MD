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

import fs from 'fs';
import os from 'os';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { downloadContentFromMessage, prepareWAMessageMedia, generateWAMessageFromContent } from 'rubyy-baileys';

const toSmallCaps = (str) => {
	const smallCapsMap = {
		a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
		j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
		s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
	};
	return String(str).toLowerCase().split('').map(c => smallCapsMap[c] || c).join('');
};

let handler = async (m, { conn, sock, usedPrefix, command }) => {
	const client = sock || conn || global.mainSock;
	const flTmpVideo = path.join(os.tmpdir(), `lv_video_${Date.now()}.mp4`);
	const flTmpThumb = path.join(os.tmpdir(), `lv_thumb_${Date.now()}.jpg`);

	try {
		const q = m.quoted ? m.quoted : m;
		const mime = (q.msg || q).mimetype || q.mimetype || '';

		if (!mime.includes('video')) {
			return m.reply(`🌸 *${toSmallCaps('Live Photo Maker')}* 🌸\n\n✨ *${toSmallCaps('Balas / reply video yang ingin dijadikan Live Photo')}* *${usedPrefix + command}* ʏᴀ ᴋᴀᴋ~`);
		}

		m.reply(`⏳ *${toSmallCaps('Sedang membuat Live Photo, tunggu sebentar ya kak~')}* ✨`);

		let flVideoBuffer;
		
		if (typeof q.download === 'function') {
			flVideoBuffer = await q.download();
		} else {
			const flVideoMsgObj = q.msg || q; 
			
			if (!flVideoMsgObj || (!flVideoMsgObj.mediaKey && !flVideoMsgObj.url)) {
				return m.reply(`❌ *${toSmallCaps('Media key tidak ditemukan, pastikan reply video yang valid ya kak~')}*`);
			}

			const flStream = await downloadContentFromMessage(flVideoMsgObj, 'video');
			let chunks = [];
			for await (const chunk of flStream) {
				chunks.push(chunk);
			}
			flVideoBuffer = Buffer.concat(chunks);
		}

		if (!flVideoBuffer || flVideoBuffer.length === 0) {
			return m.reply(`❌ *${toSmallCaps('Gagal mendownload video kak~')}*`);
		}

		fs.writeFileSync(flTmpVideo, flVideoBuffer);

		await new Promise((resolve, reject) => {
			ffmpeg(flTmpVideo)
				.outputOptions(['-vframes 1', '-q:v 2'])
				.output(flTmpThumb)
				.on('end', resolve)
				.on('error', reject)
				.run();
		});

		const flThumbBuffer = fs.readFileSync(flTmpThumb);
		
		const flImageMedia = await prepareWAMessageMedia(
			{ image: flThumbBuffer },
			{ upload: client.waUploadToServer }
		);
		const flVideoMedia = await prepareWAMessageMedia(
			{ video: flVideoBuffer },
			{ upload: client.waUploadToServer }
		);

		const flPhotoMsg = generateWAMessageFromContent(
			m.chat,
			{
				imageMessage: {
					...flImageMedia.imageMessage,
					contextInfo: { pairedMediaType: 5, statusSourceType: 0 }
				}
			},
			{ quoted: m }
		);
		
		await client.relayMessage(m.chat, flPhotoMsg.message, { messageId: flPhotoMsg.key.id });

		await client.relayMessage(
			m.chat,
			{
				videoMessage: {
					...flVideoMedia.videoMessage,
					contextInfo: { pairedMediaType: 6, statusSourceType: 0 }
				},
				messageContextInfo: {
					messageAssociation: { associationType: 12, parentMessageKey: flPhotoMsg.key }
				}
			},
			{}
		);

		await client.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

	} catch (e) {
		console.error('[FOTOLIVE ERROR]', e);
		await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
		m.reply(`❌ *${toSmallCaps('Gagal membuat Live Photo-nya kak~')}* 🥺`);
	} finally {
		try { if (fs.existsSync(flTmpVideo)) fs.unlinkSync(flTmpVideo); } catch (_) {}
		try { if (fs.existsSync(flTmpThumb)) fs.unlinkSync(flTmpThumb); } catch (_) {}
	}
};

handler.help = ['fotolive'];
handler.tags = ['maker', 'tools'];
handler.command = /^(fotolive|livephoto|livepic)$/i;
handler.category = 'tools';
handler.limit = true;
handler.register = true;

export default handler;
