export type Serializable =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | Record<string, unknown>
  | null
  | undefined

type Storage = Record<string, Serializable>

const get = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}')
  } catch {
    return {}
  }
}

const set = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage: Storage = get('threekit.debug')

export const save = (key: string, value: Serializable) => {
  storage[key] = value
  set('threekit.debug', storage)
}

export const erase = (...args: string[]) => {
  for (const arg of args) {
    delete storage[arg]
  }

  set('threekit.debug', storage)
}
