<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core'
	import { ThreePerf } from 'three-perf'
	import { onMount } from 'svelte'

	export let scale = 0.85

	const { renderer } = useThrelte()

	let ref: HTMLElement
	let perf: ThreePerf

	const { start } = useTask(
		() => {
			perf.end()
			perf.begin()
		},
		{ autoStart: false }
	)

	onMount(() => {
		perf = new ThreePerf({
			renderer,
			scale,
			anchorX: 'left',
			anchorY: 'top',
			domElement: ref,
		})

		perf.ui.wrapper.style.position = 'relative'

		start()

		return () => {
			perf.dispose()
		}
	})
</script>

<div bind:this={ref} />
