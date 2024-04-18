<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import Stones from './stones.svelte'
</script>

<Canvas>
	<Studio>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 6.7288, 17.1646]}
			far={50}
			rotation={[-0.2662, 0, 0]}
			scale={[1, 1, 1]}
		/>

		<T.DirectionalLight
			position={[5, 10, 8]}
			castShadow
			shadow.camera.top={30}
			shadow.camera.bottom={-30}
			shadow.camera.left={-30}
			shadow.camera.right={30}
			shadow.mapSize.width={2048}
			shadow.mapSize.height={2048}
		/>
		<T.AmbientLight intensity={0.2} />

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
