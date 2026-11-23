import { getFamily, saveFamily } from '../../lib/family.js'
import { getCleanNumber } from '../../lib/economy.js'
import { resolveLidToPn, normalizeNumber } from '../../lib/utils.js'

let handler = async (m, { text, usedPrefix, command }) => {
  const senderFam = getFamily(m.sender)
  if (!senderFam) return m.reply('❌ Akun kamu belum terdaftar. Ketik *.daftar <nama>* terlebih dahulu!')

  if (senderFam.family.partner) {
    return m.reply(`❌ Kamu sudah menikah dengan @${senderFam.family.partner}! Selesaikan hubungan dulu jika ingin mencari yang lain.`, {
      mentions: [`${senderFam.family.partner}@s.whatsapp.net`]
    })
  }

  let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : text)
  if (!target) {
    return m.reply(`Tag atau reply orang yang ingin kamu lamar!\n\nContoh:\n*${usedPrefix + command} @user*`)
  }

  target = resolveLidToPn(target)
  const targetNum = normalizeNumber(target)
  if (!targetNum || targetNum === senderFam.num) {
    return m.reply('❌ Kamu tidak bisa melamar diri sendiri!')
  }

  const targetFam = getFamily(targetNum)
  if (!targetFam) {
    return m.reply('❌ Target belum terdaftar di bot. Ajak dia untuk ketik *.daftar <nama>*!')
  }

  if (targetFam.family.partner) {
    return m.reply(`❌ Yah terlambat, @${targetNum} sudah menikah dengan orang lain!`, {
      mentions: [target]
    })
  }

  targetFam.family.proposalFrom = senderFam.num
  saveFamily(targetFam)

  const textMsg = [
    '╭─── ୨୧ LAMARAN PERNIKAHAN ୨୧ ───╮',
    '│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა surat cinta romantis!',
    '╰───────────────────────────────╯',
    '',
    `Wahai @${targetNum}, kamu baru saja dilamar oleh @${senderFam.num} untuk membina rumah tangga bersama! 💍✨`,
    '',
    '• Ketik *.terimalamar* untuk menerima lamaran ini.',
    '• Ketik *.tolaklamar* untuk menolak secara halus.',
    '',
    '──────── ୨୧ ────────',
    `© ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return await m.reply(textMsg, {
    mentions: [target, `${senderFam.num}@s.whatsapp.net`]
  })
}

handler.help = ['lamar @user']
handler.tags = ['rpg']
handler.category = 'rpg'
handler.command = ['lamar', 'propose']

export default handler
