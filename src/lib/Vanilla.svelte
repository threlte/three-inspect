<script lang="ts">
	import type {
		Scene,
		PerspectiveCamera,
		OrthographicCamera,
		WebGLRenderer,
	} from 'three'
	import { createThrelteContext } from '@threlte/core'
	import Threlte from './Threlte.svelte'
	import { writable } from 'svelte/store'

	export let position: 'draggable' | 'inline' = 'draggable'
	export let scene: Scene
	export let camera: PerspectiveCamera | OrthographicCamera
	export let renderer: WebGLRenderer

	const context = createThrelteContext({
		colorSpace: renderer.outputColorSpace,
		toneMapping: renderer.toneMapping,
		dpr: renderer.getPixelRatio(),
		userSize: writable({ width: 0, height: 0 }),
		parentSize: writable({ width: 0, height: 0 }),
		renderMode: 'always',
		autoRender: false,
		shadows: false,
		useLegacyLights: false,
		colorManagementEnabled: true,
	})

	let elapsed = 0
	const loop = (delta: number) => {
		requestAnimationFrame(loop)
		elapsed += delta

		context.scheduler.run(elapsed)
	}

	requestAnimationFrame(loop)
</script>

<Threlte
	{position}
	{scene}
	{camera}
	{renderer}
/>
