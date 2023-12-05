import { currentWritable } from '@threlte/core'

const interacting = currentWritable(false)

export const useInteracting = () => interacting
