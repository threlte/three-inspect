<script lang='ts'>
  import { Inspector } from '$lib'
  import * as THREE from 'three'
	import { T, useThrelte } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import Plane from './Plane.svelte'
	// import Clouds from './Clouds.svelte'

	const { scene } = useThrelte()

	scene.background = new THREE.Color('#D1E6FA')
	scene.fog = new THREE.Fog('#D1E6FA', 18, 25)
</script>

<Inspector />

<T.OrthographicCamera
	makeDefault
	position={[10, 8, 12]}
	zoom={50}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
	<OrbitControls autoRotate enableDamping />
</T.OrthographicCamera>

<T.AmbientLight intensity={1.5} />
<T.DirectionalLight
	shadow.bias={-0.0001}
	castShadow
	position={[-10, 10, -10]}
/>

<Plane />
<!-- <Clouds /> -->