<script lang="ts">
	import { TransformControls } from '@threlte/extras'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'

	const { getExtension } = useStudio()
	const { run, state } = getExtension<TransformControlsState, TransformControlsActions>(
		transformControlsScope,
	)

	const { selectedObjects } = useObjectSelection()

	const { addObject, removeObject } = useStudioObjectsRegistry()

	const mode = state.select((s) => s.mode)

	const setIgnoreOverrideMaterial = (ref: any) => {
		ref.traverse((node: any) => {
			node.userData.ignoreOverrideMaterial = true
		})
	}
</script>

<TransformControls
	object={$selectedObjects[0]}
	mode={$mode}
	on:mouseDown={() => {
		run('setInUse', true)
	}}
	on:mouseUp={() => {
		run('setInUse', false)
	}}
	on:create={({ ref, cleanup }) => {
		setIgnoreOverrideMaterial(ref)
		addObject(ref)
		cleanup(() => {
			removeObject(ref)
		})
	}}
/>
