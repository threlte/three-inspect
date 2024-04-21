<script lang="ts">
	import { useLoader, useThrelte, watch } from '@threlte/core'
	import { useTexture } from '@threlte/extras'
	import { EquirectangularReflectionMapping } from 'three'
	import { RGBELoader } from 'three/examples/jsm/Addons.js'

	const { scene, renderer } = useThrelte()

	const env = useLoader(RGBELoader).load('/autumn_field_puresky_2k.hdr')
	const bg = useTexture('autumn_field_puresky_bg.jpg')

	renderer.toneMappingExposure = 0.7

	watch(env, (env) => {
		if (!env) return
		env.mapping = EquirectangularReflectionMapping
		scene.environment = env
	})

	watch(bg, (bg) => {
		if (!bg) return
		bg.mapping = EquirectangularReflectionMapping
		scene.background = bg
	})
</script>
