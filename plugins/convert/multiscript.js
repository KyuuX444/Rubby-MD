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
┇   › Feature  : MultiScript (Run & Convert Jawa, Sunda, Indo, JS)
┇   › Engine   : @rafxzflow/multiscript
┇
┇       ୨ৎ made with love by Kyuu ୨ৎ
┇          ♡ RUBBY • 2026 ♡
┇
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import vm from 'node:vm'
import util from 'node:util'
import { downloadMediaMessage } from 'rubyy-baileys'
import { tokenize } from '@rafxzflow/multiscript/src/tokenizer.js'
import { parse } from '@rafxzflow/multiscript/src/parser.js'
import { translate, LANGS } from '@rafxzflow/multiscript/src/translator.js'

const TIMEOUT_MS = 5000

// Keywords JavaScript standar untuk tokenizer
const JS_KEYWORDS = [
  ['else', 'else'],
  ['if', 'if'],
  ['catch', 'catch'],
  ['try', 'try'],
  ['finally', 'finally'],
  ['async', 'async'],
  ['for', 'for'],
  ['while', 'while'],
  ['function', 'function'],
  ['extends', 'extends'],
  ['class', 'class'],
  ['return', 'return'],
  ['break', 'break'],
  ['continue', 'continue'],
  ['switch', 'switch'],
  ['case', 'case'],
  ['default', 'default'],
  ['throw', 'throw'],
  ['await', 'await'],
  ['new', 'new'],
  ['const', 'const'],
  ['let', 'let'],
  ['var', 'let'],
  ['console.log', 'console.log'],
  ['undefined', 'undefined'],
  ['null', 'null'],
  ['this', 'this'],
  ['true', 'true'],
  ['false', 'false'],
  ['of', 'of'],
  ['in', 'in']
]

const ALL_LANG_CONFIGS = {
  ...LANGS,
  js: { KEYWORDS: JS_KEYWORDS, MEMBERS: {} },
  javascript: { KEYWORDS: JS_KEYWORDS, MEMBERS: {} }
}

const KEYWORD_MAP = {
  jawa: {
    let: 'ono',
    const: 'paten',
    if: 'yen',
    else: 'ora',
    while: 'nganti',
    for: 'kanggo',
    of: 'saka',
    in: 'ing',
    function: 'fungsi',
    return: 'balekno',
    break: 'mandheg',
    continue: 'lanjutna',
    throw: 'buang',
    try: 'nyoba',
    catch: 'nompo',
    finally: 'akhire',
    switch: 'milih',
    case: 'kasus',
    default: 'asale',
    class: 'kelas',
    extends: 'warisan',
    this: 'iki',
    new: 'anyar',
    async: 'sambil',
    await: 'enteni',
    true: 'bener',
    false: 'salah',
    null: 'suwung',
    undefined: 'rajelas',
    print: 'tampilno'
  },
  sunda: {
    let: 'aya',
    const: 'tetep',
    if: 'lamun',
    else: 'salian',
    while: 'salila',
    for: 'keur',
    of: 'tina',
    in: 'dina',
    function: 'fungsi',
    return: 'balikkeun',
    break: 'eureun',
    continue: 'lanjutkeun',
    throw: 'balingkeun',
    try: 'coba',
    catch: 'tangkep',
    finally: 'ahirna',
    switch: 'milih',
    case: 'kasus',
    default: 'baku',
    class: 'kelas',
    extends: 'turunan',
    this: 'ieu',
    new: 'anyar',
    async: 'sabari',
    await: 'anti',
    true: 'bener',
    false: 'salah',
    null: 'kosong',
    undefined: 'teuJelas',
    print: 'tampilkeun'
  },
  indo: {
    let: 'biarkan',
    const: 'konstanta',
    if: 'jika',
    else: 'selain',
    while: 'selama',
    for: 'untuk',
    of: 'dari',
    in: 'dalam',
    function: 'fungsi',
    return: 'kembalikan',
    break: 'hentikan',
    continue: 'lanjutkan',
    throw: 'lempar',
    try: 'coba',
    catch: 'tangkap',
    finally: 'akhirnya',
    switch: 'pilih',
    case: 'kasus',
    default: 'asali',
    class: 'kelas',
    extends: 'warisi',
    this: 'ini',
    new: 'baru',
    async: 'sembari',
    await: 'tunggu',
    true: 'benar',
    false: 'salah',
    null: 'kosong',
    undefined: 'tidakJelas',
    print: 'cetak'
  },
  js: {
    let: 'let',
    const: 'const',
    if: 'if',
    else: 'else',
    while: 'while',
    for: 'for',
    of: 'of',
    in: 'in',
    function: 'function',
    return: 'return',
    break: 'break',
    continue: 'continue',
    throw: 'throw',
    try: 'try',
    catch: 'catch',
    finally: 'finally',
    switch: 'switch',
    case: 'case',
    default: 'default',
    class: 'class',
    extends: 'extends',
    this: 'this',
    new: 'new',
    async: 'async',
    await: 'await',
    true: 'true',
    false: 'false',
    null: 'null',
    undefined: 'undefined',
    print: 'console.log'
  }
}

