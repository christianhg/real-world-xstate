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
			dismiss: () => void;
	  }
	| {
			name: 'rating selected';
			rating: number;
			selectRating: (rating: number) => void;
			send: (feedbackText: string) => void;
			dismiss: () => void;
	  }
	| { name: 'sending' }
	| { name: 'sent' };

export function useFeedback(): FeedbackState {
	const [state, send] = useMachine(() =>
		createFeedbackMachine({
			api: {
				skip: () => wait(1000),
				send: () => wait(1000),
			},
			delays: { doneDelay: 4000 },
			on: {
				failedToDismissFeedback: () => {},
				failedToSendFeedback: () => {},
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
			dismiss: () => {
				formRef.send('dismiss');
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
			dismiss: () => {
				formRef.send('dismiss');
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
