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
  import { browser } from '../../internal/browser'

  const {
    usingRaycast,
    optionalPanes,
    gizmoSettings,
    toolSettings,
    syncSettings,
    sync,
    studioSettings,
    viewSettings,
  } = getInternalContext()

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
      <span slot="tooltip">Select {$usingRaycast ? 'off' : 'on'} (A)</span>
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
      <span slot="tooltip">Free camera {$toolSettings.freeCamera.enabled ? 'off' : 'on'} (C)</span>
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

    <VerticalSeparator />

    <HorizontalButtonGroup>
      <Tooltip>
        <span slot="tooltip">Local Space (W)</span>
        <IconButton
          on:click={() => {
            $toolSettings.space = 'local'
          }}
          active={$toolSettings.space === 'local'}
          label="Local Space"
          icon="mdiAxisArrow"
        />
      </Tooltip>
      <Tooltip>
        <span slot="tooltip">World Space (W)</span>
        <IconButton
          label="World Space"
          on:click={() => {
            $toolSettings.space = 'world'
          }}
          active={$toolSettings.space === 'world'}
          icon="mdiEarth"
        />
      </Tooltip>
    </HorizontalButtonGroup>

    <HorizontalButtonGroup>
      <Tooltip>
        <IconButton
          label="Snapping"
          icon="mdiMagnet"
          active={$toolSettings.snapping.enabled}
          on:click={() => {
            $toolSettings.snapping.enabled = !$toolSettings.snapping.enabled
          }}
        />
        <span slot="tooltip">Snapping {$toolSettings.snapping.enabled ? 'off' : 'on'} (M)</span>
      </Tooltip>

      <PopUpPane
        placement="bottom"
        title="Snapping"
      >
        <svelte:fragment slot="pane">
          <Slider
            bind:value={$toolSettings.snapping.translation.step}
            label="Move"
            min={0}
          />
          <Slider
            bind:value={$toolSettings.snapping.rotation.step}
            label="Rotate"
            min={0}
            format={(v) => `${v.toFixed(2)}°`}
          />
          <Slider
            bind:value={$toolSettings.snapping.scale.step}
            label="Scale"
            min={0}
          />
        </svelte:fragment>
      </PopUpPane>
    </HorizontalButtonGroup>

    <HorizontalButtonGroup>
      <Tooltip>
        <IconButton
          on:click={() => {
            if (
              $toolSettings.transformControls.enabled &&
              $toolSettings.transformControls.mode === 'translate'
            ) {
              $toolSettings.transformControls.enabled = false
            } else {
              $toolSettings.transformControls.enabled = true
              $toolSettings.transformControls.mode = 'translate'
            }
          }}
          active={$toolSettings.transformControls.enabled &&
            $toolSettings.transformControls.mode === 'translate'}
          label="Move"
          icon="mdiRayEndArrow"
        />
        <span slot="tooltip">Move (T)</span>
      </Tooltip>

      <Tooltip>
        <IconButton
          on:click={() => {
            if (
              $toolSettings.transformControls.enabled &&
              $toolSettings.transformControls.mode === 'rotate'
            ) {
              $toolSettings.transformControls.enabled = false
            } else {
              $toolSettings.transformControls.enabled = true
              $toolSettings.transformControls.mode = 'rotate'
            }
          }}
          active={$toolSettings.transformControls.enabled &&
            $toolSettings.transformControls.mode === 'rotate'}
          label="Rotate"
          icon="mdiRotateLeft"
        />
        <span slot="tooltip">Rotate (R)</span>
      </Tooltip>

      <Tooltip>
        <IconButton
          on:click={() => {
            if (
              $toolSettings.transformControls.enabled &&
              $toolSettings.transformControls.mode === 'scale'
            ) {
              $toolSettings.transformControls.enabled = false
            } else {
              $toolSettings.transformControls.enabled = true
              $toolSettings.transformControls.mode = 'scale'
            }
          }}
          active={$toolSettings.transformControls.enabled &&
            $toolSettings.transformControls.mode === 'scale'}
          label="Scale"
          icon="mdiArrowExpand"
        />
        <span slot="tooltip">Scale (S)</span>
      </Tooltip>
    </HorizontalButtonGroup>

    <VerticalSeparator />

    <HorizontalButtonGroup>
      <Tooltip>
        <IconButton
          on:click={() => {
            $viewSettings.mode = 'wireframe'
          }}
          active={$viewSettings.mode === 'wireframe'}
          label="Wireframe"
          icon="mdiWeb"
        />
        <span slot="tooltip">Wireframe (V)</span>
      </Tooltip>

      <Tooltip>
        <IconButton
          on:click={() => {
            $viewSettings.mode = 'solid'
          }}
          active={$viewSettings.mode === 'solid'}
          label="Solid"
          icon="mdiCircle"
        />
        <span slot="tooltip">Solid (V)</span>
      </Tooltip>

      <Tooltip>
        <IconButton
          on:click={() => {
            $viewSettings.mode = 'rendered'
          }}
          active={$viewSettings.mode === 'rendered'}
          label="Rendered"
          icon="mdiCircleOpacity"
        />
        <span slot="tooltip">Rendered (V)</span>
      </Tooltip>
    </HorizontalButtonGroup>
  </div>

  <div>
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

    <!-- Sync -->
    <HorizontalButtonGroup>
      <Tooltip>
        <IconButton
          label="Sync"
          icon={$staleTransactions.length > 0 ? 'mdiLoading' : 'mdiContentSave'}
          warn={$syncSettings.enabled &&
            $syncSettings.mode === 'manual' &&
            $transactions.length > 0}
          success={$syncSettings.enabled && $syncSettings.mode === 'auto'}
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
                {#if browser && navigator.userAgent.includes('Mac')}
                  (CMD + S)
                {:else}
                  (CTRL + S)
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

    <!-- Settings -->

    <PopUpPane
      placement="bottom"
      title="Studio Settings"
      icon="mdiCog"
    >
      <svelte:fragment slot="pane">
        <Checkbox
          bind:value={$studioSettings.keyboard.enabled}
          label="Keyboard Shortcuts"
        />
      </svelte:fragment>
    </PopUpPane>
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
