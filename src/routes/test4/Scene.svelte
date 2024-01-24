<script lang="ts">
	import { Inspector } from '$lib'
	import { T, injectPlugin, useThrelte } from '@threlte/core'
	import { RoundedBoxGeometry } from '@threlte/extras'
	import { Color } from 'three'

	injectPlugin('inspector', ({ props, ref }) => {
		if (!props.inspectorOptions) return
		ref.userData.inspectorOptions = props.inspectorOptions
	})

	const { scene } = useThrelte()

	scene.background = new Color('#18191C')
</script>

<Inspector position="draggable" />

<T.PerspectiveCamera
	position={[-3.6341, 2.3358, 3.2701]}
	near={0.1}
	far={2000}
	rotation={[-0.4169, -0.8022, -0.3083, 'XYZ']}
	fov={60}
	makeDefault
/>

<T.DirectionalLight
	castShadow={true}
	position={[1.7319, 3.4897, 1.5203]}
/>

<T.AmbientLight intensity={0.2} />

<T.Mesh
	scale={[1, 1.2197, 1]}
	position={[0, 0.8, 0]}
	castShadow={true}
	name="Box"
>
	<RoundedBoxGeometry
		args={[1, 1, 1]}
		radius={0.2}
		smoothness={12}
	/>
	<T.MeshStandardMaterial
		wireframe={false}
		color={'#aaff9b'}
	/>
</T.Mesh>

<T.Mesh
	visible={true}
	castShadow={false}
	matrixWorldAutoUpdate={true}
	matrixAutoUpdate={true}
	frustumCulled={true}
	position={[0, 0, 0]}
	receiveShadow={true}
	name="Floor"
>
	<T.BoxGeometry args={[5, 0.01, 5]} />
	<T.MeshStandardMaterial visible={true} transparent={true} />
</T.Mesh>
