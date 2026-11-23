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

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import logger from './logger.js'
import { stringSimilarity, levenshteinDistance } from './utils.js'

function testRegex(regex, str) {
  if (!(regex instanceof RegExp)) return false
  regex.lastIndex = 0
  return regex.test(str)
}

function extractCommandsFromHandler(handler, defaultName) {
  const result = new Set()

  if (typeof handler.command === 'string' && handler.command.trim()) {
    result.add(handler.command.toLowerCase().trim())
  } else if (Array.isArray(handler.command)) {
    for (const item of handler.command) {
      if (typeof item === 'string' && item.trim()) {
        result.add(item.toLowerCase().trim())
      } else if (item instanceof RegExp) {
        const clean = item.source.replace(/^[\^\(\)]+|[\$\(\)]+$/g, '')
        clean.split('|').forEach(s => {
          const w = s.replace(/[\\]/g, '').toLowerCase().trim()
          if (w) result.add(w)
        })
      }
    }
  } else if (handler.command instanceof RegExp) {
    const clean = handler.command.source.replace(/^[\^\(\)]+|[\$\(\)]+$/g, '')
    clean.split('|').forEach(s => {
      const w = s.replace(/[\\]/g, '').toLowerCase().trim()
      if (w) result.add(w)
    })
  }

  if (Array.isArray(handler.help)) {
    for (const h of handler.help) {
      const firstWord = String(h).split(/\s+/)[0].replace(/^\./, '').toLowerCase().trim()
      if (firstWord) result.add(firstWord)
    }
  }

  if (result.size === 0) {
    result.add(defaultName.toLowerCase())
  }

  return Array.from(result)
}

function getPrimaryCommand(handler, extractedCommands, defaultName) {
  if (Array.isArray(handler.help) && handler.help.length > 0) {
    const firstHelp = String(handler.help[0]).split(/\s+/)[0].replace(/^\./, '').toLowerCase().trim()
    if (firstHelp) return firstHelp
  }
  if (typeof handler.help === 'string' && handler.help.trim()) {
    const firstHelp = handler.help.split(/\s+/)[0].replace(/^\./, '').toLowerCase().trim()
    if (firstHelp) return firstHelp
  }
  return extractedCommands[0] || defaultName.toLowerCase()
}

export class PluginRegistry {
  constructor(pluginsDir) {
    this.pluginsDir = pluginsDir
    this.plugins = new Map()
    this.commands = new Map()
    this.categories = new Map()
  }

