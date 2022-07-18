import { createMachine } from 'xstate';

export const processMachine = createMachine({
	id: 'process',
	tsTypes: {} as import('./process.machine.typegen').Typegen0,
	initial: 'running',
	states: {
		running: {
			after: [
				{
					delay: 5000,
					target: 'completed',
				},
			],
		},
		completed: {
			entry: 'on complete',
			type: 'final',
		},
	},
});
