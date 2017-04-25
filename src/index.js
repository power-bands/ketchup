import React from 'react';
import ReactDOM from 'react-dom';

function pickPhaseStateInstance(step) {
	if (step === 1 || step % 2 === 1) return 0;
	if (step % 2 === 0 && step % 8 !== 0) return 1;
	if (step % 8 === 0) return 2;
}

const phaseNames = ['work','break','rest'],
			targetNameMap = { "work": 0, "break": 1, "rest": 2, "left": 3 };

class KetchupTimer extends React.Component {

	constructor(props) {
		super(props);

		// bind methods
		this.tick = this.tick.bind(this);
		this.handleTimeControlChange = this.handleTimeControlChange.bind(this);

		this.state = {
			refTime: 0,
			timeRemaining: 0,
			phaseCount: 1,
			timeControls: [
				1,
				1,
				1,
				1
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

		let t = Date.now(),
					diff = (t - this.state.refTime),
					timeRemaining = (this.state.timeRemaining - diff),
					timeControls = [ ...this.state.timeControls ],
					phaseCount = this.state.phaseCount;
		
		// handle phase change
		if (timeRemaining <= 0) {
			phaseCount++;
			let nextPhase = pickPhaseStateInstance(phaseCount);
			timeRemaining = (this.state.timeControls[nextPhase] * 60000);
			
			// decrement interval after rest phase
			if (phaseCount % 8 === 1) {
				timeControls[3] = timeControls[3] - 1;
			}
			// console.log(timeControls, nextPhase, phaseCount);
			if (phaseCount % 8 === 0 && timeControls[3] === 0) {
				// trigger completion state
				cancelAnimationFrame(this.state.frameRequestID);
				this.setState({ phaseCount: phaseCount, timeRemaining: 0 });
				return false;
			}
		}


		this.setState({
			refTime: t,
			timeRemaining: timeRemaining,
			frameRequestID: requestAnimationFrame(this.tick),
			phaseCount: phaseCount,
			timeControls: timeControls
		});
	}

	handleTimeControlChange(e) {

		let timeControls = [ ...this.state.timeControls ];

		timeControls[targetNameMap[e.target.name]] = parseInt(e.target.value,10);

		// important for performance why exactly? Don't stack frame requests?
		cancelAnimationFrame(this.state.frameRequestID);

		this.setState({
			timeControls: timeControls,
			phaseCount: 1,
			refTime: Date.now(),
			timeRemaining: (timeControls[0] * 60000),
			frameRequestID: requestAnimationFrame(this.tick)
		});

	}

	render() {

		// set phase className based on phase count
		const phaseModifier = phaseNames[pickPhaseStateInstance(this.state.phaseCount)];

		return (
			<section className={ "ketchup " + phaseModifier }>
				<div>
					<TimeDisplay timeRemaining={this.state.timeRemaining}
											 timeControls={this.state.timeControls}
											 handleTimeControlChange={this.handleTimeControlChange} />
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
				<TimeControl timeControls={this.props.timeControls}
										 handleTimeControlChange={this.props.handleTimeControlChange} />
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
								 name="work"
								 min="1"
								 max="99"
								 value={('00' + this.props.timeControls[0]).substr(-2)}
								 onChange={this.props.handleTimeControlChange}></input>
				</label>
				<label className="ketchup-timer_label break" title="break length in minutes">
					B
					<input className="global_light"
								 type="number"
								 name="break"
								 min="1"
								 max="99"
								 value={('00' + this.props.timeControls[1]).substr(-2)}
								 onChange={this.props.handleTimeControlChange}></input>
				</label>
				<label className="ketchup-timer_label rest" title="rest length in minutes">
					R
					<input className="global_light"
								 type="number"
								 name="rest"
								 min="1"
								 max="99"
								 value={('00' + this.props.timeControls[2]).substr(-2)}
								 onChange={this.props.handleTimeControlChange}></input>
				</label>
				<label className="ketchup-timer_label left" title="number of intervals remaining">
					L
					<input className="global_light"
								 type="number"
								 name="left"
								 min="1"
								 max="99"
								 value={('00' + this.props.timeControls[3]).substr(-2)}
								 onChange={this.props.handleTimeControlChange}></input>
				</label>
			</div>
		);
	}
} 

ReactDOM.render(
	<KetchupTimer />,
	document.getElementById('ketchup')
);
