<script lang="ts">
	import { T, useThrelte } from '@threlte/core'
	import { useTexture } from '@threlte/extras'
	import { BoxGeometry, Color, EquirectangularReflectionMapping } from 'three'
	import Cylinder from './Cylinder.svelte'
	import Drop from './Drop.svelte'
	import Ico from './Ico.svelte'
	import Pie from './Pie.svelte'
	import Ramp from './RampModel.svelte'
	import Torus from './TorusModel.svelte'
	import { useObjectSelection } from '../../lib/extensions/object-selection/useObjectSelection'

	// const applyToProperties = ['shadow', 'light', 'material', 'camera']

	// const insertStudioProps = (object: any, props: StudioProps) => {
	// 	for (const key of Object.keys(object)) {
	// 		if (applyToProperties.includes(key)) {
	// 			const newProps = {
	// 				...props,
	// 				path: [...(props.path ?? []), key],
	// 			}
	// 			const hasUserData = 'userData' in object[key]
	// 			const hasInspectorOptions = hasUserData && 'inspectorOptions' in object[key].userData
	// 			if (!hasInspectorOptions) {
	// 				if (hasUserData) {
	// 					object[key].userData.inspectorOptions = newProps
	// 				} else {
	// 					object[key]['userData'] = { inspectorOptions: newProps }
	// 				}
	// 			}
	// 			insertStudioProps(object[key], newProps)
	// 		}
	// 	}
	// }

	// injectPlugin('inspector', ({ props, ref }) => {
	// 	if (!props.inspectorOptions) return
	// 	ref.userData.inspectorOptions = props.inspectorOptions
	// 	// go through the properties and apply the inspector options
	// 	// to the properties that are in the applyToProperties array
	// 	onMount(() => {
	// 		insertStudioProps(ref, props.inspectorOptions)
	// 	})
	// })

	const { scene, invalidate } = useThrelte()

	scene.background = new Color('#18191C')
	const oil = useTexture('/oil.png')
	$: if ($oil) {
		$oil.mapping = EquirectangularReflectionMapping
		scene.environment = $oil
		invalidate()
	}

	const { addToSelection, removeFromSelection } = useObjectSelection()
</script>

<T.PerspectiveCamera
	position={[10, 1, 0]}
	near={0.1}
	far={2000}
	rotation={[0, 1.5708, 0, 'XYZ']}
	fov={30}
	makeDefault
/>

<T.DirectionalLight
	intensity={1}
	visible={true}
	rotation={[0, 0, 0, 'XYZ']}
	castShadow={true}
	position={[-1.4245, 4.8, 8.0099]}
/>

<T.AmbientLight
	visible={true}
	intensity={0.2}
/>

<Ramp />

<Torus />

<Ico />

<Pie />

<Cylinder />

<Drop />
