<script lang="ts">
	import { TransformControls } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { Object3D } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import { useSnapping } from '../snapping/useSnapping.svelte'
	import { useSpace } from '../space/useSpace.svelte'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry.svelte'
	import { useTransactions } from '../transactions/useTransactions'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'
	import { getThrelteStudioUserData } from '../transactions/vite-plugin/runtimeUtils'

	const { getExtension } = useStudio()
	const { run, state } = getExtension<TransformControlsState, TransformControlsActions, true>(
		transformControlsScope,
	)

	const objectSelection = useObjectSelection()
	const space = useSpace()
	const snapping = useSnapping()
	const studioObjectsRegistry = useStudioObjectsRegistry()

	const mode = $derived(state.mode)

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
			studioObjectsRegistry.addObject(object)
		})
		cleanup(() => {
			for (const object of objects) {
				studioObjectsRegistry.removeObject(object)
			}
		})
	}

	onDestroy(() => {
		run('setInUse', false)
	})

	const { commit } = useTransactions()

	let initialValue: any
	const onMouseDown = () => {
		objectSelection.selectedObjects[0]
		if (mode === 'translate') {
			initialValue = objectSelection.selectedObjects[0].position.clone()
		}
	}

	const onMouseUp = () => {
		if (!initialValue) return

		const userData = getThrelteStudioUserData(objectSelection.selectedObjects[0])

		if (mode === 'translate') {
			const value = objectSelection.selectedObjects[0].position.clone()
			objectSelection.selectedObjects[0].position.copy(initialValue)
			commit([
				{
					object: objectSelection.selectedObjects[0],
					read(root) {
						return root.position.clone()
					},
					write(root, data) {
						root.position.copy(data)
					},
					value,
					sync: userData
						? {
								attributeName: 'position',
								componentIndex: userData.index,
								moduleId: userData.moduleId,
								signature: userData.signature,
							}
						: undefined,
				},
			])
		}
		initialValue = undefined
	}
</script>

<TransformControls
	object={objectSelection.selectedObjects[0]}
	{mode}
	space={space.space}
	translationSnap={snapping.enabled ? snapping.translate ?? 0 : null}
	rotationSnap={snapping.enabled ? (snapping.rotate ?? 0) * DEG2RAD : null}
	scaleSnap={snapping.enabled ? snapping.scale ?? 0 : null}
	on:mouseDown={() => {
		run('setInUse', true)
		onMouseDown()
	}}
	on:mouseUp={() => {
		run('setInUse', false)
		onMouseUp()
	}}
	on:create={({ ref, cleanup }) => {
		onCreate(ref, cleanup)
	}}
/>
