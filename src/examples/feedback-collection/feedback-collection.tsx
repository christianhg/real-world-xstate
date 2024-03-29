import { FeedbackForm } from './feedback-form';
import { useFeedbackState } from './feedback-state';

export const FeedbackCollection = () => {
	const feedbackState = useFeedbackState();

	return (
		<main>
			<header>
				<h1>My app</h1>
				{feedbackState.name === 'idle' ? (
					<button onClick={feedbackState.toggle}>Share feedback</button>
				) : feedbackState.name === 'showing form' ? (
					<button disabled>Share feedback</button>
				) : null}
			</header>
			<section>
				<p>This is the app. Isn't it great?</p>
				{feedbackState.name === 'showing form' ? (
					<div className="dialog">
						<FeedbackForm state={feedbackState.formState} />
					</div>
				) : null}
			</section>
		</main>
	);
};
