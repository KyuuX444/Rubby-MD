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

import { downloadMediaMessage, readRichMessage } from 'rubyy-baileys'
import { isOwner, isPremium, normalizeJid, normalizeNumber, recordLidMapping, resolveLidToPn } from './utils.js'

export async function serialize(sock, rawMessage) {
  if (!rawMessage) return null
  const m = {}

  m.raw = rawMessage
  m.key = rawMessage.key || {}
  m.id = m.key.id
  m.fromMe = m.key.fromMe || false
  m.chat = m.key.remoteJid || ''
  m.isGroup = m.chat.endsWith('@g.us')

  let rawSender = ''
  if (m.isGroup) {
    rawSender = m.key.participantAlt || rawMessage.participantAlt || m.key.participant || (m.fromMe ? (sock.user?.id || '') : '')
  } else {
    rawSender = m.fromMe ? (sock.user?.id || '') : (m.key.remoteJidAlt || rawMessage.remoteJidAlt || m.chat)
  }

  const candidatePn = m.key.participantAlt || rawMessage.participantAlt || m.key.remoteJidAlt || rawMessage.remoteJidAlt
  if (candidatePn && candidatePn.endsWith('@s.whatsapp.net')) {
    if (m.key.participant && m.key.participant.endsWith('@lid')) {
      recordLidMapping(m.key.participant, candidatePn)
    }
    if (m.key.remoteJid && m.key.remoteJid.endsWith('@lid')) {
      recordLidMapping(m.key.remoteJid, candidatePn)
    }
    rawSender = candidatePn
  } else if (rawSender.endsWith('@lid')) {
    const resolved = resolveLidToPn(rawSender)
    if (resolved && !resolved.endsWith('@lid')) {
      rawSender = resolved
    }
  }

  const decodedSender = typeof sock.decodeJid === 'function' ? await sock.decodeJid(rawSender) : rawSender
  m.sender = decodedSender || rawSender || ''
  if (m.sender.endsWith('@lid')) {
    const resolved = resolveLidToPn(m.sender)
    if (resolved && !resolved.endsWith('@lid')) m.sender = resolved
  }
  const isJadibotOwner = Boolean(sock.isJadiBot && (m.fromMe || normalizeNumber(m.sender) === normalizeNumber(sock.user?.id)))
  m.isJadiBot = Boolean(sock.isJadiBot)
  m.isOwner = isOwner(m.sender) || (m.fromMe && isOwner(sock.user?.id)) || isJadibotOwner
  m.isPremium = isPremium(m.sender) || m.isOwner

  let msg = rawMessage.message
  if (msg) {
    while (
      msg.ephemeralMessage ||
      msg.viewOnceMessage ||
      msg.viewOnceMessageV2 ||
      msg.viewOnceMessageV2Extension ||
      msg.documentWithCaptionMessage ||
      msg.botInvokeMessage ||
      msg.botForwardedMessage
    ) {
      msg =
        msg.ephemeralMessage?.message ||
        msg.viewOnceMessage?.message ||
        msg.viewOnceMessageV2?.message ||
        msg.viewOnceMessageV2Extension?.message ||
        msg.documentWithCaptionMessage?.message ||
        msg.botInvokeMessage?.message ||
        msg.botForwardedMessage?.message ||
        msg.botForwardedMessage ||
        msg
    }

    m.message = msg
    m.type = Object.keys(msg)[0] || ''
    m.mimetype = msg[m.type]?.mimetype || ''

    let richData = null
    try {
      richData = readRichMessage(rawMessage) || (rawMessage.message ? readRichMessage(rawMessage.message) : null) || readRichMessage(msg)
    } catch {}
    m.rich = richData

    let text = ''
    if (msg.conversation) {
      text = msg.conversation
    } else if (msg.extendedTextMessage?.text) {
      text = msg.extendedTextMessage.text
    } else if (msg.imageMessage?.caption) {
      text = msg.imageMessage.caption
    } else if (msg.videoMessage?.caption) {
      text = msg.videoMessage.caption
    } else if (msg.documentMessage?.caption) {
      text = msg.documentMessage.caption
    } else if (msg.buttonsResponseMessage?.selectedButtonId) {
      text = msg.buttonsResponseMessage.selectedButtonId
    } else if (msg.buttonsResponseMessage?.selectedDisplayText) {
      text = msg.buttonsResponseMessage.selectedDisplayText
    } else if (msg.templateButtonReplyMessage?.selectedId) {
      text = msg.templateButtonReplyMessage.selectedId
    } else if (msg.templateButtonReplyMessage?.selectedDisplayText) {
      text = msg.templateButtonReplyMessage.selectedDisplayText
    } else if (msg.listResponseMessage?.singleSelectReply?.selectedRowId) {
      text = msg.listResponseMessage.singleSelectReply.selectedRowId
    } else if (msg.listResponseMessage?.title) {
      text = msg.listResponseMessage.title
    } else if (msg.interactiveResponseMessage) {
      const nativeFlow = msg.interactiveResponseMessage.nativeFlowResponseMessage
      if (nativeFlow?.paramsJson) {
        try {
          const parsed = JSON.parse(nativeFlow.paramsJson)
          text = parsed.id || parsed.selectedId || parsed.rowId || parsed.title || nativeFlow.paramsJson
        } catch {
          text = nativeFlow.paramsJson
        }
      }
      if (!text && msg.interactiveResponseMessage.body?.text) {
        text = msg.interactiveResponseMessage.body.text
      }
    }

    if (!text && richData?.text) {
      text = richData.text
    }

    if (!text && msg[m.type]) {
      const target = msg[m.type]
      text =
        target.text ||
        target.caption ||
        target.selectedId ||
        target.selectedButtonId ||
        target.singleSelectReply?.selectedRowId ||
        target.selectedDisplayText ||
        target.title ||
        target.description ||
        ''
    }

    m.text = text

    const contextInfo = msg[m.type]?.contextInfo
    if (contextInfo && contextInfo.quotedMessage) {
      let qMsg = contextInfo.quotedMessage
      while (
        qMsg.ephemeralMessage ||
        qMsg.viewOnceMessage ||
        qMsg.viewOnceMessageV2 ||
        qMsg.viewOnceMessageV2Extension ||
        qMsg.documentWithCaptionMessage ||
        qMsg.botInvokeMessage ||
        qMsg.botForwardedMessage
      ) {
        qMsg =
          qMsg.ephemeralMessage?.message ||
          qMsg.viewOnceMessage?.message ||
          qMsg.viewOnceMessageV2?.message ||
          qMsg.viewOnceMessageV2Extension?.message ||
          qMsg.documentWithCaptionMessage?.message ||
          qMsg.botInvokeMessage?.message ||
          qMsg.botForwardedMessage?.message ||
          qMsg.botForwardedMessage ||
          qMsg
      }

      const qType = Object.keys(qMsg)[0] || ''
      let rawQSender = contextInfo.participantAlt || contextInfo.participant || ''
      if (contextInfo.participant && contextInfo.participantAlt && contextInfo.participantAlt.endsWith('@s.whatsapp.net')) {
        recordLidMapping(contextInfo.participant, contextInfo.participantAlt)
        rawQSender = contextInfo.participantAlt
      } else if (rawQSender.endsWith('@lid')) {
        const resolved = resolveLidToPn(rawQSender)
        if (resolved && !resolved.endsWith('@lid')) {
          rawQSender = resolved
        }
      }
      const decodedQSender = typeof sock.decodeJid === 'function' ? await sock.decodeJid(rawQSender) : rawQSender
      let qSender = decodedQSender || rawQSender || ''
      if (qSender.endsWith('@lid')) {
        const resolved = resolveLidToPn(qSender)
        if (resolved && !resolved.endsWith('@lid')) qSender = resolved
      }

      const decodedMentioned = await Promise.all(
        (contextInfo.mentionedJid || []).map(async j => {
          let resolved = j
          if (typeof sock.decodeJid === 'function') resolved = (await sock.decodeJid(j)) || j
          if (resolved.endsWith('@lid')) {
            const mapped = resolveLidToPn(resolved)
            if (mapped && !mapped.endsWith('@lid')) resolved = mapped
          }
          return resolved
        })
      )

      let qRichData = null
      try {
        qRichData = readRichMessage(contextInfo.quotedMessage) || readRichMessage(qMsg)
      } catch {}

      m.quoted = {
        key: {
          remoteJid: m.chat,
          fromMe: normalizeNumber(qSender) === normalizeNumber(sock.user?.id || ''),
          id: contextInfo.stanzaId,
          participant: contextInfo.participant
        },
        sender: qSender,
        fromMe: normalizeNumber(qSender) === normalizeNumber(sock.user?.id || ''),
        isOwner: isOwner(qSender),
        type: qType,
        mimetype: qMsg[qType]?.mimetype || '',
        caption: qMsg[qType]?.caption || '',
        message: qMsg,
        rich: qRichData,
        text:
          qMsg.conversation ||
          qMsg[qType]?.text ||
          qMsg[qType]?.caption ||
          qMsg[qType]?.description ||
          qRichData?.text ||
          '',
        mentionedJid: decodedMentioned,
        download: async () => downloadMediaMessage({ key: { remoteJid: m.chat, id: contextInfo.stanzaId, participant: contextInfo.participant }, message: qMsg }, 'buffer', {})
      }
    } else {
      m.quoted = null
    }

    m.mentionedJid = await Promise.all(
      (contextInfo?.mentionedJid || []).map(async j => {
        let resolved = j
        if (typeof sock.decodeJid === 'function') resolved = (await sock.decodeJid(j)) || j
        if (resolved.endsWith('@lid')) {
          const mapped = resolveLidToPn(resolved)
          if (mapped && !mapped.endsWith('@lid')) resolved = mapped
        }
        return resolved
      })
    )
  } else {
    m.message = null
    m.type = ''
    m.mimetype = ''
    m.text = ''
    m.quoted = null
    m.mentionedJid = []
  }

  m.download = async () => downloadMediaMessage(rawMessage, 'buffer', {})

  m.reply = async (text, options = {}) => {
    const quoted = options.quoted || (typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : rawMessage)
    return await sock.sendMessage(
      m.chat,
      {
        text: typeof text === 'string' ? text : String(text),
        ...options
      },
      {
        ...options,
        quoted
      }
    )
  }

  m.react = async (emoji) => {
    try {
      return await sock.sendMessage(m.chat, {
        react: {
          text: emoji,
          key: m.key
        }
      })
    } catch {}
  }

  m.fstatus = typeof sock.getFakeQuoted === 'function' ? sock.getFakeQuoted() : null

  return m
}

export default serialize
