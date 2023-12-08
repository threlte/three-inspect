import { onMount } from 'svelte'

type Callback = (time: number) => void

const callbacks: Callback[] = []

let rafid = -1

const toggle = (on: boolean) => {
  if (on) {
    rafid = requestAnimationFrame(function tick(time) {
      rafid = requestAnimationFrame(tick)
      for (const callback of callbacks) {
        callback(time)
      }
    })
  } else {
    cancelAnimationFrame(rafid)
  }
}

export const useUpdate = (callback: Callback) => {
  onMount(() => {
    callbacks.push(callback)
    if (callbacks.length === 1) {
      toggle(true)
    }
    return () => {
      callbacks.splice(callbacks.indexOf(callback), 1)
      if (callbacks.length === 0) {
        toggle(false)
      }
    }
  })
}