const indent = (s) => s.split('\n').map((l) => '    ' + l).join('\n')

/**
 * Emit AST menjadi kode bahasa target
 */
const emitCodeToLang = (node, targetLang = 'jawa') => {
  const K = KEYWORD_MAP[targetLang] || KEYWORD_MAP.jawa

  const emitDeclarator = (n) =>
    `${K[n.kind] || n.kind} ${emit(n.id)}${n.init ? ' = ' + emit(n.init) : ''}`

  const emitBlockOrStmt = (n) =>
    n.type === 'Block' ? emit(n) : `{\n${indent(emit(n))}\n}`

  function emit(n) {
    switch (n.type) {
      case 'Program':
        return n.body.map(emit).join('\n')

      case 'Block':
        return `{\n${n.body.map((s) => indent(emit(s))).join('\n')}\n}`

      case 'VariableDeclaration':
        return `${emitDeclarator(n)};`

      case 'IfStatement': {
        let out = `${K.if} (${emit(n.test)}) ${emitBlockOrStmt(n.consequent)}`
        if (n.alternate) {
          out += n.alternate.type === 'IfStatement'
            ? ` ${K.else} ${emit(n.alternate)}`
            : ` ${K.else} ${emitBlockOrStmt(n.alternate)}`
        }
        return out
      }

      case 'WhileStatement':
        return `${K.while} (${emit(n.test)}) ${emitBlockOrStmt(n.body)}`

      case 'ForStatement': {
        const init = n.init === null ? '' : n.init.type === 'VariableDeclaration' ? emitDeclarator(n.init) : emit(n.init)
        const test = n.test === null ? '' : emit(n.test)
        const update = n.update === null ? '' : emit(n.update)
        return `${K.for} (${init}; ${test}; ${update}) ${emitBlockOrStmt(n.body)}`
      }

      case 'ForOfStatement':
        return `${K.for} (${n.left.type === 'VariableDeclaration' ? emitDeclarator(n.left) : emit(n.left)} ${K.of} ${emit(n.right)}) ${emitBlockOrStmt(n.body)}`

      case 'ForInStatement':
        return `${K.for} (${n.left.type === 'VariableDeclaration' ? emitDeclarator(n.left) : emit(n.left)} ${K.in} ${emit(n.right)}) ${emitBlockOrStmt(n.body)}`

      case 'FunctionDeclaration':
        return `${n.isAsync ? K.async + ' ' : ''}${K.function} ${emit(n.name)}(${n.params.map(emit).join(', ')}) ${emit(n.body)}`

      case 'FunctionExpression':
        return `${n.isAsync ? K.async + ' ' : ''}${K.function} (${n.params.map(emit).join(', ')}) ${emit(n.body)}`

      case 'ArrowExpression':
        return `(${n.params.map(emit).join(', ')}) => ${emit(n.body)}`

      case 'ReturnStatement':
        return `${K.return}${n.argument ? ' ' + emit(n.argument) : ''};`

      case 'BreakStatement':
        return `${K.break};`

      case 'ContinueStatement':
        return `${K.continue};`

      case 'ThrowStatement':
        return `${K.throw} ${emit(n.argument)};`

      case 'TryStatement': {
        let out = `${K.try} ${emit(n.block)}`
        if (n.handler) {
          out += ` ${K.catch}${n.param ? ` (${emit(n.param)})` : ''} ${emit(n.handler)}`
        }
        if (n.finalizer) {
          out += ` ${K.finally} ${emit(n.finalizer)}`
        }
        return out
      }

      case 'SwitchStatement': {
        const cases = n.cases.map((c) => {
          const label = c.test ? `${K.case} ${emit(c.test)}:` : `${K.default}:`
          const body = c.consequent.map((s) => indent(emit(s))).join('\n')
          return `${label}\n${body}`
        }).join('\n')
        return `${K.switch} (${emit(n.discriminant)}) {\n${cases}\n}`
      }

      case 'ClassDeclaration': {
        const head = `${K.class} ${emit(n.name)}${n.superClass ? ` ${K.extends} ${emit(n.superClass)}` : ''}`
        const methods = n.methods.map((m) => indent(emit(m))).join('\n')
        return `${head} {\n${methods}\n}`
      }

      case 'MethodDefinition':
        return `${emit(n.name)}(${n.params.map(emit).join(', ')}) ${emit(n.body)}`

      case 'ExpressionStatement':
        return `${emit(n.expression)};`

      case 'BinaryExpression':
        return `(${emit(n.left)} ${n.op} ${emit(n.right)})`

      case 'UnaryExpression':
        return `${n.op}${emit(n.argument)}`

      case 'AssignmentExpression':
        return `${emit(n.left)} ${n.op} ${emit(n.right)}`

      case 'UpdateExpression':
        return `${emit(n.argument)}${n.op}`

      case 'CallExpression': {
        if (n.callee.type === 'MemberExpression' && n.callee.object?.name === 'console' && n.callee.property?.name === 'log') {
          return `${K.print}(${n.args.map(emit).join(', ')})`
        }
        return `${emit(n.callee)}(${n.args.map(emit).join(', ')})`
      }

      case 'MemberExpression':
        if (n.computed) return `${emit(n.object)}[${emit(n.property)}]`
        return `${emit(n.object)}.${emit(n.property)}`

      case 'ThisExpression':
        return K.this

      case 'NewExpression':
        return `${K.new} ${emit(n.callee)}(${n.args.map(emit).join(', ')})`

      case 'AwaitExpression':
        return `${K.await} ${emit(n.argument)}`

      case 'Identifier':
        return n.name

      case 'ArrayExpression':
        return `[${n.elements.map(emit).join(', ')}]`

      case 'ObjectExpression':
        return `{ ${n.properties.map(emit).join(', ')} }`

      case 'Property':
        return `${emit(n.key)}: ${emit(n.value)}`

      case 'Literal':
        if (n.value === true) return K.true
        if (n.value === false) return K.false
        if (n.value === null) return K.null
        if (n.value === undefined) return K.undefined
        return typeof n.value === 'string' ? JSON.stringify(n.value) : String(n.value)

      default:
        throw new Error(`Node tidak dikenali: ${n.type}`)
    }
  }

  return emit(node)
}

