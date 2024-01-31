<script lang="ts">
	import type * as THREE from 'three'
	import { useThrelte } from '@threlte/core'
	import Inspector from './Inspector.svelte'

	export let position: 'draggable' | 'inline' = 'draggable'
	export let scene: undefined | THREE.Scene = undefined
	export let camera: undefined | THREE.PerspectiveCamera | THREE.OrthographicCamera = undefined
	export let renderer: undefined | THREE.WebGLRenderer = undefined

	const context = useThrelte()

	if (scene) context.scene = scene
	if (camera) context.camera.set(camera)
	if (renderer) context.renderer = renderer
</script>

{#if $$slots.default}
	<Inspector {position}>
	</Inspector>
{:else}
	<Inspector {position} />
{/if}
