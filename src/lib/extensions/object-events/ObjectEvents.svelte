<script lang="ts">
	import mitt, { type Emitter } from 'mitt'
	import { useStudio } from '../../internal/extensions'
	import {
		objectEventsScope,
		type ObjectEventsActions,
		type ObjectEventsState,
		type ObjectEvents,
	} from './types'
	import { onDestroy } from 'svelte'

	const { addExtension, removeExtension } = useStudio()

	const emitter = mitt() as Emitter<ObjectEvents>

	addExtension<ObjectEventsState, ObjectEventsActions>({
		scope: objectEventsScope,
		state: () => {
			return {}
		},
		actions: {
			emit(_, ...args) {
				emitter.emit(...args)
			},
			off(_, ...args) {
				emitter.off(...args)
			},
			on(_, ...args) {
				emitter.on(...args)
			},
		},
	})

	onDestroy(() => {
		removeExtension(objectEventsScope)
	})
</script>
