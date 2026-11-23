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

import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { downloadMediaMessage } from 'rubyy-baileys';
import { Button } from '../../src/lib/helper-bails.js';

const toSmallCaps = (str) => {
	const smallCapsMap = {
		a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
		j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
		s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
	};
	return str.toLowerCase().split('').map(c => smallCapsMap[c] || c).join('');
};

const extractMediaBuffer = async (msgObj, client) => {
	if (!msgObj) return null;
	if (Buffer.isBuffer(msgObj)) return msgObj;
	if (typeof msgObj.download === 'function') {
		try {
			const buf = await msgObj.download();
			if (buf && Buffer.isBuffer(buf)) return buf;
		} catch (_) {}
	}

	const rawMsg = msgObj.message || msgObj.msg || msgObj;
	const innerMsg = rawMsg.imageMessage || rawMsg.documentMessage || rawMsg.viewOnceMessageV2?.message?.imageMessage || rawMsg.viewOnceMessage?.message?.imageMessage;

	if (innerMsg) {
		try {
			const buf = await downloadMediaMessage(
				{ key: msgObj.key || {}, message: rawMsg },
				'buffer',
				{},
				{ logger: console, reuploadRequest: client?.updateMediaMessage }
			);
			if (buf && Buffer.isBuffer(buf)) return buf;
		} catch (_) {}
	}
	return null;
};

