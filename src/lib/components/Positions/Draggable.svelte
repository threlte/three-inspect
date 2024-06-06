<script lang="ts">
	import {
		Pane,
		ThemeUtils,
		Element,
		Separator,
		TabGroup,
		TabPage,
	} from 'svelte-tweakpane-ui'
	import { getInternalContext, useInspector } from '../../internal/context'
	import { browser } from '../../internal/browser'
	import Tree from '../Tree/Tree.svelte'
	import Bindings from '../Bindings/Bindings.svelte'
	import Tools from '../Tools/Tools.svelte'
	import Perf from '../Internal/Perf.svelte'
	import DefaultCameraView from '../Tools/DefaultCameraView.svelte'

	const { theme } = useInspector()
	const { selectedObject, usingFreeCamera } = getInternalContext()

	$: object = $selectedObject
</script>

<Pane
	title=""
	position="draggable"
	theme={ThemeUtils.presets[$theme]}
	localStoreId="three-inspect-pane-inspect"
	storePositionLocally
	width={250}
	x={6}
	y={6}
>
	{#if $$slots.default}
		<TabGroup>
			<TabPage title="inspector">
				<Element>
					<Tools />
				</Element>

				<Separator />

				<Element>
					<Tree />
				</Element>
			</TabPage>
			<slot />
		</TabGroup>
	{:else}
		<Element>
			<Tools />
		</Element>

		<Separator />

		<Element>
			<Tree />
		</Element>
	{/if}
</Pane>

<Pane
	title=""
	position="draggable"
	theme={ThemeUtils.presets[$theme]}
	localStoreId="three-inspect-pane-monitor"
	storePositionLocally
	width={325}
	x={6}
	y={browser ? window.innerHeight - 6 - 125 : 6}
>
	<Element>
		<Perf />
	</Element>
</Pane>

{#if object}
	<Pane
		title={`${object.name} (${object.type})`}
		position="draggable"
		theme={ThemeUtils.presets[$theme]}
		localStoreId="three-inspect-pane-selected-object"
		storePositionLocally
		width={320}
		x={browser ? window.innerWidth - 6 - 320 : 6}
		y={6}
	>
		{#key object}
			<Bindings {object} />
		{/key}
	</Pane>
{/if}

{#if $usingFreeCamera}
	<Pane
		title="Default Camera"
		position="draggable"
		theme={ThemeUtils.presets[$theme]}
		localStoreId="three-inspect-pane-game-view"
		storePositionLocally
		userExpandable={false}
		width={308}
		x={browser ? window.innerWidth - 6 - 308 : 6}
		y={browser ? window.innerHeight - 6 - 196 : 6}
	>
		<DefaultCameraView
			width={300}
			height={160}
		/>
	</Pane>
{/if}
