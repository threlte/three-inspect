<script lang="ts">
	import Icon, { type Icons } from './Icon.svelte'

	export let icon: Icons
	export let label: string

	export let activityColor: 'transparent' | 'red' | 'orange' | 'green' = 'transparent'
	export let backgroundColor: 'default' | 'red' | 'orange' | 'green' = 'default'

	const activityColors: Record<Exclude<typeof activityColor, undefined>, string> = {
		red: 'red',
		orange: '#f97316',
		green: '#22c55e',
		transparent: 'transparent',
	}

	const backgroundColors: Record<Exclude<typeof backgroundColor, undefined>, string> = {
		red: '#fca5a5',
		orange: '#fdba74',
		green: '#4BDE80',
		default: 'var(--tp-button-background-color)',
	}

	const backgroundColorsHover: Record<Exclude<typeof backgroundColor, undefined>, string> = {
		red: '#f87171',
		orange: '#fb923c',
		green: '#22c55e',
		default: 'var(--tp-button-background-color-hover)',
	}

	const backgroundColorsFocus: Record<Exclude<typeof backgroundColor, undefined>, string> = {
		red: '#ef4444',
		orange: '#f97316',
		green: '#22c55e',
		default: 'var(--tp-button-background-color-focus)',
	}

	const backgroundColorsActive: Record<Exclude<typeof backgroundColor, undefined>, string> = {
		red: '#ef4444',
		orange: '#f97316',
		green: '#16a34a',
		default: 'var(--tp-button-background-color-active)',
	}
</script>

<button
	aria-label={label}
	{...$$restProps}
	on:click
	style="--activityColor: {activityColors[activityColor]}; --background-color: {backgroundColors[
		backgroundColor
	]}; --background-color-hover: {backgroundColorsHover[
		backgroundColor
	]}; --background-color-focus: {backgroundColorsFocus[
		backgroundColor
	]}; --background-color-active: {backgroundColorsActive[backgroundColor]}"
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
		color: var(--tp-button-foreground-color);
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
