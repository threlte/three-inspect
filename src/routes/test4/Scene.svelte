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
	zoom={1}
	position={[0, 0, 5.4]}
	near={0.1}
	far={2000}
	rotation={[0, 0, 0, 'XYZ']}
	fov={60}
	makeDefault
/>

<T.DirectionalLight
	visible={true}
	rotation={[0, 0, 0, 'XYZ']}
	castShadow={true}
	position={[-1.4245, 4.8, 8.0099]}
/>

<T.AmbientLight
	visible={true}
	intensity={0.2}
/>

<T.Mesh
	rotation={[0, 0, 0, 'XYZ']}
	position={[0, 1.3487, 0]}
	receiveShadow={false}
	frustumCulled={false}
	visible={true}
	scale={[1, 1, 1]}
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
		color={'#68ff00'}
	/>
</T.Mesh>

<T.Group visible={true} rotation={[0, 0, 0, 'XYZ']} position={[0, -0.6218, 0]}>
	<T.MeshStandardMaterial
		visible={true}
		opacity={1}
		transparent={false}
		metalness={0.2609}
		roughness={0.1848}
		color={'#ff4747'}
		let:ref
	>
		{#each [-2, -1, 0, 1, 2] as x, index}
			<T.Mesh
				castShadow={true}
				position={[x, 0, 0]}
				name="Sphere-{index + 1}"
			>
				<T.SphereGeometry args={[0.4]} />
				<T is={ref} />
			</T.Mesh>
		{/each}
	</T.MeshStandardMaterial>
</T.Group>

<T.Mesh
	scale={[2.5, 1, 2.3]}
	rotation={[1.5708, 0, 0, 'XYZ']}
	visible={true}
	castShadow={false}
	matrixWorldAutoUpdate={true}
	matrixAutoUpdate={true}
	frustumCulled={true}
	position={[0, 0, -0.7]}
	receiveShadow={true}
	name="Floor"
>
	<T.BoxGeometry args={[5, 0.01, 5]} />
	<T.MeshStandardMaterial
		color={'#8062fb'}
		visible={true}
		transparent={true}
	/>
</T.Mesh>
