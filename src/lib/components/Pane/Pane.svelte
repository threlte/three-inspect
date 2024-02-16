<script lang="ts">
	import { Pane, ThemeUtils } from 'svelte-tweakpane-ui'
	import Portal from '../Internal/Portal.svelte'

	export let title = ''
	export let expanded = true
	export let userExpandable = true
	export let width = 500
</script>

<Portal>
	<Pane
		theme={ThemeUtils.presets.standard}
		{title}
		{expanded}
		{userExpandable}
		position="draggable"
		{width}
	>
		<slot />
	</Pane>
</Portal>
