/**
 * Author  : kyuu masih amatir
 * Feature : Instagram Preview Card Maker
 * Chanel  : https://whatsapp.com/channel/0029VbDO8tI2phHLTSN2ed0U
 * Note    : don't claim this code
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const FONTS_DIR = path.join(process.cwd(), 'media', 'fonts');
const ANTON_URL = 'https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf';
const INTER_URL = 'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf';
const ANTON_PATH = path.join(FONTS_DIR, 'Anton-Regular.ttf');
const INTER_PATH = path.join(FONTS_DIR, 'Inter.ttf');

async function ensureFonts() {
	if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });
	if (!fs.existsSync(ANTON_PATH)) {
		const res = await axios.get(ANTON_URL, { responseType: 'arraybuffer', timeout: 15000 });
		fs.writeFileSync(ANTON_PATH, Buffer.from(res.data));
	}
	if (!fs.existsSync(INTER_PATH)) {
		const res = await axios.get(INTER_URL, { responseType: 'arraybuffer', timeout: 15000 });
		fs.writeFileSync(INTER_PATH, Buffer.from(res.data));
	}
	if (!GlobalFonts.has('Anton') && fs.existsSync(ANTON_PATH)) {
		GlobalFonts.registerFromPath(ANTON_PATH, 'Anton');
	}
	if (!GlobalFonts.has('Inter') && fs.existsSync(INTER_PATH)) {
		GlobalFonts.registerFromPath(INTER_PATH, 'Inter');
	}
}

if (fs.existsSync(ANTON_PATH)) GlobalFonts.registerFromPath(ANTON_PATH, 'Anton');
if (fs.existsSync(INTER_PATH)) GlobalFonts.registerFromPath(INTER_PATH, 'Inter');

const FONT_ANTON = 'Anton';
const FONT_INTER = 'Inter';
const FONT_FAMILY = FONT_INTER;

const APPLE_EMOJI_JSON_LOCAL = path.join(FONTS_DIR, 'emoji-apple-image.json');
let appleEmojiMap = null;
const emojiCache = new Map();
const graphemeSegmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

function getAppleEmojiMap() {
	if (appleEmojiMap) return appleEmojiMap;
	if (fs.existsSync(APPLE_EMOJI_JSON_LOCAL)) {
		appleEmojiMap = JSON.parse(fs.readFileSync(APPLE_EMOJI_JSON_LOCAL, 'utf-8'));
		return appleEmojiMap;
	}
	return {};
}

function getEmojiBase64(grapheme, map) {
	if (!map) return null;
	if (map[grapheme]) return map[grapheme];
	const codePoints = Array.from(grapheme).map(c => c.codePointAt(0).toString(16));
	const fullKey = codePoints.join('-');
	if (map[fullKey]) return map[fullKey];
	const noFe0fKey = codePoints.filter(cp => cp !== 'fe0f').join('-');
	if (map[noFe0fKey]) return map[noFe0fKey];
	return null;
}

async function getEmojiImage(grapheme, map) {
	const key = grapheme.replace(/\uFE0F/g, '');
	if (emojiCache.has(key)) return emojiCache.get(key);
	const b64 = getEmojiBase64(grapheme, map);
	if (!b64) return null;
	try {
		const raw = b64.includes(',') ? b64.split(',')[1] : b64;
		const img = await loadImage(Buffer.from(raw, 'base64'));
		emojiCache.set(key, img);
		return img;
	} catch {
		return null;
	}
}

async function drawRichText(ctx, text, x, y, emojiSize, map, emojiOffsetY = 0) {
	let curX = x;
	for (const { segment } of graphemeSegmenter.segment(text)) {
		const emojiImg = await getEmojiImage(segment, map);
		if (emojiImg) {
			ctx.drawImage(emojiImg, curX + 1, y + emojiOffsetY, emojiSize, emojiSize);
			curX += emojiSize + 4;
		} else {
			ctx.fillText(segment, curX, y);
			curX += ctx.measureText(segment).width;
		}
	}
}

const withTimeout = (promise, ms, msg = 'Timeout') =>
	Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms))]);

function drawRoundedRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

function drawCoverImage(ctx, img, x, y, w, h) {
	const imgRatio = img.width / img.height;
	const boxRatio = w / h;
	let sx = 0, sy = 0, sw = img.width, sh = img.height;
	if (imgRatio > boxRatio) {
		sw = img.height * boxRatio;
		sx = (img.width - sw) / 2;
	} else {
		sh = img.width / boxRatio;
		sy = (img.height - sh) / 2;
	}
	ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function wrapText(ctx, text, maxWidth) {
	const paragraphs = text.split(/\r?\n/);
	const lines = [];
	for (const para of paragraphs) {
		const words = para.trim().split(/\s+/).filter(Boolean);
		if (words.length === 0) {
			lines.push('');
			continue;
		}
		let current = '';
		for (const word of words) {
			const test = current ? `${current} ${word}` : word;
			if (ctx.measureText(test).width > maxWidth && current) {
				lines.push(current);
				current = word;
			} else {
				current = test;
			}
		}
		if (current) lines.push(current);
	}
	return lines;
}

function drawCollageBackground(ctx, W, H) {
	ctx.fillStyle = '#c9ccd6';
	ctx.fillRect(0, 0, W, H);

	const cols = 3;
	const rows = 5;
	const cellW = W / cols;
	const cellH = H / rows;
	const labels = [
		'hidup', 'bagemara pun hsaingki kamu', 'tl bea',
		'tips', '', 'hidup',
		'cda ean', 'ppg dia', '',
		'tl bea', 'hsaingki kamu', '',
		'cda ean', '', 'ppg dia'
	];

	ctx.save();
	ctx.globalAlpha = 0.85;
	ctx.filter = 'blur(3px) saturate(0.8)';

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const x = c * cellW;
			const y = r * cellH;
			const idx = r * cols + c;

			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, cellW, cellH);
			ctx.clip();

			const sky = ctx.createLinearGradient(x, y, x, y + cellH);
			sky.addColorStop(0, '#5aa9ec');
			sky.addColorStop(0.6, '#cfe7fb');
			sky.addColorStop(1, '#e8f1fa');
			ctx.fillStyle = sky;
			ctx.fillRect(x, y, cellW, cellH);

			const hillY = y + cellH * 0.92;
			const hill = ctx.createRadialGradient(x + cellW / 2, hillY, 10, x + cellW / 2, hillY, cellW * 0.72);
			hill.addColorStop(0, '#3f9a2c');
			hill.addColorStop(0.7, '#7ac143');
			hill.addColorStop(1, 'rgba(122, 193, 67, 0)');
			ctx.fillStyle = hill;
			ctx.fillRect(x - cellW * 0.2, y + cellH * 0.55, cellW * 1.4, cellH * 0.5);

			const label = labels[idx];
			if (label) {
				ctx.fillStyle = '#222222';
				ctx.font = `600 40px "${FONT_FAMILY}"`;
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				const lines = wrapText(ctx, label, cellW - 40);
				let ty = y + 24;
				for (const line of lines) {
					ctx.fillText(line, x + 20, ty);
					ty += 46;
				}
			}
			ctx.restore();
		}
	}
	ctx.restore();
}

function drawMenuIcon(ctx, type, cx, cy, size) {
	ctx.save();
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 4.2;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	const r = size / 2;
	if (type === 'heart') {
		ctx.beginPath();
		ctx.moveTo(cx, cy + r * 0.78);
		ctx.bezierCurveTo(cx - r * 1.25, cy - r * 0.05, cx - r * 0.65, cy - r * 0.98, cx, cy - r * 0.35);
		ctx.bezierCurveTo(cx + r * 0.65, cy - r * 0.98, cx + r * 1.25, cy - r * 0.05, cx, cy + r * 0.78);
		ctx.stroke();
	} else if (type === 'comment') {
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.78, Math.PI * 0.78, Math.PI * 2.55);
		ctx.lineTo(cx - r * 0.78, cy + r * 0.78);
		ctx.closePath();
		ctx.stroke();
	} else if (type === 'repost') {
		const w = r * 0.72;
		const h = r * 0.55;
		ctx.beginPath();
		ctx.moveTo(cx - w, cy - h * 0.2);
		ctx.lineTo(cx - w, cy - h);
		ctx.lineTo(cx + w * 0.75, cy - h);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(cx + w * 0.4, cy - h - 6);
		ctx.lineTo(cx + w * 0.8, cy - h);
		ctx.lineTo(cx + w * 0.4, cy - h + 6);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(cx + w, cy + h * 0.2);
		ctx.lineTo(cx + w, cy + h);
		ctx.lineTo(cx - w * 0.75, cy + h);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(cx - w * 0.4, cy + h - 6);
		ctx.lineTo(cx - w * 0.8, cy + h);
		ctx.lineTo(cx - w * 0.4, cy + h + 6);
		ctx.stroke();
	} else if (type === 'share') {
		ctx.beginPath();
		ctx.moveTo(cx - r * 0.8, cy - r * 0.2);
		ctx.lineTo(cx + r * 0.8, cy - r * 0.75);
		ctx.lineTo(cx + r * 0.18, cy + r * 0.82);
		ctx.lineTo(cx - r * 0.08, cy + r * 0.1);
		ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(cx - r * 0.08, cy + r * 0.1);
		ctx.lineTo(cx + r * 0.8, cy - r * 0.75);
		ctx.stroke();
	}
	ctx.restore();
}

const handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
	const client = conn || sock || global.mainSock;
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || '';

	if (!/image/.test(mime)) {
		return reply(
			`*📸 INSTAGRAM PREVIEW CARD MAKER*\n\n` +
			`Reply/kirim gambar dengan format:\n` +
			`\`${usedPrefix + command} nama | deskripsi | kata-kata | background(opsional)\`\n\n` +
			`✦ *Opsi Background:*\n` +
			`• Kosong ➔ Collage grid default\n` +
			`• URL gambar ➔ \`https://...\`\n` +
			`• Warna hex ➔ \`#1e293b\`\n` +
			`• \`blur\` ➔ Blur dari foto utama\n\n` +
			`*Contoh:*\n` +
			`\`${usedPrefix + command} kyu manusia biasa | Semangat | tips waras = punya cewe cakep | blur\``
		);
	}

	const parts = (text || '').split('|').map(v => v.trim());
	const nama = parts[0] || m.pushName || 'user';
	const desk = parts[1] || '';
	const kata = parts[2] || '';
	const bgUrl = parts[3] || '';

	await global.react?.(client, m, 'loading').catch(() => {});

	try {
		await ensureFonts();
		const emojiMap = getAppleEmojiMap();
		const imgBuffer = await withTimeout(q.download(), 15000, 'Download gambar timeout');
		if (!imgBuffer) return reply('❌ Gagal mengunduh gambar!');
		const mainImg = await loadImage(imgBuffer);

		let customBgImg = null;
		let customBgColor = null;
		if (bgUrl) {
			if (/^https?:\/\//i.test(bgUrl)) {
				try {
					const res = await axios.get(bgUrl, { responseType: 'arraybuffer', timeout: 15000 });
					customBgImg = await loadImage(Buffer.from(res.data));
				} catch (_) {}
			} else if (/^blur$/i.test(bgUrl)) {
				customBgImg = mainImg;
			} else if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bgUrl)) {
				customBgColor = bgUrl;
			}
		}

		let avatarImg = mainImg;
		try {
			const ppUrl = await withTimeout(client.profilePictureUrl(m.sender, 'image'), 6000, 'PP timeout');
			if (ppUrl) {
				const ppRes = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 8000 });
				avatarImg = await loadImage(Buffer.from(ppRes.data));
			}
		} catch (_) {}

		const W = 1080;
		const H = 1920;
		const canvas = createCanvas(W, H);
		const ctx = canvas.getContext('2d');

		// 1. Background
		if (customBgImg) {
			ctx.save();
			ctx.filter = 'blur(12px) brightness(0.75)';
			drawCoverImage(ctx, customBgImg, -30, -30, W + 60, H + 60);
			ctx.restore();
		} else if (customBgColor) {
			ctx.fillStyle = customBgColor;
			ctx.fillRect(0, 0, W, H);
		} else {
			drawCollageBackground(ctx, W, H);
		}

		// 2. Post Card (.post)
		const cardX = 34;
		const cardY = 115;
		const cardW = W - 68;
		const headerH = 140;
		const naturalImgH = Math.round(cardW * (mainImg.height / mainImg.width));
		const imgH = Math.max(600, Math.min(1040, naturalImgH));
		const cardH = headerH + imgH;
		const radius = 58;

		ctx.save();
		ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
		ctx.shadowBlur = 60;
		ctx.shadowOffsetY = 20;
		drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
		ctx.fillStyle = '#23272e';
		ctx.fill();
		ctx.restore();

		ctx.save();
		drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
		ctx.clip();

		ctx.fillStyle = '#23272e';
		ctx.fillRect(cardX, cardY, cardW, headerH);

		// Avatar (.av)
		const avR = 46;
		const avX = cardX + 36 + avR;
		const avY = cardY + headerH / 2;
		ctx.save();
		ctx.beginPath();
		ctx.arc(avX, avY, avR, 0, Math.PI * 2);
		ctx.clip();
		drawCoverImage(ctx, avatarImg, avX - avR, avY - avR, avR * 2, avR * 2);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.arc(avX, avY, avR, 0, Math.PI * 2);
		ctx.strokeStyle = '#555555';
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.restore();

		// Nama & Deskripsi
		ctx.fillStyle = '#FFFFFF';
		ctx.font = `bold 36px "${FONT_FAMILY}"`;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'left';
		if (desk) {
			await drawRichText(ctx, nama, avX + avR + 24, avY - 18, 34, emojiMap, -17);
			ctx.fillStyle = '#c8cbd2';
			ctx.font = `29px "${FONT_FAMILY}"`;
			await drawRichText(ctx, desk, avX + avR + 24, avY + 22, 28, emojiMap, -14);
		} else {
			await drawRichText(ctx, nama, avX + avR + 24, avY, 34, emojiMap, -17);
		}

		// Main Image (.img)
		const imgY = cardY + headerH;
		drawCoverImage(ctx, mainImg, cardX, imgY, cardW, imgH);

		// Kata-kata overlay
		if (kata) {
			ctx.save();
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			const maxTextW = cardW * 0.48;
			const maxTextH = imgH - 80;
			let fontSize = 64;
			let lines = [];
			let lineHeight = 74;

			while (fontSize >= 24) {
				ctx.font = `${fontSize}px "${FONT_ANTON}", Impact, sans-serif`;
				lineHeight = Math.round(fontSize * 1.18);
				lines = wrapText(ctx, kata, maxTextW);
				if (lines.length * lineHeight <= maxTextH) break;
				fontSize -= 4;
			}

			const totalH = lines.length * lineHeight;
			let startY = imgY + Math.max(48, (imgH - totalH) * 0.45);
			const startX = cardX + 48;

			ctx.fillStyle = '#111111';
			ctx.font = `${fontSize}px "${FONT_ANTON}", Impact, sans-serif`;
			for (const line of lines) {
				await drawRichText(ctx, line, startX, startY, Math.round(fontSize * 0.88), emojiMap, Math.round(fontSize * 0.08));
				startY += lineHeight;
			}
			ctx.restore();
		}

		ctx.restore();

		// 3. Frosted Glass Action Menu (.menu)
		const menuW = 620;
		const menuH = 420;
		const menuX = cardX + cardW - menuW - 24;
		const menuY = cardY + cardH + 40;
		const menuR = 50;

		ctx.save();
		ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
		ctx.shadowBlur = 48;
		ctx.shadowOffsetY = 12;
		drawRoundedRect(ctx, menuX, menuY, menuW, menuH, menuR);
		ctx.fillStyle = 'rgba(120, 120, 125, 0.55)';
		ctx.fill();
		ctx.restore();

		ctx.save();
		drawRoundedRect(ctx, menuX, menuY, menuW, menuH, menuR);
		ctx.clip();

		ctx.filter = 'blur(30px)';
		if (customBgImg) {
			drawCoverImage(ctx, customBgImg, -30, -30, W + 60, H + 60);
		} else if (customBgColor) {
			ctx.fillStyle = customBgColor;
			ctx.fillRect(0, 0, W, H);
		} else {
			drawCollageBackground(ctx, W, H);
		}
		ctx.filter = 'none';

		ctx.fillStyle = 'rgba(120, 120, 125, 0.55)';
		ctx.fillRect(menuX, menuY, menuW, menuH);
		ctx.restore();

		const items = [
			{ icon: 'heart', label: 'Suka' },
			{ icon: 'comment', label: 'Komentar' },
			{ icon: 'repost', label: 'Posting ulang' },
			{ icon: 'share', label: 'Bagikan' }
		];

		const padY = 24;
		const rowH = (menuH - padY * 2) / items.length;
		ctx.fillStyle = '#FFFFFF';
		ctx.font = `500 42px "${FONT_FAMILY}"`;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'left';

		items.forEach((item, idx) => {
			const cy = menuY + padY + rowH * idx + rowH / 2;
			drawMenuIcon(ctx, item.icon, menuX + 82, cy, 48);
			ctx.fillText(item.label, menuX + 158, cy + 2);

			if (idx < items.length - 1) {
				const lineY = menuY + padY + rowH * (idx + 1);
				ctx.save();
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(menuX + 28, lineY);
				ctx.lineTo(menuX + menuW - 28, lineY);
				ctx.stroke();
				ctx.restore();
			}
		});

		const outBuffer = canvas.toBuffer('image/jpeg', 92);
		await client.sendMessage(m.chat, {
			image: outBuffer,
			caption: `✨ *Instagram Preview Card*`
		}, { quoted: m });

		await global.react?.(client, m, 'success').catch(() => {});
	} catch (err) {
		console.error('[IGPREVIEW ERROR]', err);
		await global.react?.(client, m, 'error').catch(() => {});
		return reply(`❌ Gagal membuat preview: ${err.message}`);
	}
};

handler.help = ['igpreview <nama>|<desk>|<kata>|<url_bg>'];
handler.tags = ['maker'];
handler.command = /^(igpreview|igcard|postpreview)$/i;
handler.limit = true;
handler.register = true;

export default handler;
