import { createMachine } from 'xstate';

export const visibilityMachine = createMachine(
	{
		id: 'visibility',
		tsTypes: {} as import('./visibility.machine.typegen').Typegen0,
		schema: {
			context: {} as { element: () => Element | null },
			events: {} as { type: 'in view' | 'out of view' },
		},
		initial: 'unknown',
		invoke: {
			id: 'intersection observer',
			src: 'intersection observer',
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
			visible: {
				on: {
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
		},
	},
	{
		services: {
			'intersection observer': (context) => (callback) => {
				const observer = new IntersectionObserver(
					(entries) => {
						const entry = entries[0];

						if (entry) {
							if (entry.isIntersecting) {
								callback({ type: 'in view' });
							} else {
								callback({ type: 'out of view' });
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
	},
);
