/**

* Angela Multi Device — WhatsApp Bot
* 
* Library      : @wishkeysocket/baileys
* Type         : Plugins | ESM Modules
* Creator      : Mommy Kyu
* Recode       : (Your Name)
* 
* Official Channels:
* • https://whatsapp.com/channel/0029VbDO8tI2phHLTSN2ed0U
* • https://whatsapp.com/channel/0029VbCKm3I5EjxsUbvmVf33
* 
* Thanks To:
* • Allah SWT. — The Creator of Everything
* • Mother & Father — My Greatest Support
* • Kyu — Developer of Angela Multi Device
* • Nana — my girl friend
* • Hilman — Developer of Ryo Yamada MD
* • Kano — femboy jing
* • Rennz — pemboy nya akuu
* • Raynold — penyopng Ourin jir 😹
* • Fahri — Developer of Jssslyn MD
* • Amane Offc — orng belok
* • All Buyers
* • All Users & Contributors
* 
* Documentation:
* [ID]  Baca README.md untuk melihat panduan.
* [EN]  Read README.md untuk melihat panduan.
* 
* Distribution Notice:
* Dilarang menyebarkan source code ini secara gratis
* tanpa izin dari creator.
* 
* Pelanggaran terhadap ketentuan ini dapat menyebabkan
* penghentian update dan dukungan terhadap source code.
* 
* Copyright © Mommy Kyu 2026
* All Rights Reserved.
  */

import axios from 'axios'
import * as cheerio from 'cheerio'

const BASE_URL = 'https://kusonime.com'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
}

async function request(url) {
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 })
    return data
  } catch (error) {
    console.error(`[KUSONIME FETCH ERROR] ${url}:`, error.message)
    throw error
  }
}

function cleanText(str) {
  return str ? str.replace(/\s+/g, ' ').trim() : ''
}

function parseList($) {
  const result = []

  $('.venz > ul > .kover, .venz > .kover').each((_, el) => {
    const item = $(el)
    const linkEl = item.find('.content h2 a, h2.episodeye a').first()
    const title = cleanText(linkEl.text())
    const url = linkEl.attr('href')

    if (!title && !url) return

    const thumb = item.find('.thumb img').attr('src') ||
      item.find('.thumb img').attr('data-src') ||
      item.find('.thumb img').attr('data-lazy-src') || ''

    const released = cleanText(
      item.find('.content p:has(i.fa-clock-o), p:has(i.fa-clock-o)')
        .text()
        .replace(/Released on/i, '')
    )

    const genres = item
      .find('.content p:has(i.fa-tag) a, p:has(i.fa-tag) a')
      .map((_, g) => cleanText($(g).text()))
      .get()
      .filter(Boolean)

    result.push({
      title,
      url,
      thumb,
      released,
      genres
    })
  })

  return result
}

