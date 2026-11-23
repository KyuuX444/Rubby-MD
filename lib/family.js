import databaseApi from './database.js'
import { getCleanNumber } from './economy.js'

export function getFamily(userId) {
  const num = getCleanNumber(userId)
  if (!num) return null
  const user = databaseApi.getUser(num)
  if (!user) return null

  if (!user.data || typeof user.data !== 'object') {
    user.data = {}
  }

  if (!user.data.family || typeof user.data.family !== 'object') {
    user.data.family = {
      partner: null,
      marriedAt: 0,
      proposalFrom: null,
      harmony: 0,
      children: [],
      parents: [],
      house: 'Gubuk Sederhana',
      lastDating: 0,
      lastNafkah: 0
    }
  }

  return { user, num, family: user.data.family }
}

export function saveFamily(userObj) {
  if (!userObj?.num || !userObj.user) return false
  return databaseApi.updateUser(userObj.num, {
    data: userObj.user.data
  })
}

export function formatFamilyDuration(ms) {
  if (ms <= 0) return '0 hari'
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days} hari ${hours} jam`
  return `${hours} jam`
}

export default {
  getFamily,
  saveFamily,
  formatFamilyDuration
}
