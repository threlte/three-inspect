<script
	context="module"
	lang="ts"
>
	import { mdiCursorDefault, mdiCameraOutline } from '@mdi/js'

	export const paths = {
		mdiCursorDefault,
		mdiCameraOutline,
	}

	export type Icons = keyof typeof paths
</script>

<script lang="ts">
	export let name: Icons
	export let size: string | undefined = '24'
	export let viewBox: string | undefined = '0 0 24 24'
	export let flip = 'none'
	export let rotate = 0

	$: sx = ['both', 'horizontal'].includes(flip) ? '-1' : '1'
	$: sy = ['both', 'vertical'].includes(flip) ? '-1' : '1'
	$: r = Number.isNaN(rotate) ? rotate : `${rotate}deg`
</script>

<svg
	width={size}
	height={size}
	{viewBox}
	style="--sx:{sx}; --sy:{sy}; --r:{r}"
	{...$$restProps}
>
	<path d={paths[name]} />
</svg>

<style>
	svg {
		transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
	}

	path {
		fill: currentColor;
	}
</style>
