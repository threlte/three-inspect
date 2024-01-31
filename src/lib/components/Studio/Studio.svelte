<script lang="ts">
	import { objectSelection } from '../../extensions/object-selection'
	import RenderModes from '../../extensions/render-modes/RenderModes.svelte'
	import TransformControls from '../../extensions/transform-controls/TransformControls.svelte'
	import { createRootContext } from '../../internal/extensions'
	import Toolbar from '../Toolbar/Toolbar.svelte'

	createRootContext()

	// register default extensions
	objectSelection()
</script>

<Toolbar />

<!-- Default Extensions -->
<TransformControls />
<RenderModes />

<slot />
