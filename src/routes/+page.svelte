<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import { MeshBasicMaterial } from 'three'
	import { browser } from '../lib/internal/browser'

	if (browser) {
		console.log('Browser detected')
		window.console.trace = () => {}
	}
</script>

<Canvas>
	<Studio>
		<T.Mesh
			scale={[2, 2, 2]}
			position={[0.30000000000000004,0.9,0]}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="#ffa500" />
		</T.Mesh>

		<T.Mesh
			material={new MeshBasicMaterial()}
			position={[4.2, -2.8000000000000003, -1.8]}
			scale={[2, 2, 2]}
			material.color="#ffffff"
		>
			<T.BoxGeometry args={[1, 1, 1]} />
		</T.Mesh>
	</Studio>
</Canvas>

<style>
	:global(body) {
		height: 100vh;
		margin: 0;
		background-color: midnightblue;
	}
</style>
