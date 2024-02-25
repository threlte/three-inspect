<script lang="ts">
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import { syncScope, type SyncActions, type SyncState } from './types'

	const { addExtension, removeExtension } = useStudio()

	addExtension<SyncState, SyncActions>({
		scope: syncScope,
		state: ({ persist }) => {
			return {
				enabled: persist<boolean>(true),
				mode: persist('auto'),
			}
		},
		actions: {
			setEnabled(params, enabled) {},
		},
	})

	onDestroy(() => {
		removeExtension(syncScope)
	})
</script>
