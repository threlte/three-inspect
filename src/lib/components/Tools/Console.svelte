<script lang="ts">
	import { onDestroy } from 'svelte'

	let originalConsoleLog = console.log
	let originalConsoleWarn = console.warn
	let originalConsoleError = console.error

	type Message = {
		type: 'log' | 'warn' | 'error'
		content: any[]
	}

	let messages: Message[] = []

	const log = (...args: any[]) => {
		const message: Message = {
			type: 'log',
			content: args,
		}
		messages.unshift(message)
		messages = messages
		originalConsoleLog(...args)
	}
	const warn = (...args: any[]) => {
		const message: Message = {
			type: 'warn',
			content: args,
		}
		messages.unshift(message)
		messages = messages
		originalConsoleWarn(...args)
	}
	const error = (...args: any[]) => {
		const message: Message = {
			type: 'error',
			content: args,
		}
		messages.unshift(message)
		messages = messages
		originalConsoleError(...args)
	}

	console.log = log
	console.warn = warn
	console.error = error

	onDestroy(() => {
		console.log = originalConsoleLog
		console.warn = originalConsoleWarn
		console.error = originalConsoleError
	})

	// console.log('Message A', { x: 0 })
	// console.warn('Message B')
	// console.error('Message C')
	// console.log('Hello World')
	// console.log('Message A', { x: 0 })
	// console.warn('Message B')
	// console.error('Message C')
	// console.log('Hello World')
	// console.log('Message A', { x: 0 })
	// console.warn('Message B')
	// console.error('Message C')
	// console.log('Hello World')
</script>

<div class="wrapper">
	{#each messages as message}
		<div class="message {message.type}">
			{#each message.content as content}
				<div class="content">
					{JSON.stringify(content, null, 2)}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.wrapper {
		height: 200px;
		overflow: auto;
		display: flex;
		flex-direction: column-reverse;
	}

	.message {
		font-family: monospace;
		font-size: 11px;
		color: #aaaaaa;
		border-bottom: 1px solid var(--tp-button-background-color);
	}

	.message.warn {
		color: rgb(255, 136, 0);
	}

	.message.error {
		color: #f00;
	}

	.content {
		padding: 2px 0;
	}
</style>
