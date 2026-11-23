import http from 'node:http'
import { URL } from 'node:url'
import logger from './logger.js'
import ssmsInstance from './ssms.js'

/**
 * CustomAPIManager
 * Embedded, high-performance HTTP REST API server.
 */
export class CustomAPIManager {
  constructor(options = {}) {
    this.enabled = options.enabled ?? true
    this.port = options.port || 3000
    this.apiKey = options.key || 'rubby-secret-key-2026'
    this.rateLimit = options.rateLimit || 60 // requests per minute
    this.server = null
    this.rateLimitMap = new Map()
    this.registry = options.registry || null
    this.conn = options.conn || null

    // Periodically clean up rate limit map
    this._rateLimitInterval = setInterval(() => {
      const now = Date.now()
      for (const [ip, entry] of this.rateLimitMap.entries()) {
        if (now - entry.resetTime > 60000) {
          this.rateLimitMap.delete(ip)
        }
      }
    }, 60000)
    if (this._rateLimitInterval.unref) {
      this._rateLimitInterval.unref()
    }
  }

  setRegistry(reg) {
    this.registry = reg
  }

  setConnections({ conn }) {
    if (conn) this.conn = conn
  }

  _isRateLimited(ip) {
    const now = Date.now()
    let record = this.rateLimitMap.get(ip)
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + 60000 }
      this.rateLimitMap.set(ip, record)
      return false
    }

    record.count++
    if (record.count > this.rateLimit) {
      return true
    }
    return false
  }

  _checkAuth(req, url) {
    const headerKey = req.headers['x-api-key']
    if (headerKey && headerKey === this.apiKey) return true

    const authHeader = req.headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim()
      if (token === this.apiKey) return true
    }

    const queryKey = url.searchParams.get('key')
    if (queryKey && queryKey === this.apiKey) return true

    return false
  }

  async _readJsonBody(req) {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', chunk => {
        body += chunk
        if (body.length > 1024 * 1024) { // 1MB limit
          reject(new Error('Payload too large'))
        }
      })
      req.on('end', () => {
        if (!body.trim()) {
          return resolve({})
        }
        try {
          resolve(JSON.parse(body))
        } catch {
          reject(new Error('Invalid JSON format'))
        }
      })
      req.on('error', reject)
    })
  }

  _sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key'
    })
    res.end(JSON.stringify(data, null, 2))
  }

  start(port) {
    if (!this.enabled) {
      console.log('Custom API server is disabled by configuration.')
      return
    }

    const listenPort = port || this.port

    this.server = http.createServer(async (req, res) => {
      const clientIp = req.socket.remoteAddress || '127.0.0.1'

      // CORS Preflight
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key'
        })
        return res.end()
      }

      // Rate Limiting
      if (this._isRateLimited(clientIp)) {
        return this._sendJson(res, 429, {
          success: false,
          error: 'Rate limit exceeded. Maximum 60 requests per minute.'
        })
      }

      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
      const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/'

      try {
        // Public Health Check
        if (pathname === '/health' || pathname === '/api/health') {
          return this._sendJson(res, 200, {
            status: 'ok',
            uptime: Math.floor(process.uptime()),
            timestamp: Date.now()
          })
        }

        // Authenticate all /api routes
        if (!this._checkAuth(req, parsedUrl)) {
          return this._sendJson(res, 401, {
            success: false,
            error: 'Unauthorized: Invalid or missing API key. Provide via X-API-Key header or ?key= query parameter.'
          })
        }

        // --- Authenticated Endpoints ---

        // 1. GET /api/status
        if (req.method === 'GET' && (pathname === '/api/status' || pathname === '/')) {
          const waConnected = Boolean(this.conn?.user?.id)

          return this._sendJson(res, 200, {
            success: true,
            bot: {
              name: global.botName || 'Rubby Multi Device',
              version: global.botVersion || '1.5.0',
              creator: global.botCreator || 'Kyuu',
              uptime: Math.floor(process.uptime()),
              timestamp: Date.now()
            },
            platforms: {
              whatsapp: {
                connected: waConnected,
                jid: this.conn?.user?.id || null,
                name: this.conn?.user?.name || null
              }
            },
            stats: {
              plugins: this.registry?.plugins?.size || 0,
              commands: this.registry?.commands?.size || 0,
              ssmsModules: ssmsInstance.modules.size
            }
          })
        }

        // 2. GET /api/plugins
        if (req.method === 'GET' && pathname === '/api/plugins') {
          const pluginsList = []
          if (this.registry?.plugins) {
            for (const [filePath, p] of this.registry.plugins.entries()) {
              pluginsList.push({
                relativePath: p.relativePath,
                commands: p.commands || [],
                allCommands: p.allCommands || [],
                help: p.handler?.help || null,
                tags: p.handler?.tags || [],
                ownerOnly: Boolean(p.owner),
                premiumOnly: Boolean(p.premium),
                groupOnly: Boolean(p.group),
                privateOnly: Boolean(p.private),
                limitRequired: p.limit || 0
              })
            }
          }
          return this._sendJson(res, 200, {
            success: true,
            total: pluginsList.length,
            plugins: pluginsList
          })
        }

        // 3. POST /api/plugins/toggle
        if (req.method === 'POST' && pathname === '/api/plugins/toggle') {
          const body = await this._readJsonBody(req)
          const { command, enabled } = body
          if (!command) {
            return this._sendJson(res, 400, { success: false, error: 'Parameter "command" is required' })
          }

          if (global.db) {
            if (enabled === false) {
              if (global.db.disablePlugin) global.db.disablePlugin(command)
            } else {
              if (global.db.enablePlugin) global.db.enablePlugin(command)
            }
          }

          return this._sendJson(res, 200, {
            success: true,
            message: `Plugin for command "${command}" has been ${enabled === false ? 'disabled' : 'enabled'}.`
          })
        }

        // 4. POST /api/message/send
        if (req.method === 'POST' && pathname === '/api/message/send') {
          const body = await this._readJsonBody(req)
          const { to, text } = body

          if (!to || !text) {
            return this._sendJson(res, 400, { success: false, error: 'Parameters "to" and "text" are required' })
          }

          // WhatsApp Send
          const conn = this.conn || global.conn
          if (!conn || typeof conn.sendMessage !== 'function') {
            return this._sendJson(res, 503, { success: false, error: 'WhatsApp is not connected' })
          }
          const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`
          const sent = await conn.sendMessage(jid, { text })
          return this._sendJson(res, 200, {
            success: true,
            platform: 'whatsapp',
            messageId: sent?.key?.id
          })
        }

        // 5. GET /api/ssms/modules
        if (req.method === 'GET' && pathname === '/api/ssms/modules') {
          const modules = ssmsInstance.listModules()
          return this._sendJson(res, 200, {
            success: true,
            total: modules.length,
            modules
          })
        }

        // 6. POST /api/ssms/execute
        if (req.method === 'POST' && pathname === '/api/ssms/execute') {
          const body = await this._readJsonBody(req)
          const { module, action, params } = body

          if (!module || !action) {
            return this._sendJson(res, 400, {
              success: false,
              error: 'Parameters "module" and "action" are required'
            })
          }

          const result = await ssmsInstance.execute(module, action, params || {}, {
            conn: this.conn || global.conn
          })

          return this._sendJson(res, 200, {
            success: true,
            execution: result
          })
        }

        // Route Not Found
        return this._sendJson(res, 404, {
          success: false,
          error: `Route ${req.method} ${pathname} not found.`
        })

      } catch (err) {
        logger.error(`API Error on ${req.method} ${pathname}:`, err)
        return this._sendJson(res, 500, {
          success: false,
          error: err.message || 'Internal Server Error'
        })
      }
    })

    return new Promise((resolve) => {
      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          const fallbackPort = listenPort + 1
          console.warn(`\x1b[33m[API] Port ${listenPort} is in use. Retrying on port ${fallbackPort}...\x1b[0m`)
          try {
            this.server.close()
          } catch {}
          this.server.listen(fallbackPort, () => {
            console.log(`\x1b[38;5;213m[API] Internal REST API server listening on fallback port \x1b[36m${fallbackPort}\x1b[0m`)
            resolve(this.server)
          })
        } else {
          console.error(`[API] Server error:`, err.message)
          resolve(null)
        }
      })

      this.server.listen(listenPort, () => {
        console.log(`\x1b[38;5;213m[API] Internal REST API server listening on port \x1b[36m${listenPort}\x1b[0m`)
        resolve(this.server)
      })
    })
  }

  async stop() {
    if (this._rateLimitInterval) {
      clearInterval(this._rateLimitInterval)
    }
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve))
      this.server = null
    }
  }
}

export const customApiInstance = new CustomAPIManager({
  enabled: global.api?.enabled ?? true,
  port: global.api?.port || 3000,
  key: global.api?.key || 'rubby-secret-key-2026',
  rateLimit: global.api?.rateLimit || 60
})

export default customApiInstance
