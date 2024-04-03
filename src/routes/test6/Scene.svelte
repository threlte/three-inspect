<script lang="ts">
	import type { Handler } from 'mitt'
	import { onMount } from 'svelte'
	import { createRPCClient } from 'vite-dev-rpc'
	import { type ObjectEvents } from '../../lib/extensions/object-events/types'
	import { useObjectEvents } from '../../lib/extensions/object-events/useObjectEvents'
	import type { ClientFunctions, ServerFunctions } from '../../lib/extensions/sync/types'

	const client = createRPCClient<ServerFunctions, ClientFunctions>(
		'threlte-studio',
		import.meta.hot!,
		{},
	)

	const { on, off } = useObjectEvents()

	const onPropertyChange: Handler<ObjectEvents['property-change']> = async ({
		from,
		object,
		property,
		to,
	}) => {
		console.log(object)
		const isStudioObject = !!object.name && !!object.userData && !!object.userData.threlteStudio
		if (!isStudioObject) {
			console.warn('Object is not a studio object')
			return
		}
		await client.transaction({
			transactionId: 'abc',
			moduleId: object.userData.threlteStudio.moduleId,
			componentName: object.name,
			attributeName: property,
			from: [from.x, from.y, from.z],
			to: [to.x, to.y, to.z],
			parserType: 'position',
		})
	}
	onMount(() => {
		on('property-change', onPropertyChange)
		return () => {
			off('property-change', onPropertyChange)
		}
	})
</script>
