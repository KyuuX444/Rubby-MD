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
┇   › Feature  : MeioNovel Scraper Suite
┇   › Target   : meionovels.com
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://meionovels.com';

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Referer': `${BASE_URL}/`
};

export const meionovel = {
  async search(query, page = 1) {
    try {
      const url = `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}&post_type=wp-manga`;
      const { data } = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
      const $ = cheerio.load(data);
      const results = [];

      $('.c-tabs-item__content, .row.c-tabs-item__content').each((_, el) => {
        const item = $(el);
        const linkEl = item.find('.post-title h3 a, .post-title h4 a');
        const title = linkEl.text().trim();
        const url = linkEl.attr('href') || '';
        const thumbnail = item.find('img').attr('data-src') || item.find('img').attr('src') || '';
        const rating = item.find('.score').text().trim();
        const latestChapter = item.find('.font-meta.chapter').first().text().trim();

        if (title && url) {
          results.push({
            title,
            url,
            thumbnail,
            rating: rating || 'N/A',
            latestChapter: latestChapter || 'N/A'
          });
        }
      });

      return { status: true, page, total: results.length, results };
    } catch (error) {
      throw new Error(`[MeioNovel Search Error]: ${error.message}`);
    }
  },

  async detail(novelUrlOrSlug) {
    try {
      const url = novelUrlOrSlug.startsWith('http')
        ? novelUrlOrSlug
        : `${BASE_URL}/novel/${novelUrlOrSlug.replace(/^\/|\/$/g, '')}/`;
      const { data } = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
      const $ = cheerio.load(data);

      const title = $('.post-title h1').text().trim();
      const thumbnail = $('.summary_image img').attr('data-src') || $('.summary_image img').attr('src') || '';
      const rating = $('.post-total-rating .score').text().trim() || 'N/A';
      const synopsis = $('.description-summary .summary__content, .summary__content.show-more').text().trim();

      const genres = [];
      $('.genres-content a').each((_, el) => {
        genres.push($(el).text().trim());
      });

      const author = $('.author-content a').text().trim() || 'Unknown';
      const status = $('.post-status .summary-content').text().trim() || 'Unknown';

      const chapters = [];
      $('.wp-manga-chapter').each((_, el) => {
        const linkEl = $(el).find('a');
        const chapterTitle = linkEl.text().trim();
        const chapterUrl = linkEl.attr('href');
        const releaseDate = $(el).find('.chapter-release-date').text().trim();

        if (chapterUrl) {
          chapters.push({
            title: chapterTitle,
            url: chapterUrl,
            releaseDate: releaseDate || 'N/A'
          });
        }
      });

      return {
        status: true,
        title,
        thumbnail,
        rating,
        author,
        statusNovel: status,
        genres,
        synopsis,
        totalChapters: chapters.length,
        chapters: chapters.reverse()
      };
    } catch (error) {
      throw new Error(`[MeioNovel Detail Error]: ${error.message}`);
    }
  },

  async read(chapterUrl) {
    try {
      const url = chapterUrl.startsWith('http')
        ? chapterUrl
        : `${BASE_URL}/${chapterUrl.replace(/^\//, '')}`;
      const { data } = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
      const $ = cheerio.load(data);

      const title = $('h1#chapter-heading, .breadcrumb li.active').text().trim();
      const contentEl = $('.text-left, .text-right, .entry-content, .c-blog-post > div > div:nth-child(2)').first();
      contentEl.find('script, style, ins, .adsbygoogle, .code-block').remove();

      const paragraphs = [];
      contentEl.find('p').each((_, el) => {
        const pText = $(el).text().trim();
        if (pText) paragraphs.push(pText);
      });

      const prevChapter = $('a.btn.prev_page, .nav-previous a').attr('href') || null;
      const nextChapter = $('a.btn.next_page, .nav-next a').attr('href') || null;

      return {
        status: true,
        title,
        url,
        content: paragraphs.length ? paragraphs.join('\n\n') : contentEl.text().trim(),
        prevChapter,
        nextChapter
      };
    } catch (error) {
      throw new Error(`[MeioNovel Read Error]: ${error.message}`);
    }
  }
};

export default meionovel;
