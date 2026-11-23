/**
 * =============================================================
 *  NAME       : Anichin Donghua Scraper
 *  AUTHOR     : Mommy Kyuu
 *  CHANNEL    : https://whatsapp.com/channel/0029VbDO8tI2phHLTSN2ed0U
 *  TELEGRAM   : @kyumasihcowo
 * =============================================================
 *  NOTE:
 *  JANGAN DI CLAIM ASU
 *  DESCRIPTION:
 *  Scraper streaming Donghua Anichin (anichin.ro) lengkap mulai
 *  dari Home, Search, Catalog, Detail, Episode, hingga Video Server.
 * =============================================================
 */

import axios from "axios";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";

const BASE_URL = "https://anichin.ro";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
  Referer: `${BASE_URL}/`,
};

const client = axios.create({
  baseURL: BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: 20000,
  maxRedirects: 5,
});

function cleanText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function extractSlug(url) {
  if (!url) return null;
  const parts = url.split("?")[0].replace(/\/+$/, "").split("/");
  return parts.pop() || null;
}

function parseCard($, el) {
  const $el = $(el);
  const $link = $el.find("a").first();
  const url = toAbsoluteUrl($link.attr("href"));
  const slug = extractSlug(url);

  const title =
    $el.find(".tt h2, .tt h4").first().text().trim() ||
    $link.attr("title")?.trim() ||
    $el.find("img").attr("alt")?.trim() ||
    cleanText($el.find(".tt").contents().first().text());

  const thumbnail =
    $el.find("img").attr("src") ||
    $el.find("img").attr("data-src") ||
    null;

  const episode = cleanText($el.find(".epx, .bt .epx").text()) || null;
  const subType = cleanText($el.find(".sb").text()) || null;
  const type = cleanText($el.find(".typez").text()) || null;

  return {
    title,
    slug,
    url,
    thumbnail,
    episode,
    type,
    subType,
  };
}

function parsePagination($, currentPage = 1) {
  const hasNextPage =
    $(".pagination a.next, .pagination .r, a.next.page-numbers, .hpage .r").length > 0;
  const hasPrevPage =
    $(".pagination a.prev, .pagination .l, a.prev.page-numbers, .hpage .l").length > 0;

  let totalPages = null;
  const pageNums = [];
  $(".page-numbers").each((_, el) => {
    const num = parseInt($(el).text().trim(), 10);
    if (!isNaN(num)) pageNums.push(num);
  });
  if (pageNums.length > 0) {
    totalPages = Math.max(...pageNums);
  }

  return {
    currentPage: Number(currentPage),
    hasNextPage,
    hasPrevPage,
    totalPages,
  };
}

export async function getHome() {
  const { data } = await client.get("/");
  const $ = cheerio.load(data);

  const popular = [];
  const latest = [];

  $(".bixbox").each((_, box) => {
    const heading = $(box)
      .find(".releases h2, .releases h3, h2, h3")
      .first()
      .text()
      .trim()
      .toLowerCase();

    if (heading.includes("popular")) {
      $(box)
        .find(".listupd .bs")
        .each((_, el) => {
          popular.push(parseCard($, el));
        });
    } else if (heading.includes("latest") || heading.includes("rilis")) {
      $(box)
        .find(".listupd .bs")
        .each((_, el) => {
          latest.push(parseCard($, el));
        });
    }
  });

  if (popular.length === 0 && latest.length === 0) {
    $(".listupd .bs").each((_, el) => {
      latest.push(parseCard($, el));
    });
  }

  return {
    popular,
    latest,
    pagination: parsePagination($, 1),
  };
}

export async function getLatest(page = 1) {
  const path = page > 1 ? `/page/${page}/` : "/";
  const { data } = await client.get(path);
  const $ = cheerio.load(data);

  const items = [];
  $(".listupd")
    .last()
    .find(".bs")
    .each((_, el) => {
      items.push(parseCard($, el));
    });

  return {
    currentPage: Number(page),
    items,
    pagination: parsePagination($, page),
  };
}

export async function search(query, page = 1) {
  if (!query) throw new Error("Search query is required");

  const path = page > 1 ? `/page/${page}/` : "/";
  const { data } = await client.get(path, {
    params: { s: query },
  });
  const $ = cheerio.load(data);

  const items = [];
  $(".listupd article, .listupd .bs").each((_, el) => {
    items.push(parseCard($, el));
  });

  return {
    query,
    currentPage: Number(page),
    items,
    pagination: parsePagination($, page),
  };
}

