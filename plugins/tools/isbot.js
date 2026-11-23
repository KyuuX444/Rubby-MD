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

import { getDevice } from 'rubyy-baileys';
import { isBotMessage } from '../../src/lib/detectbot.js';
import { getActiveThumbBuffer } from '../../src/lib/thumb.js';

const parseDeviceDetailed = (msgId, isBot) => {
	const raw = getDevice(msgId) || 'unknown';
	if (isBot) return 'WhatsApp Bot (Baileys / Multi-Device)';
	switch (raw.toLowerCase()) {
		case 'android':
			return 'Android (Official WhatsApp)';
		case 'ios':
			return 'iOS / iPhone (Official WhatsApp)';
		case 'web':
			return 'WhatsApp Web (Browser)';
		case 'desktop':
			return 'WhatsApp Desktop (Windows / Mac)';
		default:
			return raw.charAt(0).toUpperCase() + raw.slice(1);
	}
};

const handler = async (m, { sock, conn, reply }) => {
	const client = sock || conn || global.mainSock;
	const targetMsg = m.quoted ? m.quoted : m;
	const targetSender = targetMsg.sender || targetMsg.key?.participant || (targetMsg.key?.fromMe ? (client.decodeJid ? client.decodeJid(client.user?.id || '') : client.user?.id) : m.sender);
	const targetNumber = (targetSender || '').replace(/[^0-9]/g, '');

	const analysis = isBotMessage(targetMsg, client);
	const detailedDevice = parseDeviceDetailed(analysis.msgId, analysis.isBot);

	const status = analysis.isBot
		? `🤖 *ʙᴏᴛ* (${analysis.confidence}%)`
		: `👤 *ʜᴜᴍᴀɴ* (${100 - analysis.confidence}%)`;

	const captionText = `🤖 *ᴅᴇᴛᴇᴋsɪ ʙᴏᴛ & ᴅᴇᴠɪᴄᴇ* ✨\n\n` +
		`• 👤 *ᴛᴀʀɢᴇᴛ:* @${targetNumber}\n` +
		`• 📊 *sᴛᴀᴛᴜs:* ${status}\n` +
		`• 📱 *ᴅᴇᴠɪᴄᴇ:* ${detailedDevice}\n` +
		`• 🆔 *ᴍᴇssᴀɢᴇ ɪᴅ:* \`${analysis.msgId}\`\n` +
		`• 📑 *ᴛɪᴘᴇ ᴘᴇsᴀɴ:* \`${analysis.msgType}\``;

	const thumbBuffer = await getActiveThumbBuffer().catch(() => null);

	try {
		if (client && typeof client.sendButtons === 'function') {
			await client.sendButtons(m.chat, {
				location: {
					degreesLatitude: 0,
					degreesLongitude: 0,
					name: '🤖 Deteksi Bot & Device',
					address: `Target: @${targetNumber} • Status: ${analysis.isBot ? 'BOT' : 'HUMAN'}`,
					jpegThumbnail: thumbBuffer
				},
				text: '',
				footer: captionText,
				contextInfo: {
					mentionedJid: [targetSender]
				}
			}, {
				quoted: m,
				mentions: [targetSender]
			});
		} else {
			await client.sendMessage(m.chat, {
				location: {
					degreesLatitude: 0,
					degreesLongitude: 0,
					name: '🤖 Deteksi Bot & Device',
					address: `Target: @${targetNumber} • Status: ${analysis.isBot ? 'BOT' : 'HUMAN'}`,
					jpegThumbnail: thumbBuffer
				},
				caption: captionText,
				mentions: [targetSender],
				contextInfo: {
					mentionedJid: [targetSender]
				}
			}, { quoted: m });
		}
	} catch (e) {
		console.error('[ISBOT ERROR]', e);
		return await reply(captionText, { mentions: [targetSender] });
	}
};

handler.help = ['isbot', 'cekdevice'];
handler.tags = ['tools'];
handler.command = ['isbot', 'cekbot', 'botcheck', 'cekdevice', 'device'];
handler.category = 'tools';
handler.description = 'Cek apakah suatu akun/pesan adalah Bot atau Human beserta detail device pengirim';
handler.register = true;

handler.limit = true;

export default handler;
