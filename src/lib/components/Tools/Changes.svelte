<script lang="ts">
  import { derived } from 'svelte/store'
  import { getInternalContext } from '../../internal/context'

  const {
    sync: { transactions },
  } = getInternalContext()

  const fileNames = derived(transactions, (transactions) => {
    const fileIds = [...new Set(transactions.map((t) => t.fileId))]
    return fileIds.map((fileId) => {
      return fileId.replace(/^.*[\\/]/, '')
    })
  })
</script>

<div>
  {#if $fileNames.length}
    Unsaved changes in:<br />
    <ul>
      {#each $fileNames as fileName}
        <li>
          {fileName}
        </li>
      {/each}
    </ul>
  {:else}
    Up-to-date
  {/if}
</div>

<style>
  div {
    padding: 0.25rem 4px;
    font-family: monospace;
    font-size: 11px;
    color: var(--lbl-fg);
  }

  ul {
    padding: 0 1rem;
    margin: 0.25rem 0;
  }
</style>
