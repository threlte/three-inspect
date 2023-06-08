/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

type Listener = (...args: unknown[]) => void

class EventDispatcher {
  listeners: Record<string, Listener[] | undefined> = {}

  addEventListener (type: string, listener: Listener) {
    const { listeners } = this

    listeners[type] ??= []

    const listenerArray = listeners[type]!

    if (!listenerArray.includes(listener)) {
      listenerArray.push(listener)
    }
  }

  hasEventListener (type: string, listener: Listener) {
    return this.listeners[type]?.includes(listener)
  }

  removeEventListener (type: string, listener: Listener) {
    const { listeners } = this
    const listenerArray = listeners[type]

    if (listenerArray === undefined) {
      return
    }

    const index = listenerArray.indexOf(listener)

    if (index !== -1) {
      listenerArray.splice(index, 1)
    }
  }

  dispatchEvent (event: Record<string, unknown> & { type: string }) {
    const { listeners } = this
    const listenerArray = listeners[event.type]

    if (listenerArray === undefined) {
      return
    }

    event.target = this

    // Make a copy, in case listeners are removed while iterating.
    const array = [...listenerArray]

    for (let i = 0, l = array.length; i < l; i += 1) {
      array[i].call(this, event)
    }

    event.target = undefined
  }
}

export { EventDispatcher }

export const dispatcher = new EventDispatcher()
