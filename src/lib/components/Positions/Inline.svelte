<script lang="ts">
	import { useThrelte } from '@threlte/core'
	import { onMount } from 'svelte'
	import { Pane as SplitPane, Splitpanes } from 'svelte-splitpanes'
	import { Pane, Element, Separator, ThemeUtils, TabGroup, TabPage } from 'svelte-tweakpane-ui'
	import { getInternalContext, useInspector } from '../../internal/context'
	import Bindings from '../Bindings/Bindings.svelte'
	import Tools from '../Tools/Tools.svelte'
	import Tree from '../Tree/Tree.svelte'
	import Perf from '../Internal/Perf.svelte'

	const { renderer } = useThrelte()
	const { theme } = useInspector()
	const { selectedObject } = getInternalContext()

	let ref: HTMLElement

	onMount(() => {
		const canvas = renderer.domElement
		const oldParent = canvas.parentElement ?? document.body
		ref.replaceWith(canvas)
		return () => {
			oldParent.append(canvas)
		}
	})

	$: object = $selectedObject
</script>

<Splitpanes
	style="
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		--tp-base-border-radius: 0px;
	"
>
	<SplitPane
		minSize={15}
		size={20}
	>
		<TabGroup theme={ThemeUtils.presets[$theme]}>
			<TabPage title='inspector'>
				<Element>
					<Tools />
				</Element>

				<Separator />

				<Element>
					<Tree />
				</Element>

				<Element>
					<Perf scale={0.7} />
				</Element>
			</TabPage>

			<slot />
		</TabGroup>

	</SplitPane>

	<SplitPane minSize={10}>
		<div
			style="height: 100vh"
			bind:this={ref}
		/>
	</SplitPane>

	<SplitPane
		minSize={15}
		size={20}
	>
		{#if object}
			<Pane
				title=""
				position="inline"
				theme={ThemeUtils.presets[$theme]}
			>
				{#key object}
					<Bindings object={object} />
				{/key}
			</Pane>
		{/if}
	</SplitPane>
</Splitpanes>

<style>
	:global(.tp-rotv) {
		overflow: auto !important;
		max-height: 100dvh !important;
	}
	/* Firefox */
	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: #ababab #ebebeb;
	}

	/* Chrome, Edge and Safari */
	:global(*::-webkit-scrollbar) {
		width: 3px;
		width: 3px;
	}

	:global(*::-webkit-scrollbar-track) {
		border-radius: 0px;
		background-color: #ebebeb;
	}

	:global(*::-webkit-scrollbar-track:hover) {
		background-color: #c2c2c2;
	}

	:global(*::-webkit-scrollbar-track:active) {
		background-color: #c2c2c2;
	}

	:global(*::-webkit-scrollbar-thumb) {
		border-radius: 2px;
		background-color: #ababab;
	}

	:global(*::-webkit-scrollbar-thumb:hover) {
		background-color: #747474;
	}

	:global(*::-webkit-scrollbar-thumb:active) {
		background-color: #525252;
	}
</style>
