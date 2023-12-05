/* eslint-disable func-style */
import type { BindingParams, FolderApi, InputBindingApi, TabPageApi } from 'tweakpane'
import { type Writable, derived, get, writable } from 'svelte/store'
import { getParent } from '../context'
import { onDestroy } from 'svelte'

export type UseBindingBaseOptions = {
  label: string
  params?: BindingParams
  parent?: FolderApi | TabPageApi
  onChange?: () => void
  onClick?: () => void
}

export type UseBindingOptionsObject = {
  object?: unknown
}

export type UseBindingOptionsValue<T> = {
  label: string
  value?: T
}

export type UseBindingOptions<T> = UseBindingBaseOptions & (UseBindingOptionsObject | UseBindingOptionsValue<T>)

export function useBinding<T>(options: UseBindingBaseOptions & UseBindingOptionsObject): { binding: InputBindingApi<T> }
export function useBinding<T>(options: UseBindingBaseOptions & UseBindingOptionsValue<T>): Writable<T> & { binding: InputBindingApi<T> }

export function useBinding<Value = unknown> (options: UseBindingOptions<Value>) {
  const parent = getParent()

  if ('object' in options) {
    const binding = parent.addBinding<Record<string, Value>, string>(
      options.object as Record<string, Value>,
      options.label,
      options.params
    )

    if (options.onChange) {
      binding.on('change', options.onChange)
    }

    if (options.onClick) {
      binding.element.addEventListener('click', options.onClick)
    }

    onDestroy(() => {
      binding.dispose()
      if (options.onClick) {
        binding.element.removeEventListener('click', options.onClick)
      }
    })

    return { binding }
  }

  if (!('value' in options)) {
    throw new Error('Invalid input binding options')
  }
  const inputStore = writable({
    updatedAt: performance.now(),
    value: options.value,
  })

  const userStore = writable({
    updatedAt: performance.now(),
    value: options.value,
  })

  const store = writable<Value>(options.value)

  const binding = parent.addBinding<Record<string, Value>, string>(
    { [options.label]: get(store) },
    options.label,
    options.params
  )

  if (options.onChange) {
    binding.on('change', options.onChange)
  }

  binding.on('change', (e: { value: Value }) => {
    inputStore.set({
      updatedAt: performance.now(),
      value: e.value,
    })
  })

  const unsubscribe = userStore.subscribe((v) => {
    binding.controller.value.binding.target.write(v.value)
    binding.refresh()
  })

  const value = derived([inputStore, userStore], ([inputStoreValue, userStoreValue]) => {
    if (inputStoreValue.updatedAt > userStoreValue.updatedAt) {
      return inputStoreValue.value
    }
    return userStoreValue.value
  })

  onDestroy(() => {
    unsubscribe()
    binding.dispose()
  })

  return {
    binding,
    subscribe: value.subscribe,
    set: (nextValue: Value) => {
      userStore.set({
        updatedAt: performance.now(),
        value: nextValue,
      })
    },
    update: (fn: (nextValue: Value) => Value) => {
      userStore.update((v) => ({
        updatedAt: performance.now(),
        value: fn(v.value),
      }))
    },
  } satisfies Writable<Value>
}
