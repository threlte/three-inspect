<script lang="ts">
	import { Pane, ThemeUtils, Element } from 'svelte-tweakpane-ui'
	import Portal from '../Internal/Portal.svelte'
	import { browser } from '../../internal/browser'

	let innerWidth = browser ? window.innerWidth : 0
</script>

<svelte:window bind:innerWidth />

<Portal>
	<Pane
		title="Threlte Studio"
		userExpandable={false}
		position="fixed"
		width={innerWidth - 12}
		theme={ThemeUtils.presets.standard}
		x={6}
		y={6}
	>
		<Element>
			<div id="toolbar-items-wrapper">
				<div class="toolbar-items toolbar-items-left"></div>
				<div class="toolbar-items toolbar-items-center"></div>
				<div class="toolbar-items toolbar-items-right"></div>
			</div>
		</Element>
	</Pane>
</Portal>

<style>
	#toolbar-items-wrapper {
		display: flex;
		gap: 0.25rem;
		align-items: stretch;
		justify-content: space-between;
		padding: 2px 2px;
	}

	.toolbar-items > :global(* + *) {
		display: block !important;
		border-left: 1px solid #444548;
		padding-left: 0.5rem;
		margin-left: 0.25rem;
	}

	#toolbar-items-wrapper .toolbar-items-center {
		justify-content: center;
	}

	#toolbar-items-wrapper .toolbar-items-right {
		justify-content: flex-end;
	}

	#toolbar-items-wrapper div {
		flex-shrink: 0;
		flex-grow: 1;
		display: flex;
		gap: 0.25rem;
		align-items: stretch;
	}

	/* tweakpane checkbox value wrapper */
	:global(.tp-lblv_v:has(.tp-ckbv)) {
		width: auto !important;
	}
</style>
