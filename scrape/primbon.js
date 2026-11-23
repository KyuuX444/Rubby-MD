const CONFIG = {
  baseUrl: 'https://primbon.com',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  timeout: 15000,
  maxRetries: 3
}

export function decodeEntities(str = '') {
  const entities = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    copy: '©', reg: '®', trade: '™', ndash: '–', mdash: '—',
    hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”'
  }

  return String(str)
    .replace(/&#(\d+);?/g, (match, n) => {
      const code = Number(n)
      try {
        return String.fromCodePoint(code)
      } catch {
        return match
      }
    })
    .replace(/&#x([0-9a-f]+);?/gi, (match, n) => {
      const code = parseInt(n, 16)
      try {
        return String.fromCodePoint(code)
      } catch {
        return match
      }
    })
    .replace(/&([a-z]+);?/gi, (match, name) => entities[name.toLowerCase()] ?? match)
}

export function parseDateInput(input) {
  if (!input) throw new Error('Tanggal wajib diisi.')

  let d, m, y

  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      throw new Error('Tanggal tidak valid.')
    }
    d = input.getDate()
    m = input.getMonth() + 1
    y = input.getFullYear()
  } else {
    const s = String(input).trim()

    if (/^\d{4}$/.test(s)) {
      y = Number(s)
      d = 1
      m = 1
    } else {
      let match = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)

      if (match) {
        y = Number(match[1])
        m = Number(match[2])
        d = Number(match[3])
      } else {
        match = s.match(/^(\d{1,2})[-/.\s]+(\d{1,2})[-/.\s]+(\d{4})$/)

        if (!match) {
          throw new Error(`Format tanggal "${s}" tidak valid.\nGunakan format DD-MM-YYYY atau YYYY-MM-DD.`)
        }

        d = Number(match[1])
        m = Number(match[2])
        y = Number(match[3])
      }
    }
  }

  const date = new Date(y, m - 1, d)

  if (
    !Number.isInteger(y) ||
    y < 1 ||
    y > 9999 ||
    date.getFullYear() !== y ||
    date.getMonth() + 1 !== m ||
    date.getDate() !== d
  ) {
    throw new Error('Tanggal tidak valid. Periksa tanggal, bulan, dan tahun.')
  }

  return {
    d,
    m,
    y,
    dStr: String(d).padStart(2, '0'),
    mStr: String(m).padStart(2, '0'),
    yStr: String(y)
  }
}

export function extractContent(html) {
  let content = html

  const begin = html.indexOf('<!-- BEGIN: CONTENT -->')
  if (begin !== -1) {
    content = html.slice(begin + '<!-- BEGIN: CONTENT -->'.length)
  } else {
    const body = html.indexOf('<div id="body"')
    if (body !== -1) {
      content = html.slice(body)
    }
  }

  const cutOffs = [
    '<!-- AKHIR',
    '<!-- BEGIN: FOOTER',
    '<div id="footer"',
    '<div class="share-box',
    '<div class="tm-search-box'
  ]

  for (const cut of cutOffs) {
    const index = content.indexOf(cut)
    if (index !== -1) {
      content = content.slice(0, index)
    }
  }

  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<ins[\s\S]*?<\/ins>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, '  ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')

  return decodeEntities(content)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !/^Copyright\s*©\s*PRIMBON/i.test(line))
    .join('\n')
}

