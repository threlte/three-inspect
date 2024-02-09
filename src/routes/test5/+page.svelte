<script lang="ts">
	import { writable } from 'svelte/store'
	import { subStore } from '../../lib/internal/subStore'
	import { setAutoFreeze } from 'immer'
	import { watch } from '@threlte/core'

	setAutoFreeze(false)

	const store = writable({})

	const sub = subStore(store, (s) => s)

	watch(store, (s) => {
		console.log(JSON.stringify(s, null, 2))
	})

	sub.update((s) => {
		s['test'] = 'test'
		return s
	})

	sub.update((s) => {
		s['foo'] = {
			bar: 'bar',
		}
		return s
	})

	const subsub = subStore(sub, (s) => s.foo)

	subsub.update((s) => {
		s['baz'] = 'baz'
		return s
	})

	const subsubsub = subStore(sub, (s) => s.foo)

	subsubsub.update((s) => {
		s['booze'] = 'booze'
		return s
	})

	sub.update((s) => {
		s['foo'] = {
			bar: 'bar',
		}
		return s
	})
</script>
