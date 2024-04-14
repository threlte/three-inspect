import type { Color, Euler, Vector3 } from 'three'
import { clientRpc } from './vite-plugin/clientRpc'

export type UpsertRequest = {
	/** The name of the component attribute, e.g. `"position"` or `"position.x"` */
	attributeName: string
	/** The value of the component attribute derived by the value of the transaction */
	attributeValue: any
	/** The index of the component */
	componentIndex: number
	/** The module id of the component */
	moduleId: string
	/** The signature of the component */
	signature: string
}

const parser = {
	isVector3: (value: Vector3) => [value.x, value.y, value.z],
	isEuler: (value: Euler) => [value.x, value.y, value.z],
	isColor: (value: Color) => `#${value.getHexString()}`,
} satisfies Record<string, (value: any) => any>

export type SyncRequest = UpsertRequest

export class SyncQueue {
	private queue: SyncRequest[] = []

	add(request: SyncRequest) {
		// transform the value based on the parser type
		let value = request.attributeValue
		Object.entries(parser).forEach(([key, parse]) => {
			if (typeof value === 'object' && key in value) {
				value = parse(value)
			}
		})
		this.queue.push({
			...request,
			attributeValue: value,
		})
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
