<script lang="ts">
	import { Inspector } from '$lib'
	import { Color, Fog } from 'three'
	import { T, useThrelte } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import { Slider, TabPage } from 'svelte-tweakpane-ui'
	import Plane from './Plane.svelte'
	import Clouds from './Clouds.svelte'

	const { scene } = useThrelte()

	scene.background = new Color('#D1E6FA')
	scene.fog = new Fog('#D1E6FA', 18, 25)

	let floatIntensity = 3
	let rotationSpeed = 10
	let sway = 0.2
</script>

<Inspector position="draggable">
	<TabPage title="world">
		<Slider
			bind:value={rotationSpeed}
			label="rotation speed"
			min={1}
			max={30}
		/>
		<Slider
			bind:value={sway}
			label="sway"
			min={0}
			max={1}
		/>
		<Slider
			bind:value={floatIntensity}
			label="float intensity"
			min={0}
			max={8}
		/>
	</TabPage>
</Inspector>

<Plane
	{floatIntensity}
	{rotationSpeed}
	{sway}
/>

<T.OrthographicCamera
	makeDefault
	position={[10, 8, 12]}
	zoom={50}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
	<OrbitControls
		autoRotate
		enableDamping
	/>
</T.OrthographicCamera>

<T.AmbientLight intensity={1.5} />
<T.DirectionalLight
	shadow.bias={-0.0001}
	castShadow
	position={[-10, 10, -10]}
/>

<Clouds />
