import { useInterpret, useMachine } from '@xstate/react';
import { useRef } from 'react';
import { processNotificationMachine } from './process-notification.machine';
import { processMachine } from './process.machine';

export default function OffScreenNotification() {
	const processRef = useRef(null);
	const processNotification = useInterpret(
		() =>
			processNotificationMachine.withContext({
				element: () => processRef.current,
			}),
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
				processNotification.send('process complete');
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
