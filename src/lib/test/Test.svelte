<script lang="ts">
	import { T } from '@threlte/core'
	import { DoubleSide } from 'three'

	let x: number = 5
</script>

<T.Mesh visible={true}>
	<T.BoxGeometry />
	<T.MeshStandardMaterial
		color="white"
		side={DoubleSide}
	/>
</T.Mesh>

<style lang="pug">
</style>
