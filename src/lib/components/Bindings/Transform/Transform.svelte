<script lang="ts">
	import { useTask, useThrelte, watch } from '@threlte/core'
	import { RotationEuler, Separator } from 'svelte-tweakpane-ui'
	import * as THREE from 'three'
	import { getInternalContext } from '../../../internal/context'
	import SerializedBinding from '../SerializedBinding.svelte'
	import Instance from './Instance.svelte'
	import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils.js'
	import { useTransaction } from '../../../internal/useTransaction'

	export let object: THREE.Object3D

	const { invalidate } = useThrelte()
	const { addTransaction } = useTransaction(object)

	let rotationProxy = {
		x: object.rotation.x * RAD2DEG,
		y: object.rotation.y * RAD2DEG,
		z: object.rotation.z * RAD2DEG,
	}

	$: {
		object.rotation.set(
			rotationProxy.x * DEG2RAD,
			rotationProxy.y * DEG2RAD,
			rotationProxy.z * DEG2RAD
		)
		invalidate()
		addTransaction('rotation', object.rotation.toArray())
	}

	const { toolSettings } = getInternalContext()

	let refreshPosition: (() => void) | undefined
	let refreshScale: (() => void) | undefined

	const { start, stop } = useTask(
		() => {
			if (!object) return
			refreshPosition?.()
			rotationProxy.x = object.rotation.x * RAD2DEG
			rotationProxy.y = object.rotation.y * RAD2DEG
			rotationProxy.z = object.rotation.z * RAD2DEG
			refreshScale?.()
		},
		{
			autoInvalidate: false,
			autoStart: false,
		}
	)

	watch(toolSettings, (settings) => {
		if (settings.transformControls.inUse) {
			start()
		} else {
			stop()
		}
	})
</script>

<SerializedBinding
	bind:object
	key="position"
	label="position"
	bind:refresh={refreshPosition}
/>
<RotationEuler
	label="rotation"
	bind:value={rotationProxy}
	order={object.rotation.order}
	unit="deg"
/>
<SerializedBinding
	bind:object
	key="scale"
	label="scale"
	bind:refresh={refreshScale}
/>

{#if object instanceof THREE.InstancedMesh}
	<Separator />
	<Instance {object} />
{/if}
