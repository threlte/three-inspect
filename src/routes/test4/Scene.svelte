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
	rotation={[-0.4133, -0.7942, -0.3032, 'XYZ']}
	fov={60}
	position={[-2.8546, 1.8376, 2.64]}
	makeDefault
/>

<T.DirectionalLight
	castShadow={true}
	position={[1.7319, 3.4897, 1.5203]}
/>

<T.Mesh
	scale={[1, 1.2197, 1]}
	position={[-1.5335, 0.812, 2.0922]}
	castShadow={true}
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
	position={[0, -0.3607, -1.8369]}
	receiveShadow={true}
	name="Floor"
>
	<T.BoxGeometry args={[5, 0.01, 5]} />
	<T.MeshStandardMaterial transparent={false} />
</T.Mesh>