export async function getAnimeList({
  genre,
  status = "",
  type = "",
  order = "",
  page = 1,
} = {}) {
  const params = {};
  if (genre) {
    params["genre[]"] = Array.isArray(genre) ? genre : [genre];
  }
  if (status) params.status = status;
  if (type) params.type = type;
  if (order) params.order = order;
  if (page > 1) params.page = page;

  const { data } = await client.get("/anime/", { params });
  const $ = cheerio.load(data);

  const items = [];
  $(".listupd article, .listupd .bs").each((_, el) => {
    items.push(parseCard($, el));
  });

  return {
    currentPage: Number(page),
    items,
    pagination: parsePagination($, page),
  };
}

export async function getAnimeDetail(slugOrUrl) {
  if (!slugOrUrl) throw new Error("Anime slug or URL is required");

  let cleanSlug = slugOrUrl.startsWith("http")
    ? (extractSlug(slugOrUrl) || slugOrUrl)
    : slugOrUrl.replace(/^\/+|\/+$/g, "");

  if (/-episode-\d+/i.test(cleanSlug)) {
    const candidateSlug = cleanSlug.replace(/-episode-\d+.*$/i, "");
    try {
      const testRes = await client.get(`/anime/${candidateSlug}/`);
      if (testRes.status === 200) {
        cleanSlug = candidateSlug;
      }
    } catch (_) {}
  }

  let url = cleanSlug.startsWith("http") ? cleanSlug : `/anime/${cleanSlug}/`;
  let data, config;

  try {
    const res = await client.get(url);
    data = res.data;
    config = res.config;
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const epData = await getEpisode(slugOrUrl);
        if (epData?.navigation?.animeSlug) {
          const res = await client.get(`/anime/${epData.navigation.animeSlug}/`);
          data = res.data;
          config = res.config;
        } else {
          throw err;
        }
      } catch (_) {
        throw err;
      }
    } else {
      throw err;
    }
  }

  const $ = cheerio.load(data);

  const finalUrl = toAbsoluteUrl(config.url || url);
  const slug = extractSlug(finalUrl);

  const title = cleanText($("h1.entry-title").text());
  const alterTitle = cleanText($(".alter").text()) || null;
  const thumbnail =
    $(".thumb img, .infox img, .bigcontent img").attr("src") || null;

  const ratingRaw = cleanText($(".rating strong, .num").text());
  const rating = ratingRaw ? ratingRaw.replace(/Rating\s*/i, "").trim() : null;

  const synopsis = cleanText(
    $(".entry-content p, .synp .entry-content, .desc").text()
  );

  const metadata = {};
  $(".spe span, .info-content .spe span").each((_, el) => {
    const raw = $(el).text().trim();
    const parts = raw.split(":");
    if (parts.length >= 2) {
      const key = cleanText(parts[0]).toLowerCase().replace(/\s+/g, "_");
      const val = cleanText(parts.slice(1).join(":"));
      metadata[key] = val;
    }
  });

  const genres = [];
  $(".genxed a, .genre-info a").each((_, el) => {
    const name = cleanText($(el).text());
    const gUrl = toAbsoluteUrl($(el).attr("href"));
    const gSlug = extractSlug(gUrl);
    if (name) {
      genres.push({ name, slug: gSlug, url: gUrl });
    }
  });

  const episodes = [];
  $(".eplister ul li a, a.ep-item").each((_, el) => {
    const epNum = $(el).find(".epl-num").text().trim() || $(el).attr("data-number") || cleanText($(el).find(".order").text());
    const epTitle = $(el).find(".epl-title").text().trim() || cleanText($(el).text());
    const epDate = $(el).find(".epl-date").text().trim() || null;
    const epSub = $(el).find(".epl-sub").text().trim() || null;
    const epId = $(el).attr("data-id") || null;
    const epUrl = toAbsoluteUrl($(el).attr("href"));
    const epSlug = extractSlug(epUrl);

    episodes.push({
      number: epNum,
      title: epTitle,
      date: epDate,
      sub: epSub,
      id: epId,
      slug: epSlug,
      url: epUrl,
    });
  });

  return {
    title,
    alterTitle,
    slug,
    url: finalUrl,
    thumbnail,
    rating,
    synopsis,
    status: metadata.status || null,
    type: metadata.type || null,
    episodesCount: episodes.length > 0 ? episodes.length.toString() : (metadata.episodes || '-'),
    totalScheduled: metadata.episodes || null,
    duration: metadata.duration || null,
    released: metadata.released || null,
    fansub: metadata.fansub || null,
    postedBy: metadata.posted_by || null,
    releasedOn: metadata.released_on || null,
    updatedOn: metadata.updated_on || null,
    genres,
    episodes,
  };
}

