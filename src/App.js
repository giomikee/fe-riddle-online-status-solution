import React from 'react';
import {
	NotificationContainer,
	NotificationManager
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import OnlineStatusMock from './OnlineStatusMock';
import './App.css';

/*
Feel free to edit this all. If you don't need the HoC, go remove it.
If you wish to save the state somewhere else, go for it.
Just keep rendering <OnlineStatusMock />
*/

const withOnlineStatus = WrappedComponent =>
	class WithOnlineStatus extends React.Component {
		constructor(props) {
			super(props);
			this.state = { isOnline: false };
		}
		render() {
			return (
				<>
					<OnlineStatusMock
						onIsOnlineChange={isOnline =>
							this.setState({ isOnline })
						}
					/>
					<WrappedComponent
						{...this.props}
						isOnline={this.state.isOnline}
					/>
				</>
			);
		}
	};

class App extends React.Component {
	statusChangeBuffer;

	constructor(props) {
		super(props);

		this.state = {
			isOnlineBuffer: false
		};
	}

	notifyStatus() {
		NotificationManager.info(this.props.isOnline ? 'Online' : 'Offline');
	}

	componentDidUpdate(prevProps) {
		const self = this;

		this.statusChangeBuffer && clearTimeout(this.statusChangeBuffer);

		this.statusChangeBuffer = setTimeout(() => {
			if (
				prevProps.isOnline &&
				self.props.isOnline !== prevProps.isOnline
			) {
				self.notifyStatus();
			}

			self.setState({ isOnlineBuffer: self.props.isOnline });
		}, 2000);

		if (
			this.props.isOnline &&
			this.props.isOnline !== prevProps.isOnline &&
			this.props.isOnline !== this.state.isOnlineBuffer
		) {
			this.notifyStatus();
		}
	}

	render() {
		const { isOnline } = this.props;

		return (
			<>
				<div className={isOnline ? 'online' : 'offline'}>
					{isOnline ? 'Online' : 'Offline'}
					<NotificationContainer />
				</div>
			</>
		);
	}
}

export default withOnlineStatus(App);
