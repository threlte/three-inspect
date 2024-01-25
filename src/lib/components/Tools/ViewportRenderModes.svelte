<script lang="ts">
	import { useThrelte, watch } from '@threlte/core'
	import { derived } from 'svelte/store'
	import { BackSide, DoubleSide, FrontSide, MeshBasicMaterial, MeshMatcapMaterial } from 'three'
	import { getInternalContext } from '../../internal/context'
	import { onDestroy } from 'svelte'

	const { scene, invalidate, renderer } = useThrelte()
	const { viewSettings } = getInternalContext()

	// override to exclude objects with `ignoreOverrideMaterial` from being rendered with the override material
	// see https://github.com/mrdoob/three.js/blob/bd33e679a5b634842bb39a377b9a37eb68bc0e2a/src/renderers/WebGLRenderer.js#L1561-L1590
	const ogRenderBufferDirect = renderer.renderBufferDirect
	renderer.renderBufferDirect = (...args) => {
		// signature: 0:camera, 1:scene, 2:geometry, 3:material, 4:object, 5:group
		if (args[4].userData.ignoreOverrideMaterial && (args[4] as any).material) {
			// we have to mimic what `renderObject` does with the original material
			const material = (args[4] as any).material
			material.onBeforeRender(renderer, scene, args[0], args[2], args[4], args[5])
			if (
				material.transparent === true &&
				material.side === DoubleSide &&
				material.forceSinglePass === false
			) {
				material.side = BackSide
				material.needsUpdate = true
				ogRenderBufferDirect.call(renderer, args[0], args[1], args[2], material, args[4], args[5])
				material.side = FrontSide
				material.needsUpdate = true
				ogRenderBufferDirect.call(renderer, args[0], args[1], args[2], material, args[4], args[5])
				material.side = DoubleSide
			} else {
				ogRenderBufferDirect.call(renderer, args[0], args[1], args[2], material, args[4], args[5])
			}
		} else {
			ogRenderBufferDirect.call(renderer, ...args)
		}
	}
	onDestroy(() => {
		renderer.renderBufferDirect = ogRenderBufferDirect
	})

	const viewMode = derived(viewSettings, (viewSettings) => viewSettings.mode)
	watch(viewMode, (viewMode) => {
		if (viewMode === 'rendered') {
			scene.overrideMaterial = null
		} else if (viewMode === 'wireframe') {
			scene.overrideMaterial = new MeshBasicMaterial({
				wireframe: true,
				color: 0xffffff,
			})
		} else if (viewMode === 'solid') {
			scene.overrideMaterial = new MeshMatcapMaterial({
				color: 0xffffff,
				flatShading: true,
			})
		}
		invalidate()
	})
</script>
