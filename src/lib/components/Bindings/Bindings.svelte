<script lang="ts">
	import {
		Material as ThreeMaterial,
		type Scene as ThreeScene,
		type Light as ThreeLight,
		type PerspectiveCamera,
		type OrthographicCamera,
	} from 'three'
	import { Binding, Textarea, Folder } from 'svelte-tweakpane-ui'
	import Transform from './Transform/Transform.svelte'
	import Camera from './Camera.svelte'
	import Light from './Light.svelte'
	import Scene from './Scene.svelte'
	import Material from './Material.svelte'

	export let object: ThreeScene | ThreeLight | PerspectiveCamera | OrthographicCamera

	$: userData = JSON.stringify(object.userData)
</script>

<Binding
	bind:object
	key="visible"
	label="visible"
/>

{#if !('isAmbientLight' in object)}
	<Transform {object} />
{/if}

{#if 'isMesh' in object || 'isPointLight' in object || 'isSpotLight' in object || 'isDirectionalLight' in object}
	<Binding
		bind:object
		key="castShadow"
		label="castShadow"
	/>
{/if}

{#if 'isMesh' in object}
	<Binding
		bind:object
		key="receiveShadow"
		label="receiveShadow"
	/>
{/if}

<Binding
	bind:object
	key="frustumCulled"
	label="frustumCulled"
/>
<Binding
	bind:object
	key="matrixAutoUpdate"
	label="matrixAutoUpdate"
/>
<Binding
	bind:object
	key="matrixWorldAutoUpdate"
	label="matrixWorldAutoUpdate"
/>
<Binding
	bind:object
	key="renderOrder"
	label="renderOrder"
	options={{ step: 1 }}
/>

{#if 'isPerspectiveCamera' in object || 'isOrthographicCamera' in object}
	<Folder
		title="Camera"
		expanded={false}
	>
		<Camera {object} />
	</Folder>
{:else if 'isDirectionalLight' in object || 'isPointLight' in object || 'isSpotLight' in object || 'isHemisphereLight' in object || 'isRectAreaLight' in object}
	<Folder
		title="Light"
		expanded={false}
	>
		<Light {object} />
	</Folder>
{:else if 'material' in object && object.material instanceof ThreeMaterial}
	<Folder
		title="Material"
		expanded={false}
	>
		<Material object={object.material} />
	</Folder>
{:else if 'isScene' in object}
	<Folder
		title="Scene"
		expanded={false}
	>
		<Scene {object} />
	</Folder>
{/if}

<Folder
	title="userData"
	expanded={false}
>
	<Textarea
		bind:value={userData}
		disabled
		rows={5}
	/>
</Folder>
