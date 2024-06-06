<script lang="ts">
	import type {
		Scene,
		PerspectiveCamera,
		OrthographicCamera,
		WebGLRenderer,
	} from 'three'
	import { useThrelte } from '@threlte/core'
	import Inspector from './Inspector.svelte'

	export let position: 'draggable' | 'inline' = 'draggable'
	export let scene: undefined | Scene = undefined
	export let camera: undefined | PerspectiveCamera | OrthographicCamera =
		undefined
	export let renderer: undefined | WebGLRenderer = undefined

	const context = useThrelte()

	if (scene) context.scene = scene
	if (camera) context.camera.set(camera)
	if (renderer) context.renderer = renderer
</script>

{#if $$slots.default}
	<Inspector {position}>
		<slot />
	</Inspector>
{:else}
	<Inspector {position} />
{/if}
