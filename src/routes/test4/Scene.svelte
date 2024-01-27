<script lang="ts">
	import { Inspector } from '$lib'
	import { T, injectPlugin, useThrelte } from '@threlte/core'
	import { Color, EquirectangularReflectionMapping } from 'three'
	import Torus from './TorusModel.svelte'
	import Ramp from './RampModel.svelte'
	import { Float, useTexture } from '@threlte/extras'
	import type { StudioProps } from '../../types'
	import { onMount } from 'svelte'

	const applyToProperties = ['shadow', 'light', 'material', 'camera']

	const insertStudioProps = (object: any, props: StudioProps) => {
		for (const key of Object.keys(object)) {
			if (applyToProperties.includes(key)) {
				const newProps = {
					...props,
					path: [...(props.path ?? []), key],
				}
				const hasUserData = 'userData' in object[key]
				const hasInspectorOptions = hasUserData && 'inspectorOptions' in object[key].userData
				if (!hasInspectorOptions) {
					if (hasUserData) {
						object[key].userData.inspectorOptions = newProps
					} else {
						object[key]['userData'] = { inspectorOptions: newProps }
					}
				}
				insertStudioProps(object[key], newProps)
			}
		}
	}

	injectPlugin('inspector', ({ props, ref }) => {
		if (!props.inspectorOptions) return
		ref.userData.inspectorOptions = props.inspectorOptions
		// go through the properties and apply the inspector options
		// to the properties that are in the applyToProperties array
		onMount(() => {
			insertStudioProps(ref, props.inspectorOptions)
		})
	})

	const { scene } = useThrelte()

	scene.background = new Color('#18191C')
	const oil = useTexture('/oil.png')
	$: if ($oil) {
		$oil.mapping = EquirectangularReflectionMapping
		scene.environment = $oil
	}
</script>

<Inspector position="draggable" />

<T.PerspectiveCamera
	zoom={1}
	position={[-1.3227, 2.6187, 7.9287]}
	near={0.1}
	far={2000}
	rotation={[-0.2652, -0.1863, -0.0503, 'XYZ']}
	fov={30}
	makeDefault
/>

<T.DirectionalLight
	intensity={2}
	visible={true}
	rotation={[0, 0, 0, 'XYZ']}
	castShadow={true}
	position={[-1.4245, 4.8, 8.0099]}
/>

<T.AmbientLight
	visible={true}
	intensity={0.2}
/>

<Float rotationIntensity={1}>
	<Torus />
</Float>

<Float rotationIntensity={1}>
	<Ramp />
</Float>
