<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import Studio from '../lib/components/Studio/Studio.svelte'
</script>

<Canvas renderMode="always">
	<Studio>
		<T.Mesh
			orange
			position={[0,7.298160960050886,-1.5014306325005897]}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="orange" />
		</T.Mesh>
		<T.Mesh
			red
			position={[6.731787789509122,2,0]}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshBasicMaterial color="red" />
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
