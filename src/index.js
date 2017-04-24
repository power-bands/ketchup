import React from 'react';
import ReactDOM from 'react-dom';

class KetchupTimer extends React.Component {

	constructor(props) {
		super(props);

		// bind methods
		this.tick = this.tick.bind(this);

		this.state = {
			minutes: 9,
			seconds: 0,
			milliseconds: 999
		};
	}

	tick() {
		const now = { ...this.state };

		if (now.milliseconds === 0) {
			this.setState({
				seconds: now.seconds - 1,
				milliseconds: 999
			});
			return;
		} else if (now.seconds === 0) {
			this.setState({
				minutes: now.minutes - 1,
				seconds: 59
			});
			return;
		} else {
			this.setState({
				milliseconds: now.milliseconds - 1
			});
			return;
		}

	}

	componentDidUpdate() {
		// console.log(this.state.time.toString());
	}

	componentDidMount() {
		window.setInterval(() => {
			this.tick();
		}, 1);
	}

	render() {

		return (
			<div>
				<p>{this.state.minutes}:{this.state.seconds}:{this.state.milliseconds}</p>
			</div>
		);
	}
}

ReactDOM.render(
	<KetchupTimer />,
	document.getElementById('root')
);
