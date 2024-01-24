<script lang="ts">
	import { getInternalContext } from '../../internal/context'
	import IconButton from '../Internal/IconButton.svelte'
	import Tooltip from '../Internal/Tooltip.svelte'
	import VerticalSeparator from './VerticalSeparator.svelte'

	const { usingRaycast, optionalPanes, gizmoSettings, toolSettings } = getInternalContext()
</script>

<div>
	<Tooltip>
		<IconButton
			label="Raycast"
			icon="mdiCursorDefault"
			backgroundColor={$usingRaycast ? 'green' : 'default'}
			on:click={() => {
				usingRaycast.set(!$usingRaycast)
			}}
		/>
		<span slot="tooltip">Select {$usingRaycast ? 'on' : 'off'}</span>
	</Tooltip>

	<Tooltip>
		<IconButton
			label="Free camera"
			icon="mdiVideoVintage"
			backgroundColor={$toolSettings.freeCamera.enabled ? 'green' : 'default'}
			on:click={() => {
				$toolSettings.freeCamera.enabled = !$toolSettings.freeCamera.enabled
			}}
		/>
		<span slot="tooltip">Free camera {$toolSettings.freeCamera.enabled ? 'on' : 'off'}</span>
	</Tooltip>

	<Tooltip>
		<IconButton
			label="TransformControls"
			icon="mdiAngleRight"
			backgroundColor={$toolSettings.transformControls.enabled ? 'green' : 'default'}
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
			backgroundColor={$optionalPanes.Console ? 'green' : 'default'}
			on:click={() => {
				$optionalPanes.Console = !$optionalPanes.Console
			}}
		/>
		<span slot="tooltip">Console {$optionalPanes.Console ? 'off' : 'on'}</span>
	</Tooltip>

	<Tooltip>
		<IconButton
			label="Monitor"
			icon="mdiGraphOutline"
			backgroundColor={$optionalPanes.Monitor ? 'green' : 'default'}
			on:click={() => {
				$optionalPanes.Monitor = !$optionalPanes.Monitor
			}}
		/>
		<span slot="tooltip">Monitor {$optionalPanes.Monitor ? 'off' : 'on'}</span>
	</Tooltip>

	<VerticalSeparator />

	<Tooltip>
		<IconButton
			label="Axis"
			icon="mdiAxis"
			backgroundColor={$gizmoSettings.axes.visible ? 'green' : 'default'}
			on:click={() => {
				$gizmoSettings.axes.visible = !$gizmoSettings.axes.visible
			}}
		/>
		<span slot="tooltip">Axes {$gizmoSettings.axes.visible ? 'off' : 'on'}</span>
	</Tooltip>

	<Tooltip>
		<IconButton
			label="Grid"
			icon="mdiGrid"
			backgroundColor={$gizmoSettings.grid.visible ? 'green' : 'default'}
			on:click={() => {
				$gizmoSettings.grid.visible = !$gizmoSettings.grid.visible
			}}
		/>
		<span slot="tooltip">Grid {$gizmoSettings.grid.visible ? 'off' : 'on'}</span>
	</Tooltip>

	<Tooltip>
		<IconButton
			label="Helpers"
			icon="mdiBorderOutside"
			backgroundColor={$gizmoSettings.helpers.visible ? 'green' : 'default'}
			on:click={() => {
				$gizmoSettings.helpers.visible = !$gizmoSettings.helpers.visible
			}}
		/>
		<span slot="tooltip">Helpers {$gizmoSettings.helpers.visible ? 'off' : 'on'}</span>
	</Tooltip>
</div>

<style>
	div {
		display: flex;
		gap: 0.25rem;
		align-items: stretch;
		padding-top: 4px;
	}
</style>