export const kusonime = {
  latest: async (page = 1) => {
    try {
      const url = page > 1 ? `${BASE_URL}/page/${page}/` : `${BASE_URL}/`
      const html = await request(url)
      const $ = cheerio.load(html)
      return parseList($)
    } catch (e) {
      console.error({ msg: e.message })
      throw e
    }
  },

  search: async (q, page = 1) => {
    try {
      const url = page > 1 
        ? `${BASE_URL}/page/${page}/?s=${encodeURIComponent(q)}` 
        : `${BASE_URL}/?s=${encodeURIComponent(q)}`
      const html = await request(url)
      const $ = cheerio.load(html)
      return parseList($)
    } catch (e) {
      console.error({ msg: e.message })
      throw e
    }
  },

  genre: async (genres, page = 1) => {
    try {
      const formattedGenre = genres.toLowerCase().trim().replace(/\s+/g, '-')
      const url = `${BASE_URL}/genres/${encodeURIComponent(formattedGenre)}/page/${page}`
      const html = await request(url)
      const $ = cheerio.load(html)
      return parseList($)
    } catch (e) {
      console.error({ msg: e.message })
      throw e
    }
  },

  genresList: async () => {
    try {
      const html = await request(`${BASE_URL}/genres/`)
      const $ = cheerio.load(html)
      const genres = []

      $('.genres li a, ul.genre-list li a, .tagcloud a').each((_, el) => {
        const name = cleanText($(el).text())
        const url = $(el).attr('href')
        if (name && url && !genres.some(g => g.name.toLowerCase() === name.toLowerCase())) {
          genres.push({ name, url })
        }
      })

      return genres
    } catch (e) {
      console.error({ msg: e.message })
      throw e
    }
  },

  detail: async (url) => {
    try {
      const html = await request(url)
      const $ = cheerio.load(html)

      const title = cleanText($('h1.jdlz').text() || $('h1.entry-title').text())
      const poster = $('.post-thumb img.wp-post-image').attr('src') ||
        $('.post-thumb img').attr('src') ||
        $('.post-thumb img').attr('data-src') ||
        $('meta[property="og:image"]').attr('content') || ''

      const info = {}
      $('.info p').each((_, el) => {
        const text = cleanText($(el).text())
        if (text.includes(':')) {
          const colonIdx = text.indexOf(':')
          let key = text.slice(0, colonIdx).trim().toLowerCase().replace(/\s+/g, '_')
          const value = text.slice(colonIdx + 1).trim()

          if (key === 'genre') {
            info.genres = $(el).find('a').map((__, a) => cleanText($(a).text())).get().filter(Boolean)
          } else if (key === 'seasons' || key === 'season') {
            const seasonLink = $(el).find('a')
            info.season = cleanText(seasonLink.text()) || value
          } else if (key === 'producers' || key === 'producer') {
            info.producers = $(el).find('a').map((__, a) => cleanText($(a).text())).get().filter(Boolean)
            if (!info.producers.length && value) info.producers = value.split(',').map(s => s.trim()).filter(Boolean)
          } else if (key === 'status') {
            info.status = value
          } else if (key === 'type') {
            info.type = value
          } else if (key === 'total_episode' || key === 'total_episodes' || key === 'episodes') {
            info.episodes = value
          } else if (key === 'score') {
            info.score = value
          } else if (key === 'duration') {
            info.duration = value
          } else if (key === 'released_on' || key === 'released') {
            info.released = value
          } else {
            info[key] = value
          }
        }
      })

      const sinopsisParts = []
      $('.venutama > p, .lexot > p').each((_, el) => {
        const text = cleanText($(el).text())
        const parentClass = $(el).parent().attr('class') || ''
        if (text && 
            !text.toLowerCase().includes('download') && 
            !text.toLowerCase().includes('credit') && 
            !text.toLowerCase().includes('lapor link') &&
            !parentClass.includes('info')) {
          sinopsisParts.push(text)
        }
      })
      const synopsis = sinopsisParts.join('\n\n')
      const posted_info = cleanText($('.kategoz').text())

      const download = []
      $('.smokeddl, .smokeddlrh').each((_, batchEl) => {
        const $batch = $(batchEl)
        const batchTitle = cleanText($batch.find('.smokettl, .smokettlrh').text())
        if (!batchTitle) return

        const batch = {
          title: batchTitle,
          resolutions: {}
        }

        $batch.find('.smokeurl, .smokeurlrh').each((__, resEl) => {
          const $res = $(resEl)
          const resolution = cleanText($res.find('strong, b').text())
          if (!resolution) return

          const links = []
          $res.find('a').each((___, a) => {
            const $a = $(a)
            const provider = cleanText($a.text())
            const linkUrl = $a.attr('href')
            if (linkUrl && linkUrl.startsWith('http') && provider) {
              links.push({
                provider,
                url: linkUrl
              })
            }
          })

          if (links.length > 0) {
            batch.resolutions[resolution] = links
          }
        })

        if (Object.keys(batch.resolutions).length > 0) {
          download.push(batch)
        }
      })

      return {
        metadata: {
          title,
          poster_url: poster,
          info,
          synopsis,
          posted_info
        },
        download
      }
    } catch (e) {
      console.error({ msg: e.message })
      throw e
    }
  }
}

export default kusonime
