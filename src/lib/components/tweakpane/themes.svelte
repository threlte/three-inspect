<script lang='ts'>
  export let theme: 'retro' | 'light' | 'dark' | 'auto'
</script>

{#if theme === 'auto'}
<style>
  @media (prefers-color-scheme: light) {
    :root {
      --tp-base-background-color: hsla(230, 5%, 90%, 1);
      --tp-base-shadow-color: hsla(0, 0%, 0%, 0.10);
      --tp-button-background-color: hsla(230, 7%, 75%, 1);
      --tp-button-background-color-active: hsla(230, 7%, 60%, 1);
      --tp-button-background-color-focus: hsla(230, 7%, 65%, 1);
      --tp-button-background-color-hover: hsla(230, 7%, 70%, 1);
      --tp-button-foreground-color: hsla(230, 10%, 30%, 1);
      --tp-container-background-color: hsla(230, 15%, 30%, 0.20);
      --tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
      --tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
      --tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
      --tp-container-foreground-color: hsla(230, 10%, 30%, 1);
      --tp-groove-foreground-color: hsla(230, 15%, 30%, 0.10);
      --tp-input-background-color: hsla(230, 15%, 30%, 0.10);
      --tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
      --tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
      --tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
      --tp-input-foreground-color: hsla(230, 10%, 30%, 1);
      --tp-label-foreground-color: hsla(230, 10%, 30%, 0.70);
      --tp-monitor-background-color: hsla(230, 15%, 30%, 0.10);
      --tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.50);
    }
  }
</style>

{:else if theme === 'retro'}
<style>
  :root {
    --tp-base-background-color: hsla(40, 3%, 90%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.30);
    --tp-button-background-color: hsla(40, 3%, 70%, 1);
    --tp-button-background-color-active: hsla(40, 3%, 55%, 1);
    --tp-button-background-color-focus: hsla(40, 3%, 60%, 1);
    --tp-button-background-color-hover: hsla(40, 3%, 65%, 1);
    --tp-button-foreground-color: hsla(40, 3%, 20%, 1);
    --tp-container-background-color: hsla(40, 3%, 70%, 1);
    --tp-container-background-color-active: hsla(40, 3%, 55%, 1);
    --tp-container-background-color-focus: hsla(40, 3%, 60%, 1);
    --tp-container-background-color-hover: hsla(40, 3%, 65%, 1);
    --tp-container-foreground-color: hsla(40, 3%, 20%, 1);
    --tp-groove-foreground-color: hsla(40, 3%, 40%, 1);
    --tp-input-background-color: hsla(120, 3%, 20%, 1);
    --tp-input-background-color-active: hsla(120, 3%, 35%, 1);
    --tp-input-background-color-focus: hsla(120, 3%, 30%, 1);
    --tp-input-background-color-hover: hsla(120, 3%, 25%, 1);
    --tp-input-foreground-color: hsla(120, 40%, 60%, 1);
    --tp-label-foreground-color: hsla(40, 3%, 50%, 1);
    --tp-monitor-background-color: hsla(120, 3%, 20%, 1);
    --tp-monitor-foreground-color: hsla(120, 40%, 60%, 0.80);
  }
</style>

{:else if theme === 'light'}
<style>
  :root {
    --tp-base-background-color: hsla(230, 5%, 90%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.10);
    --tp-button-background-color: hsla(230, 7%, 75%, 1);
    --tp-button-background-color-active: hsla(230, 7%, 60%, 1);
    --tp-button-background-color-focus: hsla(230, 7%, 65%, 1);
    --tp-button-background-color-hover: hsla(230, 7%, 70%, 1);
    --tp-button-foreground-color: hsla(230, 10%, 30%, 1);
    --tp-container-background-color: hsla(230, 15%, 30%, 0.20);
    --tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
    --tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
    --tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
    --tp-container-foreground-color: hsla(230, 10%, 30%, 1);
    --tp-groove-foreground-color: hsla(230, 15%, 30%, 0.10);
    --tp-input-background-color: hsla(230, 15%, 30%, 0.10);
    --tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
    --tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
    --tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
    --tp-input-foreground-color: hsla(230, 10%, 30%, 1);
    --tp-label-foreground-color: hsla(230, 10%, 30%, 0.70);
    --tp-monitor-background-color: hsla(230, 15%, 30%, 0.10);
    --tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.50);
  }
</style>
{/if}