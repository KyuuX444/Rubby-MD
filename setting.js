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

global.botName = 'Rubby Multi Device'
global.owner = ['628xxxxxxxxxx'] // Ganti dengan nomor WhatsApp owner Anda (contoh: 6281234567890)
global.mode = 'public' // 'public' atau 'self'
global.noBot = '628xxxxxxxxxx' // Nomor WhatsApp bot untuk pairing code
global.customPairingCode = 'RUBBYMD1'
global.botVersion = '1.5.0'
global.botCreator = 'Kyuu'
global.packname = 'Rubby Multi Device'
global.author = 'Kyuu'
global.thumb = 'media/thumb.jpg'
global.website = 'https://api.kyzzz.xyz'

global.mess = {
  wait: '⏳ Sedang diproses...',
  error: '❌ Terjadi kesalahan!'
}

global.APIs = {
  kyzz: 'https://api.kyzzz.xyz'
}

global.APIKeys = {
  'https://api.kyzzz.xyz': 'YOUR-APIKEY' // Daftar dan dapatkan apikey gratis di https://api.kyzzz.xyz
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => {
  const baseUrl = name in global.APIs ? global.APIs[name] : name
  const q = { ...query }
  if (apikeyqueryname) {
    const key = global.APIKeys[baseUrl] || global.APIKeys[name]
    if (key) q[apikeyqueryname] = key
  }
  const search = new URLSearchParams(q).toString()
  return baseUrl + path + (search ? '?' + search : '')
}

global.api = {
  enabled: process.env.API_ENABLED !== 'false',
  port: parseInt(process.env.PORT || '3005', 10),
  key: process.env.RUBBY_API_KEY || 'rubby-secret-key-2026',
  rateLimit: 60 // Max 60 request per menit per IP
}

global.ssms = {
  enabled: true
}

global.settings = {
  api: global.api,
  ssms: global.ssms,
  registration: {
    enabled: true,
    startingLimit: 25,
    startingBalance: 10000,
    startingExp: 100,
    requireRegistrationForEconomy: true
  },
  limit: {
    enabled: true,
    dailyBonus: 15,
    dailyResetTimezone: 'Asia/Jakarta',
    maxFreeLimit: 100
  },
  economy: {
    enabled: true,
    currency: 'Rp',
    transferTaxRate: 0.05, // 5% transfer fee
    dailyCooldown: 86400000, // 24 hours
    workCooldown: 300000, // 5 minutes
    begCooldown: 120000 // 2 minutes
  },
  shop: {
    enabled: true,
    limitPackages: [
      { id: '1', amount: 5, price: 5000, name: 'Paket Mini (+5 Limit)' },
      { id: '2', amount: 15, price: 14000, name: 'Paket Sedang (+15 Limit)' },
      { id: '3', amount: 35, price: 30000, name: 'Paket Jumbo (+35 Limit)' },
      { id: '4', amount: 100, price: 80000, name: 'Paket Sultan (+100 Limit)' }
    ]
  },
  rpg: {
    enabled: true,
    huntCooldown: 180000, // 3 minutes
    adventureCooldown: 600000, // 10 minutes
    dungeonCooldown: 1800000, // 30 minutes
    bossCooldown: 3600000, // 1 hour
    healCooldown: 60000, // 1 minute
    healPotionCost: 1000,
    staminaPotionCost: 1500
  }
}

