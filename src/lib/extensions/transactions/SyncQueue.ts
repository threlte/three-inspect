import { clientRpc } from './vite-plugin/clientRpc'
import type { ParserType } from './vite-plugin/utils/parsers'

type SyncRequest = {
	id: string
	moduleId: string
	componentIndex: number
	signature: string
	parserType: ParserType
	attributeName: string
	attributeValue: any
}

export class SyncQueue {
	private queue: SyncRequest[] = []

	add(request: SyncRequest) {
		this.queue.push(request)
		this.run()
	}

	async run() {
		while (this.queue.length > 0) {
			const request = this.queue.shift()
			if (!request) return
			await clientRpc?.syncTransaction(request)
		}
	}
}
