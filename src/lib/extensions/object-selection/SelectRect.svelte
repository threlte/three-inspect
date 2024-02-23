<script lang="ts">
	import { useThrelte, watch } from '@threlte/core'
	import { onMount } from 'svelte'
	import { Object3D } from 'three'
	import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js'
	import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper.js'
	import { useStudio } from '../../internal/extensions'
	import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry'
	import {
		objectSelectionScope,
		type ObjectSelectionActions,
		type ObjectSelectionState,
	} from './types'

	const { camera, scene, renderer } = useThrelte()

	const { getExtension } = useStudio()

	const { run, state } = getExtension<ObjectSelectionState, ObjectSelectionActions>(
		objectSelectionScope,
	)

	const selectedObjects = state.select((s) => s.selectedObjects)
	const selectionBox = new SelectionBox(camera.current, scene)
	const helper = new SelectionHelper(renderer, 'selectBox')

	const { studioObjects } = useStudioObjectsRegistry()

	watch(camera, (camera) => {
		selectionBox.camera = camera
	})

	const filter = (objects: Object3D[]): Object3D[] => {
		let objs = objects.filter((object) => {
			return !$studioObjects.has(object)
		})
		return objs
	}

	let initialObjects: Object3D[] = []

	let selectionMode: 'select' | 'remove' | 'add' = 'select'
	$: console.log('selectionMode', selectionMode)

	const onPointerDown = (event: MouseEvent) => {
		console.log('meta key', event.metaKey)
		if (event.shiftKey) {
			event.preventDefault()
			selectionMode = 'add'
		} else if (event.ctrlKey || event.metaKey) {
			event.preventDefault()
			selectionMode = 'remove'
		} else {
			selectionMode = 'select'
		}
		initialObjects = [...$selectedObjects]
		selectionBox.startPoint.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1,
			0.5,
		)
		run('setInUse', true)
	}

	const onPointerMove = (event: MouseEvent) => {
		if (helper.isDown) {
			selectionBox.endPoint.set(
				(event.clientX / window.innerWidth) * 2 - 1,
				-(event.clientY / window.innerHeight) * 2 + 1,
				0.5,
			)
			const allSelected = filter(selectionBox.select())
			if (selectionMode === 'add') {
				run('addToSelection', allSelected)
			} else if (selectionMode === 'remove') {
				run('removeFromSelection', allSelected)
			} else {
				run('selectObjects', allSelected)
			}
		}
	}

	const onPointerUp = (event: MouseEvent) => {
		selectionBox.endPoint.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1,
			0.5,
		)

		const allSelected = filter(selectionBox.select())
		if (selectionMode === 'add') {
			run('addToSelection', allSelected)
		} else if (selectionMode === 'remove') {
			run('removeFromSelection', allSelected)
		} else {
			run('selectObjects', allSelected)
		}
		run('setInUse', false)
	}

	onMount(() => {
		renderer.domElement.addEventListener('pointerdown', onPointerDown)
		renderer.domElement.addEventListener('pointermove', onPointerMove)
		renderer.domElement.addEventListener('pointerup', onPointerUp)
		return () => {
			renderer.domElement.removeEventListener('pointerdown', onPointerDown)
			renderer.domElement.removeEventListener('pointermove', onPointerMove)
			renderer.domElement.removeEventListener('pointerup', onPointerUp)
			helper.dispose()
		}
	})
</script>

<style>
	:global(.selectBox) {
		border: 1px solid #3662e3;
		background-color: #3661e339;
		position: fixed;
	}
</style>
