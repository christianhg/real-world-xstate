import { createMachine } from 'xstate';

export const visibilityMachine = createMachine({
	id: 'visibility',
	tsTypes: {} as import('./visibility.machine.typegen').Typegen0,
	schema: {
		context: {} as { element: () => HTMLElement | null },
		events: {} as { type: 'in view' | 'out of view' },
	},

	initial: 'unknown',
	invoke: {
		id: 'intersection observer',
		src: (context) => (callback) => {
			const observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];

					if (entry) {
						if (entry.isIntersecting) {
							callback('in view');
						} else {
							callback('out of view');
						}
					}
				},
				{
					root: window.document,
					rootMargin: '0px',
					threshold: 0.25,
				},
			);

			const element = context.element();

			if (element) {
				observer.observe(element);
			}

			return () => {
				observer.disconnect();
			};
		},
	},
	states: {
		unknown: {
			on: {
				'in view': {
					target: 'visible',
				},
				'out of view': {
					target: 'hidden',
				},
			},
		},
		hidden: {
			on: {
				'in view': {
					target: 'visible',
				},
			},
		},
		visible: {
			on: {
				'out of view': {
					target: 'hidden',
				},
			},
		},
	},
});
