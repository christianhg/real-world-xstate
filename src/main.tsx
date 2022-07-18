import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import OffScreenNotification from './examples/off-screen-notification';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route
					path="off-screen-notification"
					element={<OffScreenNotification />}
				/>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
