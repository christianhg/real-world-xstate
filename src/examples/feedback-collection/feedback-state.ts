import { useMachine } from '@xstate/react';
import { wait } from '../../util/wait';
import { FeedbackFormMachineRef } from './feedback-form-machine';
import { createFeedbackMachine } from './feedback-machine';

export type FeedbackState =
	| { name: 'idle'; toggle: () => void }
	| { name: 'showing form'; formState: FeedbackFormState }
	| { name: 'completed' };

export type FeedbackFormState =
	| {
			name: 'idle';
			selectRating: (rating: number) => void;
			skip: () => void;
	  }
	| {
			name: 'rating selected';
			rating: number;
			selectRating: (rating: number) => void;
			send: (feedbackText: string) => void;
			skip: () => void;
	  }
	| { name: 'sending' }
	| { name: 'sent' };

export function useFeedbackState(): FeedbackState {
	const [state, send] = useMachine(() =>
		createFeedbackMachine({
			api: {
				skip: async () => {
					// Store skip action on the back end so we don't show the form again.
					console.info('Feedback skipped');
					await wait(1000);
				},
				send: async (payload) => {
					// Store feedback on the back end.
					console.info(
						`Feedback given: "${payload.feedbackText}" (${payload.rating})`,
					);
					await wait(1000);
				},
			},
			delays: { doneDelay: 4000 },
			on: {
				failedToSkipFeedback: () => {
					// We didn't create an explicit fail state since feedback collection
					// isn't so important. Perhaps trigger a small toaster error message
					// using this callback?
				},
				failedToSendFeedback: () => {
					// Same as above.
				},
			},
		}),
	);

	if (state.matches('idle')) {
		return {
			name: 'idle',
			toggle: () => {
				send('toggle');
			},
		};
	}

	if (state.matches('showing form')) {
		return {
			name: 'showing form',
			formState: getFeedbackFormState(state.context.formRef),
		};
	}

	return {
		name: 'completed',
	};
}

function getFeedbackFormState(
	formRef: FeedbackFormMachineRef,
): FeedbackFormState {
	const formSnapshot = formRef.getSnapshot();

	if (!formSnapshot) {
		throw new Error('Expected form snapshot');
	}

	if (formSnapshot.matches('idle')) {
		return {
			name: 'idle',
			selectRating: (rating) => {
				formRef.send({ type: 'select rating', rating });
			},
			skip: () => {
				formRef.send('skip');
			},
		};
	}

	if (formSnapshot.matches('rating selected')) {
		return {
			name: 'rating selected',
			rating: formSnapshot.context.rating,
			selectRating: (rating) => {
				formRef.send({ type: 'select rating', rating });
			},
			skip: () => {
				formRef.send('skip');
			},
			send: (feedbackText) => {
				formRef.send({ type: 'send', feedbackText });
			},
		};
	}

	if (formSnapshot.matches('sending')) {
		return {
			name: 'sending',
		};
	}

	return {
		name: 'sent',
	};
}