export async function getVideoSource(hash) {
  if (!hash) throw new Error("Hash is required");
  const { data } = await client.get(`/api/theme/episode/source?get=${encodeURIComponent(hash)}`);
  return data;
}

export async function getEpisode(slugOrUrl) {
  if (!slugOrUrl) throw new Error("Episode slug or URL is required");

  const url = slugOrUrl.startsWith("http")
    ? slugOrUrl
    : `/${slugOrUrl.replace(/^\/+|\/+$/g, "")}/`;

  const { data, config } = await client.get(url);
  const $ = cheerio.load(data);

  const finalUrl = toAbsoluteUrl(config.url || url);
  const slug = extractSlug(finalUrl);
  const title = cleanText($("h1.entry-title").text());

  const prevUrl = toAbsoluteUrl($(".naveps .nvs a[rel=\"prev\"]").attr("href"));
  const nextUrl = toAbsoluteUrl($(".naveps .nvs a[rel=\"next\"]").attr("href"));
  const allEpisodesUrl = toAbsoluteUrl(
    $(".naveps .nvsc a, .naveps a[aria-label=\"All Episodes\"]").attr("href")
  );
  const animeSlug = extractSlug(allEpisodesUrl);

  const episodeId = $("#as-servers").attr("data-episode") || $(".as-servers").attr("data-episode") || $("[data-episode]").attr("data-episode") || null;

  const servers = [];
  const downloads = [];

  // Jika episodeId tersedia, muat servers dan downloads via endpoint API internal Anichin
  if (episodeId) {
    try {
      const serverRes = await client.get(`/api/theme/episode/servers?episodeId=${encodeURIComponent(episodeId)}`);
      if (serverRes.data?.html) {
        const $s = cheerio.load(serverRes.data.html);
        $s(".server-item a").each((_, el) => {
          const name = cleanText($s(el).text());
          const hash = $s(el).attr("data-hash") || null;
          servers.push({
            name,
            hash,
            embedUrl: null,
            iframeHtml: null,
          });
        });
      }

      if (serverRes.data?.downloads) {
        const $dl = cheerio.load(serverRes.data.downloads);
        $dl(".soraurlx").each((_, box) => {
          const quality = cleanText($dl(box).find("strong").text());
          const links = [];
          $dl(box).find("a").each((_, a) => {
            const host = cleanText($dl(a).text());
            const linkUrl = $dl(a).attr("href");
            if (linkUrl) links.push({ host, url: linkUrl });
          });
          if (quality) downloads.push({ quality, links });
        });
      }
    } catch (_) {}
  }

  // Fallback membaca server-item langsung dari static HTML jika ada
  if (servers.length === 0) {
    $(".server-item a").each((_, el) => {
      const name = cleanText($(el).text());
      const hash = $(el).attr("data-hash");
      let embedUrl = null;
      let iframeHtml = null;

      if (hash) {
        try {
          iframeHtml = Buffer.from(hash, "base64").toString("utf-8");
          const $f = cheerio.load(iframeHtml);
          embedUrl = $f("iframe").attr("src") || null;
        } catch (err) {}
      }

      servers.push({
        name,
        hash,
        embedUrl,
        iframeHtml,
      });
    });
  }

  let currentIframe =
    $("#pembed iframe, .player-embed iframe").attr("src") ||
    servers[0]?.embedUrl ||
    null;

  // Jika server pertama belum ada embedUrl namun memiliki hash, resolve URL aslinya
  if (!currentIframe && servers.length > 0 && servers[0].hash) {
    try {
      const src = await getVideoSource(servers[0].hash);
      if (src?.url) {
        servers[0].embedUrl = src.url;
        currentIframe = src.url;
      }
    } catch (_) {}
  }

  return {
    title,
    slug,
    url: finalUrl,
    navigation: {
      prev: prevUrl,
      next: nextUrl,
      allEpisodes: allEpisodesUrl,
      animeSlug,
    },
    currentIframe,
    servers,
    downloads,
  };
}

