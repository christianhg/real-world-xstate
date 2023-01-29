import { ComponentMeta } from '@storybook/react';
import { FeedbackForm } from './feedback-form';

export default {
	title: 'Feedback Form',
	component: FeedbackForm,
} as ComponentMeta<typeof FeedbackForm>;

export const Idle = () => {
	return (
		<div style={{ maxWidth: '300px' }}>
			<FeedbackForm
				state={{ name: 'idle', selectRating: () => {}, skip: () => {} }}
			/>
		</div>
	);
};

export const RatingSelected = () => {
	return (
		<div style={{ maxWidth: '300px' }}>
			<FeedbackForm
				state={{
					name: 'rating selected',
					rating: 10,
					selectRating: () => {},
					skip: () => {},
					send: () => {},
				}}
			/>
		</div>
	);
};

export const Sending = () => {
	return (
		<div style={{ maxWidth: '300px' }}>
			<FeedbackForm state={{ name: 'sending' }} />
		</div>
	);
};

export const Sent = () => {
	return (
		<div style={{ maxWidth: '300px' }}>
			<FeedbackForm state={{ name: 'sent' }} />
		</div>
	);
};
