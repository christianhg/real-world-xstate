import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import OffScreenNotification from './examples/off-screen-notification/off-screen-notification';
import { FeedbackCollection } from './examples/feedback-collection/feedback-collection';
import { Landing } from './landing';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route
					path="examples/off-screen-notification"
					element={<OffScreenNotification />}
				/>
				<Route path="examples/feedback" element={<FeedbackCollection />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
