<script lang="ts">
	import { Object3D } from 'three'
	import TransactionalBinding from './TransactionalBinding.svelte'
	import { haveProperty } from './utils'

	type Props = {
		objects: Object3D[]
	}

	let { objects }: Props = $props()
</script>

{#if haveProperty(objects, 'visible')}
	<TransactionalBinding
		{objects}
		key="visible"
		label="visible"
	/>
{/if}

<TransactionalBinding
	{objects}
	key="position"
	label="position"
	autoUpdate
/>

<TransactionalBinding
	{objects}
	key="rotation"
	label="rotation"
	autoUpdate
/>

<TransactionalBinding
	{objects}
	key="scale"
	label="scale"
	autoUpdate
/>

{#if haveProperty(objects, 'isMesh') || haveProperty(objects, 'isPointLight') || haveProperty(objects, 'isSpotLight') || haveProperty(objects, 'isDirectionalLight')}
	<TransactionalBinding
		{objects}
		key="castShadow"
		label="castShadow"
	/>
{/if}

{#if haveProperty(objects, 'isMesh')}
	<TransactionalBinding
		{objects}
		key="receiveShadow"
		label="receiveShadow"
	/>
{/if}

<TransactionalBinding
	{objects}
	key="frustumCulled"
	label="frustumCulled"
/>
<TransactionalBinding
	{objects}
	key="matrixAutoUpdate"
	label="matrixAutoUpdate"
/>
<TransactionalBinding
	{objects}
	key="matrixWorldAutoUpdate"
	label="matrixWorldAutoUpdate"
/>
<TransactionalBinding
	{objects}
	key="renderOrder"
	label="renderOrder"
	options={{ step: 1 }}
/>
