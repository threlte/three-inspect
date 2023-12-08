import { setPersistedNamespace } from './internal/persisted'

setPersistedNamespace('three-inspect.')

export { createInspector } from './inspector'
export { useInspector } from './internal/context'
export { default as Inspector } from './Threlte.svelte'
