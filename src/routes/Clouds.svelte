<script>
	import { T, useTask } from '@threlte/core'
	import { InstancedMesh, Instance } from '@threlte/extras'

	const randomPointOnCircle = (radius) => {
	  const theta = 2 * Math.PI * Math.random()
	  return [radius * Math.cos(theta), radius * Math.sin(theta)]
	}

	let maxZ = 25
	let count = 3
	let clusters = 20
	let clouds = []

	const r = (m = 0.6) => (Math.random() - 0.5) * m

	for (let i = 0; i < clusters; i += 1) {
		const z = r(maxZ)
		const [x, y] = randomPointOnCircle(5)
		for (let j = 0; j < count; j += 1) {
			clouds.push([x + r(), y + r(), z + r()])
		}
	}

	let time = 0

	useTask((delta) => {
		time += delta
		for (const cloud of clouds) {
			cloud[2] -= (delta * 5)
			if (cloud[2] <= -maxZ) cloud[2] = maxZ
		}
		clouds = clouds
	})
</script>

<InstancedMesh castShadow receiveShadow>
	<T.BoxGeometry />
	<T.MeshStandardMaterial color='white' />

	{#each clouds as position, index}
		<T.Group
			{position}
			scale={[0.5, 0.5, 1]}
		>
			<Instance />
		</T.Group>
	{/each}
</InstancedMesh>