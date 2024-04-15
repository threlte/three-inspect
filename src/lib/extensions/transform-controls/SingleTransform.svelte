<script lang="ts">
	import { TransformControls } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { DEG2RAD } from 'three/src/math/MathUtils.js'
	import { useStudio } from '../../internal/extensions'
	import { useObjectSelection } from '../object-selection/useObjectSelection.svelte'
	import { useSnapping } from '../snapping/useSnapping.svelte'
	import { useSpace } from '../space/useSpace'
	import { useTransactions } from '../transactions/useTransactions'
	import { getThrelteStudioUserData } from '../transactions/vite-plugin/runtimeUtils'
	import {
		transformControlsScope,
		type TransformControlsActions,
		type TransformControlsState,
	} from './types'
	import { useRegisterControlObjects } from './useRegisterControlObjects.svelte'

	const { getExtension } = useStudio()
	const transformControlsExtension = getExtension<
		TransformControlsState,
		TransformControlsActions,
		true
	>(transformControlsScope)

	const objectSelection = useObjectSelection()
	const space = useSpace()
	const snapping = useSnapping()

	const mode = $derived(transformControlsExtension.state.mode)

	const reg = useRegisterControlObjects()

	onDestroy(() => {
		transformControlsExtension.run('setInUse', false)
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
		transformControlsExtension.run('setInUse', true)
		onMouseDown()
	}}
	on:mouseUp={() => {
		transformControlsExtension.run('setInUse', false)
		onMouseUp()
	}}
	bind:controls={reg.controls}
	bind:group={reg.group}
/>
