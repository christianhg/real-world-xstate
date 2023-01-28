import { ActorRefFrom, assign, createMachine, sendParent } from 'xstate';

export type FeedbackFormMachineRef = ActorRefFrom<
	typeof createFeedbackFormMachine
>;

type Context = {
	rating: number | undefined;
};

type MachineEvent =
	| { type: 'dismiss' }
	| { type: 'select rating'; rating: number }
	| { type: 'send'; feedbackText: string };

type MachineState =
	| {
			value: 'idle' | 'sending' | 'sent' | 'done';
			context: {
				rating: undefined;
			};
	  }
	| {
			value: 'rating selected';
			context: {
				rating: number;
			};
	  };

export function createFeedbackFormMachine({
	api,
	delays,
	on,
}: {
	api: {
		skip: () => Promise<void>;
		send: (payload: { rating: number; feedbackText: string }) => Promise<void>;
	};
	delays: {
		doneDelay: number;
	};
	on: {
		failedToDismissFeedback: () => void;
		failedToSendFeedback: () => void;
	};
}) {
	const machine =
		/** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrABMgPYBOAtgHQCWEANmAMSxj3YAu+JmbVAdlAG0ADAF1EoAA5FYVHkV7iQAD0QBmAIwA2CgFZ1AJgCcmwzv06ALIfUB2ADQgAnoi2GK606sNChF9eoshAA4AXxCHVAwcAmJyajpGCCpYMmTYYTEkECkZOQUslQQDfQp9fQtNdR1DCv8goNUHZwRNVQobPyFNG00ymw1jMIi0CCw8QlJKLh5+fGZWNkgmFjB2Tm4+QVFFHNkqeUVCnSCbCk0g850bHUrrIJ0mtX11XXObfVVNCwsgwzKhkCRUbRCZxaabOYrdhLJIpNIZHbSPYHAqIGy-UpBCyqMw-ITo1QWR5FLQUQw9Cz6IJCVT6dF-CwAoFjGKTCjg2bzVaLCDLXgQBFZXZ5Q6IIK2Mnnam+LENcXE55tfxUow-T4fUxMkYs0GUZj8zYMCDyMDUXgANyIuFNzJBsT1YAN-AQfEt2A28gygskSJFqJawQon3x3gsNn6Ng8xKsp2+tJOti69zpWqi43tFH1SX4DDAJBIpAoElo3AztvTbKzmxdFqI7ryXu2Qt9+3yoEK4rclQ8dIsOn7hmM0ZsblMxgCPxH1VTwIrcX1bAYSlgbG4pswyEWJAAFMbeGB8BAWJhHABKBjl1nzx1sb3ZFso9suLSnG5UjpdQdq4lfNo-dS-HSQiWJYNgzjqGZ7qasKpLAzC8nmBYkEWJZsGW2p2myUEUDBaSQDWboerwjaZD6uStqKJIVBQFxYmYAS9F8mjEgAtP0QaGKokbdPoQgAeqYThCAvBEEe8BZJeuqIuRj7KIgLHMU48lGDoQZXOUbwfKoXTgZhcQ0PQ0nIm2ckIJSxIMWSViqr2lIeJoulzlMGyclCPJGX6T5mVi7Q2L4dL+IYvxEkpRRWBQfhYpoNLlOGqgXI5V4Ok6UAeRR-o9KpwHvMBHjXOoQiGMSqi0u4AF8dcvGfP4iW6pmN5pbJhQ9KOlJ0hcATor4P7AUGXQmEIvHeCOhi1ZBJqNSZhQFeG7iWL4g1+VcIXNCxvGnAmy3nBVAT6GNWEmjhySwfBk2UcqqlVIEgRActP4WBQXT+Oo2lhv0A77XE2HYEQZDFmA7nNjJU3PtFpThu81RXfFinNFVugfCYmj9sBT2MoJQA */
		createMachine<Context, MachineEvent, MachineState>(
			{
				context: { rating: undefined },
				preserveActionOrder: true,
				predictableActionArguments: true,
				initial: 'idle',
				id: 'feedback form',
				states: {
					idle: {
						description: 'Show feedback form in its initial state',
						on: {
							'select rating': {
								target: 'rating selected',
							},
							dismiss: {
								target: 'done.dismissed',
							},
						},
					},
					'rating selected': {
						entry: 'store rating',
						description: 'Present the option to share feedback',
						on: {
							'select rating': {
								target: 'rating selected',
								internal: false,
							},
							dismiss: {
								target: 'done.dismissed',
							},
							send: {
								target: 'sending',
							},
						},
					},
					sending: {
						invoke: {
							src: 'sendFeedback',
							onDone: [
								{
									target: 'sent',
								},
							],
							onError: [
								{
									target: 'sent',
									actions: 'notify failed to send',
								},
							],
						},
					},
					sent: {
						description: 'Show a success message',
						after: {
							'done delay': {
								target: 'done.completed',
								actions: [],
								internal: false,
							},
						},
					},
					done: {
						entry: 'notify parent of completion',
						states: {
							dismissed: {
								type: 'final',
								invoke: {
									src: 'dismissFeedback',
									onError: [
										{
											actions: 'notify failed to dismiss',
										},
									],
								},
							},
							completed: {
								type: 'final',
							},
						},
					},
				},
			},
			{
				actions: {
					'store rating': assign({
						rating: (context, event) =>
							event.type === 'select rating' ? event.rating : context.rating,
					}),
					'notify failed to send': () => on.failedToSendFeedback(),
					'notify failed to dismiss': () => on.failedToDismissFeedback(),
					'notify parent of completion': sendParent({
						type: 'form completed',
					}),
				},
				delays: {
					'done delay': delays.doneDelay,
				},
				services: {
					dismissFeedback: () => api.skip(),
					sendFeedback: (context, event) => {
						if (event.type !== 'send' || context.rating === undefined) {
							return Promise.reject();
						}

						return api.send({
							feedbackText: event.feedbackText,
							rating: context.rating,
						});
					},
				},
			},
		);

	return machine;
}
