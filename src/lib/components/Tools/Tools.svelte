<script lang="ts">
import { getInternalContext } from '../../internal/context'
import IconButton from '../Internal/IconButton.svelte'
import Tooltip from '../Internal/Tooltip.svelte'

const { usingFreeCamera, usingRaycast } = getInternalContext()
</script>

<div>
	<Tooltip>
		<IconButton
			label="Raycast"
			icon="mdiCursorDefault"
			on:click={() => {
				usingRaycast.set(!$usingRaycast)
			}}
		/>
		<span slot="tooltip">Select {$usingRaycast ? 'on' : 'off'}</span>
	</Tooltip>

	<Tooltip>
		<IconButton
			label="Free camera"
			icon="mdiCameraOutline"
			on:click={() => {
				usingFreeCamera.set(!$usingFreeCamera)
			}}
		/>
		<span slot="tooltip">Free camera {$usingFreeCamera ? 'on' : 'off'}</span>
	</Tooltip>
</div>

<style>
div {
	display: flex;
	gap: 0.25rem;
	margin-bottom: 0.25rem;
}
</style>
