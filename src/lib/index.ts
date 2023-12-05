import { setPersistedNamespace } from './internal/persisted'

setPersistedNamespace('three-inspect.')

export { default as Inspector } from './Inspector.svelte'
export { default as ThrelteInspector } from './InspectorThrelte.svelte'
export { default as R3fInspector } from './r3f'
