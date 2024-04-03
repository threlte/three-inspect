<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../../lib/components/Studio/Studio.svelte'
	import Scene from './Scene.svelte'
</script>

<Canvas renderMode="always">
	<Studio>
		<!-- <Scene /> -->
		<T.Mesh position={[0, 1, 0]}>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="orange" />
		</T.Mesh>
		<T.Mesh position={[0, 2, 0]}>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="red" />
		</T.Mesh>
	</Studio>
</Canvas>

<style>
	:global(body) {
		height: 100vh;
		margin: 0;
	}
</style>
