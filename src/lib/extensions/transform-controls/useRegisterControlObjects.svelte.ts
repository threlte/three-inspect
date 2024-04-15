import type { Group, Object3D } from 'three'
import type { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { useStudioObjectsRegistry } from '../studio-objects-registry/useStudioObjectsRegistry.svelte'
import { onDestroy } from 'svelte'

const isObject3D = (object: any): object is Object3D => {
	return 'isObject3D' in object
}

export const useRegisterControlObjects = () => {
	const objects = new Set<Object3D>()

	let group = $state<Group | undefined>()
	let controls = $state<TransformControls | undefined>()

	const studioObjectsRegistry = useStudioObjectsRegistry()

	$effect(() => {
		if (!controls || !group) return
		objects.add(controls)
		objects.add(group)
		controls.traverse((node: any) => {
			if (isObject3D(node)) {
				objects.add(node)
			}
			node.userData.ignoreOverrideMaterial = true
		})
		group.traverse((node: any) => {
			if (isObject3D(node)) {
				objects.add(node)
			}
			node.userData.ignoreOverrideMaterial = true
		})
		objects.forEach((object) => {
			studioObjectsRegistry.addObject(object)
		})
	})

	onDestroy(() => {
		objects.forEach((object) => {
			studioObjectsRegistry.removeObject(object)
		})
	})

	return {
		get controls() {
			return controls
		},
		set controls(value: TransformControls | undefined) {
			controls = value
		},
		get group() {
			return group
		},
		set group(value: Group | undefined) {
			group = value
		},
	}
}
