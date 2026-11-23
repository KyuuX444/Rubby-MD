import crypto from 'node:crypto'
import os from 'node:os'
import process from 'node:process'
import logger from './logger.js'

/**
 * SSMS - Safe Script & Module Management System
 * Centralized, safe custom code and module manager.
 * Strictly avoids eval() and new Function().
 */
export class SSMSManager {
  constructor(options = {}) {
    this.enabled = options.enabled ?? true
    this.modules = new Map()
    this.customCommands = new Map()
    this.executionHistory = []
    this.maxHistory = 100

    this._registerBuiltins()
  }

  /**
   * Register a safe module
   */
  registerModule(name, meta = {}, actions = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('Module name must be a non-empty string')
    }

    const actionMap = new Map()
    for (const [actionName, actionDef] of Object.entries(actions)) {
      if (typeof actionDef === 'function') {
        actionMap.set(actionName, {
          handler: actionDef,
          description: '',
          params: []
        })
      } else if (typeof actionDef?.handler === 'function') {
        actionMap.set(actionName, {
          handler: actionDef.handler,
          description: actionDef.description || '',
          params: actionDef.params || []
        })
      }
    }

    this.modules.set(name, {
      name,
      description: meta.description || '',
      version: meta.version || '1.0.0',
      author: meta.author || 'System',
      registeredAt: Date.now(),
      actions: actionMap
    })

