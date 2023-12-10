<script lang='ts'>
	import { T, useTask } from '@threlte/core'
	import { InstancedMesh, Instance } from '@threlte/extras'

	const randomPointOnCircle = (radius: number) => {
	  const theta = 2 * Math.PI * Math.random()
	  return [radius * Math.cos(theta), radius * Math.sin(theta)]
	}

	const maxZ = 25
	const count = 3
	const clusters = 20
	let clouds: [number, number, number][] = []

	const r = (m = 0.6) => (Math.random() - 0.5) * m

	for (let i = 0; i < clusters; i += 1) {
	  const z = r(maxZ)
	  const [x, y] = randomPointOnCircle(5)
	  for (let j = 0; j < count; j += 1) {
	    clouds.push([x + r(), y + r(), z + r()])
	  }
	}

	useTask((delta) => {
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

	{#each clouds as position, index (index)}
		<T.Group
			{position}
			scale={[0.5, 0.5, 1]}
		>
			<Instance />
		</T.Group>
	{/each}
</InstancedMesh>
