import React from 'react';
import ReactDOM from 'react-dom';

class KetchupTimer extends React.Component {

	constructor(props) {
		super(props);

		// bind methods
		this.tick = this.tick.bind(this);
		// handleTimeControlChange

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

		const t = Date.now(),
					diff = (t - this.state.refTime),
					timeRemaining = (this.state.timeRemaining - diff);
		
		// handle phase change
		if (timeRemaining <= 0) {
			// based on next phase type
			// set timeRemaining to length in timeControls
			// increment phaseCount
			// decrement timeControls[3]
		}

		this.setState({
			refTime: t,
			timeRemaining: timeRemaining,
			frameRequestID: requestAnimationFrame(this.tick)
			// update phase count if changed above
		});
	}

	// handle timeControl change

	render() {

		// set phase className based on phase count

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

		// zero pad timeControl values

		return (
			<div>
				<label className="ketchup-timer_label work" title="work length in minutes">
					W
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={('00' + this.props.timeControls[0]).substr(-2)}></input>
				</label>
				<label className="ketchup-timer_label break" title="break length in minutes">
					B
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={('00' + this.props.timeControls[1]).substr(-2)}></input>
				</label>
				<label className="ketchup-timer_label rest" title="rest length in minutes">
					R
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={('00' + this.props.timeControls[2]).substr(-2)}></input>
				</label>
				<label className="ketchup-timer_label left" title="number of intervals remaining">
					L
					<input className="global_light"
								 type="number"
								 min="0"
								 max="99"
								 defaultValue={('00' + this.props.timeControls[3]).substr(-2)}></input>
				</label>
			</div>
		);
	}
} 

ReactDOM.render(
	<KetchupTimer />,
	document.getElementById('ketchup')
);
