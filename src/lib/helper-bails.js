export * from 'rubyy-baileys'
export { Button, ButtonV2, Carousel, AIRich } from 'rubyy-baileys'

export class BloksWidget {
  constructor(client) {
    this.client = client
    this.params = {}
  }
  setParams(p) {
    this.params = p
    return this
  }
}

export function makeHelper(sock) {
  return sock
}

export default makeHelper
