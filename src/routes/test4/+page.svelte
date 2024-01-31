<script lang="ts">
	import { Canvas } from '@threlte/core'
	import Scene from './Scene.svelte'
	import Studio from '../../lib/components/Studio/Studio.svelte'
</script>

<Canvas>
	<Studio>
		<Scene />
	</Studio>
</Canvas>

<style>
	:global(body) {
		height: 100vh;
		margin: 0;
	}
</style>
