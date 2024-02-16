<script lang="ts">
	import EditorCamera from '../../extensions/editor-camera/EditorCamera.svelte'
	import Grid from '../../extensions/grid/Grid.svelte'
	import Helpers from '../../extensions/helpers/Helpers.svelte'
	import ObjectSelection from '../../extensions/object-selection/ObjectSelection.svelte'
	import RenderModes from '../../extensions/render-modes/RenderModes.svelte'
	import StudioObjectsRegistry from '../../extensions/studio-objects-registry/StudioObjectsRegistry.svelte'
	import TransformControls from '../../extensions/transform-controls/TransformControls.svelte'
	import { createRootContext } from '../../internal/extensions'
	import Toolbar from '../Toolbar/Toolbar.svelte'

	createRootContext()
</script>

<Toolbar />

<ObjectSelection />
<StudioObjectsRegistry />
<TransformControls />
<EditorCamera />
<RenderModes />
<Grid />
<Helpers />

<slot />
