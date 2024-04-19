<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import Stones from './stones.svelte'
</script>

<Canvas>
	<Studio>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 15.6009, 36.6882]}
			far={100}
			rotation={[-0.2662, 0, 0]}
			fov={30}
		/>

		<T.DirectionalLight
			position={[-26.8,39.2,0]}
			castShadow
			shadow.camera.top={30}
			shadow.camera.bottom={-30}
			shadow.camera.left={-30}
			shadow.camera.right={30}
			shadow.mapSize.width={2048}
			shadow.mapSize.height={512}
			color="#e28c8c"
			intensity={4}
			rotation={[0, 0, 0]}
			matrixAutoUpdate
			matrixWorldAutoUpdate
			shadow.autoUpdate
			shadow.bias={0}
			shadow.camera.near={0.1}
			target.position={[3,0,0.8]}
		/>
		<T.AmbientLight
			intensity={2}
			color="#949be1"
			position={[0, 4.8, 0]}
		/>

		<Stones />
	</Studio>
</Canvas>

<style>
	:global(body) {
		height: 100vh;
		margin: 0;
		background-color: black;
	}
</style>
