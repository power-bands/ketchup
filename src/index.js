import React from 'react';
import ReactDOM from 'react-dom';

class KetchupTimer extends React.Component {

	constructor(props) {
		super(props);

		// bind methods
		this.tick = this.tick.bind(this);

		this.state = {
			refTime: 0,
			timeRemaining: 0,
			phaseCount: 1,
			timeControls: [
				30,
				7,
				15,
				16
			],
			frameRequestID: 0
		};
	}

	componentDidMount() {
		const timeRemaining = (this.state.timeControls[0] * 60000);

		this.setState({
			refTime: Date.now(),
			timeRemaining: timeRemaining,
			frameRequestID: requestAnimationFrame(this.tick)
		});
	}

	tick() {

		// handle phase change

		const t = Date.now(),
					diff = (t - this.state.refTime),
					timeRemaining = (this.state.timeRemaining - diff);

		this.setState({
			refTime: t,
			timeRemaining: timeRemaining,
			frameRequestID: requestAnimationFrame(this.tick)
		});
	}

	render() {

		return (
			<section className="ketchup work">
				<div>
					<TimeDisplay timeRemaining={this.state.timeRemaining}
											 timeControls={this.state.timeControls}/>
					<p className="ketchup-timer_title">ketchup timer <span>offbeat</span></p>
				</div>
			</section>
		);
	}
}

class TimeDisplay extends React.Component {

	render() {

		const	minutes = ('000' + (Math.floor(this.props.timeRemaining / 60000))).substr(-2),
		 			seconds = ('000' + (Math.floor((this.props.timeRemaining % 60000) / 1000))).substr(-2),
					milliseconds = ('000' + (this.props.timeRemaining % 60000 % 1000)).substr(-3);

		return (
			<div className="ketchup-timer">
				<p className="ketchup-timer_time">{minutes+":"+seconds+":"+milliseconds}</p>
				<TimeControl timeControls={this.props.timeControls} />
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
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={this.props.timeControls[0]}></input>
				</label>
				<label className="ketchup-timer_label break" title="break length in minutes">
					B
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={this.props.timeControls[1]}></input>
				</label>
				<label className="ketchup-timer_label rest" title="rest length in minutes">
					R
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={this.props.timeControls[2]}></input>
				</label>
				<label className="ketchup-timer_label left" title="number of intervals remaining">
					L
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={this.props.timeControls[3]}></input>
				</label>
			</div>
		);
	}
} 

ReactDOM.render(
	<KetchupTimer />,
	document.getElementById('ketchup')
);
