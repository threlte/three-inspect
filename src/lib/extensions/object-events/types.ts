import { type Emitter, type Handler } from 'mitt'
export const objectEventsScope = 'object-events'

export type ObjectEvents = {
	'property-change': {
		object: any
		property: string
		from: any
		to: any
	}
}

export type ObjectEventsState = {}

export type ObjectEventsActions = {
	emit<Key extends keyof ObjectEvents>(type: Key, event: ObjectEvents[Key]): void
	on<Key extends keyof ObjectEvents>(type: Key, handler: Handler<ObjectEvents[Key]>): void
	off<Key extends keyof ObjectEvents>(type: Key, handler?: Handler<ObjectEvents[Key]>): void
}
