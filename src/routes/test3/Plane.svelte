<script>
import { T, useTask } from '@threlte/core'
import { useGltf, Float } from '@threlte/extras'
import { Slider, TabPage } from 'svelte-tweakpane-ui'

const gltf = useGltf('glb/plane.glb')

$: scene = $gltf?.scene
$: prop = scene?.getObjectByName('Prop')

$: scene?.traverse((node) => {
	node.castShadow = true
	node.receiveShadow = true
})

let time = 0
let floatIntensity = 3
let rotationSpeed = 10
let sway = 0.2

useTask((delta) => {
	if (!prop || !scene) return
	prop.rotation.z -= delta * rotationSpeed
	time += delta
	scene.rotation.z = Math.sin(time) * sway
})
</script>

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

{#if $gltf}
	<Float
		{floatIntensity}
		speed={12}
	>
		<T is={$gltf.scene} />
	</Float>
{/if}
