// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {};
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
		'done.invoke.intersection observer': {
			type: 'done.invoke.intersection observer';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.intersection observer': {
			type: 'error.platform.intersection observer';
			data: unknown;
		};
	};
	invokeSrcNameMap: {
		'intersection observer': 'done.invoke.intersection observer';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {
		'intersection observer': 'xstate.init';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'unknown' | 'visible' | 'hidden';
	tags: never;
}
