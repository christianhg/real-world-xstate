import { describe, expect, test, vi } from 'vitest';
import { interpret } from 'xstate';
import { createSearchMachine } from './search-machine';
import pDefer from 'p-defer';

describe('Search machine', () => {
	test('Guards against race conditions', async () => {
		const queryAPromise = pDefer<string>();
		const queryBPromise = pDefer<string>();
		const search = vi.fn().mockImplementation((query) => {
			return query === 'a'
				? queryAPromise.promise
				: query === 'b'
				? queryBPromise.promise
				: Promise.reject();
		});

		const service = interpret(createSearchMachine({ search }));

		service.start();

		service.send({ type: 'search', query: 'a' });

		await processTick();

		service.send({ type: 'cancel' });

		await processTick();

		service.send({ type: 'search', query: 'b' });

		await processTick();

		queryAPromise.resolve('result a');
		queryBPromise.resolve('result b');

		await processTick();

		expect(service.getSnapshot().context.result).toBe('result b');
	});
});

function processTick() {
	return new Promise((resolve) => {
		setTimeout(resolve);
	});
}
