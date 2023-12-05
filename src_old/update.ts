type Callback = () => void

let handle = -1

const callbacks: Callback[] = []

const loop = () => {
  for (let i = 0, l = callbacks.length; i < l; i += 1) {
    callbacks[i]()
  }

  handle = requestAnimationFrame(loop)
}

/**
 * Starts the animation loop.
 */
export const run = () => {
  handle = requestAnimationFrame(loop)
}

/**
 * Pauses the animation looop.
 */
export const pause = () => {
  cancelAnimationFrame(handle)
}

/**
 * Registers a callback that will be executed on each frame.
 * @param callback The callback to execute on each frame.
 */
export const update = (callback: Callback) => {
  callbacks.push(callback)
}

export const removeUpdate = (callback: Callback) => {
  callbacks.splice(callbacks.indexOf(callback), 1)
}
