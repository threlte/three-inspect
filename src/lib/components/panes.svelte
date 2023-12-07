<script lang='ts'>

import { Pane, Splitpanes } from 'svelte-splitpanes'
import { Pane as Tweakpane, RadioGrid } from 'svelte-tweakpane-ui'
import Treeview from '$lib/components/treeview.svelte'
import Inputs from '$lib/components/Bindings/index.svelte'

</script>

<Splitpanes style="height: 100vh">
	<Pane minSize={10}>
    <slot />
  </Pane>

  <Pane minSize={26} size={30}>
    <div style='overflow-x: auto; width: fill-content;'>
      <!-- <Tweakpane>
        <RadioGrid key='Pane' label='' value='inspect' options={['inspect', 'world', 'physics']} />
      </Tweakpane> -->
    </div>

    <Treeview />

    <div
      class='tweakpane'
      style='overflow-y: auto; height: calc(100% - 308px)'
    >
      <Tweakpane position='inline'>
        <Inputs />
      </Tweakpane>
    </div>
    
  </Pane>
</Splitpanes>

<style>
  /* Firefox */
  :global(*) {
    scrollbar-width: thin;
    scrollbar-color: #ABABAB #EBEBEB;
  }

  /* Chrome, Edge and Safari */
  :global(*::-webkit-scrollbar) {
    width: 3px;
    width: 3px;
  }

  :global(*::-webkit-scrollbar-track) {
    border-radius: 0px;
    background-color: #EBEBEB;
  }

  :global(*::-webkit-scrollbar-track:hover) {
    background-color: #C2C2C2;
  }

  :global(*::-webkit-scrollbar-track:active) {
    background-color: #C2C2C2;
  }

  :global(*::-webkit-scrollbar-thumb) {
    border-radius: 2px;
    background-color: #ABABAB;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background-color: #747474;
  }

  :global(*::-webkit-scrollbar-thumb:active) {
    background-color: #525252;
  }
</style>