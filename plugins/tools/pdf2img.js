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
import path from 'path';
import { exec } from 'child_process';
import { downloadMediaMessage } from 'rubyy-baileys';

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
	const innerMsg = rawMsg.documentMessage || rawMsg.documentWithCaptionMessage?.message?.documentMessage;

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

const handler = async (m, { sock, conn, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	const qmsg = m.quoted ? m.quoted : m;

	const mime = qmsg.mimetype || qmsg.msg?.mimetype || (qmsg.message?.documentMessage?.mimetype) || (qmsg.message?.documentWithCaptionMessage?.message?.documentMessage?.mimetype) || '';

	if (!/application\/pdf/i.test(mime)) {
		let help = `🌸 *${toSmallCaps('PDF to Image Converter')}* 🌸\n\n` +
			`✨ *${toSmallCaps('Kirim atau reply dokumen PDF dengan perintah')}* *${usedPrefix + command}* ʏᴀ ᴋᴀᴋ~\n\n` +
			`• 📌 *${toSmallCaps('Fitur:')}* Mengonversi tiap halaman file PDF menjadi Album Foto gambar JPG!\n` +
			`• 🎀 *${toSmallCaps('Contoh:')}* Balas dokumen .pdf dengan \`${usedPrefix + command}\``;
		return reply(help);
	}

	await reply(`⏳ *${toSmallCaps('Sedang mengekstrak halaman PDF menjadi gambar album, tunggu sebentar ya kak~')}* ✨`);

	const id = Date.now() + '_' + Math.random().toString(36).substring(7);
	const tempPdfPath = path.join('/tmp', `pdf_${id}.pdf`);
	const outputPrefix = path.join('/tmp', `page_${id}_%d.jpg`);

	try {
		const pdfBuffer = await extractMediaBuffer(qmsg, client);
		if (!pdfBuffer) {
			return reply(`❌ *${toSmallCaps('Gagal mengunduh dokumen PDF!')}*`);
		}

		fs.writeFileSync(tempPdfPath, pdfBuffer);

		const gsCmd = `gs -dNOPAUSE -dBATCH -sDEVICE=jpeg -r150 -sOutputFile="${outputPrefix}" "${tempPdfPath}"`;

		await new Promise((resolve, reject) => {
			exec(gsCmd, (err, stdout, stderr) => {
				if (err) return reject(new Error(stderr || err.message));
				resolve(stdout);
			});
		});

		const files = fs.readdirSync('/tmp')
			.filter(f => f.startsWith(`page_${id}_`) && f.endsWith('.jpg'))
			.sort((a, b) => {
				const numA = parseInt(a.replace(`page_${id}_`, '').replace('.jpg', ''), 10);
				const numB = parseInt(b.replace(`page_${id}_`, '').replace('.jpg', ''), 10);
				return numA - numB;
			});

		if (!files.length) {
			if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
			return reply(`❌ *${toSmallCaps('Tidak ada halaman yang berhasil diekstrak dari PDF!')}*`);
		}

		const totalPages = files.length;
		const pageBuffers = files.map(f => {
			const filePath = path.join('/tmp', f);
			const buf = fs.readFileSync(filePath);
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
			return buf;
		});

		if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);

		let caption = `🖼️ *${toSmallCaps('Hasil Ekstrak PDF ke Album')}* ✨\n\n` +
			`• 📑 *${toSmallCaps('Total Halaman:')}* ${totalPages} Halaman\n\n` +
			`꒰ © Rubby Multi Device ꒱`;

		if (pageBuffers.length > 1) {
			try {
				const albumMsg = await client.sendMessage(m.chat, {
					album: {
						expectedImageCount: pageBuffers.length,
						expectedVideoCount: 0
					}
				}, { quoted: m });

				for (let i = 0; i < pageBuffers.length; i++) {
					let pageCaption = `🖼️ *${toSmallCaps('Halaman')} ${i + 1} / ${totalPages}*\n\n꒰ © Rubby Multi Device ꒱`;
					await client.sendMessage(m.chat, {
						image: pageBuffers[i],
						caption: i === 0 ? caption.trim() : pageCaption,
						albumParentKey: albumMsg?.key
					});
				}
			} catch (err) {
				console.warn('[PDF2IMG ALBUM FALLBACK]', err);
				for (let i = 0; i < pageBuffers.length; i++) {
					let pageCaption = `🖼️ *${toSmallCaps('Halaman')} ${i + 1} / ${totalPages}*\n\n꒰ © Rubby Multi Device ꒱`;
					await client.sendMessage(m.chat, {
						image: pageBuffers[i],
						caption: i === 0 ? caption.trim() : pageCaption
					}, { quoted: m });
				}
			}
		} else {
			await client.sendMessage(m.chat, {
				image: pageBuffers[0],
				caption: caption.trim()
			}, { quoted: m });
		}

	} catch (e) {
		console.error('[PDF2IMG ERROR]', e);
		if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
		reply(`❌ *${toSmallCaps('Terjadi kesalahan saat mengekstrak PDF:')}* ${e.message}`);
	}
};

handler.help = ['pdf2img', 'pdftoimg'];
handler.tags = ['tools', 'convert'];
handler.command = /^(pdf2img|pdftoimg|pdftoimage|pdf2image)$/i;
handler.category = 'tools';
handler.limit = true;
handler.register = true;

export default handler;
