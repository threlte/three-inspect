<script lang="ts">
	import { TransformControls } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { Object3D } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection'
	import { useSnapping } from '../snapping/useSnapping'
	import { useSpace } from '../space/useSpace'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import { useTransactions } from '../transactions/useTransactions'
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
	const { space } = useSpace()
	const { enabled: snappingEnabled, scale, rotate, translate } = useSnapping()

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

	onDestroy(() => {
		run('setInUse', false)
	})

	const { commit } = useTransactions()

	let initialValue: any
	const onMouseDown = () => {
		$selectedObjects[0]
		if ($mode === 'translate') {
			initialValue = $selectedObjects[0].position.clone()
		}
	}

	const onMouseUp = () => {
		if (!initialValue) return
		if ($mode === 'translate') {
			const value = $selectedObjects[0].position.clone()
			$selectedObjects[0].position.copy(initialValue)
			commit(
				$selectedObjects[0],
				value,
				(object) => object.position.clone(),
				(object, value) => {
					object.position.copy(value)
				},
			)
		}
		initialValue = undefined
	}
</script>

<TransformControls
	object={$selectedObjects[0]}
	mode={$mode}
	space={$space}
	translationSnap={$snappingEnabled ? $translate : null}
	rotationSnap={$snappingEnabled ? $rotate * DEG2RAD : null}
	scaleSnap={$snappingEnabled ? $scale : null}
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
