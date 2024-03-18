<script lang="ts">
	import type { Scene, PerspectiveCamera, OrthographicCamera, WebGLRenderer } from 'three'
	import { Canvas } from '@threlte/core'
	import Threlte from './Threlte.svelte'

	export let position: 'draggable' | 'inline' = 'draggable'
	export let scene: Scene
	export let camera: PerspectiveCamera | OrthographicCamera
	export let renderer: WebGLRenderer
</script>

<Canvas
	renderMode="manual"
	size={{ width: 0, height: 0 }}
>
	<Threlte
		{position}
		{scene}
		{camera}
		{renderer}
	/>
</Canvas>
