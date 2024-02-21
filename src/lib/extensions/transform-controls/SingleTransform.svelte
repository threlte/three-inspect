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
	import { Object3D } from 'three'

	const { getExtension } = useStudio()
	const { run, state } = getExtension<TransformControlsState, TransformControlsActions>(
		transformControlsScope,
	)

	const { selectedObjects } = useObjectSelection()

	const { addObject, removeObject } = useStudioObjectsRegistry()

	const mode = state.select((s) => s.mode)

	const isObject3D = (object: any): object is Object3D => {
		return 'isObject3D' in object
	}

	const onCreate = (ref: any, cleanup: (callback: () => void) => void) => {
		const objects: Object3D[] = [ref]
		ref.traverse((node: any) => {
			if (isObject3D(node)) {
				objects.push(node)
			}
			node.userData.ignoreOverrideMaterial = true
		})
		objects.forEach((object) => {
			addObject(object)
		})
		cleanup(() => {
			for (const object of objects) {
				removeObject(object)
			}
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
		onCreate(ref, cleanup)
	}}
/>
