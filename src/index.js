import React from 'react';
import ReactDOM from 'react-dom';

class KetchupTimer extends React.Component {

	constructor(props) {
		super(props);

		// bind methods
		this.tick = this.tick.bind(this);

		this.state = {
			timeRemaining: null,
			phaseCount: 0,
			workLength: 30,
			breakLength: 7,
			restLength: 15,
			intervalsRemaining: 16,
			frameRequestID: 0
		};
	}

	componentDidMount() {
		this.setState({
			timeRemaining: new Date(),
			request: requestAnimationFrame(this.tick)
		});
	}

	componentDidUpdate() {
		// console.log(this.state.time.toString());
	}

	tick() {
		this.setState({
			timeRemaining: new Date(),
			request: requestAnimationFrame(this.tick)
		});
	}

	render() {

		const phaseState = 0;

		return (
			<section className={"ketchup"}>
				<div>
					<TimeDisplay />
					<p className="ketchup-timer_title">ketchup timer <span>offbeat</span></p>
				</div>
			</section>
		);
	}
}

class TimeDisplay extends React.Component {
	render() {

		return (
			<div className="ketchup-timer">
				<p className="ketchup-timer_time">00:00:000</p>
				<TimeControl />
			</div>
		);
	}
} 

class TimeControl extends React.Component {
	render() {

		return (
			<div>
				<label className="ketchup-timer_label work" title="work length in minutes">
					W
					<input class="global_light" type="number" min="0" max="99" value="99"></input>
				</label>
				<label className="ketchup-timer_label break" title="break length in minutes">
					B
					<input class="global_light" type="number" min="0" max="99" value="99"></input>
				</label>
				<label className="ketchup-timer_label rest" title="rest length in minutes">
					R
					<input class="global_light" type="number" min="0" max="99" value="99"></input>
				</label>
				<label className="ketchup-timer_label left" title="number of intervals remaining">
					L
					<input class="global_light" type="number" min="0" max="99" value="99"></input>
				</label>
			</div>
		);
	}
} 

ReactDOM.render(
	<KetchupTimer />,
	document.getElementById('root')
);
