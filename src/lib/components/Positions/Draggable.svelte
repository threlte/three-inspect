<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { Element, Pane, TabGroup, TabPage, ThemeUtils } from 'svelte-tweakpane-ui'
	import { browser } from '../../internal/browser'
	import { getInternalContext, useInspector } from '../../internal/context'
	import Bindings from '../Bindings/Bindings.svelte'
	import Console from '../Tools/Console.svelte'
	import DefaultCameraView from '../Tools/DefaultCameraView.svelte'
	import Tools from '../Tools/Tools.svelte'
	import Tree from '../Tree/Tree.svelte'
	import RenderIndicator from '../Tools/RenderIndicator.svelte'
	import Perf from '../Internal/Perf.svelte'

	const { theme } = useInspector()
	const { selectedObject, toolSettings, optionalPanes } = getInternalContext()
	const { size } = useThrelte()

	$: object = $selectedObject

	const toolbarHeight = 56
</script>

<Pane
	title=""
	userExpandable={false}
	position="fixed"
	width={$size.width - 12}
	theme={ThemeUtils.presets[$theme]}
	x={6}
	y={6}
>
	<Element>
		<Tools />
	</Element>
</Pane>

<Pane
	title=""
	position="fixed"
	theme={ThemeUtils.presets[$theme]}
	width={250}
	x={6}
	y={6 + toolbarHeight + 6}
>
	{#if $$slots.default}
		<TabGroup>
			<TabPage title="inspector">
				<Element>
					<Tree />
				</Element>
			</TabPage>
			<slot />
		</TabGroup>
	{:else}
		<Element>
			<Tree />
		</Element>
	{/if}
</Pane>

{#if $optionalPanes.Console}
	<Pane
		title="Console"
		expanded
		theme={ThemeUtils.presets[$theme]}
		position="draggable"
		storePositionLocally
		localStoreId="threlte-studio-console-pane"
	>
		<Element>
			<Console />
		</Element>
	</Pane>
{/if}

{#if $optionalPanes.Monitor}
	<Pane
		title="Monitor"
		expanded
		theme={ThemeUtils.presets[$theme]}
		position="draggable"
		storePositionLocally
		localStoreId="threlte-studio-monitor-pane"
	>
		<Element>
			<RenderIndicator />
			<Perf />
		</Element>
	</Pane>
{/if}

{#if object}
	<Pane
		title={`${object.name} (${object.type})`}
		position="fixed"
		theme={ThemeUtils.presets[$theme]}
		width={320}
		x={browser ? window.innerWidth - 6 - 320 : 6}
		y={6 + toolbarHeight + 6}
	>
		{#key object}
			<Bindings {object} />
		{/key}
	</Pane>
{/if}

{#if $toolSettings.freeCamera.enabled}
	<Pane
		title="Default Camera"
		position="fixed"
		theme={ThemeUtils.presets[$theme]}
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
