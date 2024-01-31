<script lang="ts">
	import { writable } from 'svelte/store'

	const getComp = () => {
		return writable()
	}
</script>

<slot {getComp} />
