<script lang="ts">
  import { getInternalContext } from '../../internal/context'
  import { useSync } from '../../internal/sync'

  const { studioSettings, toolSettings, viewSettings, usingRaycast, syncSettings } =
    getInternalContext()

  const { writeToDisk } = useSync()

  const onKeyDown = (event: KeyboardEvent) => {
    if (!$studioSettings.keyboard.enabled) return

    // check if any modifier keys are pressed
    const metaKeyPressed = event.metaKey || event.ctrlKey || event.altKey || event.shiftKey

    if (!metaKeyPressed && event.key === 'a') {
      $usingRaycast = !$usingRaycast
      return
    }

    if (!metaKeyPressed && event.key === 'w') {
      $toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
      return
    }

    if (!metaKeyPressed && event.key === 'c') {
      $toolSettings.freeCamera.enabled = !$toolSettings.freeCamera.enabled
      return
    }

    if (!metaKeyPressed && event.key === 'm') {
      $toolSettings.snapping.enabled = !$toolSettings.snapping.enabled
      return
    }

    if (!metaKeyPressed && event.key === 'v') {
      $viewSettings.mode =
        $viewSettings.mode === 'wireframe'
          ? 'solid'
          : $viewSettings.mode === 'solid'
            ? 'rendered'
            : 'wireframe'
      return
    }

    if (!metaKeyPressed && event.key === 't') {
      $toolSettings.transformControls.enabled = true
      if ($toolSettings.transformControls.mode === 'translate') {
        $toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
      } else {
        $toolSettings.transformControls.mode = 'translate'
      }
      return
    }

    if (!metaKeyPressed && event.key === 'r') {
      $toolSettings.transformControls.enabled = true
      if ($toolSettings.transformControls.mode === 'rotate') {
        $toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
      } else {
        $toolSettings.transformControls.mode = 'rotate'
      }
      return
    }

    if (!metaKeyPressed && event.key === 's') {
      $toolSettings.transformControls.enabled = true
      if ($toolSettings.transformControls.mode === 'scale') {
        $toolSettings.space = $toolSettings.space === 'local' ? 'world' : 'local'
      } else {
        $toolSettings.transformControls.mode = 'scale'
      }
      return
    }

    // check if cmd+s or ctrl+s is pressed
    const cmdOrCtrlPressed = event.metaKey || event.ctrlKey
    if (cmdOrCtrlPressed && event.key === 's') {
      if ($syncSettings.enabled && $syncSettings.mode === 'manual') {
        writeToDisk()
      }
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />
