<script lang="ts">
	import { Element, Pane } from 'svelte-tweakpane-ui'
	import Portal from '../../components/Internal/Portal.svelte'
	import Tree from './Tree.svelte'
</script>

<Portal>
	<Pane
		title="Scene Hierarchy"
		userExpandable={false}
		position="fixed"
		y={72}
		x={6}
	>
		<Element>
			<Tree />
		</Element>
	</Pane>
</Portal>
