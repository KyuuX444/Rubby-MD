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

import axios from 'axios'
import { prepareWAMessageMedia } from 'rubyy-baileys'
import { Carousel } from '../../src/lib/helper-bails.js'

const formatNumber = (num) => {
	if (!num && num !== 0) return '0'
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
	if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
	return num.toLocaleString('id-ID')
}

const buildCaption = (type, res) => {
	const stats = res.stats || {}
	const authorNick = res.author?.nickname || 'Creator'
	const authorUser = res.author?.username ? `@${res.author.username}` : ''
	const authorText = authorUser ? `${authorNick} • ${authorUser}` : authorNick
	const title = (res.description || res.title || '').trim()
	const topComment = (Array.isArray(res.topComments) && res.topComments[0]?.text)
		? res.topComments[0].text.replace(/\r?\n/g, ' ').trim()
		: ''

	const lines = [
		`乂  *TIKTOK ${type.toUpperCase()}*`,
		'',
		`◦ *Author* : ${authorText}`,
		`◦ *Likes* : ${formatNumber(stats.likes)}`,
		`◦ *Plays* : ${formatNumber(stats.plays)}`,
		`◦ *Comments* : ${formatNumber(stats.comments)}`,
		`◦ *Shares* : ${formatNumber(stats.shares)}`,
	]

	if (title) {
		lines.push('', '◦ *Caption* :', title)
	}

	if (topComment) {
		lines.push('', '◦ *Top Comment* :', `"${topComment}"`)
	}

	return lines.join('\n')
}

async function downloadMediaBuffer(urls, customHeaders = {}) {
	const urlList = Array.isArray(urls) ? urls.filter(Boolean) : [urls].filter(Boolean)
	if (!urlList.length) return null

	const cleanUa = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
	const mobileUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'

	const headerVariants = [
		{ ...customHeaders },
		{
			'User-Agent': customHeaders['User-Agent'] || mobileUa,
			'Referer': 'https://www.tiktok.com/',
			'Accept': '*/*'
		},
		{
			'User-Agent': mobileUa,
			'Referer': 'https://m.tiktok.com/'
		},
		{
			'User-Agent': cleanUa,
			'Referer': 'https://www.tiktok.com/'
		},
		{
			'User-Agent': cleanUa
		}
	]

	for (const target of urlList) {
		for (const headers of headerVariants) {
			try {
				const res = await axios.get(target, {
					headers,
					responseType: 'arraybuffer',
					timeout: 30000,
					maxRedirects: 5
				})
				if (res.status === 200 && res.data && res.data.length > 0) {
					return Buffer.from(res.data)
				}
			} catch (_) {}
		}
	}
	return null
}