export async function extractOkRu(embedUrlOrId) {
  let id = embedUrlOrId;
  const match = String(embedUrlOrId).match(/\/video(?:embed)?\/(\d+)/);
  if (match) id = match[1];

  const embedUrl = `https://ok.ru/videoembed/${id}`;
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

  const res = await fetch(embedUrl, {
    headers: {
      "User-Agent": userAgent,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://ok.ru/",
    },
  });
  if (!res.ok) throw new Error(`OK.ru HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/data-options="([^"]+)"/);
  if (!m) throw new Error("Video data tidak ditemukan di OK.ru");

  const unescaped = m[1].replace(/&quot;/g, '"');
  const json = JSON.parse(unescaped);
  const meta =
    typeof json.flashvars?.metadata === "string"
      ? JSON.parse(json.flashvars.metadata)
      : json.flashvars?.metadata;

  if (!meta || !meta.videos || meta.videos.length === 0) {
    throw new Error(meta?.error || "Tidak ada stream video di OK.ru");
  }

  return {
    title: meta.movie?.title,
    duration: meta.movie?.duration,
    poster: meta.movie?.poster,
    videos: meta.videos,
    userAgent,
  };
}

export async function getEpisodeStream(slugOrUrl, requestedQuality = null) {
  const ep = await getEpisode(slugOrUrl);
  if (!ep || !ep.title) throw new Error("Episode tidak ditemukan");

  const okServers = (ep.servers || []).filter((s) => /ok\.?ru/i.test(s.name));

  let extracted = null;
  let lastError = null;

  for (const s of okServers) {
    try {
      let embedUrl = s.embedUrl;
      if (!embedUrl && s.hash) {
        const src = await getVideoSource(s.hash);
        embedUrl = src?.url;
      }
      if (embedUrl && /ok\.?ru/i.test(embedUrl)) {
        extracted = await extractOkRu(embedUrl);
        if (extracted?.videos?.length) break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!extracted && ep.currentIframe && /ok\.?ru/i.test(ep.currentIframe)) {
    try {
      extracted = await extractOkRu(ep.currentIframe);
    } catch (err) {
      lastError = err;
    }
  }

  if (!extracted || !extracted.videos?.length) {
    throw new Error(
      lastError ? lastError.message : "Tidak dapat mengekstrak server streaming OK.ru"
    );
  }

  const resoMap = {
    mobile: { reso: "Mobile 240p", tag: "240p" },
    lowest: { reso: "360p", tag: "360p" },
    low: { reso: "480p", tag: "480p" },
    sd: { reso: "720p HD", tag: "720p" },
    hd: { reso: "1080p Full HD", tag: "1080p" },
    full: { reso: "1080p Ultra HD", tag: "1080p" },
  };

  const rawVideos = extracted.videos.filter((v) => !v.disallowed);

  let videoStreams = rawVideos.map((v) => ({
    name: v.name,
    resolution: resoMap[v.name]?.reso || v.name.toUpperCase(),
    tag: resoMap[v.name]?.tag || v.name,
    url: v.url,
    sizeBytes: null,
    sizeMB: null,
  }));

  if (!requestedQuality) {
    videoStreams = await Promise.all(
      videoStreams.map(async (v) => {
        try {
          const headRes = await fetch(v.url, {
            method: "HEAD",
            headers: {
              "User-Agent": extracted.userAgent,
              Referer: "https://ok.ru/",
            },
          });
          const len = headRes.headers.get("content-length");
          if (len) {
            const sizeBytes = parseInt(len, 10);
            const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1) + " MB";
            return { ...v, sizeBytes, sizeMB };
          }
        } catch (_) {}
        return v;
      })
    );
  }

  let selected = null;

  if (requestedQuality) {
    const q = requestedQuality.toLowerCase().trim();
    if (["mobile", "hemat", "144", "144p", "240", "240p"].includes(q)) {
      selected = videoStreams.find((v) => v.name === "mobile") || videoStreams[0];
    } else if (["360", "360p", "lowest"].includes(q)) {
      selected =
        videoStreams.find((v) => v.name === "lowest") ||
        videoStreams.find((v) => v.name === "low") ||
        videoStreams[0];
    } else if (["480", "480p", "low"].includes(q)) {
      selected =
        videoStreams.find((v) => v.name === "low") ||
        videoStreams.find((v) => v.name === "lowest") ||
        videoStreams[0];
    } else if (["720", "720p", "sd"].includes(q)) {
      selected =
        videoStreams.find((v) => v.name === "sd") ||
        videoStreams.find((v) => v.name === "hd") ||
        videoStreams[videoStreams.length - 1];
    } else if (["1080", "1080p", "hd", "full"].includes(q)) {
      selected =
        videoStreams.find((v) => v.name === "hd") ||
        videoStreams.find((v) => v.name === "full") ||
        videoStreams[videoStreams.length - 1];
    } else {
      selected =
        videoStreams.find((v) => v.name.toLowerCase() === q) ||
        videoStreams.find((v) => v.tag.toLowerCase() === q);
    }
  }

  if (!selected) {
    selected =
      videoStreams.find((v) => v.name === "lowest") ||
      videoStreams.find((v) => v.name === "mobile") ||
      videoStreams[0];
  }

  return {
    title: ep.title,
    slug: ep.slug,
    navigation: ep.navigation,
    quality: selected.name,
    selectedResolution: selected.resolution,
    videoUrl: selected.url,
    sizeMB: selected.sizeMB,
    sizeBytes: selected.sizeBytes,
    userAgent: extracted.userAgent,
    availableStreams: videoStreams,
    allQualities: videoStreams.map((v) => v.name),
    poster: extracted.poster,
    duration: extracted.duration,
    episodeData: ep,
  };
}

export async function getGenres() {
  const { data } = await client.get("/");
  const $ = cheerio.load(data);

  const genres = [];
  $("form[action*=\"anime\"] input[name=\"genre[]\"]").each((_, el) => {
    const name = cleanText($(el).parent().text());
    const slug = $(el).val();
    if (slug) {
      genres.push({
        name,
        slug,
        url: `${BASE_URL}/genres/${slug}/`,
      });
    }
  });

  return genres;
}

export async function getAnimeByGenre(genreSlug, page = 1) {
  if (!genreSlug) throw new Error("Genre slug is required");

  const path =
    page > 1 ? `/genres/${genreSlug}/page/${page}/` : `/genres/${genreSlug}/`;
  const { data } = await client.get(path);
  const $ = cheerio.load(data);

  const items = [];
  $(".listupd article, .listupd .bs").each((_, el) => {
    items.push(parseCard($, el));
  });

  return {
    genre: genreSlug,
    currentPage: Number(page),
    items,
    pagination: parsePagination($, page),
  };
}

export async function getRandomAnime() {
  const res = await client.get("/random", { maxRedirects: 5 });
  const finalUrl = res.request?.res?.responseUrl || res.config.url;
  return getAnimeDetail(finalUrl);
}

export default {
  getHome,
  getLatest,
  search,
  getAnimeList,
  getAnimeDetail,
  getVideoSource,
  getEpisode,
  extractOkRu,
  getEpisodeStream,
  getGenres,
  getAnimeByGenre,
  getRandomAnime,
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [,, cmd = "home", arg1, arg2] = process.argv;

  (async () => {
    try {
      let result;
      switch (cmd) {
        case "home":
          result = await getHome();
          break;
        case "latest":
          result = await getLatest(arg1 ? Number(arg1) : 1);
          break;
        case "search":
          if (!arg1) throw new Error("Usage: node anichin.js search <query> [page]");
          result = await search(arg1, arg2 ? Number(arg2) : 1);
          break;
        case "list":
          result = await getAnimeList({
            genre: arg1 || undefined,
            page: arg2 ? Number(arg2) : 1,
          });
          break;
        case "detail":
          if (!arg1) throw new Error("Usage: node anichin.js detail <slugOrUrl>");
          result = await getAnimeDetail(arg1);
          break;
        case "episode":
          if (!arg1) throw new Error("Usage: node anichin.js episode <slugOrUrl>");
          result = await getEpisode(arg1);
          break;
        case "stream":
          if (!arg1) throw new Error("Usage: node anichin.js stream <slugOrUrl> [quality]");
          result = await getEpisodeStream(arg1, arg2);
          break;
        case "source":
          if (!arg1) throw new Error("Usage: node anichin.js source <hash>");
          result = await getVideoSource(arg1);
          break;
        case "genres":
          result = await getGenres();
          break;
        case "genre":
          if (!arg1) throw new Error("Usage: node anichin.js genre <genreSlug> [page]");
          result = await getAnimeByGenre(arg1, arg2 ? Number(arg2) : 1);
          break;
        case "random":
          result = await getRandomAnime();
          break;
        default:
          console.log(`Usage: node anichin.js <command> [arguments]
Commands:
  home                     Get homepage popular & latest
  latest [page]            Get paginated latest releases
  search <query> [page]    Search donghua
  list [genre] [page]      Browse catalog
  detail <slugOrUrl>       Get full series info & episode list
  episode <slugOrUrl>      Get episode stream servers & embeds
  stream <slugOrUrl> [q]   Get direct video stream (OK.ru)
  source <hash>            Get video stream source by hash
  genres                   Get all genres
  genre <genreSlug> [page] Get donghua by genre
  random                   Get random donghua detail`);
          process.exit(0);
      }
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
  })();
}
