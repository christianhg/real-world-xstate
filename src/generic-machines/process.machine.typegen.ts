// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {
		'on complete': 'xstate.init';
	};
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {};
	missingImplementations: {
		actions: 'on complete';
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'idle' | 'loading' | 'complete';
	tags: never;
}
