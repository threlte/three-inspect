<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { CSM, Float } from '@threlte/extras'
	import Studio from '../lib/components/Studio/Studio.svelte'
	import Env from './Env.svelte'
	import FloatingIsland from './FloatingIsland.svelte'
	import Ship from './Ship.svelte'
	import Stones from './stones2.svelte'
</script>

<Canvas>
	<Studio>
		<Env />

		<T.PerspectiveCamera
			makeDefault
			position={[-2.2, 11.601, 35.1519]}
			fov={37.25}
			rotation={[-0.2649, 0, 0]}
			zoom={1}
			filmOffset={0}
			filmGauge={35}
		/>

		<CSM
			lightDirection={[-1, -1, -1]}
			args={{
				shadowMapSize: 4096,
			}}
			lightIntensity={10}
		/>

		<Float
			floatIntensity={10}
			seed={2}
		>
			<FloatingIsland />
			<Stones />
		</Float>

		<Float
			floatIntensity={10}
			rotationIntensity={0.2}
			seed={1}
		>
			<Ship />
		</Float>
	</Studio>
</Canvas>

<style>
	:global(body) {
		height: 100vh;
		margin: 0;
		/* background-color: black; */
	}
</style>