  async loadAll() {
    this.plugins.clear()
    this.commands.clear()
    this.categories.clear()

    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true })
    }

    const files = this.scanDir(this.pluginsDir)
    let loadedCount = 0

    for (const filePath of files) {
      const success = await this.loadPlugin(filePath)
      if (success) loadedCount++
    }

    logger.plugin(`${loadedCount} plugins loaded`)
  }

  scanDir(dir) {
    let results = []
    const list = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of list) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        results = results.concat(this.scanDir(fullPath))
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        results.push(fullPath)
      }
    }
    return results
  }

  validatePermissions(handler) {
    if (handler.group === true && handler.private === true) {
      return {
        valid: false,
        error: 'Plugin cannot have both "group = true" and "private = true"'
      }
    }
    return { valid: true }
  }

  async loadPlugin(filePath) {
    const relativePath = path.relative(this.pluginsDir, filePath)
    const previousPluginData = this.plugins.get(filePath) || null

    try {
      if (!fs.existsSync(filePath)) {
        this.unloadPlugin(filePath, true)
        return false
      }

      const pathSegments = relativePath.split(path.sep)
      const category = pathSegments.length > 1 ? pathSegments[0].toLowerCase() : 'other'
      const baseName = path.basename(filePath, '.js')

      const fileUrl = `${pathToFileURL(filePath).href}?update=${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      let module
      try {
        module = await import(fileUrl)
      } catch (importErr) {
        logger.error(`Failed to import plugin: ${relativePath} (${importErr?.message || importErr})`)
        if (previousPluginData) {
          logger.warn(`Rollback: keeping previous active version for '${relativePath}'.`)
        }
        return false
      }

      const handler = module.default
      if (!handler || typeof handler !== 'function') {
        logger.warn(`Plugin ${relativePath} skipped: default export is not a function`)
        if (previousPluginData) {
          logger.warn(`Rollback: keeping previous active version for '${relativePath}'.`)
        }
        return false
      }

      const validation = this.validatePermissions(handler)
      if (!validation.valid) {
        logger.warn(`Plugin ${relativePath} invalid: ${validation.error}`)
        if (previousPluginData) {
          logger.warn(`Rollback: keeping previous active version for '${relativePath}'.`)
        }
        return false
      }

      // If reloading an existing plugin, clean up old resources
      if (previousPluginData?.handler) {
        try {
          if (typeof previousPluginData.handler.cleanup === 'function') {
            await previousPluginData.handler.cleanup()
          } else if (typeof previousPluginData.handler.destroy === 'function') {
            await previousPluginData.handler.destroy()
          } else if (typeof previousPluginData.handler.unload === 'function') {
            await previousPluginData.handler.unload()
          }
        } catch (cleanupErr) {
          logger.error(`Error cleaning up resources for ${relativePath}:`, cleanupErr)
        }
      }

      // Unload previous command registrations for this file
      this.unloadPlugin(filePath, false)

      const commands = extractCommandsFromHandler(handler, baseName)
      const validCommands = []

      for (const cmd of commands) {
        if (this.commands.has(cmd)) {
          const existing = this.commands.get(cmd)
          if (existing.filePath !== filePath) {
            logger.warn(`Duplicate command conflict: '.${cmd}' in '${relativePath}' conflicts with '${existing.relativePath}'. Registration canceled for '.${cmd}'.`)
          }
        } else {
          validCommands.push(cmd)
        }
      }

      const primaryCommand = getPrimaryCommand(handler, validCommands.length > 0 ? validCommands : commands, baseName)

      const pluginData = {
        filePath,
        relativePath,
        category,
        handler,
        primaryCommand,
        commands: validCommands,
        allCommands: commands,
        dynamicCommands: new Set(),
        owner: Boolean(handler.owner),
        premium: Boolean(handler.premium),
        group: Boolean(handler.group),
        private: Boolean(handler.private),
        admin: Boolean(handler.admin),
        botadmin: Boolean(handler.botadmin),
        noJadiBot: Boolean(handler.noJadiBot),
        limit: Boolean(handler.limit),
        register: Boolean(handler.register),
        noPrefix: handler.noPrefix,
        customPrefix: handler.customPrefix,
        hidden: Boolean(handler.hidden || handler.hideMenu || handler.noMenu)
      }

      this.plugins.set(filePath, pluginData)

      for (const cmd of validCommands) {
        this.commands.set(cmd, pluginData)
      }

      if (!this.categories.has(category)) {
        this.categories.set(category, new Map())
      }
      this.categories.get(category).set(filePath, pluginData)

      return true
    } catch (err) {
      logger.error(`Unexpected failure while loading plugin: ${relativePath}`, err)
      // Rollback to previous plugin if available
      if (previousPluginData) {
        try {
          this.plugins.set(filePath, previousPluginData)
          for (const cmd of previousPluginData.commands) {
            this.commands.set(cmd, previousPluginData)
          }
          if (!this.categories.has(previousPluginData.category)) {
            this.categories.set(previousPluginData.category, new Map())
          }
          this.categories.get(previousPluginData.category).set(filePath, previousPluginData)
          logger.warn(`Rollback successfully restored previous active version for '${relativePath}'.`)
        } catch {}
      }
      return false
    }
  }

  unloadPlugin(filePath, logAction = true) {
    if (!this.plugins.has(filePath)) return

    const pluginData = this.plugins.get(filePath)

    // Call cleanup hooks on the plugin before unloading
    if (pluginData?.handler) {
      try {
        if (typeof pluginData.handler.cleanup === 'function') {
          pluginData.handler.cleanup()
        } else if (typeof pluginData.handler.destroy === 'function') {
          pluginData.handler.destroy()
        } else if (typeof pluginData.handler.unload === 'function') {
          pluginData.handler.unload()
        }
      } catch (cleanErr) {
        logger.error(`Error during plugin unload cleanup for ${pluginData.relativePath}:`, cleanErr)
      }
    }

    // Clean all registered and dynamically matched commands for this file
    for (const [cmd, pData] of this.commands.entries()) {
      if (pData.filePath === filePath) {
        this.commands.delete(cmd)
      }
    }

    if (this.categories.has(pluginData.category)) {
      this.categories.get(pluginData.category).delete(filePath)
      if (this.categories.get(pluginData.category).size === 0) {
        this.categories.delete(pluginData.category)
      }
    }

    this.plugins.delete(filePath)
    if (logAction) {
      logger.hotreload(`Plugin unloaded: ${pluginData.relativePath}`)
    }
  }

  getCommand(commandName) {
    if (!commandName) return null
    const lower = commandName.toLowerCase()
    if (this.commands.has(lower)) {
      return this.commands.get(lower)
    }

    for (const pluginData of this.plugins.values()) {
      const handler = pluginData.handler
      if (!handler) continue

      if (handler.command instanceof RegExp) {
        if (testRegex(handler.command, commandName) || testRegex(handler.command, lower)) {
          this.commands.set(lower, pluginData)
          pluginData.dynamicCommands?.add(lower)
          return pluginData
        }
      } else if (Array.isArray(handler.command)) {
        for (const cmd of handler.command) {
          if (cmd instanceof RegExp && (testRegex(cmd, commandName) || testRegex(cmd, lower))) {
            this.commands.set(lower, pluginData)
            pluginData.dynamicCommands?.add(lower)
            return pluginData
          }
          if (typeof cmd === 'string' && cmd.toLowerCase() === lower) {
            this.commands.set(lower, pluginData)
            pluginData.dynamicCommands?.add(lower)
            return pluginData
          }
        }
      } else if (typeof handler.command === 'string' && handler.command.toLowerCase() === lower) {
        this.commands.set(lower, pluginData)
        pluginData.dynamicCommands?.add(lower)
        return pluginData
      }
    }

    return null
  }

  findSimilar(commandName, threshold = 0.50) {
    if (!commandName || typeof commandName !== 'string' || commandName.length < 2) return null
    const lower = commandName.toLowerCase().trim()

    let bestMatch = null
    let bestScore = 0

    // Collect all candidate commands
    const candidates = new Set()
    for (const [cmd] of this.commands.entries()) {
      if (cmd && cmd.length >= 2) candidates.add(cmd.toLowerCase())
    }
    for (const pluginData of this.plugins.values()) {
      for (const cmd of (pluginData.allCommands || [])) {
        if (cmd && cmd.length >= 2) candidates.add(cmd.toLowerCase())
      }
      if (pluginData.primaryCommand) candidates.add(pluginData.primaryCommand.toLowerCase())
    }

    if (candidates.has(lower)) return null

    for (const cand of candidates) {
      const lenDiff = Math.abs(cand.length - lower.length)
      if (lenDiff > 3) continue

      const dist = levenshteinDistance(lower, cand)
      const maxLen = Math.max(lower.length, cand.length)
      const sim = (maxLen - dist) / maxLen

      let isCandidate = false
      if (lower.length <= 4) {
        isCandidate = dist <= 1 || sim >= 0.65
      } else if (lower.length <= 7) {
        isCandidate = dist <= 2 || sim >= 0.60
      } else {
        isCandidate = dist <= 3 || sim >= 0.55
      }

      if (isCandidate) {
        let score = sim
        if (dist === 1) score += 0.3
        if (cand.startsWith(lower) || lower.startsWith(cand)) score += 0.2
        if (score > bestScore && sim >= threshold) {
          bestScore = score
          bestMatch = cand
        }
      }
    }

    return bestMatch
  }

  getMenuStructure() {
    const menu = {}
    const sortedCategories = Array.from(this.categories.keys()).sort()

    for (const cat of sortedCategories) {
      const pluginsMap = this.categories.get(cat)
      const list = []
      for (const pluginData of pluginsMap.values()) {
        if (pluginData.hidden) continue
        if (pluginData.handler?.multiscript || pluginData.handler?.allInMenu) {
          const cmds = Array.isArray(pluginData.commands) && pluginData.commands.length > 0
            ? pluginData.commands
            : [pluginData.primaryCommand]
          for (const cmd of cmds) {
            list.push({
              name: cmd,
              owner: pluginData.owner,
              premium: pluginData.premium,
              admin: pluginData.admin,
              group: pluginData.group,
              private: pluginData.private
            })
          }
        } else {
          list.push({
            name: pluginData.primaryCommand,
            owner: pluginData.owner,
            premium: pluginData.premium,
            admin: pluginData.admin,
            group: pluginData.group,
            private: pluginData.private
          })
        }
      }
      list.sort((a, b) => a.name.localeCompare(b.name))
      if (list.length > 0) {
        menu[cat] = list
      }
    }

    return {
      totalPlugins: this.plugins.size,
      totalCommands: this.commands.size,
      categories: menu
    }
  }
}

export class PluginWatcher {
  constructor(registry, pluginsDir) {
    this.registry = registry
    this.pluginsDir = pluginsDir
    this.watcher = null
    this.debounceTimers = new Map()
  }

  start() {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true })
    }

    try {
      this.watcher = fs.watch(
        this.pluginsDir,
        { recursive: true },
        (eventType, filename) => {
          if (!filename || !filename.endsWith('.js')) return
          // Ignore temporary/hidden/editor swap files
          const base = path.basename(filename)
          if (base.startsWith('.') || base.endsWith('~') || base.endsWith('.tmp') || base.endsWith('.swp')) {
            return
          }

          const filePath = path.resolve(this.pluginsDir, filename)

          if (this.debounceTimers.has(filePath)) {
            clearTimeout(this.debounceTimers.get(filePath))
          }

          const timer = setTimeout(async () => {
            this.debounceTimers.delete(filePath)
            await this.handleFileChange(filePath)
          }, 300)

          this.debounceTimers.set(filePath, timer)
        }
      )
    } catch (err) {
      logger.error('Failed to start plugin watcher', err)
    }
  }

  async handleFileChange(filePath) {
    const relativePath = path.relative(this.pluginsDir, filePath)
    try {
      const exists = fs.existsSync(filePath)

      if (exists) {
        let stats = null
        try { stats = fs.statSync(filePath) } catch {}
        if (!stats || stats.size === 0) return // Skip 0-byte transient state during file saves

        const isNew = !this.registry.plugins.has(filePath)
        const success = await this.registry.loadPlugin(filePath)
        if (success) {
          logger.hotreload(`plugins/${relativePath} ${isNew ? 'loaded' : 'updated'}`)
        }
      } else {
        this.registry.unloadPlugin(filePath, true)
      }
    } catch (err) {
      logger.error(`Error handling file change for plugins/${relativePath}:`, err)
    }
  }

  close() {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()

    if (this.watcher) {
      try {
        this.watcher.close()
      } catch {}
      this.watcher = null
    }
  }
}

export default {
  PluginRegistry,
  PluginWatcher
}
