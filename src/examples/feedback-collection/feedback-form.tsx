import { useState } from 'react';
import { FeedbackFormState } from './feedback-state';

export const FeedbackForm = ({ state }: { state: FeedbackFormState }) => {
	const [feedbackText, setFeedbackText] = useState('');

	const Header = () => (
		<>
			<p>
				<strong>Rate our app</strong>
			</p>
			<p>Please take a moment and tell us what you think.</p>
		</>
	);

	if (state.name === 'idle') {
		return (
			<div className="card">
				<div className="stack-vertical">
					<Header />
					<button
						autoFocus
						onClick={() => {
							state.selectRating(10);
						}}
					>
						Love it!
					</button>
					<button
						onClick={() => {
							state.selectRating(0);
						}}
					>
						No good!
					</button>
					<button
						onClick={() => {
							state.skip();
						}}
					>
						Skip
					</button>
				</div>
			</div>
		);
	}

	if (state.name === 'rating selected') {
		return (
			<div className="card">
				<div className="stack-vertical">
					<Header />
					<div className="stack-vertical">
						<button
							disabled={state.rating === 10}
							onClick={() => {
								state.selectRating(10);
							}}
						>
							Love it!
						</button>
						<button
							disabled={state.rating === 0}
							onClick={() => {
								state.selectRating(0);
							}}
						>
							No good!
						</button>
						<input
							autoFocus
							placeholder={
								state.rating > 5
									? 'Tell us why you love it'
									: 'Tell us why you dislike it'
							}
							name="feedbackText"
							onChange={(e) => {
								setFeedbackText(e.target.value);
							}}
						/>
					</div>
					<div className="stack-horizontal">
						<button
							onClick={() => {
								state.send(feedbackText);
							}}
						>
							Send
						</button>
						<button
							onClick={() => {
								state.skip();
							}}
						>
							Skip
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (state.name === 'sending') {
		return (
			<div className="card">
				<strong>Sending...</strong>
			</div>
		);
	}

	return (
		<div className="card">
			<strong>Thank you!</strong>
		</div>
	);
};
