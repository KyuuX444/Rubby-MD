import test from 'node:test'
import assert from 'node:assert/strict'
import { SSMSManager } from '../lib/ssms.js'
import { CustomAPIManager } from '../lib/customApi.js'
import { PluginRegistry } from '../lib/plugins.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginsDir = path.resolve(__dirname, '../plugins')

test('Upgrade Suite 1: SSMS Manager Safe Execution (Zero-Eval)', async () => {
  const ssms = new SSMSManager({ enabled: true })

  // Built-in system ping & status
  const pingRes = await ssms.execute('system', 'ping')
  assert.equal(pingRes.success, true)
  assert.equal(pingRes.result.pong, true)

  const statusRes = await ssms.execute('system', 'status')
  assert.equal(statusRes.success, true)
  assert.ok(statusRes.result.uptimeSeconds >= 0)

  // Built-in tools hashing (sha256)
  const hashRes = await ssms.execute('tools', 'hash', { text: 'RubbyMD', algorithm: 'sha256' })
  assert.equal(hashRes.success, true)
  assert.equal(hashRes.result.algorithm, 'sha256')
  assert.ok(hashRes.result.digest.length === 64)

  // Built-in tools base64
  const b64Encode = await ssms.execute('tools', 'base64', { text: 'Hello Telegram & WhatsApp', mode: 'encode' })
  assert.equal(b64Encode.result.mode, 'encode')
  const b64Decode = await ssms.execute('tools', 'base64', { text: b64Encode.result.result, mode: 'decode' })
  assert.equal(b64Decode.result.result, 'Hello Telegram & WhatsApp')

  // Register custom safe module
  ssms.registerModule('calculator', {
    description: 'Safe arithmetic without eval',
    version: '1.0.0'
  }, {
    add: {
      description: 'Add two numbers',
      handler: async ({ a, b }) => Number(a) + Number(b)
    }
  })

  const addRes = await ssms.execute('calculator', 'add', { a: 15, b: 25 })
  assert.equal(addRes.result, 40)

  // Custom command mapping
  ssms.registerCustomCommand('addme', { module: 'calculator', action: 'add', defaultParams: { a: 10, b: 20 } })
  assert.equal(ssms.hasCustomCommand('addme'), true)
})