const detectLanguage = (code) => {
  const scores = { jawa: 0, sunda: 0, indo: 0, js: 0 }
  const words = (code || '').toLowerCase().match(/[a-z]+/g) || []

  const jawaWords = ['ono', 'paten', 'tampilno', 'yen', 'ora', 'nganti', 'kanggo', 'balekno', 'iki', 'bener']
  const sundaWords = ['aya', 'tetep', 'tampilkeun', 'lamun', 'salian', 'salila', 'keur', 'balikkeun', 'ieu']
  const indoWords = ['biarkan', 'konstanta', 'cetak', 'jika', 'selain', 'selama', 'untuk', 'kembalikan', 'ini']
  const jsWords = ['let', 'const', 'console', 'log', 'if', 'else', 'function', 'return']

  for (const w of words) {
    if (jawaWords.includes(w)) scores.jawa += 2
    if (sundaWords.includes(w)) scores.sunda += 2
    if (indoWords.includes(w)) scores.indo += 2
    if (jsWords.includes(w)) scores.js += 1
  }

  let bestLang = 'jawa'
  let maxScore = 0
  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      bestLang = lang
    }
  }
  return bestLang
}

const normalizeLangName = (lang) => {
  const l = (lang || '').toLowerCase().trim()
  if (['jawa', 'jv', 'javanese'].includes(l)) return 'jawa'
  if (['sunda', 'su', 'sundanese'].includes(l)) return 'sunda'
  if (['indo', 'id', 'indonesia', 'indonesian'].includes(l)) return 'indo'
  if (['js', 'javascript', 'node'].includes(l)) return 'js'
  return null
}

