<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { MeshBasicMaterial, MeshStandardMaterial, DirectionalLight, AmbientLight } from 'three'
	import Studio from '../lib/components/Studio/Studio.svelte'
</script>

<Canvas>
	<Studio>
		<T.PerspectiveCamera
			makeDefault
			position={[0, 5, 12]}
			far={30}
		/>

		<T.DirectionalLight position={[5, 10, 8]} />
		<T.AmbientLight intensity={0.2} />

		<T.Mesh
			scale={[2, 2, 2]}
			position={[0, -0.9999999999999984, 0]}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshStandardMaterial
				color="#ffa500"
				roughness={1}
			/>
		</T.Mesh>

		<T.Mesh
			material={new MeshStandardMaterial()}
			position={[-1,0.9999999999999979,0]}
			scale={[2, 2, 2]}
			material.color="#ffffff"
			material.visible
			material.transparent={false}
			material.opacity={1}
			material.roughness={1}
			material.metalness={0}
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
