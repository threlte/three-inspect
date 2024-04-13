import { clientRpc } from './vite-plugin/clientRpc'
import type { ParserType } from './vite-plugin/utils/parsers'

export type UpsertRequest = {
	/** The name of the component attribute, e.g. `"position"` or `"position.x"` */
	attributeName: string
	/** The value of the component attribute derived by the value of the transaction */
	attributeValue: any
	/** The type of parser to use, use `"json"` for a parser based on `JSON.x` */
	parserType: ParserType
} & (
	| {
			/** The index of the component */
			componentIndex: number
			/** The module id of the component */
			moduleId: string
			/** The signature of the component */
			signature: string
	  }
	| {
			/** The object carrying the component data as userData.threlteStudio */
			object: any
	  }
)

export type SyncRequest = UpsertRequest

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
