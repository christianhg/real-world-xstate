import { createMachine } from 'xstate';

export const processMachine = createMachine({
	id: 'process',
	predictableActionArguments: true,
	preserveActionOrder: true,
	tsTypes: {} as import('./process.machine.typegen').Typegen0,
	initial: 'idle',
	states: {
		idle: {
			on: {
				start: {
					target: 'loading',
				},
			},
		},
		loading: {
			after: [
				{
					delay: 5000,
					target: 'complete',
				},
			],
		},
		complete: {
			entry: 'on complete',
			type: 'final',
		},
	},
});
