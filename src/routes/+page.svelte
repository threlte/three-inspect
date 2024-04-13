<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import { MeshBasicMaterial } from 'three'
</script>

<Canvas>
	<Studio>
		<T.Mesh>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="orange" />
		</T.Mesh>
		<T.Mesh
			position.y={2}
			material={new MeshBasicMaterial()}
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
