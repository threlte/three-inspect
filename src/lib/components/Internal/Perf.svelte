<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core'
	import { ThreePerf } from 'three-perf'
	import { onMount } from 'svelte'

	const { renderer } = useThrelte()

	let ref: HTMLElement
	let perf: ThreePerf

	onMount(() => {
		perf = new ThreePerf({
			scale: 0.85,
			anchorX: 'left',
			anchorY: 'top',
			domElement: ref,
			renderer,
		})

		perf.ui.wrapper.style.position = 'relative'

		start()

		return () => {
			perf.dispose()
		}
	})

	const { start } = useTask(
		() => {
			perf.end()
			perf.begin()
		},
		{ autoStart: false }
	)
</script>

<div bind:this={ref} />
