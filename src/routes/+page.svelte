<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { MeshBasicMaterial } from 'three'
	import Studio from '../lib/components/Studio/Studio.svelte'
</script>

<Canvas>
	<Studio>
		<T.PerspectiveCamera
			makeDefault
			position={[0,5,12]}
			far={30}
		/>

		<T.Mesh
			scale={[2, 2, 2]}
			position={[0.30000000000000004, 0.9, 0]}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="#ffa500" />
		</T.Mesh>

		<T.Mesh
			material={new MeshBasicMaterial()}
			position={[1.3, 8, 1]}
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
