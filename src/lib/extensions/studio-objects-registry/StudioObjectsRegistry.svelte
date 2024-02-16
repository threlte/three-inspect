<script lang="ts">
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import {
		studioObjectsRegistryScope,
		type StudioObjectsRegistryActions,
		type StudioObjectsRegistryState,
	} from './types'

	const { addExtension, removeExtension } = useStudio()

	addExtension<StudioObjectsRegistryState, StudioObjectsRegistryActions>({
		scope: studioObjectsRegistryScope,
		state() {
			return {
				objects: new Set(),
			}
		},
		actions: {
			addObject({ select }, object) {
				select((s) => s.objects).update((objects) => {
					objects.add(object)
					return objects
				})
			},
			removeObject({ select }, object) {
				select((s) => s.objects).update((objects) => {
					objects.delete(object)
					return objects
				})
			},
		},
	})

	onDestroy(() => {
		removeExtension(studioObjectsRegistryScope)
	})
</script>
