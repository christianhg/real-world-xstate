// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {
		'show notification': 'process complete';
	};
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {};
	missingImplementations: {
		actions: 'show notification';
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {};
	eventsCausingGuards: {
		'process is hidden': 'process complete';
	};
	eventsCausingDelays: {};
	matchesStates:
		| 'notification pending'
		| 'notification shown'
		| 'notification not shown';
	tags: never;
}
