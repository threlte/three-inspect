<script lang="ts">
	import { Inspector } from '$lib'
	import { T, injectPlugin } from '@threlte/core'

	injectPlugin('inspector', ({ props, ref }) => {
		if (!props.inspectorOptions) return
		ref.userData.inspectorOptions = props.inspectorOptions
	})
</script>

<Inspector position="draggable" />

<T.PerspectiveCamera
	rotation={[-0.4, 0.25, 0.1, 'XYZ']}
	fov={60}
	position={[2.6, 5, 8]}
	makeDefault
/>

<T.DirectionalLight
	castShadow={true}
	position={[1.7319, 3.4897, 1.5203]}
/>

<T.Mesh
	castShadow={true}
	position={[0, 1.0355, 0]}
	name="Box"
>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color={'#fb7676'} />
</T.Mesh>

<T.Mesh
	castShadow={false}
	matrixWorldAutoUpdate={true}
	matrixAutoUpdate={true}
	frustumCulled={true}
	position={[0, -0.9238, 0]}
	receiveShadow={false}
	name="Floor"
>
	<T.BoxGeometry args={[5, 0.01, 5]} />
	<T.MeshStandardMaterial transparent={false} />
</T.Mesh>
