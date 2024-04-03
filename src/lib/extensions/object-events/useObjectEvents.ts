import { useStudio } from '../../internal/extensions'
import { objectEventsScope, type ObjectEventsActions, type ObjectEventsState } from './types'

export const useObjectEvents = () => {
	const { getExtension } = useStudio()

	const { run } = getExtension<ObjectEventsState, ObjectEventsActions>(objectEventsScope)

	const emit: ObjectEventsActions['emit'] = (...args) => {
		run('emit', ...args)
	}

	const on: ObjectEventsActions['on'] = (...args) => {
		run('on', ...args)
	}

	const off: ObjectEventsActions['off'] = (...args) => {
		run('off', ...args)
	}

	return {
		emit,
		on,
		off,
	}
}
