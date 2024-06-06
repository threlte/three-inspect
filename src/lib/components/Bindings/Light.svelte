<script lang="ts">
	import type {
		DirectionalLight,
		PointLight,
		SpotLight,
		HemisphereLight,
		RectAreaLight,
	} from 'three'
	import { Binding, Folder } from 'svelte-tweakpane-ui'
	import Color from './Color.svelte'
	import Shadow from './Shadow.svelte'

	export let object:
		| DirectionalLight
		| PointLight
		| SpotLight
		| HemisphereLight
		| RectAreaLight
</script>

<Color
	key="color"
	{object}
/>

<Binding
	bind:object
	key="intensity"
	label="intensity"
	options={{ step: 0.05 }}
/>

{#if 'isDirectionalLight' in object}
	<Binding
		bind:object={object.target}
		key="position"
		label="target"
	/>
{:else if 'isPointLight' in object}
	<Binding
		bind:object
		key="decay"
		label="decay"
	/>
	<Binding
		bind:object
		key="distance"
		label="distance"
	/>
	<Binding
		bind:object
		key="power"
		label="power"
	/>
{:else if 'isSpotLight' in object}
	<Binding
		bind:object={object.target}
		key="position"
		label="target"
	/>
	<Binding
		bind:object
		key="angle"
		label="angle"
		options={{ min: 0, max: Math.PI / 2 }}
	/>
	<Binding
		bind:object
		key="decay"
		label="decay"
	/>
	<Binding
		bind:object
		key="distance"
		label="distance"
	/>
	<Binding
		bind:object
		key="penumbra"
		label="penumbra"
		options={{ min: 0, max: 1 }}
	/>
	<Binding
		bind:object
		key="power"
		label="power"
	/>
	<Binding
		bind:object
		key="position"
		label="position"
	/>
{:else if 'isHemisphereLight' in object}
	<Binding
		bind:object
		key="groundColor"
		label="groundColor"
	/>
{:else if 'isRectAreaLight' in object}
	<Binding
		bind:object
		key="power"
		label="power"
	/>
	<Binding
		bind:object
		key="width"
		label="width"
	/>
	<Binding
		bind:object
		key="height"
		label="height"
	/>
{/if}

{#if object.shadow && object.castShadow}
	<Folder
		expanded={false}
		title="shadow"
	>
		<Shadow object={object.shadow} />
	</Folder>
{/if}

<!-- @TODO: target and transform controls -->
