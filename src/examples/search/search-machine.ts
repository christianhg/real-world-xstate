import { assign, createMachine } from 'xstate';

export function createSearchMachine({
	search,
}: {
	search: (query: string) => Promise<string>;
}) {
	const searchMachine = createMachine(
		{
			id: 'search',
			predictableActionArguments: true,
			preserveActionOrder: true,
			tsTypes: {} as import('./search-machine.typegen').Typegen0,
			schema: {
				context: {} as { result?: string },
				events: {} as
					| { type: 'search'; query: string }
					| { type: 'cancel' | 'reset' },
				services: {} as { search: { data: string } },
			},
			context: {},
			initial: 'idle',
			states: {
				idle: {
					entry: ['clear result'],
					on: { search: { target: 'searching' } },
				},
				searching: {
					on: { cancel: { target: 'idle' } },
					invoke: {
						src: 'search',
						onDone: { target: 'done', actions: ['store result'] },
						onError: { target: 'error' },
					},
				},
				error: { on: { reset: { target: 'idle' } } },
				done: { on: { reset: { target: 'idle' } } },
			},
		},
		{
			actions: {
				'store result': assign({ result: (context, event) => event.data }),
				'clear result': assign({ result: (context) => undefined }),
			},
			services: {
				search: (context, event) => search(event.query),
			},
		},
	);

	return searchMachine;
}
