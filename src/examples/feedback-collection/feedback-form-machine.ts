import { ActorRefFrom, assign, createMachine, sendParent } from 'xstate';

export type FeedbackFormMachineRef = ActorRefFrom<
	typeof createFeedbackFormMachine
>;

type Context = {
	rating: number | undefined;
};

type MachineEvent =
	| { type: 'skip' }
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
		failedToSkipFeedback: () => void;
		failedToSendFeedback: () => void;
	};
}) {
	const machine =
		/** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrABMgPYBOAtgHQCWEANmAMSxj3YAu+JmbVAdlAG0ADAF1EoAA5FYVHkV7iQAD0QBmAIwA2CgFZ1AJgCcmwzv06ALIfUB2ADQgAnoi2GK606sNChF9eoshAA4AXxCHVAwcAmJyajpGWFwqCWExJBApGTkFDJUEdSCgiiL1HVUhG01bQpsdB2cEKooLfSFVVRsLC01VTU0g1TCItAgsPEJSSi4efnxmVjZIJhYwdk5uPkFRRSzZKnlFfJ1rCmMdavNgm0L9BrUhdQpH4M19DU0qm31hkEix6KTOIzLbzVbsZZJFJpXbSfaHPKIHTNQZCQw2G6VQydVT3JraVrtDpBN4VHqGX7-cYxKYUEFzBZrJYQFa8CAwjJ7HJHRA2QYUOqVIJGISfdQaPGudyeawePwkryU0bUoGUZhsrYMCDyMDUXgANyIuF1VMBsTVYA1-AQfEN2E28jSHMkcO5iIQhn02h0aNa3msFz8eJsQmeQnKJ09FhOZR+4T+yrNtPVEE1YBIJFIFAktG45oopom+ZTWxtBqI9pyTp2nNdB1yoHynps7i+pIsNkMVgseP0nYF4b0Pn0RR8OiVUSLyctbAYSlgbG4uswyCWJAAFNreGB8BAWJhHABKBiFmlxdVsZ2ZOsIxuIbGqZ69dF9oR9zTBPEAWiCOgFgUsQxPQCQwggsIZ41PVUKC3XUoQkCRlnTTMSGzXM2HzKD81gih4MQiAyztB1eGrdIXWyeseQQPwWwGG4rF8Pk9Aub9ClDL02jRR4Th8dQwnjXgiD3eAMiwqZYQo29lEQL9NG-QJ9AofRzEscD9A7VRQkgxMpziGh6Ak+EG2k6i7icFwejOKwjFaLpWg8TQJwBXTpk2BlwWZQy3TvaiwIFENbP8UDsUMSUjDOH0TiKDsR30QonJVYtLVTfgvMo91rEU0ChWsIJCl-ULzIKaMKBMbE31aaMDAgkZJzPC1eDYNKpPyfwzAoLxkRMYVkUKb9VD-NFyj5Io+1sBKkziWDmuM1rgg6roTAsYV7KCOp+oCAUvBJX8DHRXwJpcmCdVw5IEMgGaqLKbROnJZb1Litb6iKr90VK-x2l-C4AxsGqEzq6CcOwIgyBzMBPNrSTZsQAZFM0H0blsHQzBW78ihaNauy6XxqhW-iQiAA */
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
							skip: {
								target: 'done.skipped',
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
							skip: {
								target: 'done.skipped',
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
							skipped: {
								type: 'final',
								invoke: {
									src: 'skipFeedback',
									onError: [
										{
											actions: 'notify failed to skip',
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
					'notify failed to skip': () => on.failedToSkipFeedback(),
					'notify parent of completion': sendParent({
						type: 'form completed',
					}),
				},
				delays: {
					'done delay': delays.doneDelay,
				},
				services: {
					skipFeedback: () => api.skip(),
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