const cleanCodeFences = (code) => {
  if (!code) return ''
  return code
    .trim()
    .replace(/^```[a-zA-Z0-9_-]*\r?\n?/i, '')
    .replace(/\r?\n?```$/i, '')
    .trim()
}

const formatArg = (arg) => {
  if (typeof arg === 'string') return arg
  if (arg === undefined) return 'undefined'
  if (arg === null) return 'null'
  if (typeof arg === 'function') return arg.toString()
  try {
    return util.inspect(arg, { depth: 3, colors: false, compact: true })
  } catch {
    return String(arg)
  }
}

const executeInSandbox = async (jsCode) => {
  const logs = []

  const customConsole = {
    log: (...args) => logs.push(args.map(formatArg).join(' ')),
    error: (...args) => logs.push('[ERROR] ' + args.map(formatArg).join(' ')),
    warn: (...args) => logs.push('[WARN] ' + args.map(formatArg).join(' ')),
    info: (...args) => logs.push('[INFO] ' + args.map(formatArg).join(' ')),
    table: (...args) => logs.push(args.map(formatArg).join(' '))
  }

  const sandbox = {
    console: customConsole,
    Math,
    Date,
    JSON,
    RegExp,
    Array,
    Object,
    String,
    Number,
    Boolean,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURI,
    decodeURI,
    encodeURIComponent,
    decodeURIComponent,
    Set,
    Map,
    Promise,
    fetch: (...args) => fetch(...args)
  }

  const context = vm.createContext(sandbox, {
    codeGeneration: { strings: false, wasm: false }
  })

  const wrappedCode = `(async () => {\n${jsCode}\n})()`

  const startTime = Date.now()
  const execPromise = vm.runInContext(wrappedCode, context, {
    timeout: TIMEOUT_MS,
    displayErrors: true
  })

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Batas waktu eksekusi habis (${TIMEOUT_MS / 1000} detik)!`)), TIMEOUT_MS)
  })

  const result = await Promise.race([execPromise, timeoutPromise])
  const duration = Date.now() - startTime

  return { logs, result, duration }
}

/**
 * Ekstraksi kode dari: Langsung ketik teks, Reply teks pesan, atau Reply file dokumen (via rubyy-baileys)
 */
const extractCodeInput = async (m, text, conn) => {
  if (text && text.trim()) {
    return { code: text.trim(), fileExt: null }
  }

  if (m.quoted) {
    if (m.quoted.text) {
      return { code: m.quoted.text.trim(), fileExt: null }
    }

    // Reply file / media dokumen via rubyy-baileys
    try {
      let buf = null
      if (typeof m.quoted.download === 'function') {
        buf = await m.quoted.download().catch(() => null)
      }
      if (!buf && typeof conn?.downloadMediaMessage === 'function') {
        buf = await conn.downloadMediaMessage(m.quoted).catch(() => null)
      }
      if (!buf) {
        buf = await downloadMediaMessage(m.quoted, 'buffer', {}, { reuploadRequest: conn?.updateMediaMessage }).catch(() => null)
      }

      if (buf && buf.length > 0) {
        const fileName = m.quoted.msg?.fileName || m.quoted.fileName || ''
        const match = fileName.match(/\.([^.]+)$/)
        const fileExt = match ? match[1].toLowerCase() : null
        return { code: buf.toString('utf-8').trim(), fileExt }
      }
    } catch (err) {
      console.error('[MULTISCRIPT MEDIA DOWNLOAD ERROR]', err)
    }
  }

  return { code: '', fileExt: null }
}

const getHelpMessage = (usedPrefix) => {
  return `⚡ *MULTISCRIPT (RUN & CONVERT)* ⚡
_Bisa langsung ketik kode, reply teks pesan, atau reply file script!_

🔄 *CONVERT (Ubah Bahasa):*
• \`${usedPrefix}js2jawa\` / \`${usedPrefix}jawa2js\`
• \`${usedPrefix}js2sunda\` / \`${usedPrefix}sunda2js\`
• \`${usedPrefix}js2indo\` / \`${usedPrefix}indo2js\`
• \`${usedPrefix}jawa2sunda\` / \`${usedPrefix}sunda2jawa\`
• \`${usedPrefix}jawa2indo\` / \`${usedPrefix}indo2jawa\`
• \`${usedPrefix}sunda2indo\` / \`${usedPrefix}indo2sunda\`

🏃 *RUN (Jalankan Kode):*
• \`${usedPrefix}jawa <kode>\` (atau reply kode/file)
• \`${usedPrefix}sunda <kode>\` (atau reply kode/file)
• \`${usedPrefix}indo <kode>\` (atau reply kode/file)
• \`${usedPrefix}multiscript <kode>\` (auto deteksi)

💡 *Contoh Praktis:*
1. Langsung ketik:
   \`${usedPrefix}js2jawa let x = 10; console.log(x);\`
2. Reply kode atau file dokumen:
   Ketik \`${usedPrefix}js2jawa\` sambil reply pesan kode / file \`.js\``
}