test('Upgrade Suite 2: Custom API Endpoints & Auth & Rate Limiting', async () => {
  const testPort = 31234
  const registry = new PluginRegistry(pluginsDir)
  const api = new CustomAPIManager({
    enabled: true,
    port: testPort,
    key: 'test-secret-key',
    rateLimit: 100,
    registry
  })

  await api.start(testPort)

  try {
    // 1. Health check (unauthenticated allowed)
    const healthRes = await fetch(`http://localhost:${testPort}/health`)
    assert.equal(healthRes.status, 200)
    const healthJson = await healthRes.json()
    assert.equal(healthJson.status, 'ok')

    // 2. Unauthorized request
    const unauthRes = await fetch(`http://localhost:${testPort}/api/status`)
    assert.equal(unauthRes.status, 401)

    // 3. Authorized status request with X-API-Key
    const authRes = await fetch(`http://localhost:${testPort}/api/status`, {
      headers: { 'X-API-Key': 'test-secret-key' }
    })
    assert.equal(authRes.status, 200)
    const statusJson = await authRes.json()
    assert.equal(statusJson.success, true)
    assert.ok(statusJson.bot.name.includes('Rubby'))

    // 4. SSMS Modules list via API
    const ssmsRes = await fetch(`http://localhost:${testPort}/api/ssms/modules`, {
      headers: { 'Authorization': 'Bearer test-secret-key' }
    })
    assert.equal(ssmsRes.status, 200)
    const ssmsJson = await ssmsRes.json()
    assert.equal(ssmsJson.success, true)
    assert.ok(ssmsJson.modules.some(m => m.name === 'system'))

    // 5. SSMS Execute via API
    const execRes = await fetch(`http://localhost:${testPort}/api/ssms/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-secret-key'
      },
      body: JSON.stringify({
        module: 'system',
        action: 'ping'
      })
    })
    assert.equal(execRes.status, 200)
    const execJson = await execRes.json()
    assert.equal(execJson.success, true)
    assert.equal(execJson.execution.result.pong, true)

  } finally {
    api.stop()
  }
})

test('Upgrade Suite 3: Primbon Scraping Module & Plugins Architecture', async () => {
  const { primbon, parseDateInput, decodeEntities, parseArgs, formatResult, extractContent, formatPrimbonResponse } = await import('../lib/primbon.js')

  // 1. Entities decoding
  assert.equal(decodeEntities('&amp; &quot; &copy; &#39;'), '& " © \'')

  // 2. Date input parsing
  const d1 = parseDateInput('17-08-1945')
  assert.equal(d1.d, 17)
  assert.equal(d1.m, 8)
  assert.equal(d1.y, 1945)

  const d2 = parseDateInput('2026-11-23')
  assert.equal(d2.d, 23)
  assert.equal(d2.m, 11)
  assert.equal(d2.y, 2026)

  assert.throws(() => parseDateInput('31-02-2023'), /tidak valid/i)

  // 3. Shio calculation
  const shio2024 = primbon.shio(2024)
  assert.equal(shio2024.shio, 'Naga')
  assert.equal(shio2024.unsur, 'Kayu')

  // 4. Argument parsing with quotes
  const parsedArgs = parseArgs('"Budi Santoso" 15-08-1995 "Ani Putri" 20-10-1997')
  assert.deepEqual(parsedArgs, ['Budi Santoso', '15-08-1995', 'Ani Putri', '20-10-1997'])

  // 5. Response formatting (Clean Rubby style without '>')
  const formatted = formatPrimbonResponse('Weton Jawa', 'Hasil weton')
  assert.ok(formatted.includes('╭─── ୨୧ WETON JAWA ୨୧ ───╮'))
  assert.ok(!formatted.includes('> '))
  assert.ok(formatted.includes('૮₍˶ᵔ ᵕ ᵔ˶₎ა'))
  assert.ok(formatted.includes('Rubby Multi Device'))

  // 6. Verify Primbon Plugins Registry
  const registry = new PluginRegistry(pluginsDir)
  await registry.loadAll()

  const primbonCategory = registry.categories.get('primbon')
  assert.ok(primbonCategory, 'Primbon category should exist in registry')
  assert.ok(primbonCategory.size >= 25, `Expected >= 25 primbon plugins, got ${primbonCategory.size}`)

  const expectedCommands = [
    'primbon', 'artinama', 'tafsirmimpi', 'jodoh', 'cocoknama', 'cocokpasangan',
    'cinta', 'suamiistri', 'pernikahan', 'weton', 'rejeki', 'arahrejeki',
    'usaha', 'pekerjaan', 'potensi', 'peruntungan', 'nasib', 'penyakit',
    'karakter', 'horoskop', 'shio', 'haribaik', 'harinaas', 'harisangar',
    'nagahari', 'mancing', 'nomorhoki'
  ]

  for (const cmd of expectedCommands) {
    const handler = registry.getCommand(cmd)
    assert.ok(handler, `Command "${cmd}" should be registered and found by registry`)
  }
})

test('Upgrade Suite 4: Accurate Did You Mean & LID Resolution & Group/Owner Features', async () => {
  const { recordLidMapping, resolveLidToPn, normalizeNumber, normalizeJid } = await import('../lib/utils.js')
  const registry = new PluginRegistry(pluginsDir)
  await registry.loadAll()

  // 1. Accurate Did You Mean matching
  assert.equal(registry.findSimilar('pign'), 'ping')
  assert.equal(registry.findSimilar('mene'), 'menu')
  assert.equal(registry.findSimilar('wetom'), 'weton')
  assert.equal(registry.findSimilar('xyzrandomnonexistent'), null)

  // 2. LID to Real Phone Number JID Resolution
  const mockLid = '12345678901234@lid'
  const mockPn = '6281234567890@s.whatsapp.net'
  recordLidMapping(mockLid, mockPn)

  assert.equal(resolveLidToPn(mockLid), mockPn)
  assert.equal(normalizeNumber(mockLid), '6281234567890')
  assert.equal(normalizeJid(mockLid), mockPn)

  // 3. New Group Features registered
  const expectedGroupCmds = ['infogc', 'setnamegc', 'setdesc', 'setppgc', 'listadmin', 'totag', 'groupsetting']
  for (const cmd of expectedGroupCmds) {
    const handler = registry.getCommand(cmd)
    assert.ok(handler, `Group command "${cmd}" should be registered`)
  }

  // 4. New Owner Features registered
  const expectedOwnerCmds = ['broadcastgc', 'block', 'unblock', 'listblock', 'exec', 'clearsession']
  for (const cmd of expectedOwnerCmds) {
    const handler = registry.getCommand(cmd)
    assert.ok(handler, `Owner command "${cmd}" should be registered`)
  }
})

test('Upgrade Suite 5: RPG Family Engine & Fun Features', async () => {
  const { getFamily, saveFamily, formatFamilyDuration } = await import('../lib/family.js')
  const { initDatabase, databaseApi } = await import('../lib/database.js')
  await initDatabase()
  const registry = new PluginRegistry(pluginsDir)
  await registry.loadAll()

  // 1. Setup mock users for family testing
  const u1 = '62899999901'
  const u2 = '62899999902'
  databaseApi.registerUser(u1, 'Ayah Testing')
  databaseApi.registerUser(u2, 'Ibu Testing')

  const fam1 = getFamily(u1)
  const fam2 = getFamily(u2)
  assert.ok(fam1 && fam2, 'Both family records must exist')
  assert.equal(fam1.family.partner, null)

  // 2. Proposal Flow
  fam2.family.proposalFrom = u1
  saveFamily(fam2)
  const fam2Check = getFamily(u2)
  assert.equal(fam2Check.family.proposalFrom, u1)

  // 3. Marriage Accept Flow
  fam1.family.partner = u2
  fam1.family.marriedAt = Date.now() - 3600000 * 24 * 5 // 5 days ago
  fam1.family.harmony = 100
  fam2.family.partner = u1
  fam2.family.marriedAt = fam1.family.marriedAt
  fam2.family.harmony = 100
  fam2.family.proposalFrom = null
  saveFamily(fam1)
  saveFamily(fam2)

  const verifyMarried1 = getFamily(u1)
  const verifyMarried2 = getFamily(u2)
  assert.equal(verifyMarried1.family.partner, u2)
  assert.equal(verifyMarried2.family.partner, u1)
  assert.equal(verifyMarried1.family.harmony, 100)
  assert.ok(formatFamilyDuration(verifyMarried1.family.marriedAt).includes('5 hari'))

  // 4. Divorce Flow
  verifyMarried1.family.partner = null
  verifyMarried1.family.marriedAt = null
  verifyMarried2.family.partner = null
  verifyMarried2.family.marriedAt = null
  saveFamily(verifyMarried1)
  saveFamily(verifyMarried2)

  const verifyDivorced1 = getFamily(u1)
  assert.equal(verifyDivorced1.family.partner, null)

  // 5. Verify RPG Family Commands registered in plugin registry
  const expectedFamilyCmds = ['lamar', 'terimalamar', 'tolaklamar', 'keluarga', 'nafkah', 'kencan', 'adopsi', 'cerai']
  for (const cmd of expectedFamilyCmds) {
    const handler = registry.getCommand(cmd)
    assert.ok(handler, `Family command "${cmd}" should be registered in plugin registry`)
  }

  // 6. Verify Fun Commands registered in plugin registry
  const expectedFunCmds = ['slot', 'roulette', 'kiss', 'slap', 'topmember', 'topganteng', 'topcantik', 'topbucin', 'topwibu', 'susunkata']
  for (const cmd of expectedFunCmds) {
    const handler = registry.getCommand(cmd)
    assert.ok(handler, `Fun command "${cmd}" should be registered in plugin registry`)
  }
})

test('Upgrade Suite 6: Popular Indonesian WhatsApp Bot Anti-Systems', async () => {
  const { initDatabase, databaseApi } = await import('../lib/database.js')
  await initDatabase()
  const registry = new PluginRegistry(pluginsDir)
  await registry.loadAll()

  // 1. Verify all 11 Anti commands registered in registry
  const expectedAntiCmds = [
    'antilink', 'antilinkall', 'antivirtex', 'antidelete', 'antiviewonce',
    'antibot', 'antitoxic', 'antispam', 'antisticker', 'antinsfw', 'antisettings'
  ]
  for (const cmd of expectedAntiCmds) {
    const handler = registry.getCommand(cmd)
    assert.ok(handler, `Anti command "${cmd}" should be registered in plugin registry`)
  }

  // 2. Test group database persistence for anti systems
  const testGroupId = '628123456789-123456@g.us'
  databaseApi.setGroup(testGroupId, {
    antilinkwa: true,
    antilinkall: true,
    antivirtex: true,
    antidelete: true,
    antiviewonce: true,
    antibot: true,
    antitoxic: true,
    antispam: true,
    antisticker: true,
    antinsfw: true
  })

  const groupData = databaseApi.getGroup(testGroupId)
  assert.equal(groupData.antilinkwa, true)
  assert.equal(groupData.antilinkall, true)
  assert.equal(groupData.antivirtex, true)
  assert.equal(groupData.antidelete, true)
  assert.equal(groupData.antiviewonce, true)
  assert.equal(groupData.antibot, true)
  assert.equal(groupData.antitoxic, true)
  assert.equal(groupData.antispam, true)
  assert.equal(groupData.antisticker, true)
  assert.equal(groupData.antinsfw, true)

  // 3. Test antilink before hook detection
  const antilinkPlugin = registry.getCommand('antilink')
  assert.ok(typeof antilinkPlugin.handler?.before === 'function', 'antilink must have a before hook')

  let deleted = false
  let repliedText = ''
  const mockMsg = {
    isGroup: true,
    fromMe: false,
    chat: testGroupId,
    sender: '6289988776655@s.whatsapp.net',
    text: 'Ayo join grup baru https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv',
    key: { id: 'TEST_KEY_123' },
    isOwner: false,
    reply: async (text) => {
      repliedText = text
      return true
    }
  }

  const mockContext = {
    sock: {
      sendMessage: async (jid, opts) => {
        if (opts.delete) deleted = true
      }
    },
    isAdmin: false,
    isBotAdmin: true,
    getGroup: () => groupData
  }

  await antilinkPlugin.handler.before(mockMsg, mockContext)
  assert.equal(deleted, true, 'Antilink must delete unauthorized whatsapp group link')
  assert.ok(repliedText.includes('PERINGATAN ANTI LINK'), 'Antilink must send warning message')
})



