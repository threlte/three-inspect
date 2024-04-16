<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { MeshStandardMaterial } from 'three'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import Stones from './stones.svelte'
</script>

<Canvas>
	<Studio>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 0, 10]}
			far={30}
		/>

		<T.DirectionalLight position={[5, 10, 8]} />
		<T.AmbientLight intensity={0.2} />

		<T.Mesh
			scale={[2, 2, 2]}
			position={[0, -1, 0]}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshStandardMaterial
				color="#2afc71"
				roughness={1}
			/>
		</T.Mesh>

		<Stones />

		<T.Mesh
			material={new MeshStandardMaterial()}
			position={[0, 1, 0]}
			scale={[2, 2, 2]}
			material.color="#2afc71"
			material.visible
			material.transparent={false}
			material.opacity={1}
			material.roughness={1}
			material.metalness={0}
			material.emissiveIntensity={0}
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
