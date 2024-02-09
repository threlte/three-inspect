import type { Subscriber, Unsubscriber, Writable } from 'svelte/store'

export const deepStore = <T>(value: T) => {
	// mapping of paths to subscribers
	const subscribers = new Map<string, Set<Subscriber<any>>>(new Map())

	const addSubscriber = <U>(path: string, subscriber: Subscriber<U>) => {
		const subs = subscribers.get(path)
		if (subs) {
			subs.add(subscriber)
		} else {
			subscribers.set(path, new Set([subscriber]))
		}
	}

	const removeSubscriber = <U>(path: string, subscriber: Subscriber<U>) => {
		const subs = subscribers.get(path)
		if (subs) {
			subs.delete(subscriber)
		}
	}

	const notifySubscribers = (path: string, value: unknown) => {
		const subs = subscribers.get(path)
		if (subs) {
			subs.forEach((sub) => {
				sub(value)
			})
		}
	}

	const subscribe = (run: Subscriber<T>): Unsubscriber => {
		const path = ''
		addSubscriber(path, run)
		return () => {
			removeSubscriber(path, run)
		}
	}

	const set = (value: T) => {
		notifySubscribers('', value)
	}

	const update = (updater: (value: T) => T) => {
		set(updater(value))
	}

	const select = <U>(selector: (value: T) => U): Writable<U> => {
    
  }

	return {
		subscribe,
		set,
		update,
		select,
	}
}

const x = deepStore({ a: { b: { c: 1 } } })

x.select((s) => s.a.b.c)
