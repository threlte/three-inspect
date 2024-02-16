<script lang="ts">
	import { onDestroy } from 'svelte'
	import { useStudio } from '../../internal/extensions'
	import {
		objectSelectionScope,
		type ObjectSelectionActions,
		type ObjectSelectionState,
	} from './types'

	const { addExtension, removeExtension } = useStudio()

	addExtension<ObjectSelectionState, ObjectSelectionActions>({
		scope: objectSelectionScope,
		state: () => ({
			selectedObjects: [],
		}),
		actions: {
			selectObjects({ select }, objects) {
				select((s) => s.selectedObjects).set(objects)
			},
			clearSelection({ select }) {
				select((s) => s.selectedObjects).set([])
			},
			addToSelection({ select }, objects) {
				select((s) => s.selectedObjects).update((selectedObjects) => {
					return [...selectedObjects, ...objects]
				})
			},
			removeFromSelection({ select }, objects) {
				select((s) => s.selectedObjects).update((selectedObjects) => {
					return selectedObjects.filter((object) => !objects.includes(object))
				})
			},
		},
	})

	onDestroy(() => {
		removeExtension(objectSelectionScope)
	})
</script>
