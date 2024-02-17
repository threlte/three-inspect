<script lang="ts">
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import { inspectorScope, type InspectorActions, type InspectorState } from './types'

	const { addExtension, removeExtension } = useStudio()

	addExtension<InspectorState, InspectorActions>({
		scope: inspectorScope,
		state({ persist }) {
			return {
				enabled: persist(true),
			}
		},
		actions: {
			setEnabled({ select }, enabled) {
				select((s) => s.enabled).set(enabled)
			},
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((enabled) => !enabled)
			},
		},
	})

	onDestroy(() => {
		removeExtension(inspectorScope)
	})
</script>
