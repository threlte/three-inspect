import type { Plugin } from 'vite'
import { createRPCServer } from 'vite-dev-rpc'
import type { ClientFunctions, ServerFunctions } from '../rpc'
import * as componentParser from './utils/componentParser'
import { addStudioRuntimeProps, componentNeedsTransform } from './utils/componentParser'
import * as componentUtils from './utils/componentUtils'
import * as fileUtils from './utils/fileUtils'
import { toMagicString } from './utils/magicStringUtils'

const HmrIgnoredModuleTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const HmrIgnoredModuleIds = new Set<string>()

const cancelModuleHmrAbility = (moduleId: string) => {
	const timneout = HmrIgnoredModuleTimeouts.get(moduleId)
	if (timneout) clearTimeout(timneout)
}

const scheduleModuleHmrAbility = (moduleId: string) => {
	cancelModuleHmrAbility(moduleId)
	HmrIgnoredModuleTimeouts.set(
		moduleId,
		setTimeout(() => {
			HmrIgnoredModuleIds.delete(moduleId)
		}, 500),
	)
}

export const plugin: () => Plugin = () => {
	return {
		name: 'Threlte-Inspector',
		enforce: 'pre',
		transform(code, id) {
			if (!id.endsWith('.svelte')) return
			if (!componentNeedsTransform(code)) return
			const { markup, script, scriptModule, style } = componentUtils.disassembleComponent(code)
			const magicMarkup = toMagicString(markup)
			addStudioRuntimeProps(magicMarkup, id)
			const finalComponent = componentUtils.assembleComponent(
				magicMarkup,
				script,
				scriptModule,
				style,
			)
			return {
				code: finalComponent,
			}
		},
		handleHotUpdate({ file }) {
			if (HmrIgnoredModuleIds.has(file)) {
				scheduleModuleHmrAbility(file)
				return []
			}
		},
		configureServer(server) {
			createRPCServer<ClientFunctions, ServerFunctions>('threlte-studio', server.ws, {
				syncTransactions(transactions) {
					const transactionsByModuleId = new Map<string, typeof transactions>()
					transactions.forEach((transaction) => {
						const transactions = transactionsByModuleId.get(transaction.moduleId) ?? []
						transactions.push(transaction)
						transactionsByModuleId.set(transaction.moduleId, transactions)
					})

					for (const [moduleId, transactions] of transactionsByModuleId.entries()) {
						const code = fileUtils.readComponent(moduleId)
						if (!componentNeedsTransform(code)) {
							console.error('Component does not need transform')
							continue
						}
						const { markup, script, scriptModule, style } =
							componentUtils.disassembleComponent(code)

						let currentMarkup = markup

						transactions.forEach((transaction) => {
							const magicMarkup = toMagicString(currentMarkup)
							const node = componentParser.findNodeByIndex(magicMarkup, transaction.componentIndex)
							if (!node) {
								console.error('Could not find node by index', transaction.componentIndex)
								return
							}
							componentParser.upsertAttribute(
								magicMarkup,
								node,
								transaction.attributeName,
								transaction.attributeValue,
								'last',
								transaction.precision,
							)

							currentMarkup = magicMarkup.toString()
						})

						const finalComponent = componentUtils.assembleComponent(
							toMagicString(currentMarkup),
							script,
							scriptModule,
							style,
						)
						cancelModuleHmrAbility(moduleId)
						HmrIgnoredModuleIds.add(moduleId)
						fileUtils.writeComponent(moduleId, finalComponent)
					}
				},
			})
		},
	}
}
