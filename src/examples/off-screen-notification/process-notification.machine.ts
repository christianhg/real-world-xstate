import { ActorRefFrom, assign, createMachine, spawn } from 'xstate';
import { visibilityMachine } from './visibility.machine';

export const processNotificationMachine = createMachine(
	{
		id: 'off-screen notification',
		predictableActionArguments: true,
		preserveActionOrder: true,
		initial: 'notification pending',
		schema: {
			context: {} as {
				element: () => HTMLElement | null;
				visibilityRef?: ActorRefFrom<typeof visibilityMachine>;
			},
			events: {} as { type: 'process complete' },
		},
		tsTypes: {} as import('./process-notification.machine.typegen').Typegen0,
		states: {
			'notification pending': {
				entry: 'monitor process visibility',
				on: {
					'process complete': [
						{
							cond: 'process is hidden',
							target: 'notification shown',
						},
						{
							target: 'notification not shown',
						},
					],
				},
			},
			'notification shown': {
				entry: 'show notification',
				type: 'final',
			},
			'notification not shown': {
				type: 'final',
			},
		},
	},
	{
		actions: {
			'monitor process visibility': assign({
				visibilityRef: (context) =>
					spawn(
						visibilityMachine.withContext({
							element: (context as any).element,
						}),
						{ sync: true },
					),
			}),
		},
		guards: {
			'process is hidden': (context) =>
				context.visibilityRef?.getSnapshot()?.matches('hidden') ?? false,
		},
	},
);
