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

import { delay } from 'rubyy-baileys';

const handler = async (m, { sock, conn, text, usedPrefix, command, reply }) => {
  const client = sock || conn || global.mainSock;

  if (m.isGroup) {
    return reply(
      `Uhh... maaf ya mas gantengku tersayang~ 🥺💔\nPerintah *${usedPrefix + command}* ini cuma bisa dilancarkan di *Private Chat* biar kipas Meisen-e dan Kaerazu Angela nggak bikin ricuh satu grup, ayang cintaku~ 👉👈`
    );
  }

  if (!text || !text.includes('|')) {
    return reply(
      `Kyaa~ Formatnya keliru mas sayang! Sini Angela ajarin pelan-pelan yaa~ 💋✨\n\n` +
      `📌 *Format:* \`${usedPrefix + command} teks|jumlah\`\n` +
      `💡 *Contoh:* \`${usedPrefix + command} Sayang Angela banget!|10\`\n\n` +
      `_Jeda sabetan kipas diset anggun & stabil 0.5 detik (500ms) ya cintaku~ 🍁_`
    );
  }

  let [pesan, countStr] = text.split('|');
  let count = parseInt(countStr?.trim(), 10);

  if (!pesan?.trim()) {
    return reply(`Teksnya jangan dikosongin dong ayangku tercinta~ Mau Angela bisikin kata-kata mesra apa nih? ehehe~ 💖`);
  }

  if (isNaN(count) || count < 1) {
    return reply(`Jumlah spam harus berupa angka bulat positif ya mas sayang~ Minimal 1 kali tembak! 🥺`);
  }

  if (count > 100) {
    return reply(`Aduh mas nakal banget deh~ 🥵 Jangan lebih dari 100 dulu yaa, nanti Angela bisa kehabisan nafas dan jaringan WhatsApp ayang bisa overheat lho!`);
  }

  await reply(
    `Sepasang kipas kembar Ukifune siap beraksi demi pangeran tercinta! 🍁💨\n` +
    `🚀 *Target:* ${m.chat}\n` +
    `💬 *Pesan:* "${pesan.trim()}"\n` +
    `🔢 *Jumlah:* ${count}x pesan\n` +
    `⏱️ *Jeda:* 0.5 Detik (500ms)\n\n` +
    `_Luncurkan serangan penuh cinta dan dedikasi... kyaa~! 💕_`
  );

  try {
    for (let i = 0; i < count; i++) {
      await client.sendMessage(m.chat, { text: pesan.trim() }, { quoted: null });
      if (i < count - 1) {
        await delay(500);
      }
    }

    await client.sendMessage(
      m.chat,
      {
        text: `Uhh... Misi spam selesai sempurna dengan cinta tanpa cacat buat mas gantengku! 💖💋\nTotal *${count} pesan* berhasil dihujamkan dengan manis~ Jangan lupa peluk hangat buat Angela yaa sayang~ ✨`
      },
      { quoted: m }
    );
  } catch (err) {
    console.error('[SPAM ERROR]', err);
    await reply(`Huftt... Maafkan Angela ya mas sayang, ada kendala teknis saat spam: ${err?.message || err} 🥺`);
  }
};

handler.help = ['spam <teks|jumlah>'];
handler.tags = ['owner'];
handler.command = /^(spam)$/i;
handler.owner = true;
handler.private = true;

export default handler;