import { assign, createMachine, spawn } from 'xstate';
import {
	createFeedbackFormMachine,
	FeedbackFormMachineRef,
} from './feedback-form-machine';

type Context = {
	formRef?: FeedbackFormMachineRef;
};

type MachineEvent = {
	type: 'toggle' | 'form completed';
};

type MachineState =
	| {
			value: 'idle' | 'completed';
			context: { formRef: undefined };
	  }
	| {
			value: 'showing form';
			context: { formRef: FeedbackFormMachineRef };
	  };

export function createFeedbackMachine({
	api,
	delays,
	on,
}: Parameters<typeof createFeedbackFormMachine>[0]) {
	const machine =
		/** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrAdAJYQA2YAxAC4D2UUZA2gAwC6ioADtbIZYdQDt2IAB6IAjAGYm+AGwBWAByL542QCZJ8rWoA0IAJ4TJATnxN5Adkvr1TE2ssAWRQF9X+1BhwFYAC2oAd0IBKAACZGoAJwBbKlp6MGY2JBAuHj5BYTEEKRkFZVUNLR1ZfSMEZXx5WUVxJyYmdRMTJhtJd080CCw8fH8gkPDI2PIRmLDsahiOMkpIZOF03n4hVJynSUU5SSdxcUtxdVknE8UncokmJ3wXA9lLBSc9xRN5dw8QAWoIOGEvHo+JbcFZZdaIAC0ZUMkNknRAAN6BGIZGBGVW2UQTnUlwQJhuJxMlkklmuTSY4kUHU+iJ8-QCwVCEWiMTRoLWoBymjMJmasjeRxMpic2lxdVuKgeSn2j0sSnhtL6Uxmc0gbMyHNEiFkajkTUUDyOJzOuPETEk+GJ8iauxMKlKH1cQA */
		createMachine<Context, MachineEvent, MachineState>(
			{
				id: 'feedback',
				predictableActionArguments: true,
				preserveActionOrder: true,
				initial: 'idle',
				states: {
					idle: {
						on: {
							toggle: { target: 'showing form' },
						},
					},
					'showing form': {
						entry: ['spawn form'],
						on: {
							'form completed': { target: 'completed' },
						},
					},
					completed: {
						type: 'final',
					},
				},
			},
			{
				actions: {
					'spawn form': assign({
						formRef: (context) =>
							spawn(createFeedbackFormMachine({ api, delays, on }), {
								sync: true,
							}),
					}),
				},
			},
		);

	return machine;
}
