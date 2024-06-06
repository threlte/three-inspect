<script lang="ts">
	import { onMount } from 'svelte'
	import {
		WebGLRenderer,
		Scene,
		Color,
		AmbientLight,
		DirectionalLight,
		Matrix4,
		Object3D,
		BoxGeometry,
		MeshStandardMaterial,
		PerspectiveCamera,
		Mesh,
	} from 'three'
	import { createInspector } from '$lib'
	import { colors } from './colors'

	let div: HTMLElement
	let target: HTMLElement

	const renderer = new WebGLRenderer()
	renderer.shadowMap.enabled = true
	renderer.setPixelRatio(window.devicePixelRatio)

	const scene = new Scene()
	scene.background = new Color('#222')

	const ambient = new AmbientLight(undefined, 0.3)
	scene.add(ambient)

	const light1 = new DirectionalLight()
	light1.intensity = 0.5
	light1.position.set(0, 3, 0)
	light1.castShadow = true

	const light2 = new DirectionalLight()
	light2.intensity = 0.5
	light2.position.set(0, 3, 2)
	light2.castShadow = true

	const light3 = new DirectionalLight()
	light3.intensity = 0.5
	light3.position.set(2, 1, 2)
	light3.castShadow = true

	scene.add(light1, light2, light3)

	const rotationMatrix = new Matrix4()
		.makeRotationX(0.005)
		.multiply(new Matrix4().makeRotationY(0.005))
		.multiply(new Matrix4().makeRotationZ(0.005))

	const translateMatrix = new Matrix4()
	const numberCubes = 27
	const cubes: Object3D[] = []
	let index = 0

	const cubeTranslation = (cubeIndex: number, n: number) => {
		const x = (cubeIndex % 3) * n - n
		const y = Math.trunc((cubeIndex % 9) / 3) * n - n
		const z = Math.trunc(cubeIndex / 9) * n - n
		translateMatrix.makeTranslation(x, y, z)
	}

	while (index < numberCubes) {
		const geometry = new BoxGeometry()
		const material = new MeshStandardMaterial({ color: colors[index] })
		const cube = new Mesh(geometry, material)
		cube.name = `Cube ${index}`
		cube.castShadow = true
		cube.receiveShadow = true

		cubes.push(cube)
		scene.add(cube)

		cubeTranslation(index, 1)
		cube.applyMatrix4(translateMatrix)

		index += 1
	}

	let x = 0

	const camera = new PerspectiveCamera(30)
	camera.zoom = 0.9
	camera.position.set(10, 10, 10)
	camera.lookAt(0, 0, 0)
	scene.add(camera)

	requestAnimationFrame(function tick() {
		requestAnimationFrame(tick)

		x += 0.05
		camera.applyMatrix4(rotationMatrix)

		for (const [cubeIndex, cube] of cubes.entries()) {
			cubeTranslation(cubeIndex, Math.sin(x / 2) * 0.01)
			cube.applyMatrix4(translateMatrix)
		}

		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.render(scene, camera)
	})

	onMount(() => {
		const dispose = createInspector(target, {
			renderer,
			scene,
			camera,
		})

		div.append(renderer.domElement)

		return () => {
			dispose()
		}
	})
</script>

<div bind:this={target} />
<div
	style="display:contents"
	bind:this={div}
/>
