import { useInterpret, useMachine } from '@xstate/react';
import { useRef } from 'react';
import { ActorRefFrom, assign, createMachine, spawn } from 'xstate';
import { processMachine } from '../generic-machines/process.machine';
import { visibilityMachine } from '../generic-machines/visibility.machine';

export default function OffScreenNotification() {
	const processRef = useRef(null);
	const notification = useInterpret(
		() =>
			notificationMachine.withContext({ element: () => processRef.current }),
		{
			actions: {
				'show notification': () => {
					alert('Process completed');
				},
			},
		},
	);
	const [process, send] = useMachine(processMachine, {
		actions: {
			'on complete': () => {
				notification.send('process complete');
			},
		},
	});

	return (
		<main>
			<section>
				<p>
					Scroll down to see the "process". If it finishes off-screen, a
					notification is shown.
				</p>
				<p>
					<button
						disabled={!process.matches('idle')}
						onClick={() => {
							send({ type: 'start' });
						}}
					>
						Start process
					</button>
				</p>
			</section>
			<section>
				<div ref={processRef} className={`process ${process.value}`}>
					Process: {process.value.toString().toUpperCase()}
				</div>
			</section>
			<section>...</section>
		</main>
	);
}

const notificationMachine = createMachine(
	{
		id: 'off-screen notification',
		initial: 'notification pending',
		schema: {
			context: {} as {
				element: () => HTMLElement | null;
				visibilityRef?: ActorRefFrom<typeof visibilityMachine>;
			},
			events: {} as { type: 'process complete' },
		},
		tsTypes: {} as import('./off-screen-notification.typegen').Typegen0,
		states: {
			'notification pending': {
				entry: [
					assign({
						visibilityRef: (context) =>
							spawn(
								visibilityMachine.withContext({
									element: (context as any).element,
								}),
								{ sync: true },
							),
					}),
				],
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
		guards: {
			'process is hidden': (context) =>
				context.visibilityRef?.getSnapshot()?.matches('hidden') ?? false,
		},
	},
);
