<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	// import Studio from '../../lib/components/Studio/Studio.svelte'
</script>

<Canvas>
	<!-- <Studio> -->
	<T.Mesh name={'studio_gsb'}>
		<T.BoxGeometry
			name={'studio_urq'}
			args={[1, 1, 1]}
		/>
		<T.MeshStandardMaterial
			name={'studio_zhz'}
			color="orange"
		/>
	</T.Mesh>
	<!-- </Studio> -->
</Canvas>

<style>
	:global(body) {
		height: 100vh;
		margin: 0;
	}
</style>
