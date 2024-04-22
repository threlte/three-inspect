<script lang="ts">
  import { watch } from '@threlte/core'
  import { getInternalContext } from '../../internal/context'
  import { useSync } from '../../internal/sync'

  const { sync, syncSettings } = getInternalContext()

  const { writeToDisk } = useSync()

  let timeout: ReturnType<typeof setTimeout> | undefined

  watch([syncSettings, sync.transactions], ([settings, transactions]) => {
    if (!settings.enabled) return
    if (settings.mode !== 'auto') return
    if (transactions.length === 0) return
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      writeToDisk()
    }, 1000)
  })
</script>
