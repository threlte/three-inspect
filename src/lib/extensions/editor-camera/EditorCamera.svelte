<script lang="ts">
	import { T, useThrelte, watch } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { RadioGrid } from 'svelte-tweakpane-ui'
	import { derived, get } from 'svelte/store'
	import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three'
	import DropDownPane from '../../components/DropDownPane/DropDownPane.svelte'
	import ToolbarButton from '../../components/ToolbarButton/ToolbarButton.svelte'
	import ToolbarItem from '../../components/ToolbarItem/ToolbarItem.svelte'
	import HorizontalButtonGroup from '../../components/Tools/HorizontalButtonGroup.svelte'
	import { useStudio } from '../../internal/extensions'
	import CameraControls from './CameraControls.svelte'
	import DefaultCamera from './DefaultCamera.svelte'
	import { editorCameraScope, type EditorCameraActions, type EditorCameraState } from './types'

	const { addExtension } = useStudio()
	const { camera } = useThrelte()

	const editorCameraPerspective = new PerspectiveCamera()
	editorCameraPerspective.userData.editorCamera = true
	editorCameraPerspective.userData.perspective = true
	const editorCameraOrthographic = new OrthographicCamera()
	editorCameraOrthographic.userData.editorCamera = true
	editorCameraOrthographic.userData.orthographic = true

	const { state, run } = addExtension<EditorCameraState, EditorCameraActions>({
		scope: editorCameraScope,
		state({ persist }) {
			return {
				enabled: persist(false),
				mode: persist('Perspective'),
				position: persist([10, 10, 10]),
				target: persist([0, 0, 0]),
				defaultCamera: {
					object: undefined,
					enabled: persist(true),
					height: persist(240),
					width: persist(400),
				},
			}
		},
		actions: {
			toggleEnabled({ select }) {
				select((s) => s.enabled).update((active) => !active)
			},
			setEnabled({ select }, active) {
				select((s) => s.enabled).set(active)
			},
			setOrthographic({ select }) {
				select((s) => s.mode).set('Orthographic')
			},
			setPerspective({ select }) {
				select((s) => s.mode).set('Perspective')
			},
			setEditorCameraTransform({ select }, position, target) {
				select((s) => s.position).set(position)
				select((s) => s.target).set(target)
			},
			setMode({ select }, mode) {
				select((s) => s.mode).set(mode)
			},
			toggleMode({ select }) {
				select((s) => s.mode).update((mode) => {
					return mode === 'Orthographic' ? 'Perspective' : 'Orthographic'
				})
			},
			toggleDefaultCameraEnabled({ select }) {
				select((s) => s.defaultCamera.enabled).update((enabled) => !enabled)
			},
			setDefaultCameraObject({ select }, object) {
				select((s) => s.defaultCamera.object).set(object)
			},
		},
		keyMap() {
			return {
				toggleEnabled: 'c',
			}
		},
	})

	const editorCameraPosition = state.select((s) => s.position)
	const editorCameraTarget = state.select((s) => s.target)
	const defaultCameraEnabled = state.select((s) => s.defaultCamera.enabled)
	const editorCameraEnabled = state.select((s) => s.enabled)
	const mode = state.select((s) => s.mode)
	const editorCamera = derived(mode, (mode) => {
		return mode === 'Orthographic' ? editorCameraOrthographic : editorCameraPerspective
	})
	const defaultCameraObject = state.select((s) => s.defaultCamera.object)

	watch(camera, (camera) => {
		if (camera !== editorCameraPerspective && camera !== editorCameraOrthographic) {
			run('setDefaultCameraObject', camera)
		}
	})

	watch(
		[editorCameraEnabled, editorCamera, defaultCameraObject],
		([enabled, editorCamera, defaultCameraObject]) => {
			if (enabled) {
				camera.set(editorCamera)
			} else {
				if (defaultCameraObject) {
					camera.set(defaultCameraObject)
				}
			}
		},
	)

	onDestroy(() => {
		const cam = get(defaultCameraObject)
		if (cam) camera.set(cam)
	})

	let modes = ['Perspective', 'Orthographic']
	let value = $mode

	const onModeChange = (mode: string | number | boolean) => {
		if (mode === 'Perspective') run('setPerspective')
		if (mode === 'Orthographic') run('setOrthographic')
	}
</script>

<ToolbarItem position="left">
	<HorizontalButtonGroup>
		<ToolbarButton
			on:click={() => {
				run('toggleEnabled')
			}}
			active={$editorCameraEnabled}
			label="Editor Camera"
			icon="mdiCamera"
			tooltip="Editor Camera (T)"
		/>

		<DropDownPane title="Settings">
			<RadioGrid
				{value}
				values={modes}
				on:change={(e) => {
					onModeChange(e.detail.value)
				}}
			/>
		</DropDownPane>
	</HorizontalButtonGroup>
</ToolbarItem>

{#if $editorCameraEnabled}
	{#if $mode === 'Perspective'}
		<T is={editorCameraPerspective}>
			<CameraControls
				camera={editorCameraPerspective}
				initialPosition={new Vector3(...$editorCameraPosition)}
				initialTarget={new Vector3(...$editorCameraTarget)}
				on:unmount={(e) => {
					run('setEditorCameraTransform', e.detail.position.toArray(), e.detail.target.toArray())
				}}
			/>
		</T>
	{:else if $mode === 'Orthographic'}
		<T
			zoom={100}
			is={editorCameraOrthographic}
		>
			<CameraControls
				camera={editorCameraOrthographic}
				initialPosition={new Vector3(...$editorCameraPosition)}
				initialTarget={new Vector3(...$editorCameraTarget)}
				on:unmount={(e) => {
					run('setEditorCameraTransform', e.detail.position.toArray(), e.detail.target.toArray())
				}}
			/>
		</T>
	{/if}

	{#if $defaultCameraEnabled}
		<DefaultCamera />
	{/if}
{/if}