    return true
  }

  unregisterModule(name) {
    return this.modules.delete(name)
  }

  getModule(name) {
    return this.modules.get(name) || null
  }

  listModules() {
    const list = []
    for (const [name, mod] of this.modules.entries()) {
      const actions = []
      for (const [actName, act] of mod.actions.entries()) {
        actions.push({
          name: actName,
          description: act.description,
          params: act.params
        })
      }
      list.push({
        name,
        description: mod.description,
        version: mod.version,
        author: mod.author,
        registeredAt: mod.registeredAt,
        actions
      })
    }
    return list
  }

  /**
   * Safe execution of a registered module action.
   * Completely sandboxed by only executing predetermined functions.
   */
  async execute(moduleName, actionName, params = {}, context = {}) {
    if (!this.enabled) {
      throw new Error('SSMS is currently disabled in configuration')
    }

    const mod = this.modules.get(moduleName)
    if (!mod) {
      throw new Error(`SSMS module '${moduleName}' not found`)
    }

    const action = mod.actions.get(actionName)
    if (!action) {
      throw new Error(`Action '${actionName}' not found in SSMS module '${moduleName}'`)
    }

    const startTime = Date.now()
    try {
      const result = await action.handler(params, context)
      const duration = Date.now() - startTime

      this._recordExecution({
        module: moduleName,
        action: actionName,
        status: 'success',
        duration,
        timestamp: Date.now()
      })

      return {
        success: true,
        module: moduleName,
        action: actionName,
        result,
        duration
      }
    } catch (err) {
      const duration = Date.now() - startTime
      this._recordExecution({
        module: moduleName,
        action: actionName,
        status: 'error',
        error: err.message,
        duration,
        timestamp: Date.now()
      })
      throw err
    }
  }

  /**
   * Register a custom alias/command mapping to an SSMS module action
   */
  registerCustomCommand(command, { module, action, defaultParams = {} }) {
    if (!command || !module || !action) {
      throw new Error('Invalid custom command configuration')
    }
    this.customCommands.set(command.toLowerCase(), {
      module,
      action,
      defaultParams
    })
    return true
  }

  hasCustomCommand(command) {
    return this.customCommands.has(command.toLowerCase())
  }

  async executeCustomCommand(command, inputArgs = [], context = {}) {
    const cmd = this.customCommands.get(command.toLowerCase())
    if (!cmd) return null

    const params = {
      ...cmd.defaultParams,
      args: inputArgs,
      text: inputArgs.join(' ')
    }

    return await this.execute(cmd.module, cmd.action, params, context)
  }

  _recordExecution(entry) {
    this.executionHistory.push(entry)
    if (this.executionHistory.length > this.maxHistory) {
      this.executionHistory.shift()
    }
  }

  getExecutionHistory() {
    return [...this.executionHistory]
  }

  _registerBuiltins() {
    // 1. System Module
    this.registerModule('system', {
      description: 'System diagnostic and resource monitoring',
      version: '1.0.0',
      author: 'Rubby Core'
    }, {
      status: {
        description: 'Get bot system status',
        handler: async () => {
          const totalMem = os.totalmem()
          const freeMem = os.freemem()
          const uptime = process.uptime()
          return {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            uptimeSeconds: Math.floor(uptime),
            memory: {
              total: Math.round(totalMem / (1024 * 1024)) + ' MB',
              free: Math.round(freeMem / (1024 * 1024)) + ' MB',
              used: Math.round((totalMem - freeMem) / (1024 * 1024)) + ' MB'
            },
            modulesCount: this.modules.size,
            commandsCount: this.customCommands.size
          }
        }
      },
      ping: {
        description: 'Measure execution latency',
        handler: async () => {
          return { pong: true, timestamp: Date.now() }
        }
      }
    })

    // 2. Tools Module
    this.registerModule('tools', {
      description: 'Safe cryptographic and string manipulation utilities',
      version: '1.0.0',
      author: 'Rubby Core'
    }, {
      hash: {
        description: 'Generate secure hashes (sha256, md5, sha1)',
        params: ['text', 'algorithm'],
        handler: async (params) => {
          const text = String(params.text || '')
          const algo = (params.algorithm || 'sha256').toLowerCase()
          if (!['sha256', 'md5', 'sha1', 'sha512'].includes(algo)) {
            throw new Error('Unsupported algorithm. Use sha256, md5, sha1, or sha512')
          }
          return {
            algorithm: algo,
            digest: crypto.createHash(algo).update(text).digest('hex')
          }
        }
      },
      base64: {
        description: 'Encode or decode base64 strings',
        params: ['text', 'mode'],
        handler: async (params) => {
          const text = String(params.text || '')
          const mode = (params.mode || 'encode').toLowerCase()
          if (mode === 'decode') {
            return {
              mode: 'decode',
              result: Buffer.from(text, 'base64').toString('utf8')
            }
          }
          return {
            mode: 'encode',
            result: Buffer.from(text, 'utf8').toString('base64')
          }
        }
      }
    })

    // 3. Economy Bridge Module
    this.registerModule('economy', {
      description: 'Safe interface for database economy operations',
      version: '1.0.0',
      author: 'Rubby Core'
    }, {
      getBalance: {
        description: 'Fetch user wallet balance and bank balance',
        params: ['userId'],
        handler: async (params) => {
          if (!params.userId) throw new Error('userId is required')
          if (global.db?.getUser) {
            const user = global.db.getUser(params.userId)
            return {
              userId: params.userId,
              balance: user?.balance ?? 0,
              bank: user?.bank ?? 0,
              limit: user?.limit_count ?? 0
            }
          }
          return { userId: params.userId, balance: 0, bank: 0, limit: 0 }
        }
      }
    })

    // 4. Messaging Module
    this.registerModule('messaging', {
      description: 'Unified cross-platform message dispatcher',
      version: '1.0.0',
      author: 'Rubby Core'
    }, {
      sendWhatsApp: {
        description: 'Send text message via WhatsApp',
        params: ['jid', 'text'],
        handler: async (params, context) => {
          const conn = context.conn || global.conn
          if (!conn || typeof conn.sendMessage !== 'function') {
            throw new Error('WhatsApp connection is not active')
          }
          if (!params.jid || !params.text) {
            throw new Error('jid and text are required')
          }
          const jid = params.jid.includes('@') ? params.jid : `${params.jid}@s.whatsapp.net`
          const sent = await conn.sendMessage(jid, { text: String(params.text) })
          return { success: true, messageId: sent?.key?.id }
        }
      }
    })
  }
}

export const ssmsInstance = new SSMSManager()
export default ssmsInstance
