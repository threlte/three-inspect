/* eslint-disable lines-between-class-members */

import type { Events } from './events'

export class EventHandle {
  owner: null | Events = null
  name: null | string = null
  fn: null | (() => void) = null

  /**
   * @param owner - Owner
   * @param name - Name
   * @param fn - Callback function
   */
  constructor (owner: Events, name: string, fn: () => void) {
    this.owner = owner
    this.name = name
    this.fn = fn
  }

  /**
   */
  unbind () {
    if (!this.owner) {
      return
    }

    this.owner.unbind(this.name!, this.fn!)

    this.owner = null
    this.name = null
    this.fn = null
  }

  call (...args: []) {
    if (!this.fn) {
      return
    }

    this.fn.call(this.owner, ...args)
  }

  /**
   * @param name - Name
   * @param {HandleEvent} fn - Callback function
   * @returns - EventHandle
   */
  on (name: string, fn: any): EventHandle {
    return this.owner!.on(name, fn)
  }
}
