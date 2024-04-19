<script lang="ts">
	import type {
		AmbientLight,
		DirectionalLight,
		HemisphereLight,
		PointLight,
		RectAreaLight,
		SpotLight,
	} from 'three'
	import TransactionalBinding from './TransactionalBinding.svelte'
	import { Folder } from 'svelte-tweakpane-ui'
	import { haveProperty } from './utils'

	type Props = {
		lights: (
			| AmbientLight
			| DirectionalLight
			| PointLight
			| SpotLight
			| HemisphereLight
			| RectAreaLight
		)[]
	}

	let { lights }: Props = $props()
</script>

<Folder
	title="Light"
	expanded
>
	<TransactionalBinding
		objects={lights}
		key="color"
		label="color"
		options={{ color: { type: 'float' } }}
	/>

	<TransactionalBinding
		objects={lights}
		key="intensity"
		label="intensity"
		options={{ step: 0.05 }}
	/>

	{#if haveProperty(lights, 'isDirectionalLight')}
		<!-- <TransactionalBinding
			objects={lights}
			key="target.position"
			label="target"
		/> -->
		<!-- {:else if 'isPointLight' in object}
	<TransactionalBinding
		objects={lights}
		key="decay"
		label="decay"
	/>
	<TransactionalBinding
		objects={lights}
		key="distance"
		label="distance"
	/>
	<TransactionalBinding
		objects={lights}
		key="power"
		label="power"
	/>
{:else if 'isSpotLight' in object}
	<TransactionalBinding
		objects={lights}={object.target}
		key="position"
		label="target"
	/>
	<TransactionalBinding
		objects={lights}
		key="angle"
		label="angle"
		options={{ min: 0, max: Math.PI / 2 }}
	/>
	<TransactionalBinding
		objects={lights}
		key="decay"
		label="decay"
	/>
	<TransactionalBinding
		objects={lights}
		key="distance"
		label="distance"
	/>
	<TransactionalBinding
		objects={lights}
		key="penumbra"
		label="penumbra"
		options={{ min: 0, max: 1 }}
	/>
	<TransactionalBinding
		objects={lights}
		key="power"
		label="power"
	/>
	<TransactionalBinding
		objects={lights}
		key="position"
		label="position"
	/>
{:else if 'isHemisphereLight' in object}
	<TransactionalBinding
		objects={lights}
		key="groundColor"
		label="groundColor"
	/>
{:else if 'isRectAreaLight' in object}
	<TransactionalBinding
		objects={lights}
		key="power"
		label="power"
	/>
	<TransactionalBinding
		objects={lights}
		key="width"
		label="width"
	/>
	<TransactionalBinding
		objects={lights}
		key="height"
		label="height"
	/> -->
	{/if}

	<!-- {#if object.shadow && object.castShadow}
	<Folder
		expanded={false}
		title="shadow"
	>
		<Shadow object={object.shadow} />
	</Folder>
{/if} -->
</Folder>
