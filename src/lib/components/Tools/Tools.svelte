<script lang="ts">
	import { Checkbox, Color, Element, RadioGrid, Separator, Slider } from 'svelte-tweakpane-ui'
	import { getInternalContext } from '../../internal/context'
	import { useSync } from '../../internal/sync'
	import IconButton from '../Internal/IconButton.svelte'
	import Tooltip from '../Internal/Tooltip.svelte'
	import HorizontalButtonGroup from './HorizontalButtonGroup.svelte'
	import PopUpPane from './PopUpPane.svelte'
	import VerticalSeparator from './VerticalSeparator.svelte'
	import Changes from './Changes.svelte'

	const { usingRaycast, optionalPanes, gizmoSettings, toolSettings, syncSettings, sync } =
		getInternalContext()

	let autoSync = $syncSettings.mode === 'auto'
	$: {
		if (autoSync) {
			$syncSettings.mode = 'auto'
		} else {
			$syncSettings.mode = 'manual'
		}
	}

	const { writeToDisk } = useSync()

	const { staleTransactions, transactions } = sync
</script>

<div class="wrapper">
	<div>
		<Tooltip>
			<IconButton
				label="Raycast"
				icon="mdiCursorDefault"
				active={$usingRaycast}
				on:click={() => {
					usingRaycast.set(!$usingRaycast)
				}}
			/>
			<span slot="tooltip">Select {$usingRaycast ? 'off' : 'on'}</span>
		</Tooltip>
		<Tooltip>
			<IconButton
				label="Free camera"
				icon="mdiVideoVintage"
				active={$toolSettings.freeCamera.enabled}
				on:click={() => {
					$toolSettings.freeCamera.enabled = !$toolSettings.freeCamera.enabled
				}}
			/>
			<span slot="tooltip">Free camera {$toolSettings.freeCamera.enabled ? 'off' : 'on'}</span>
		</Tooltip>
		<Tooltip>
			<IconButton
				label="TransformControls"
				icon="mdiAngleRight"
				active={$toolSettings.transformControls.enabled}
				on:click={() => {
					$toolSettings.transformControls.enabled = !$toolSettings.transformControls.enabled
				}}
			/>
			<span slot="tooltip"
				>TransformControls {$toolSettings.transformControls.enabled ? 'off' : 'on'}</span
			>
		</Tooltip>
		<VerticalSeparator />
		<Tooltip>
			<IconButton
				label="Console"
				icon="mdiConsole"
				active={$optionalPanes.Console}
				on:click={() => {
					$optionalPanes.Console = !$optionalPanes.Console
				}}
			/>
			<span slot="tooltip">{$optionalPanes.Console ? 'Close' : 'Open'} Console</span>
		</Tooltip>
		<Tooltip>
			<IconButton
				label="Monitor"
				icon="mdiGraphOutline"
				active={$optionalPanes.Monitor}
				on:click={() => {
					$optionalPanes.Monitor = !$optionalPanes.Monitor
				}}
			/>
			<span slot="tooltip">{$optionalPanes.Monitor ? 'Close' : 'Open'} Monitor</span>
		</Tooltip>

		<VerticalSeparator />

		<HorizontalButtonGroup>
			<Tooltip>
				<IconButton
					label="Axis"
					icon="mdiAxis"
					active={$gizmoSettings.axes.visible}
					on:click={() => {
						$gizmoSettings.axes.visible = !$gizmoSettings.axes.visible
					}}
				/>
				<span slot="tooltip">Axes {$gizmoSettings.axes.visible ? 'off' : 'on'}</span>
			</Tooltip>

			<PopUpPane
				placement="bottom"
				title="Axis"
			>
				<svelte:fragment slot="pane">
					<Checkbox
						label="Viewport Gizmo"
						bind:value={$gizmoSettings.viewportGizmo.visible}
					/>
				</svelte:fragment>
			</PopUpPane>
		</HorizontalButtonGroup>

		<HorizontalButtonGroup>
			<Tooltip>
				<IconButton
					label="Grid"
					icon="mdiGrid"
					active={$gizmoSettings.grid.visible}
					on:click={() => {
						$gizmoSettings.grid.visible = !$gizmoSettings.grid.visible
					}}
				/>
				<span slot="tooltip">Grid {$gizmoSettings.grid.visible ? 'off' : 'on'}</span>
			</Tooltip>

			<PopUpPane
				placement="bottom"
				title="Grid"
			>
				<svelte:fragment slot="pane">
					<Color
						bind:value={$gizmoSettings.grid.color}
						label="Color"
						picker="inline"
					/>
					<Slider
						bind:value={$gizmoSettings.grid.units}
						label="Units"
						min={0.00000000001}
					/>
					<RadioGrid
						label="Plane"
						columns={3}
						values={['xy', 'xz', 'zy']}
						bind:value={$gizmoSettings.grid.plane}
					/>
				</svelte:fragment>
			</PopUpPane>
		</HorizontalButtonGroup>

		<Tooltip>
			<IconButton
				label="Helpers"
				icon="mdiBorderOutside"
				active={$gizmoSettings.helpers.visible}
				on:click={() => {
					$gizmoSettings.helpers.visible = !$gizmoSettings.helpers.visible
				}}
			/>
			<span slot="tooltip">Helpers {$gizmoSettings.helpers.visible ? 'off' : 'on'}</span>
		</Tooltip>
	</div>

	<div>
		<HorizontalButtonGroup>
			<Tooltip>
				<IconButton
					label="Sync"
					icon={$staleTransactions.length > 0 ? 'mdiLoading' : 'mdiContentSave'}
					activityColor={$syncSettings.mode === 'auto'
						? 'green'
						: $transactions.length
							? 'orange'
							: 'transparent'}
					on:click={() => {
						if ($syncSettings.mode === 'manual') {
							writeToDisk()
						}
					}}
				/>
				<span slot="tooltip">
					{#if !$syncSettings.enabled}
						Sync disabled
					{:else}
						<!-- Sync Enabled -->
						{#if $syncSettings.mode === 'manual'}
							<!-- Manual Sync -->
							{#if $staleTransactions.length > 0}
								Saving …
							{:else if $transactions.length > 0}
								Save {$transactions.length}
								{#if $transactions.length > 1}
									changes
								{:else}
									change
								{/if}
							{:else}
								Up-to-date
							{/if}
						{:else}
							<!-- Auto Sync -->
							{#if $staleTransactions.length > 0}
								Saving …
							{:else}
								AutoSave: Up-to-date
							{/if}
						{/if}
					{/if}
				</span>
			</Tooltip>

			<PopUpPane
				placement="bottom"
				title="Sync"
			>
				<svelte:fragment slot="pane">
					<Checkbox
						label="Enabled"
						bind:value={$syncSettings.enabled}
					/>
					<RadioGrid
						label="Mode"
						columns={2}
						values={['manual', 'auto']}
						bind:value={$syncSettings.mode}
					/>

					<Separator />

					<Element>
						<div style="margin-top: 4px;">
							<Changes />
						</div>
					</Element>
				</svelte:fragment>
			</PopUpPane>
		</HorizontalButtonGroup>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		gap: 0.25rem;
		align-items: stretch;
		justify-content: space-between;
		padding: 2px 2px;
	}

	.wrapper div {
		display: flex;
		gap: 0.25rem;
		align-items: stretch;
	}
</style>
