import type * as THREE from 'three'

let object: typeof THREE

export const setThree = (three: typeof THREE) => {
  object = three
}

export const three = () => {
  return object
}
