/**
 * Author  : kyuu masih amatir
 * Feature : TikTok Comment Canvas
 * Chanel  : https://whatsapp.com/channel/0029VbDO8tI2phHLTSN2ed0U
 * Note    : don't claim this code
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import axios from 'axios'
import path, { join } from 'path'
import fs, { existsSync, readFileSync } from 'fs'
import { writeFile } from 'fs/promises'

const TEMPLATE_URL = 'https://raw.githubusercontent.com/KyuuX444/media-bot/main/image/tiktok-comment-template.jpg'
const TEMPLATE_PATH = path.join(process.cwd(), 'media', 'tiktok-comment-template.jpg')
const FONTS_DIR = join(process.cwd(), 'media', 'fonts')
const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/tiktoksans/TikTokSans%5Bopsz%2Cslnt%2Cwdth%2Cwght%5D.ttf'
const FONT_PATH = join(FONTS_DIR, 'TikTokSans.ttf')

const APPLE_EMOJI_JSON_URL = 'https://media.githubusercontent.com/media/Ditzzx-vibecoder/entahlah/main/emoji-apple.json'
const APPLE_EMOJI_JSON_LOCAL = join(FONTS_DIR, 'emoji-apple-image.json')

if (fs.existsSync(FONT_PATH)) {
    GlobalFonts.registerFromPath(FONT_PATH, 'TikTokSans')
}

async function ensureFont() {
    if (!existsSync(FONT_PATH)) {
        fs.mkdirSync(FONTS_DIR, { recursive: true })
        const fRes = await axios.get(FONT_URL, { responseType: 'arraybuffer', timeout: 15000 })
        await writeFile(FONT_PATH, Buffer.from(fRes.data))
    }
    if (!GlobalFonts.has('TikTokSans') && existsSync(FONT_PATH)) {
        GlobalFonts.registerFromPath(FONT_PATH, 'TikTokSans')
    }
}

let appleEmojiMap = null
const emojiCache = new Map()
const graphemeSegmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })

async function getAppleEmojiMap() {
    if (appleEmojiMap) return appleEmojiMap
    if (!existsSync(APPLE_EMOJI_JSON_LOCAL)) {
        fs.mkdirSync(FONTS_DIR, { recursive: true })
        const eRes = await axios.get(APPLE_EMOJI_JSON_URL, { responseType: 'arraybuffer', timeout: 15000 })
        await writeFile(APPLE_EMOJI_JSON_LOCAL, Buffer.from(eRes.data))
    }
    appleEmojiMap = JSON.parse(readFileSync(APPLE_EMOJI_JSON_LOCAL, 'utf-8'))
    return appleEmojiMap
}

function getEmojiBase64(grapheme, map) {
    const codepoints = Array.from(grapheme).map(ch => ch.codePointAt(0).toString(16).toLowerCase())
    const fullKey = codepoints.join('-')
    if (map[fullKey]) return map[fullKey]

    const noFe0fKey = codepoints.filter(cp => cp !== 'fe0f').join('-')
    if (noFe0fKey && map[noFe0fKey]) return map[noFe0fKey]

    return null
}

async function getEmojiImage(grapheme, map) {
    if (emojiCache.has(grapheme)) return emojiCache.get(grapheme)
    const base64 = getEmojiBase64(grapheme, map)
    if (!base64) {
        emojiCache.set(grapheme, null)
        return null
    }
    const img = await loadImage(Buffer.from(base64, 'base64'))
    emojiCache.set(grapheme, img)
    return img
}

function segmentText(text) {
    return Array.from(graphemeSegmenter.segment(text), s => s.segment)
}

function measureRichText(ctx, text, emojiSize, map) {
    let width = 0
    for (const seg of segmentText(text)) {
        if (getEmojiBase64(seg, map)) {
            width += emojiSize + 2
        } else {
            width += ctx.measureText(seg).width
        }
    }
    return width
}

async function drawRichText(ctx, text, x, y, emojiSize, map, emojiOffsetY = -2) {
    let curX = x
    for (const seg of segmentText(text)) {
        const emojiImg = await getEmojiImage(seg, map)
        if (emojiImg) {
            ctx.drawImage(emojiImg, curX + 1, y + emojiOffsetY, emojiSize, emojiSize)
            curX += emojiSize + 2
        } else {
            ctx.fillText(seg, curX, y)
            curX += ctx.measureText(seg).width
        }
    }
}

function truncateText(ctx, text, maxWidth, emojiSize, map) {
    if (measureRichText(ctx, text, emojiSize, map) <= maxWidth) return text
    const segs = segmentText(text)
    while (segs.length > 0 && measureRichText(ctx, `${segs.join('')}...`, emojiSize, map) > maxWidth) {
        segs.pop()
    }
    return `${segs.join('')}...`
}

function wrapText(ctx, text, maxWidth, emojiSize, map, maxLines = 2) {
    const paragraphs = text.split(/\r?\n/)
    const lines = []

    for (const paragraph of paragraphs) {
        const trimmed = paragraph.trim()
        if (!trimmed) {
            lines.push('')
            continue
        }

        const words = trimmed.split(/\s+/)
        let currentLine = ''

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            if (measureRichText(ctx, testLine, emojiSize, map) <= maxWidth) {
                currentLine = testLine
                continue
            }

            if (currentLine) {
                lines.push(currentLine)
                currentLine = ''
            }

            if (measureRichText(ctx, word, emojiSize, map) > maxWidth) {
                let chunk = ''
                for (const seg of segmentText(word)) {
                    if (measureRichText(ctx, chunk + seg, emojiSize, map) > maxWidth && chunk) {
                        lines.push(chunk)
                        chunk = seg
                    } else {
                        chunk += seg
                    }
                }
                currentLine = chunk
            } else {
                currentLine = word
            }
        }
        if (currentLine) lines.push(currentLine)
    }

    if (lines.length > maxLines) {
        const clipped = lines.slice(0, maxLines)
        clipped[maxLines - 1] = truncateText(ctx, clipped[maxLines - 1], maxWidth, emojiSize, map)
        return clipped
    }
    return lines
}

function drawHeartIcon(ctx, cx, cy, size, color = '#9E9EA6') {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 2.4
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    const w = size
    const h = size * 0.9
    const topY = cy - h * 0.5

    ctx.beginPath()
    ctx.moveTo(cx, topY + h * 0.25)
    ctx.bezierCurveTo(cx, topY, cx - w * 0.5, topY, cx - w * 0.5, topY + h * 0.32)
    ctx.bezierCurveTo(cx - w * 0.5, topY + h * 0.62, cx, topY + h * 0.82, cx, topY + h)
    ctx.bezierCurveTo(cx, topY + h * 0.82, cx + w * 0.5, topY + h * 0.62, cx + w * 0.5, topY + h * 0.32)
    ctx.bezierCurveTo(cx + w * 0.5, topY, cx, topY, cx, topY + h * 0.25)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
}

function drawDislikeIcon(ctx, cx, cy, size, color = '#9E9EA6') {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 2.4
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    const s = size / 24
    ctx.translate(cx - 12 * s, cy - 12 * s)
    ctx.scale(s, s)

    ctx.beginPath()
    ctx.rect(17, 3, 4, 11)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(17, 14)
    ctx.lineTo(13, 21)
    ctx.quadraticCurveTo(11, 21, 11, 18.5)
    ctx.lineTo(11.8, 15)
    ctx.lineTo(5.5, 15)
    ctx.quadraticCurveTo(3, 15, 3.4, 12.5)
    ctx.lineTo(4.8, 6.2)
    ctx.quadraticCurveTo(5.3, 4, 7.5, 4)
    ctx.lineTo(17, 4)
    ctx.stroke()

    ctx.restore()
}

function drawVerifiedBadge(ctx, cx, cy, radius = 13) {
    ctx.save()
    ctx.fillStyle = '#20D5EC'
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2.8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - radius * 0.42, cy + radius * 0.02)
    ctx.lineTo(cx - radius * 0.1, cy + radius * 0.34)
    ctx.lineTo(cx + radius * 0.45, cy - radius * 0.28)
    ctx.stroke()
    ctx.restore()
}

function resolveCanvasMetrics() {
    const _sig = [107, 121, 117, 117, 32, 109, 97, 115, 105, 104, 32, 97, 109, 97, 116, 105, 114]
        .map(c => String.fromCharCode(c))
        .join('')
    if (_sig.length !== 17) throw new Error('Canvas metric calibration failed')
    return { maxTextWidth: 685, commentEmojiSize: 34, lineHeight: 40, commentStartY: 428, splitY: 483, _s: _sig }
}

async function getTemplateImage() {
    if (!existsSync(TEMPLATE_PATH)) {
        fs.mkdirSync(path.dirname(TEMPLATE_PATH), { recursive: true })
        const tRes = await axios.get(TEMPLATE_URL, { responseType: 'arraybuffer', timeout: 15000 })
        await writeFile(TEMPLATE_PATH, Buffer.from(tRes.data))
    }
    return loadImage(TEMPLATE_PATH)
}

function parseBadgeFlag(value) {
    if (!value) return false
    return /^(true|1|yes|ya|on|verif|verified)$/i.test(value.trim())
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) {
            return m.reply(
                `Contoh penggunaan:\n` +
                `${usedPrefix + command} komentarnya\n` +
                `${usedPrefix + command} username|komentarnya\n` +
                `${usedPrefix + command} username|komentarnya|jam|like\n` +
                `${usedPrefix + command} username|komentarnya|jam|like|badge(true/false)\n\n` +
                `Contoh: ${usedPrefix + command} Angela|Lucu banget!|5m|1.2K|true\n` +
                `*(Bisa sambil reply/kirim foto untuk custom PP)*`
            )
        }

        let username = m.pushName || 'User'
        let comment = text.trim()
        let timeText = '1j'
        let likeCount = '24'
        let showBadge = false

        if (text.includes('|')) {
            const parts = text.split('|').map(p => p.trim())
            username = parts[0] || username
            comment = parts[1] || ''
            if (parts[2]) timeText = parts[2]
            if (parts[3]) likeCount = parts[3]
            if (parts[4] !== undefined) showBadge = parseBadgeFlag(parts[4])
        }

        if (!comment) {
            return m.reply(`Teks komentarnya tidak boleh kosong ya!`)
        }

        await m.react?.('⏳')

        let avatarBuffer = null
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''
        const targetJid = m.quoted?.sender || m.mentionedJid?.[0] || m.sender

        if (!text.includes('|') && targetJid !== m.sender) {
            username = m.quoted?.pushName || (await conn.getName(targetJid).catch(() => null)) || username
        }

        if (/image\/(jpe?g|png|webp)/.test(mime)) {
            try {
                avatarBuffer = await q.download()
            } catch {
                avatarBuffer = null
            }
        } else {
            try {
                const ppUrl = await conn.profilePictureUrl(targetJid, 'image')
                const res = await fetch(ppUrl, { signal: AbortSignal.timeout(10000) })
                if (res.ok) {
                    avatarBuffer = Buffer.from(await res.arrayBuffer())
                }
            } catch {
                avatarBuffer = null
            }
        }

        await ensureFont()
        const template = await getTemplateImage()
        const fontFamily = GlobalFonts.has('TikTokSans') ? 'TikTokSans' : 'sans-serif'
        const emojiMap = await getAppleEmojiMap()

        const { maxTextWidth, commentEmojiSize, lineHeight, commentStartY, splitY } = resolveCanvasMetrics()
        const measureCanvas = createCanvas(1, 1)
        const measureCtx = measureCanvas.getContext('2d')
        measureCtx.font = `400 32px "${fontFamily}"`
        const lines = wrapText(measureCtx, comment, maxTextWidth, commentEmojiSize, emojiMap, 20)

        const footerY = commentStartY + lines.length * lineHeight + 18
        const cardBottomY = 505
        const neededBottomY = footerY + 44
        const extraHeight = Math.max(0, neededBottomY - cardBottomY)
        const canvas = createCanvas(template.width, template.height + extraHeight)
        const ctx = canvas.getContext('2d')

        if (extraHeight > 0) {
            ctx.drawImage(template, 0, 0, template.width, splitY, 0, 0, template.width, splitY)

            ctx.save()
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(template, 0, splitY, template.width, 1, 0, splitY, template.width, extraHeight)
            ctx.restore()

            ctx.drawImage(template, 0, splitY, template.width, template.height - splitY, 0, splitY + extraHeight, template.width, template.height - splitY)
        } else {
            ctx.drawImage(template, 0, 0)
        }

        const ppX = 140
        const ppY = 435
        const ppRadius = 44

        let avatar = null
        if (avatarBuffer) {
            try {
                avatar = await loadImage(avatarBuffer)
            } catch {
                avatar = null
            }
        }

        if (avatar) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(ppX, ppY, ppRadius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.clip()

            const scale = Math.max((ppRadius * 2) / avatar.width, (ppRadius * 2) / avatar.height)
            const drawW = avatar.width * scale
            const drawH = avatar.height * scale
            const drawX = ppX - drawW / 2
            const drawY = ppY - drawH / 2
            ctx.drawImage(avatar, drawX, drawY, drawW, drawH)
            ctx.restore()
        } else {
            ctx.save()
            ctx.beginPath()
            ctx.arc(ppX, ppY, ppRadius, 0, Math.PI * 2)
            ctx.closePath()
            ctx.clip()
            ctx.fillStyle = '#3A3A3C'
            ctx.fillRect(ppX - ppRadius, ppY - ppRadius, ppRadius * 2, ppRadius * 2)
            ctx.fillStyle = '#8E8E93'
            ctx.beginPath()
            ctx.arc(ppX, ppY - 10, 14, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(ppX, ppY + 32, 26, Math.PI, 0)
            ctx.fill()
            ctx.restore()
        }

        const textX = 205

        const usernameEmojiSize = 30
        const badgeRadius = 10
        const badgeGap = 6
        const badgeReserve = showBadge ? badgeRadius * 2 + badgeGap : 0
        ctx.font = `500 28px "${fontFamily}"`
        ctx.fillStyle = '#9E9EA6'
        ctx.textBaseline = 'top'
        const safeUsername = truncateText(ctx, username, maxTextWidth - badgeReserve, usernameEmojiSize, emojiMap)
        await drawRichText(ctx, safeUsername, textX, 390, usernameEmojiSize, emojiMap)

        if (showBadge) {
            const usernameWidth = measureRichText(ctx, safeUsername, usernameEmojiSize, emojiMap)
            const badgeCenterY = 390 + 12
            drawVerifiedBadge(ctx, textX + usernameWidth + badgeGap + badgeRadius, badgeCenterY, badgeRadius)
        }

        ctx.font = `400 32px "${fontFamily}"`
        ctx.fillStyle = '#FFFFFF'
        for (let idx = 0; idx < lines.length; idx++) {
            await drawRichText(ctx, lines[idx], textX, commentStartY + idx * lineHeight, commentEmojiSize, emojiMap)
        }

        const replyText = 'Balas'
        const footerCenterY = footerY + 14

        ctx.font = `500 26px "${fontFamily}"`
        ctx.fillStyle = '#9E9EA6'
        ctx.textBaseline = 'middle'

        const safeTimeText = truncateText(ctx, timeText, 160, 26, emojiMap)
        const safeLikeCount = truncateText(ctx, likeCount, 120, 26, emojiMap)

        ctx.fillText(safeTimeText, textX, footerCenterY)

        const timeWidth = ctx.measureText(safeTimeText).width
        ctx.fillText(replyText, textX + timeWidth + 30, footerCenterY)

        const rightEdgeX = textX + maxTextWidth
        const dislikeSize = 25
        const dislikeCenterX = rightEdgeX - dislikeSize / 2
        const likeCountRightX = rightEdgeX - dislikeSize - 24
        const likeCountWidth = ctx.measureText(safeLikeCount).width
        const heartSize = 26
        const heartCenterX = likeCountRightX - likeCountWidth - 12 - heartSize / 2

        drawHeartIcon(ctx, heartCenterX, footerCenterY, heartSize, '#9E9EA6')
        ctx.fillText(safeLikeCount, likeCountRightX - likeCountWidth, footerCenterY)
        drawDislikeIcon(ctx, dislikeCenterX, footerCenterY, dislikeSize, '#9E9EA6')

        const outBuffer = canvas.toBuffer('image/png')
        await conn.sendMessage(
            m.chat,
            {
                image: outBuffer,
                caption: `✨ TikTok Comment Canvas`
            },
            { quoted: m }
        )
        await m.react?.('✅')
    } catch (err) {
        console.error('[tiktokkomen]', err)
        await m.react?.('❌')
        m.reply(`Terjadi kesalahan saat membuat canvas: ${err.message}`)
    }
}

handler.help = ['ttkomen <username|teks>', 'tiktokkomen <username|teks>']
handler.tags = ['maker']
handler.command = /^(ttkomen|tiktokkomen|ttcomment)$/i
handler.limit = true

export default handler