export class PrimbonClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || CONFIG.baseUrl).replace(/\/+$/, '')
    this.userAgent = options.userAgent || CONFIG.userAgent
    this.timeout = options.timeout || CONFIG.timeout
  }

  async _request(endpoint, options = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`

    const headers = {
      'User-Agent': this.userAgent,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      Referer: `${this.baseUrl}/`,
      ...options.headers
    }

    let lastError

    for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), this.timeout)

      try {
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers,
          body: options.body,
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.text()
      } catch (err) {
        lastError = err.name === 'AbortError'
          ? new Error('Request timeout. Server Primbon tidak merespons.')
          : err

        if (attempt < CONFIG.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 600 * attempt))
        }
      } finally {
        clearTimeout(timer)
      }
    }

    throw lastError
  }

  async _postForm(endpoint, params) {
    const body = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      body.set(key, String(value))
    }
    return this._request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })
  }

  async _datePost(endpoint, tanggal, fields = {}) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm(endpoint, {
      ...fields,
      tgl: d.d,
      bln: d.m,
      thn: d.y,
      submit: ' Submit! '
    })
    return {
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async artiNama(nama) {
    if (!nama) throw new Error('Nama wajib diisi.')
    const query = new URLSearchParams({
      nama1: nama,
      proses: ' Submit! '
    })
    const html = await this._request(`arti_nama.php?${query}`)
    return {
      nama,
      result: extractContent(html)
    }
  }

  async tafsirMimpi(kataKunci) {
    if (!kataKunci) throw new Error('Kata kunci mimpi wajib diisi.')
    const query = new URLSearchParams({
      mimpi: kataKunci,
      submit: ' Submit '
    })
    const html = await this._request(`tafsir_mimpi.php?${query}`)
    const parts = html.split('<div class="tm-result-card">').slice(1)
    const results = []

    for (const part of parts) {
      const rank = part.match(/class="tm-rank">#?(\d+)<\/span>/)
      const score = part.match(/class="tm-score[^"]*">([^<]+)<\/span>/)
      const title = part.match(/class="tm-result-title">([\s\S]*?)<\/div>/)
      const meaning = part.match(/class="tm-result-meaning">([\s\S]*?)<\/div>/)

      if (title && meaning) {
        results.push({
          rank: rank ? Number(rank[1]) : results.length + 1,
          score: score ? decodeEntities(score[1].trim()) : null,
          title: decodeEntities(title[1].replace(/<[^>]+>/g, '').trim()),
          meaning: decodeEntities(meaning[1].replace(/<[^>]+>/g, '').trim())
        })
      }
    }

    const count = html.match(/Ditemukan\s*<b>(\d+)<\/b>\s*tafsir/i)
    return {
      query: kataKunci,
      total: count ? Number(count[1]) : results.length,
      results
    }
  }

  async ramalanJodoh(nama1, tgl1, nama2, tgl2) {
    const d1 = parseDateInput(tgl1)
    const d2 = parseDateInput(tgl2)
    const html = await this._postForm('ramalan_jodoh.php', {
      nama1,
      tgl1: d1.d,
      bln1: d1.m,
      thn1: d1.y,
      nama2,
      tgl2: d2.d,
      bln2: d2.m,
      thn2: d2.y,
      submit: ' Submit! '
    })
    return {
      pasangan: {
        nama1,
        tgl1: `${d1.yStr}-${d1.mStr}-${d1.dStr}`,
        nama2,
        tgl2: `${d2.yStr}-${d2.mStr}-${d2.dStr}`
      },
      result: extractContent(html)
    }
  }

  async wetonJawa(tanggal) {
    return this._datePost('weton_jawa.php', tanggal)
  }

  async rejekiHokiWeton(tanggal) {
    return this._datePost('rejeki_hoki_weton.php', tanggal)
  }

  async nomorHoki(nomor) {
    const cleanNo = String(nomor).replace(/[^\d+]/g, '')
    if (!cleanNo) throw new Error('Nomor HP tidak valid.')
    const html = await this._postForm('nomor_hoki.php', {
      nomer: cleanNo,
      submit: ' Submit! '
    })
    return {
      nomor: cleanNo,
      result: extractContent(html)
    }
  }

  async kecocokanNama(nama, tanggal) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm('kecocokan_nama.php', {
      nama,
      tgl: d.d,
      bln: d.m,
      thn: d.y,
      kirim: ' Submit! '
    })
    return {
      nama,
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async kecocokanNamaPasangan(nama1, nama2) {
    const query = new URLSearchParams({
      nama1,
      nama2,
      proses: ' Submit! '
    })
    const html = await this._request(`kecocokan_nama_pasangan.php?${query}`)
    return {
      nama1,
      nama2,
      result: extractContent(html)
    }
  }

  async sifatUsahaBisnis(tanggal) {
    return this._datePost('sifat_usaha_bisnis.php', tanggal)
  }

  async pekerjaanWeton(tanggal) {
    return this._datePost('pekerjaan_weton_lahir.php', tanggal)
  }

  async ramalanNasib(tanggal) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm('ramalan_nasib.php', {
      tanggal: d.dStr,
      bulan: d.mStr,
      tahun: d.yStr,
      hitung: 'Submit'
    })
    return {
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async cekPenyakit(tanggal) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm('cek_potensi_penyakit.php', {
      tanggal: d.dStr,
      bulan: d.mStr,
      tahun: d.yStr,
      hitung: 'Submit'
    })
    return {
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async petungHariBaik(tanggal) {
    return this._datePost('petung_hari_baik.php', tanggal)
  }

  async hariNaas(tanggal) {
    return this._datePost('primbon_hari_naas.php', tanggal)
  }

  async hariSangarTaliwangke(tanggal) {
    return this._datePost('hari_sangar_taliwangke.php', tanggal, {
      kirim: ' Submit! '
    })
  }

  async nagaHari(tanggal) {
    return this._datePost('rahasia_naga_hari.php', tanggal)
  }

  async arahRejeki(tanggal) {
    return this._datePost('primbon_arah_rejeki.php', tanggal)
  }

  async memancingIkan(tanggal) {
    return this._datePost('primbon_memancing_ikan.php', tanggal)
  }

  async sifatKarakter(nama, tanggal) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm('sifat_karakter_tanggal_lahir.php', {
      nama,
      tanggal: d.d,
      bulan: d.m,
      tahun: d.y,
      submit: ' Submit! '
    })
    return {
      nama,
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async potensiKeberuntungan(nama, tanggal) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm('potensi_keberuntungan.php', {
      nama,
      tanggal: d.d,
      bulan: d.m,
      tahun: d.y,
      submit: ' Submit! '
    })
    return {
      nama,
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async tanggalPernikahan(tanggal) {
    const d = parseDateInput(tanggal)
    const query = new URLSearchParams({
      tgl: d.d,
      bln: d.m,
      thn: d.y,
      proses: ' Submit! '
    })
    const html = await this._request(`tanggal_jadian_pernikahan.php?${query}`)
    return {
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  async ramalanCinta(nama1, tgl1, nama2, tgl2) {
    const d1 = parseDateInput(tgl1)
    const d2 = parseDateInput(tgl2)
    const html = await this._postForm('ramalan_cinta.php', {
      nama1,
      tanggal1: d1.d,
      bulan1: d1.m,
      tahun1: d1.y,
      nama2,
      tanggal2: d2.d,
      bulan2: d2.m,
      tahun2: d2.y,
      submit: ' Submit! '
    })
    return {
      nama1,
      nama2,
      result: extractContent(html)
    }
  }

  async suamiIstri(nama1, tgl1, nama2, tgl2) {
    const d1 = parseDateInput(tgl1)
    const d2 = parseDateInput(tgl2)
    const html = await this._postForm('suami_istri.php', {
      nama1,
      tgl1: d1.d,
      bln1: d1.m,
      thn1: d1.y,
      nama2,
      tgl2: d2.d,
      bln2: d2.m,
      thn2: d2.y,
      submit: ' Submit! '
    })
    return {
      suami: nama1,
      istri: nama2,
      result: extractContent(html)
    }
  }

  async ramalanPeruntungan(nama, tanggal, tahun = new Date().getFullYear()) {
    const d = parseDateInput(tanggal)
    if (!/^\d{4}$/.test(String(tahun))) {
      throw new Error('Tahun ramalan harus berupa 4 digit.')
    }
    const html = await this._postForm('ramalan_peruntungan.php', {
      nama1: nama,
      tgl1: d.d,
      bln1: d.m,
      thn1: d.y,
      thn2: String(tahun),
      submit: ' Submit! '
    })
    return {
      nama,
      tahunRamalan: Number(tahun),
      result: extractContent(html)
    }
  }

  async horoskop(nama, tanggal) {
    const d = parseDateInput(tanggal)
    const html = await this._postForm('horoskop.php', {
      nama,
      tgl: d.d,
      bln: d.m,
      thn: d.y,
      submit: ' Submit! '
    })
    return {
      nama,
      tanggal: `${d.yStr}-${d.mStr}-${d.dStr}`,
      result: extractContent(html)
    }
  }

  shio(input) {
    let year
    if (input instanceof Date) {
      year = input.getFullYear()
    } else if (/^\d{4}$/.test(String(input))) {
      year = Number(input)
    } else {
      year = parseDateInput(input).y
    }

    if (year < 1900 || year > 9999) {
      throw new Error('Tahun shio harus antara 1900 sampai 9999.')
    }

    const shioList = [
      'Tikus', 'Kerbau', 'Macan', 'Kelinci',
      'Naga', 'Ular', 'Kuda', 'Kambing',
      'Monyet', 'Ayam', 'Anjing', 'Babi'
    ]

    const unsurList = ['Logam', 'Air', 'Kayu', 'Api', 'Tanah']

    return {
      tahun: year,
      shio: shioList[(year - 1900) % 12],
      unsur: unsurList[Math.floor(((year - 1900) % 10) / 2)]
    }
  }
}

export function parseArgs(text = '') {
  return text.match(/"[^"]*"|'[^']*'|\S+/g)?.map(value =>
    value.replace(/^["']|["']$/g, '')
  ) || []
}

export function formatResult(data) {
  if (!data) return 'Tidak ada hasil yang ditemukan.'
  if (typeof data === 'string') return data
  if (data.results) {
    if (!data.results.length) return 'Tidak ditemukan hasil tafsir mimpi.'
    return data.results.map(item =>
      `*#${item.rank} ${item.title}*\n` +
      `Skor: ${item.score || '-'}\n` +
      `${item.meaning}`
    ).join('\n\n')
  }
  if (data.result !== undefined) {
    return data.result || 'Hasil kosong. Silakan coba lagi.'
  }
  return JSON.stringify(data, null, 2)
}

export function formatPrimbonResponse(title, body) {
  const header = [
    `╭─── ୨୧ ${title.toUpperCase()} ୨୧ ───╮`,
    `│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა primbon online!`,
    `╰────────────────────────────╯`,
    ``
  ].join('\n')

  const formattedBody = String(body).trim()

  const footer = [
    ``,
    `──────── ୨୧ ────────`,
    `૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა © ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')

  return `${header}\n${formattedBody}\n${footer}`
}

export function formatPrimbonUsage(title, usage, example) {
  return [
    `╭─── ୨୧ ${title.toUpperCase()} ୨୧ ───╮`,
    `│ ૮₍˶ᵔ ᵕ ᵔ˶₎ა format salah!`,
    `╰────────────────────────────╯`,
    ``,
    `୨ৎ *Penggunaan:* \`${usage}\``,
    `୨ৎ *Contoh:* \`${example}\``,
    ``,
    `──────── ୨୧ ────────`,
    `૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა © ${global.botName || 'Rubby Multi Device'} • Kyuu`
  ].join('\n')
}

export const primbon = new PrimbonClient()
export default primbon
