<script lang="ts">
	import { getInternalContext } from '../../internal/context'

	const { studioSettings, toolSettings, viewSettings } = getInternalContext()

	const onKeyDown = (event: KeyboardEvent) => {
		if (!$studioSettings.keyboard.enabled) return

		if (event.key === 'w') {
			$toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
			return
		}

		if (event.key === 'c') {
			$toolSettings.freeCamera.enabled = !$toolSettings.freeCamera.enabled
			return
		}

		if (event.key === 'm') {
			$toolSettings.snapping.enabled = !$toolSettings.snapping.enabled
			return
		}

		if (event.key === 'v') {
			$viewSettings.mode =
				$viewSettings.mode === 'wireframe'
					? 'solid'
					: $viewSettings.mode === 'solid'
						? 'rendered'
						: 'wireframe'
			return
		}

		if (event.key === 't') {
			$toolSettings.transformControls.enabled = true
			if ($toolSettings.transformControls.mode === 'translate') {
				$toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
			} else {
				$toolSettings.transformControls.mode = 'translate'
			}
			return
		}

		if (event.key === 'r') {
			$toolSettings.transformControls.enabled = true
			if ($toolSettings.transformControls.mode === 'rotate') {
				$toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
			} else {
				$toolSettings.transformControls.mode = 'rotate'
			}
			return
		}

		if (event.key === 's') {
			$toolSettings.transformControls.enabled = true
			if ($toolSettings.transformControls.mode === 'scale') {
				$toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
			} else {
				$toolSettings.transformControls.mode = 'scale'
			}
			return
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} />
