/* eslint-disable no-underscore-dangle */
import { EventHandle } from './event-handle'

type HandleEvent<Type = unknown> = (...args: Type[]) => void

/**
 * Base class for event handling.
 */
export class Events {
  #events: Record<string, HandleEvent<any>[] | undefined> = {}

  /**
   * @param name - Name
   * @param fn - Callback function
   * @returns EventHandle
   */
  on<Type = unknown> (name: string, fn: HandleEvent<Type>): EventHandle {
    const events = this.#events[name]
    if (events === undefined) {
      this.#events[name] = [fn]
    } else if (events.indexOf(fn) === -1) {
      events.push(fn)
    }
    return new EventHandle(this, name, fn)
  }

  /**
   * @param name - Name
   * @param fn - Callback function
   * @returns EventHandle
   */
  once (name: string, fn: HandleEvent): EventHandle {
    const evt = this.on(name, (...args) => {
      fn.call(this, ...args)
      evt.unbind()
    })
    return evt
  }

  /**
   * @param name - Name
   * @returns Self for chaining.
   */
  emit (name: string, ...args: unknown[]): this {
    let events = this.#events[name]
    if (events !== undefined && events.length > 0) {
      events = [...events]
      for (let i = 0, l = events.length; i < l; i += 1) {
        events[i].call(this, ...args)
      }
    }

    return this
  }

  /**
   * @param name - Name
   * @param fn - Callback function
   * @returns - This
   */
  unbind (name?: string, fn?: HandleEvent): this {
    if (name === undefined) {
      this.#events = {}
    } else {
      const events = this.#events[name]
      if (events === undefined) {
        return this
      }

      if (fn === undefined) {
        delete this.#events[name]
      } else {
        const i = events.indexOf(fn)
        if (i !== -1) {
          if (events.length === 1) {
            delete this.#events[name]
          } else {
            events.splice(i, 1)
          }
        }
      }
    }

    return this
  }
}
