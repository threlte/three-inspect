<script lang="ts">
	import { T, watch } from '@threlte/core'
	import { TransformControls } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { Box3, Object3D, Quaternion, Vector3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { useSnapping } from '../snapping/useSnapping'
	import { useSpace } from '../space/useSpace'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'

	const { selectedObjects } = useObjectSelection()
	const { getExtension } = useStudio()
	const { run, state } = getExtension<TransformControlsState, TransformControlsActions>(
		transformControlsScope,
	)
	const { space } = useSpace()
	const { enabled: snappingEnabled, scale, rotate, translate } = useSnapping()
	const mode = state.select((s) => s.mode)

	let centerObject = new Object3D()
	let lastPosition = new Vector3()

	watch(selectedObjects, (objects) => {
		if (objects.length === 0) return
		// make bb with all selected objects
		const bb = new Box3().setFromObject(objects[0])
		for (let i = 1; i < objects.length; i++) {
			bb.expandByObject(objects[i])
		}
		lastPosition.copy(bb.getCenter(new Vector3()))
		centerObject.position.copy(lastPosition)
	})

	const onChange = () => {
		if ($mode === 'translate') {
			const delta = new Vector3().subVectors(centerObject.position, lastPosition)
			for (const object of $selectedObjects) {
				// object.position.add(delta)
				if ($space === 'world') {
					if (!object.parent) {
						// world space is local space
						object.position.add(delta)
					} else {
						// translate in world space
						const worldPosition = new Vector3()
						object.getWorldPosition(worldPosition)
						worldPosition.add(delta)
						const localPosition = object.parent.worldToLocal(worldPosition)
						object.position.copy(localPosition)
					}
				} else {
					object.position.add(delta)
				}
			}
			lastPosition.copy(centerObject.position)
		} else if ($mode === 'rotate') {
			// TODO: implement rotation
		} else {
			// TODO: implement scale
		}
	}

	const { addObject, removeObject } = useStudioObjectsRegistry()

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

	onDestroy(() => {
		run('setInUse', false)
	})
</script>

<T is={centerObject} />

<TransformControls
	object={centerObject}
	space={$space}
	translationSnap={$snappingEnabled ? $translate : null}
	rotationSnap={$snappingEnabled ? $rotate * DEG2RAD : null}
	scaleSnap={$snappingEnabled ? $scale : null}
	on:change={onChange}
	on:mouseDown={() => {
		run('setInUse', true)
	}}
	on:mouseUp={() => {
		run('setInUse', false)
	}}
	mode={$mode}
	on:create={({ ref, cleanup }) => {
		onCreate(ref, cleanup)
	}}
/>
