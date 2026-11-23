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

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { databaseApi } from './database.js'

global.lidToPnMap = global.lidToPnMap || new Map()
global.pnToLidMap = global.pnToLidMap || new Map()

export function recordLidMapping(lid, pn) {
  if (!lid || !pn) return
  const cleanLid = String(lid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '') + '@lid'
  const cleanPn = String(pn).split('@')[0].split(':')[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  global.lidToPnMap.set(cleanLid, cleanPn)
  global.pnToLidMap.set(cleanPn, cleanLid)
}

export function resolveLidToPn(jid) {
  if (!jid || typeof jid !== 'string') return ''
  if (!jid.endsWith('@lid')) return jid
  const clean = jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '') + '@lid'
  if (global.lidToPnMap.has(clean)) {
    return global.lidToPnMap.get(clean)
  }
  return jid
}

export function normalizeNumber(jid) {
  if (!jid || typeof jid !== 'string') return ''
  if (jid.endsWith('@lid')) {
    const resolved = resolveLidToPn(jid)
    if (resolved && !resolved.endsWith('@lid')) {
      return resolved.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
    }
  }
  return jid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
}

export function normalizeJid(jid) {
  if (!jid || typeof jid !== 'string') return ''
  if (jid.endsWith('@lid')) {
    const resolved = resolveLidToPn(jid)
    if (resolved && !resolved.endsWith('@lid')) {
      return resolved
    }
  }
  const num = normalizeNumber(jid)
  return num ? `${num}@s.whatsapp.net` : ''
}

export function isOwner(senderJid) {
  if (!senderJid) return false
  const senderNumber = normalizeNumber(senderJid)
  const owners = (global.owner || []).map(o => normalizeNumber(o))
  return owners.includes(senderNumber)
}

export function getPremiumUsers() {
  if (global.db?.getPremiumUsers) {
    return global.db.getPremiumUsers()
  }
  return databaseApi.getPremiumUsers()
}

export function savePremiumUsers(users) {
  if (!Array.isArray(users)) return false
  const current = getPremiumUsers()
  const dbInst = global.db || databaseApi
  for (const u of current) {
    if (!users.includes(u)) {
      dbInst.delPremium(u)
    }
  }
  for (const u of users) {
    dbInst.addPremium(u)
  }
  return true
}

export function isPremium(senderJid) {
  if (!senderJid) return false
  if (isOwner(senderJid)) return true
  const senderNumber = normalizeNumber(senderJid)
  if (global.db?.isPremium) {
    return global.db.isPremium(senderNumber)
  }
  return databaseApi.isPremium(senderNumber)
}

export function formatRuntime(ms) {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  const h = hours < 10 ? '0' + hours : hours
  const m = minutes < 10 ? '0' + minutes : minutes
  const s = seconds < 10 ? '0' + seconds : seconds

  return `${h}:${m}:${s}`
}

/**
 * Calculate Damerau-Levenshtein distance between two strings (handles insertions, deletions, substitutions, and transpositions)
 */
export function levenshteinDistance(s1, s2) {
  if (typeof s1 !== 'string' || typeof s2 !== 'string') return Infinity
  const a = s1.toLowerCase()
  const b = s2.toLowerCase()
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const d = []
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i]
  }
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      )
      // Damerau transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }

  return d[a.length][b.length]
}

/**
 * Calculate similarity score between 0 and 1
 */
export function stringSimilarity(s1, s2) {
  if (typeof s1 !== 'string' || typeof s2 !== 'string') return 0
  const a = s1.toLowerCase()
  const b = s2.toLowerCase()
  if (a === b) return 1
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  const dist = levenshteinDistance(a, b)
  return Math.max(0, (maxLen - dist) / maxLen)
}

/**
 * Check if string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(input) {
  if (!input || typeof input !== 'string') return false
  try {
    const parsed = new URL(input.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * SSRF guard: Check if URL points to safe public destinations
 */
export function isSafeUrl(input) {
  if (!isValidUrl(input)) return false
  try {
    const parsed = new URL(input.trim())
    const host = parsed.hostname.toLowerCase()

    // Disallow localhost and common private names
    if (host === 'localhost' || host === 'ip6-localhost' || host.endsWith('.local') || host.endsWith('.internal')) {
      return false
    }

    // IP address checks
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    const match = host.match(ipv4Regex)
    if (match) {
      const [_, o1, o2, o3, o4] = match.map(Number)
      if (o1 === 0) return false // 0.0.0.0/8
      if (o1 === 10) return false // 10.0.0.0/8
      if (o1 === 127) return false // 127.0.0.0/8 loopback
      if (o1 === 169 && o2 === 254) return false // 169.254.0.0/16 link-local/cloud metadata
      if (o1 === 172 && o2 >= 16 && o2 <= 31) return false // 172.16.0.0/12
      if (o1 === 192 && o2 === 168) return false // 192.168.0.0/16
      if (o1 >= 224) return false // multicast / reserved
    }

    // IPv6 checks
    if (host === '::1' || host === '::' || host.startsWith('fc00:') || host.startsWith('fd00:') || host.startsWith('fe80:')) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Prevent path traversal vulnerabilities by enforcing boundaries
 */
export function safePath(baseDir, userInput) {
  if (!baseDir || !userInput || typeof userInput !== 'string') return null
  const resolvedBase = path.resolve(baseDir)
  const resolvedTarget = path.resolve(resolvedBase, userInput)
  if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
    return null
  }
  return resolvedTarget
}