let handler = async (m, { text, usedPrefix, command, conn, sock }) => {
  const client = conn || sock
  const cmd = (command || '').toLowerCase()

  // 1. Ambil kode (Bisa Langsung Ketik, Reply Pesan Teks, atau Reply File Dokumen)
  const { code: rawCode, fileExt } = await extractCodeInput(m, text, client)

  if (!rawCode || /^(help|contoh|--help|--contoh)$/i.test(rawCode)) {
    return m.reply(getHelpMessage(usedPrefix))
  }

  const code = cleanCodeFences(rawCode)
  if (!code) {
    return m.reply(`💡 *Cara Penggunaan:*
Ketik: \`${usedPrefix + cmd} <code>\`
Atau *reply pesan kode / file script* lalu ketik \`${usedPrefix + cmd}\``)
  }

  // 2. Deteksi apakah perintah adalah CONVERT shortcut (e.g. .js2jawa, .jawa2sunda, dll)
  const shortcutMatch = cmd.match(/^([a-z]+)2([a-z]+)$/i)
  const isGenericConvert = /^(msconvert|multiconvert|convertscript)$/i.test(cmd)
  const toMatch = code.match(/--to=([a-zA-Z]+)/i)

  if (shortcutMatch || isGenericConvert || toMatch) {
    let fromLang = null
    let toLang = null
    let cleanConvertCode = code

    if (shortcutMatch) {
      fromLang = normalizeLangName(shortcutMatch[1])
      toLang = normalizeLangName(shortcutMatch[2])
    } else if (toMatch) {
      toLang = normalizeLangName(toMatch[1])
      cleanConvertCode = cleanConvertCode.replace(/--to=[a-zA-Z]+/gi, '').trim()
    } else if (isGenericConvert) {
      const parts = cleanConvertCode.split(/\s+/)
      const a1 = normalizeLangName(parts[0])
      const a2 = normalizeLangName(parts[1])
      if (a1 && a2) {
        fromLang = a1
        toLang = a2
        cleanConvertCode = cleanConvertCode.replace(new RegExp(`^${parts[0]}\\s+${parts[1]}\\s*`, 'i'), '').trim()
      }
    }

    if (!fromLang) {
      fromLang = fileExt && ALL_LANG_CONFIGS[fileExt] ? normalizeLangName(fileExt) : detectLanguage(cleanConvertCode)
    }
    if (!toLang) {
      toLang = fromLang === 'jawa' ? 'indo' : (fromLang === 'sunda' ? 'indo' : 'jawa')
    }

    if (!ALL_LANG_CONFIGS[fromLang]) {
      return m.reply(`❌ Bahasa asal tidak didukung: *${fromLang}*\nPilihan: js, jawa, sunda, indo`)
    }
    if (!KEYWORD_MAP[toLang]) {
      return m.reply(`❌ Bahasa tujuan tidak didukung: *${toLang}*\nPilihan: js, jawa, sunda, indo`)
    }
    if (fromLang === toLang) {
      return m.reply(`⚠️ Bahasa asal dan tujuan sudah sama (*${fromLang.toUpperCase()}*).`)
    }

    try {
      const cfg = ALL_LANG_CONFIGS[fromLang]
      const tokens = tokenize(cleanConvertCode, cfg.KEYWORDS)
      const ast = parse(tokens, cfg.MEMBERS)
      const converted = emitCodeToLang(ast, toLang)

      const headerText = `✨ *CONVERT: ${fromLang.toUpperCase()} ➔ ${toLang.toUpperCase()}*`
      const RichClass = typeof global.AIRich !== 'undefined' ? global.AIRich : (await import('rubyy-baileys').then(r => r.AIRich).catch(() => null))

      if (RichClass && client) {
        try {
          const rich = new RichClass(client)
          rich.addText(headerText)
          const codeLang = toLang === 'js' ? 'javascript' : toLang
          rich.addCode(codeLang, converted.trim())
          await rich.send(m.chat, { quoted: m })
          return
        } catch (errRich) {
          console.error('[msconvert AIRich Error, fallback to normal reply]:', errRich)
        }
      }

      let msg = `${headerText}\n\n`
      msg += `\`\`\`${toLang}\n${converted}\n\`\`\``
      return m.reply(msg)
    } catch (err) {
      let errLoc = err.line != null ? ` (Baris ${err.line}, Kolom ${err.col || '-'})` : ''
      return m.reply(`❌ *Gagal Konversi:* ${err.message || String(err)}${errLoc}`)
    }
  }

  // 3. Mode RUN (Eksekusi Kode)
  let runLang = 'jawa'
  if (['jawa', 'runjawa'].includes(cmd)) runLang = 'jawa'
  else if (['sunda', 'runsunda'].includes(cmd)) runLang = 'sunda'
  else if (['indo', 'runindo'].includes(cmd)) runLang = 'indo'
  else if (fileExt && ['jawa', 'sunda', 'indo'].includes(fileExt)) runLang = fileExt
  else runLang = detectLanguage(code)

  if (!LANGS[runLang]) {
    return m.reply(`❌ Bahasa tidak didukung untuk run: *${runLang}*\nPilihan: jawa, sunda, indo`)
  }

  const isTranspileOnly = /\B--(transpile|js)\b|-t\b/i.test(code)
  const cleanRunCode = code.replace(/\B--(transpile|js)\b|-t\b/gi, '').trim()

  let transpiledJS = ''
  try {
    transpiledJS = translate(cleanRunCode, runLang)
  } catch (err) {
    let errLoc = err.line != null ? ` (Baris ${err.line}, Kolom ${err.col || '-'})` : ''
    return m.reply(`❌ *Compile Error (${runLang.toUpperCase()}):* ${err.message}${errLoc}`)
  }

  if (isTranspileOnly) {
    return m.reply(`📜 *TRANSPILE (${runLang.toUpperCase()} ➔ JS):*\n\n\`\`\`javascript\n${transpiledJS}\n\`\`\``)
  }

  try {
    const { logs, result, duration } = await executeInSandbox(transpiledJS)

    let msg = `🚀 *RUN: ${runLang.toUpperCase()}* (${duration}ms)\n\n`

    if (logs.length > 0) {
      msg += `📋 *Output:*\n\`\`\`\n${logs.join('\n')}\n\`\`\`\n\n`
    }
    if (result !== undefined) {
      let resStr = typeof result === 'object' ? util.inspect(result, { depth: 3, compact: true }) : String(result)
      msg += `🔄 *Return:* \`${resStr}\`\n\n`
    }
    if (logs.length === 0 && result === undefined) {
      msg += `✓ _Selesai dieksekusi (tanpa output)_\n\n`
    }

    return m.reply(msg.trim())
  } catch (err) {
    return m.reply(`❌ *Runtime Error (${runLang.toUpperCase()}):* ${err.message || String(err)}`)
  }
}

handler.help = [
  'js2jawa <kode>',
  'js2sunda <kode>',
  'js2indo <kode>',
  'jawa2js <kode>',
  'jawa2sunda <kode>',
  'jawa2indo <kode>',
  'sunda2js <kode>',
  'sunda2jawa <kode>',
  'sunda2indo <kode>',
  'indo2js <kode>',
  'indo2jawa <kode>',
  'indo2sunda <kode>',
  'jawa <kode>',
  'sunda <kode>',
  'indo <kode>',
  'multiscript <kode>'
]
handler.tags = ['convert', 'tools']
handler.command = /^(js2jawa|js2sunda|js2indo|jawa2js|jawa2sunda|jawa2indo|sunda2js|sunda2jawa|sunda2indo|indo2js|indo2jawa|indo2sunda|msconvert|multiconvert|convertscript|jawa|sunda|indo|runjawa|runsunda|runindo|multiscript|multi)$/i

export default handler