const handler = async (m, { sock, conn, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	const qmsg = m.quoted ? m.quoted : m;

	let targetMessages = [];

	if (m.quoted) {
		const qId = m.quoted.id || m.quoted.key?.id;
		const qFake = m.quoted.fakeObj || {};
		const qFakeMsg = qFake.message || qFake.msg || {};
		const qMsgObj = m.quoted.message || m.quoted.msg || {};

		const cachedAlbum = qId ? global.albumCache?.get(qId) : null;
		const isAlbumReply =
			m.quoted.mtype === 'albumMessage' ||
			Boolean(qMsgObj?.albumMessage) ||
			Boolean(qFakeMsg?.albumMessage) ||
			Boolean(m.quoted.albumMessage) ||
			(Array.isArray(m.quoted.messages) && m.quoted.messages.length > 1) ||
			(Array.isArray(m.quoted.medias) && m.quoted.medias.length > 1) ||
			(Array.isArray(m.quoted.album) && m.quoted.album.length > 1) ||
			(Boolean(cachedAlbum?.isAlbum) && (cachedAlbum.parentId === qId || m.quoted.mtype === 'albumMessage'));

		if (isAlbumReply) {
			if (cachedAlbum && Array.isArray(cachedAlbum.messages) && cachedAlbum.messages.length > 0) {
				targetMessages = cachedAlbum.messages;
			} else if (Array.isArray(m.quoted.messages) && m.quoted.messages.length > 0) {
				targetMessages = m.quoted.messages;
			} else if (Array.isArray(m.quoted.medias) && m.quoted.medias.length > 0) {
				targetMessages = m.quoted.medias;
			} else if (Array.isArray(m.quoted.album) && m.quoted.album.length > 0) {
				targetMessages = m.quoted.album;
			} else if (qFakeMsg?.albumMessage?.messages || qMsgObj?.albumMessage?.messages) {
				targetMessages = qFakeMsg?.albumMessage?.messages || qMsgObj?.albumMessage?.messages;
			} else {
				targetMessages = [m.quoted];
			}
		} else {
			targetMessages = [m.quoted];
		}
	} else {
		targetMessages = [m];
	}

	const isImageCandidate = (msg) => {
		if (!msg) return false;
		if (msg.mtype === 'imageMessage') return true;
		const mime = msg.mimetype || msg.msg?.mimetype || (msg.message?.imageMessage?.mimetype) || '';
		return /image\/(png|jpe?g|webp|bmp)/i.test(mime);
	};

	const validMediaMsgs = targetMessages.filter(isImageCandidate);

	if (!validMediaMsgs.length) {
		let help = `🌸 *${toSmallCaps('Image to PDF Converter')}* 🌸\n\n` +
			`✨ *${toSmallCaps('Kirim atau reply foto / album foto')}* *${usedPrefix + command} [namafile]* ʏᴀ ᴋᴀᴋ~\n\n` +
			`• 📌 *${toSmallCaps('Fitur:')}* Mendukung 1 foto atau banyak foto (Album Message) sekaligus!\n` +
			`• 🎀 *${toSmallCaps('Contoh:')}* \`${usedPrefix + command} Dokumen_Tugas\``;
		return reply(help);
	}

	await reply(`⏳ *${toSmallCaps('Sedang mengubah')}* ${validMediaMsgs.length} *${toSmallCaps('gambar menjadi PDF, tunggu sebentar ya kak~')}* ✨`);

	try {
		const imageBuffers = [];
		for (const msg of validMediaMsgs) {
			const buf = await extractMediaBuffer(msg, client);
			if (buf) {
				const convertedJpeg = await sharp(buf)
					.jpeg({ quality: 90 })
					.toBuffer()
					.catch(() => null);

				if (convertedJpeg) {
					const meta = await sharp(convertedJpeg).metadata().catch(() => null);
					imageBuffers.push({
						buffer: convertedJpeg,
						width: meta?.width || 595.28,
						height: meta?.height || 841.89
					});
				}
			}
		}

		if (!imageBuffers.length) {
			return reply(`❌ *${toSmallCaps('Gagal mengunduh gambar!')}*`);
		}

		const customFileName = (text || '').trim().replace(/[^a-zA-Z0-9_\- ]/g, '') || `angela_doc_${Date.now()}`;
		const finalPdfName = customFileName.endsWith('.pdf') ? customFileName : `${customFileName}.pdf`;

		const doc = new PDFDocument({ autoFirstPage: false });
		const chunks = [];

		doc.on('data', chunk => chunks.push(chunk));

		for (const img of imageBuffers) {
			doc.addPage({
				size: [img.width, img.height],
				margin: 0
			});
			doc.image(img.buffer, 0, 0, {
				width: img.width,
				height: img.height
			});
		}

		doc.end();

		const pdfBuffer = await new Promise((resolve) => {
			doc.on('end', () => resolve(Buffer.concat(chunks)));
		});

		let caption = `📄 *${toSmallCaps('Berhasil Membuat Dokumen PDF')}* ✨\n\n` +
			`• 📝 *${toSmallCaps('Nama File:')}* ${finalPdfName}\n` +
			`• 🖼️ *${toSmallCaps('Total Halaman:')}* ${imageBuffers.length} Halaman\n` +
			`• 📦 *${toSmallCaps('Ukuran:')}* ${(pdfBuffer.length / 1024).toFixed(2)} KB\n\n` +
			`꒰ © Rubby Multi Device ꒱`;

		try {
			const btn = new Button(client);
			btn.setDocument(pdfBuffer, {
				mimetype: 'application/pdf',
				fileName: finalPdfName
			});
			btn.setBody('');
			btn.setFooter(caption.trim());
			await btn.send(m.chat, { quoted: m });
		} catch (_) {
			await client.sendMessage(m.chat, {
				document: pdfBuffer,
				mimetype: 'application/pdf',
				fileName: finalPdfName,
				caption: caption.trim()
			}, { quoted: m });
		}

	} catch (e) {
		console.error('[IMG2PDF ERROR]', e);
		reply(`❌ *${toSmallCaps('Terjadi kesalahan saat membuat PDF:')}* ${e.message}`);
	}
};

handler.help = ['img2pdf [namafile]', 'topdf [namafile]'];
handler.tags = ['tools', 'convert'];
handler.command = /^(img2pdf|topdf|imagetopdf|fototopdf)$/i;
handler.category = 'tools';
handler.limit = true;
handler.register = true;

export default handler;
