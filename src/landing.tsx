import { Link } from 'react-router-dom';

export const Landing = () => {
	return (
		<main>
			<section>
				<div className="stack-vertical" style={{ alignItems: 'center' }}>
					<h1>Real-World XState</h1>
					<Link to="examples/feedback">💬 Collecting Feedback</Link>
					<Link to="examples/off-screen-notification">
						🔔 Off-Screen Notification
					</Link>
				</div>
			</section>
		</main>
	);
};
