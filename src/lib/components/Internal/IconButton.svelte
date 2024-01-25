<script lang="ts">
	import Icon, { type Icons } from './Icon.svelte'

	export let icon: Icons
	export let label: string

	export let activityColor: 'transparent' | 'red' | 'orange' | 'green' = 'transparent'
	export let active: boolean = false
	export let disabled: boolean = false

	const activityColors: Record<Exclude<typeof activityColor, undefined>, string> = {
		red: '#dc2626',
		orange: '#f97316',
		green: '#22c55e',
		transparent: 'transparent',
	}

	const backgroundColors: Record<'active' | 'default', string> = {
		active: '#2563eb',
		default: 'var(--btn-bg);',
	}

	const backgroundColorsHover: Record<'active' | 'default', string> = {
		active: '#1d4ed8',
		default: 'var(--btn-bg-h)',
	}

	const backgroundColorsFocus: Record<'active' | 'default', string> = {
		active: '#1d4ed8',
		default: 'var(--btn-bg-f);',
	}

	const backgroundColorsActive: Record<'active' | 'default', string> = {
		active: '#1d4ed8',
		default: 'var(--btn-bg-a);',
	}

	const textColor: Record<'active' | 'default', string> = {
		active: 'white',
		default: 'black',
	}
</script>

<button
	aria-label={label}
	on:click
	style="--activityColor: {activityColors[activityColor]}; --background-color: {backgroundColors[
		active ? 'active' : 'default'
	]}; --background-color-hover: {backgroundColorsHover[
		active ? 'active' : 'default'
	]}; --background-color-focus: {backgroundColorsFocus[
		active ? 'active' : 'default'
	]}; --background-color-active: {backgroundColorsActive[
		active ? 'active' : 'default'
	]}; --text-color: {textColor[active ? 'active' : 'default']};"
	{disabled}
	{...$$restProps}
>
	<Icon
		size="15"
		name={icon}
	/>
</button>

<style>
	button {
		display: grid;
		place-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border: 0;
		padding: 0;
		margin: 0;
		background-color: var(--background-color);
		color: var(--text-color);
		border-radius: var(--bs-br);
		position: relative;
	}

	button::after {
		content: '';
		position: absolute;
		top: -2px;
		right: -2px;
		width: 8px;
		height: 8px;
		background-color: var(--activityColor);
		border-radius: 1000px;
		z-index: 1;
	}

	button:hover {
		background-color: var(--background-color-hover);
	}

	button:focus {
		background-color: var(--background-color-focus);
	}

	button:active {
		background-color: var(--background-color-active);
	}
</style>