const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
	const quotedText = m.quoted ? (m.quoted.text || m.quoted.caption || m.quoted.description || m.quoted.msg?.caption || m.quoted.msg?.text || '') : ''
	let rawInput = (text || quotedText || '').trim()

	if (!/^https?:\/\//i.test(rawInput)) {
		rawInput = rawInput.replace(/(?:^|\s)((?:www\.)?(?:tt\.site|tiktok\.com|douyin\.com)\/[^\s]+)/i, 'https://$1')
	}

	const urlMatch = rawInput.match(/https?:\/\/(?:[a-zA-Z0-9_-]+\.)?(?:tiktok\.com|vt\.tiktok\.com|douyin\.com|tt\.site)\/[^\s]+/i) || rawInput.match(/https?:\/\/[^\s]+/i)
	let targetUrl = urlMatch ? urlMatch[0] : rawInput

	if (targetUrl && !/^https?:\/\//i.test(targetUrl) && /(?:tiktok\.com|tt\.site|douyin\.com)/i.test(targetUrl)) {
		targetUrl = 'https://' + targetUrl
	}

	if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
		return reply(`*TikTok Downloader*\n\nContoh:\n${usedPrefix}${command} https://vt.tiktok.com/ZS67d26A7/\nAtau:\n${usedPrefix}${command} www.tt.site/...\nAtau reply pesan yang berisi tautan TikTok!`)
	}

	reply(global.mess?.wait || '⏳ Sedang mengunduh media TikTok...')

	try {
		let resolvedUrl = targetUrl
		if (/vt\.tiktok\.com|vm\.tiktok\.com|\/t\/|tt\.site/i.test(targetUrl)) {
			try {
				const headRes = await axios.get(targetUrl, {
					maxRedirects: 5,
					timeout: 10000,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
					}
				})
				const finalUrl = headRes.request?.res?.responseUrl || headRes.config?.url || targetUrl
				resolvedUrl = finalUrl.split('?')[0].replace(/\/+$/, '')
			} catch (_) {}
		}

		const cleanTargetUrl = targetUrl.split('?')[0].replace(/\/+$/, '')
		const primaryUrl = (resolvedUrl && /tiktok\.com/i.test(resolvedUrl)) ? resolvedUrl : targetUrl

		let apiUrl = global.API('kyzz', '/api/download/tiktok', { url: primaryUrl }, 'apikey')
		let apiRes = await axios.get(apiUrl, { timeout: 25000, validateStatus: () => true })

		if ((!apiRes.data?.status || !apiRes.data?.result) && primaryUrl !== targetUrl) {
			apiUrl = global.API('kyzz', '/api/download/tiktok', { url: targetUrl }, 'apikey')
			apiRes = await axios.get(apiUrl, { timeout: 25000, validateStatus: () => true })
		}

		if ((!apiRes.data?.status || !apiRes.data?.result) && cleanTargetUrl !== targetUrl && cleanTargetUrl !== primaryUrl) {
			apiUrl = global.API('kyzz', '/api/download/tiktok', { url: cleanTargetUrl }, 'apikey')
			apiRes = await axios.get(apiUrl, { timeout: 25000, validateStatus: () => true })
		}

		const data = apiRes.data
		if (!data?.status || !data?.result) {
			const errMsg = data?.error || data?.message || (apiRes.status === 400 ? 'Video tidak ditemukan atau bersifat privat di TikTok.' : 'Gagal mendapatkan data dari Kyzz API.')
			return reply(`❌ ${errMsg}`)
		}

		const res = data.result
		const isPhoto = res.type === 'photo'
		const photos = res.media?.photos || []
		const videoData = res.media?.video
		const videoHeaders = videoData?.headers || {}

		if (isPhoto && photos.length > 0) {
			let carouselSuccess = false
			try {
				const cardPromises = photos.map(async (photoUrl, idx) => {
					try {
						const photoBuffer = await downloadMediaBuffer([photoUrl], {
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
							'Referer': 'https://www.tiktok.com/'
						})
						if (!photoBuffer) return null

						const media = await prepareWAMessageMedia(
							{ image: photoBuffer },
							{ upload: sock.waUploadToServer }
						)

						const cardCaption = buildCaption('SLIDE', res)

						return {
							body: { text: cardCaption },
							footer: { text: `Foto ${idx + 1} dari ${photos.length}` },
							header: {
								title: `Slide ${idx + 1}`,
								hasMediaAttachment: true,
								imageMessage: media.imageMessage
							},
							nativeFlowMessage: {
								buttons: [{
									name: "cta_url",
									buttonParamsJson: JSON.stringify({
										display_text: "🔗 Buka di TikTok",
										url: targetUrl
									})
								}]
							}
						}
					} catch (errCard) {
						console.warn(`[TIKTOK CARD WARN ${idx}]:`, errCard.message)
						return null
					}
				})

				const resolvedCards = (await Promise.all(cardPromises)).filter(Boolean)

				if (resolvedCards.length > 0) {
					const carousel = new Carousel(sock)
						.setBody(`✨ *TikTok Slide* • ${resolvedCards.length} Foto`)
						.setFooter('Geser ke samping ⏩')

					for (const card of resolvedCards) {
						carousel.addCard(card)
					}

					await carousel.send(m.chat, { quoted: m })
					carouselSuccess = true
				}
			} catch (errCar) {
				console.error('[TIKTOK CAROUSEL ERROR]:', errCar)
			}

			if (!carouselSuccess) {
				reply(`📸 *TikTok Slide* • Mengirim ${photos.length} foto...`)
				const caption = buildCaption('SLIDE', res)
				for (let i = 0; i < photos.length; i++) {
					const photoBuffer = await downloadMediaBuffer([photos[i]], {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
						'Referer': 'https://www.tiktok.com/'
					})
					if (photoBuffer) {
						await sock.sendMessage(m.chat, {
							image: photoBuffer,
							caption: i === 0 ? caption : `Slide ${i + 1} dari ${photos.length}`
						}, { quoted: m })
					}
				}
			}
		} else if (videoData) {
			const videoCandidates = [
				videoData?.noWatermark,
				videoData?.nowm,
				videoData?.directStreamUrl,
				videoData?.playUrl,
				...(videoData?.bitrates?.map(b => b.url || b.playAddr || b.downloadAddr) || [])
			].filter(Boolean)

			const videoBuffer = await downloadMediaBuffer(videoCandidates, videoHeaders)
			if (!videoBuffer) {
				return reply('❌ Gagal mengunduh file video TikTok (Server CDN memblokir akses atau token kadaluwarsa).')
			}

			const videoCaption = buildCaption('VIDEO', res)

			await sock.sendMessage(m.chat, {
				video: videoBuffer,
				caption: videoCaption,
				fileName: `${res.id || Date.now()}.mp4`,
				mimetype: 'video/mp4'
			}, { quoted: m })
		} else {
			return reply('❌ Tidak ditemukan media video atau foto pada tautan TikTok tersebut.')
		}

		const audioCandidates = [
			res.music?.playUrl,
			res.music?.downloadUrl,
			res.media?.audio
		].filter(Boolean)

		if (audioCandidates.length > 0) {
			try {
				const audioBuffer = await downloadMediaBuffer(audioCandidates, {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					'Referer': 'https://www.tiktok.com/'
				})
				if (audioBuffer) {
					await sock.sendMessage(m.chat, {
						audio: audioBuffer,
						mimetype: 'audio/mpeg',
						fileName: `${res.music?.title || res.id || 'audio'}.mp3`
					}, { quoted: m })
				}
			} catch (errAudio) {
				console.warn('[TIKTOK AUDIO SEND WARN]:', errAudio.message)
			}
		}

	} catch (e) {
		console.error('[TIKTOK KYZZ API ERROR]:', e.response?.data || e)
		const errMsg = e.response?.data?.error || e.response?.data?.message || e.message
		return reply(`❌ Terjadi kesalahan saat mengunduh TikTok: ${errMsg}`)
	}
}

handler.help = ['tiktok <url>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt', 'ttdl', 'tiktokdl']
handler.limit = true
handler.register = true

export default handler
