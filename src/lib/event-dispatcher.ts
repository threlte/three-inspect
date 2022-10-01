/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

type Listener = (...args: unknown[]) => void

class EventDispatcher {
  listeners: Record<string, Listener[]> = {}

  addEventListener (type: string, listener: Listener) {
    const { listeners } = this

    if (listeners[type] === undefined) {
      listeners[type] = []
    }

    if (!listeners[type].includes(listener)) {
      listeners[type].push(listener)
    }
  }

  hasEventListener (type: string, listener: Listener) {
    const { listeners } = this

    return listeners[type] !== undefined && listeners[type].includes(listener)
  }

  removeEventListener (type: string, listener: Listener) {
    const { listeners } = this
    const listenerArray = listeners[type]

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener)

      if (index !== -1) {
        listenerArray.splice(index, 1)
      }
    }
  }

  dispatchEvent (event: Record<string, unknown> & { type: string }) {
    const { listeners } = this
    const listenerArray = listeners[event.type]

    if (listenerArray !== undefined) {
      event.target = this

      // Make a copy, in case listeners are removed while iterating.
      const array = listenerArray.slice(0)

      for (let i = 0, l = array.length; i < l; i += 1) {
        array[i].call(this, event)
      }

      event.target = null
    }
  }
}

export { EventDispatcher }
