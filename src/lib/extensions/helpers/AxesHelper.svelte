<script lang="ts">
	import * as THREE from 'three'
	import { T, forwardEventHandlers, type Events } from '@threlte/core'
	import { Line2 } from 'three/examples/jsm/lines/Line2.js'
	import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
	import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

	type $$Events = Events<typeof Line2>

	export let length = 1
	export let width = 0.2
	export let colors = ['red', 'green', 'blue']

	const lineGeometry = new LineGeometry()
	const lineMaterial = new LineMaterial({
		alphaToCoverage: true,
		linewidth: width / 100,
		vertexColors: true,
	})
	const line2 = new Line2(lineGeometry, lineMaterial)
	const color = new THREE.Color()

	$: {
		const positions = new Float32Array(27)
		positions[3] = length
		positions[13] = length
		positions[23] = length
		lineGeometry.setPositions(positions)
		line2.computeLineDistances()
	}

	$: {
		lineMaterial.linewidth = width / 100
	}

	$: {
		const colorArray = new Float32Array(27)
		colors.forEach((axis, i) => {
			color.set(axis)
			for (let j = i * 9; j < i * 9 + 9; j += 3) {
				colorArray[j + 0] = color.r
				colorArray[j + 1] = color.g
				colorArray[j + 2] = color.b
			}
		})
		lineGeometry.setColors(colorArray)
	}

	const component = forwardEventHandlers()
</script>

<T
	is={line2}
	bind:this={$component}
	userData={{ ignoreOverrideMaterial: true }}
>
	<T is={lineGeometry} />
	<T is={lineMaterial} />
</T>
