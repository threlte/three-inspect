<script lang='ts'>
  import type { Icons } from './Icon.svelte'
  import Icon from './Icon.svelte'

  export let icon: Icons
  export let label: string
</script>

<button aria-label={label} {...$$restProps} on:click>
  <Icon size='15' name={icon} />
</button>

<style>
  button {
    display: grid;
    place-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    padding: 0;
    margin: 0;
    background-color: var(--tp-button-background-color);
    color: var(--tp-button-foreground-color);
  }

  button:hover {
    background-color: var(--tp-button-background-color-hover);
  }
  
  button:focus {
    background-color: var(--tp-button-background-color-focus);
  }

  button:active {
    background-color: var(--tp-button-background-color-active);
  }
</style>
