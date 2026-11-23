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

const BASE_URL = 'https://www.okezone.com'
const SEARCH_URL = 'https://search.okezone.com/search'
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

async function fetchPage(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 })
        return cheerio.load(data)
    } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`)
        return null
    }
}

export async function scrapeArticleDetail(url) {
    const $ = await fetchPage(url)
    if (!$) return null

    const title = $('meta[property="og:title"]').attr('content') || $('h1').text().trim()
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
    const image = $('meta[property="og:image"]').attr('content') || ''
    const publishedAt = $('meta[name="pubdate"]').attr('content') || $('meta[property="article:published_time"]').attr('content') || ''
    const author = $('meta[name="author"]').attr('content') || ''

    let paragraphs = []
    $('#content p, .read-content p, .read p').each((_, el) => {
        const text = $(el).text().trim()
        if (text && !text.toLowerCase().includes('baca juga:')) {
            paragraphs.push(text)
        }
    })

    return {
        url,
        title,
        description,
        image,
        publishedAt,
        author,
        fullText: paragraphs.join('\n\n'),
        paragraphs
    }
}

export async function scrapeHomeArticles({ fetchDetails = false, limit = 10 } = {}) {
    const $ = await fetchPage(BASE_URL)
    if (!$) return []

    const articles = []
    const seenUrls = new Set()

    $('a[href]').each((_, el) => {
        let url = $(el).attr('href')
        const title = $(el).text().trim().replace(/\s+/g, ' ')

        if (!url) return
        if (url.startsWith('//')) url = 'https:' + url

        if (url.includes('/read/') && !seenUrls.has(url) && title.length > 15) {
            seenUrls.add(url)
            articles.push({ title, url })
        }
    })

    const targetArticles = articles.slice(0, limit)

    if (!fetchDetails) {
        return targetArticles
    }

    const detailedArticles = []
    for (const item of targetArticles) {
        const detail = await scrapeArticleDetail(item.url)
        if (detail) detailedArticles.push(detail)
        await new Promise(r => setTimeout(r, 200))
    }

    return detailedArticles
}

export async function scrapeSearch(query, { fetchDetails = false, limit = 10 } = {}) {
    const searchUrl = `${SEARCH_URL}?q=${encodeURIComponent(query)}`
    const $ = await fetchPage(searchUrl)
    if (!$) return []

    const articles = []
    const seenUrls = new Set()

    $('a[href]').each((_, el) => {
        let url = $(el).attr('href')
        const title = $(el).text().trim().replace(/\s+/g, ' ')

        if (!url) return
        if (url.startsWith('//')) url = 'https:' + url

        if (url.includes('/read/') && !seenUrls.has(url) && title.length > 10) {
            seenUrls.add(url)
            articles.push({ title, url })
        }
    })

    const targetArticles = articles.slice(0, limit)

    if (!fetchDetails) {
        return targetArticles
    }

    const detailedArticles = []
    for (const item of targetArticles) {
        const detail = await scrapeArticleDetail(item.url);
        if (detail) detailedArticles.push(detail);
        await new Promise(r => setTimeout(r, 200));
    }

    return detailedArticles;
}

export async function scrapeCategories() {
    const $ = await fetchPage(BASE_URL);
    if (!$) return [];

    const categories = [];
    const seen = new Set();

    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim().replace(/\s+/g, ' ');

        if (href && href.includes('okezone.com') && !href.includes('/read/') && text && text.length < 30) {
            let cleanUrl = href.startsWith('//') ? 'https:' + href : href;
            if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);

            if (!seen.has(cleanUrl) && !cleanUrl.includes('#')) {
                seen.add(cleanUrl);
                categories.push({ name: text, url: cleanUrl });
            }
        }
    });

    return categories;
}

export default {
    scrapeHomeArticles,
    scrapeSearch,
    scrapeCategories,
    scrapeArticleDetail
}
