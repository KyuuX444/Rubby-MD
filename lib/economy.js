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
┇        ♡ DEVELOPER INFO ♡
┇  ──────── ୨୧ ────────
┇   ↳ Creator  : Kyuu
┇   ↳ GitHub   : github.com/KyuuX444
┇   ↳ YouTube  : MommyKyuu
┇   ↳ Website  : https://api.kyzzz.xyz
┇
┇  ════════ ◇ ════════
┇        📡 ECONOMY ENGINE
┇  ════════ ◇ ════════
┇   ↳ Integrated Centralized Economy, Daily & Limit Shop
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import databaseApi from './database.js'
import logger from './logger.js'
import { normalizeNumber } from './utils.js'

export function formatCurrency(amount) {
  const currency = global.settings?.economy?.currency || 'Rp'
  const num = Math.max(0, parseInt(amount, 10) || 0)
  return `${currency} ${num.toLocaleString('id-ID')}`
}

export function formatDuration(ms) {
  if (ms <= 0) return '0 detik'
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (hours > 0) parts.push(`${hours} jam`)
  if (minutes > 0) parts.push(`${minutes} menit`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} detik`)
  return parts.join(' ')
}

export function getCleanNumber(jidOrNumber) {
  return normalizeNumber(jidOrNumber) || String(jidOrNumber || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
}

export const WORK_JOBS = [
  { title: 'Fullstack Developer', tasks: ['memperbaiki bug production', 'deploy fitur microservice', 'refactor API backend'], minPay: 4000, maxPay: 8500, minExp: 50, maxExp: 100 },
  { title: 'Desainer UI/UX', tasks: ['membuat wireframe landing page', 'merancang mockup aplikasi', 'mendesain icon set baru'], minPay: 3500, maxPay: 7000, minExp: 40, maxExp: 80 },
  { title: 'Kurir Kilat', tasks: ['mengantar 15 paket express', 'mengirim pesanan makanan kilat', 'mengantar dokumen penting antar kota'], minPay: 3000, maxPay: 6000, minExp: 30, maxExp: 70 },
  { title: 'Barista Aesthetic', tasks: ['meracik kopi pour-over single origin', 'membuat latte art kucing', 'melayani pelanggan kafe'], minPay: 2800, maxPay: 5500, minExp: 30, maxExp: 60 },
  { title: 'Driver Online', tasks: ['mengantar 8 penumpang di jam sibuk', 'menerima orderan ekspres lintas distrik', 'selesai 5 orderan bintang 5 berturut-turut'], minPay: 3500, maxPay: 7500, minExp: 35, maxExp: 75 },
  { title: 'Konten Kreator', tasks: ['membuat video edukasi coding viral', 'live streaming review gadget', 'membuat short tutorial aesthetic'], minPay: 4500, maxPay: 9500, minExp: 60, maxExp: 120 },
  { title: 'Pedagang Kuliner', tasks: ['menjual 40 porsi nasi goreng lezat', 'membuat dimsum kukus hangat', 'menyajikan es matcha latte laku keras'], minPay: 3000, maxPay: 6500, minExp: 35, maxExp: 70 }
]

export const BEG_SCENARIOS = [
  { success: true, text: 'Seorang sultan yang lewat dengan mobil sport memberimu uang jajan!', minPay: 1500, maxPay: 3000 },
  { success: true, text: 'Kakek baik hati memberimu sedikit uang kembalian belanja.', minPay: 800, maxPay: 2000 },
  { success: true, text: 'Kamu menemukan dompet jatuh, kamu kembalikan dan pemiliknya memberimu imbalan!', minPay: 2000, maxPay: 4000 },
  { success: true, text: 'Seseorang kasihan melihatmu duduk lesu di pinggir jalan lalu memberi sedekah.', minPay: 500, maxPay: 1800 },
  { success: false, text: 'Satpam komplek mengejarmu karena dikira mencurigakan! Kamu tidak dapat apa-apa.', minPay: 0, maxPay: 0 },
  { success: false, text: 'Orang yang kamu mintai uang malah minta uang balik padamu!', minPay: 0, maxPay: 0 }
]

export const Economy = {
  claimDaily(userId) {
    const num = getCleanNumber(userId)
    if (!num) return { success: false, reason: 'invalid_user' }

    const user = databaseApi.getUser(num)
    if (!user) return { success: false, reason: 'user_not_found' }

    const now = Date.now()
    const cooldown = global.settings?.economy?.dailyCooldown ?? 86400000
    const lastDaily = user.last_daily || 0
    const elapsed = now - lastDaily

    if (elapsed < cooldown) {
      return {
        success: false,
        reason: 'cooldown',
        remainingMs: cooldown - elapsed,
        lastDaily
      }
    }

    // Streak logic: within 48h continues streak, otherwise resets to 1
    let streak = (user.daily_streak || 0)
    if (elapsed <= cooldown * 2) {
      streak += 1
    } else {
      streak = 1
    }

    const dailyLimit = global.settings?.limit?.dailyBonus ?? 15
    const baseMoney = 5000
    const streakBonusMoney = Math.min(streak, 7) * 1000
    const totalMoney = baseMoney + streakBonusMoney
    const expBonus = 100 + (Math.min(streak, 7) * 25)

    return databaseApi.withTransaction(() => {
      databaseApi.addLimit(num, dailyLimit, `Klaim Daily (Streak: Hari ke-${streak})`)
      databaseApi.addBalance(num, totalMoney, `Klaim Daily (Streak: Hari ke-${streak})`)

      const curExp = (user.exp || 0) + expBonus
      databaseApi.updateUser(num, {
        last_daily: now,
        daily_streak: streak,
        exp: curExp
      })

      // Quest and achievement hooks
      databaseApi.updateQuestProgress(num, 'daily_claim', 1, 1)
      if (streak >= 7) {
        databaseApi.unlockAchievement(num, 'streak_7_days')
      }

      const updated = databaseApi.getUser(num)
      return {
        success: true,
        limitReward: dailyLimit,
        moneyReward: totalMoney,
        expReward: expBonus,
        streak,
        newBalance: updated.balance,
        newLimit: updated.limit_count
      }
    })
  },

  work(userId) {
    const num = getCleanNumber(userId)
    if (!num) return { success: false, reason: 'invalid_user' }

    const user = databaseApi.getUser(num)
    if (!user) return { success: false, reason: 'user_not_found' }

    const now = Date.now()
    const cooldown = global.settings?.economy?.workCooldown ?? 300000
    const lastWork = user.last_work || 0
    const elapsed = now - lastWork

    if (elapsed < cooldown) {
      return {
        success: false,
        reason: 'cooldown',
        remainingMs: cooldown - elapsed
      }
    }

    const job = WORK_JOBS[Math.floor(Math.random() * WORK_JOBS.length)]
    const task = job.tasks[Math.floor(Math.random() * job.tasks.length)]
    const pay = Math.floor(Math.random() * (job.maxPay - job.minPay + 1)) + job.minPay
    const expGain = Math.floor(Math.random() * (job.maxExp - job.minExp + 1)) + job.minExp

    return databaseApi.withTransaction(() => {
      databaseApi.addBalance(num, pay, `Bekerja sebagai ${job.title}: ${task}`)
      const curExp = (user.exp || 0) + expGain
      databaseApi.updateUser(num, {
        last_work: now,
        exp: curExp
      })

      databaseApi.updateQuestProgress(num, 'work_times', 1, 3)

      const updated = databaseApi.getUser(num)
      return {
        success: true,
        job: job.title,
        task,
        pay,
        expGain,
        newBalance: updated.balance
      }
    })
  },

  beg(userId) {
    const num = getCleanNumber(userId)
    if (!num) return { success: false, reason: 'invalid_user' }

    const user = databaseApi.getUser(num)
    if (!user) return { success: false, reason: 'user_not_found' }

    const now = Date.now()
    const cooldown = global.settings?.economy?.begCooldown ?? 120000
    const lastBeg = user.last_beg || 0
    const elapsed = now - lastBeg

    if (elapsed < cooldown) {
      return {
        success: false,
        reason: 'cooldown',
        remainingMs: cooldown - elapsed
      }
    }

    const scenario = BEG_SCENARIOS[Math.floor(Math.random() * BEG_SCENARIOS.length)]
    let moneyGain = 0
    if (scenario.success) {
      moneyGain = Math.floor(Math.random() * (scenario.maxPay - scenario.minPay + 1)) + scenario.minPay
    }

    return databaseApi.withTransaction(() => {
      if (moneyGain > 0) {
        databaseApi.addBalance(num, moneyGain, `Minta Uang / Beg: ${scenario.text}`)
      }
      databaseApi.updateUser(num, { last_beg: now })

      const updated = databaseApi.getUser(num)
      return {
        success: true,
        isGotMoney: scenario.success && moneyGain > 0,
        story: scenario.text,
        moneyGain,
        newBalance: updated.balance
      }
    })
  },

  buyLimit(userId, packageId) {
    const num = getCleanNumber(userId)
    if (!num) return { success: false, reason: 'invalid_user' }

    const packages = global.settings?.shop?.limitPackages || []
    const pkg = packages.find(p => String(p.id) === String(packageId))
    if (!pkg) {
      return { success: false, reason: 'package_not_found', availablePackages: packages }
    }

    const user = databaseApi.getUser(num)
    if (!user) return { success: false, reason: 'user_not_found' }
    if ((user.balance || 0) < pkg.price) {
      return {
        success: false,
        reason: 'insufficient_balance',
        currentBalance: user.balance || 0,
        requiredPrice: pkg.price,
        pkg
      }
    }

    return databaseApi.withTransaction(() => {
      const deductRes = databaseApi.deductBalance(num, pkg.price, `Beli Limit: ${pkg.name}`)
      if (!deductRes.success) return deductRes

      const newLimit = databaseApi.addLimit(num, pkg.amount, `Hasil Pembelian Limit: ${pkg.name}`)
      databaseApi.updateQuestProgress(num, 'buy_limit', 1, 1)

      const updated = databaseApi.getUser(num)
      return {
        success: true,
        pkg,
        newLimit,
        newBalance: updated.balance
      }
    })
  },

  transfer(senderId, recipientId, amount) {
    const taxRate = global.settings?.economy?.transferTaxRate ?? 0.05
    return databaseApi.transferBalance(senderId, recipientId, amount, taxRate, 'Transfer Saldo')
  }
}

export default Economy
