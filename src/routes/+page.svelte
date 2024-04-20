<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import Stones from './stones.svelte'
</script>

<Canvas>
	<Studio>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 14.1442, 52.633]}
			fov={21}
			rotation={[-0.2105,0,0]}
		/>

		<T.DirectionalLight />
		<T.AmbientLight />

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
