<script lang="ts">
	import EditorCamera from '../../extensions/editor-camera/EditorCamera.svelte'
	import Grid from '../../extensions/grid/Grid.svelte'
	import Helpers from '../../extensions/helpers/Helpers.svelte'
	import Inspector from '../../extensions/inspector/Inspector.svelte'
	import ObjectSelection from '../../extensions/object-selection/ObjectSelection.svelte'
	import RenderModes from '../../extensions/render-modes/RenderModes.svelte'
	import SceneHierarchy from '../../extensions/scene-hierarchy/SceneHierarchy.svelte'
	import Snapping from '../../extensions/snapping/Snapping.svelte'
	import Space from '../../extensions/space/Space.svelte'
	import StudioObjectsRegistry from '../../extensions/studio-objects-registry/StudioObjectsRegistry.svelte'
	import TransformControls from '../../extensions/transform-controls/TransformControls.svelte'
	import { createRootContext } from '../../internal/extensions'
	import Toolbar from '../Toolbar/Toolbar.svelte'

	createRootContext()
</script>

<Toolbar />

<Space />
<Snapping />
<ObjectSelection />
<StudioObjectsRegistry />
<TransformControls />
<EditorCamera />
<RenderModes />
<Grid />
<Helpers />
<SceneHierarchy />
<Inspector />

<slot />
