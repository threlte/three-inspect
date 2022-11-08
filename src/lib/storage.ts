const prefix = 'three-inspect'

export const storage = {
  get (key: string) {
    return localStorage.getItem(`${prefix}.${key}`)
  },
  getJSON (key: string): unknown | null {
    const str = storage.get(key)

    if (str) {
      return JSON.parse(str)
    }

    return null
  },
  getNumber (key: string) {
    const str = storage.get(key)

    if (str) {
      return Number.parseFloat(str)
    }

    return null
  },
  remove (key: string) {
    localStorage.removeItem(`${prefix}.${key}`)
  },
  set (key: string, value: string) {
    return localStorage.setItem(`${prefix}.${key}`, value)
  },
  setJSON (key: string, value: unknown) {
    storage.set(key, JSON.stringify(value))
  },
  setNumber (key: string, value: number) {
    storage.set(key, String(value))
  },
}
