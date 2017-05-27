import React from 'react';
import ReactDOM from 'react-dom';

function pickPhaseStateInstance(step) {
	if (step === 1 || step % 2 === 1) return 0;
	if (step % 2 === 0 && step % 8 !== 0) return 1;
	if (step % 8 === 0) return 2;
}

function getEpochMillisecondsFromTwentyFourHourTime(time) {

	const targetTime = time.split(":").map((n) => parseInt(n,10)),
				shouldIncrementDate = (new Date().getHours() > targetTime[0]) ? true : false,
				newDateObj = (shouldIncrementDate) ? new Date(new Date().setDate( + 1 )) : new Date();

	return (
		new Date(newDateObj.getFullYear(),
						 newDateObj.getMonth(),
						 newDateObj.getDate(),
						 targetTime[0],
						 targetTime[1])
			.getTime()
	);

}

const TwentyFourHourTimeRegex = new RegExp(/(2[0-3]|[01][0-9]):([0-5][0-9])/);

const phaseNames = ['work','break','rest'],
			targetNameMap = { "work": 0, "break": 1, "rest": 2, "left": 3 };

class KetchupTimer extends React.Component {

	constructor(props) {

		const currentDate = new Date();

		super(props);

		// bind methods
		this.tick = this.tick.bind(this);
		this.handleTimeControlChange = this.handleTimeControlChange.bind(this);
		this.updateStartTime = this.updateStartTime.bind(this);

		this.state = {
			refTime: 0,
			timeRemaining: 0,
			phaseCount: 1,
			startTime: ('00'+currentDate.getHours()).substr(-2)+":"+('00'+currentDate.getMinutes()).substr(-2),
			timeControls: [
				1,
				1,
				1,
				1
			],
			frameRequestID: 0,
			timeoutTick: 0
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
			if (phaseCount > 1 && phaseCount % 8 === 1) {
				timeControls[3]--;
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

		let timeControls = [ ...this.state.timeControls ],
				currentDate = new Date(),
				theStartTime = (Boolean(this.state.timeoutTick)) ? this.state.startTime : ('00'+currentDate.getHours()).substr(-2)+":"+('00'+currentDate.getMinutes()).substr(-2);

		timeControls[targetNameMap[e.target.name]] = parseInt(e.target.value,10);

		cancelAnimationFrame(this.state.frameRequestID);

		this.setState({
			timeControls: timeControls,
			phaseCount: 1,
			startTime: theStartTime,
			refTime: currentDate,
			timeRemaining: (timeControls[0] * 60000),
			frameRequestID: (Boolean(this.state.timeoutTick)) ?  0 : requestAnimationFrame(this.tick)
		});

	}

	updateStartTime(timestring) {

		const nowEpochMilliseconds = new Date().getTime(),
					providedTimeString = timestring,
					targetEpochMilliseconds = getEpochMillisecondsFromTwentyFourHourTime(providedTimeString),
					theTimeoutLength = targetEpochMilliseconds - nowEpochMilliseconds;

		cancelAnimationFrame(this.state.frameRequestID);
		if (this.state.timeoutTick) clearTimeout(this.state.timeoutTick);
		
		const timeoutTick = window.setTimeout(() => {
			this.setState({
				frameRequestID: requestAnimationFrame(this.tick),
				timeoutTick: 0
			});
		}, theTimeoutLength);

		this.setState({
			startTime: providedTimeString,
			refTime: targetEpochMilliseconds,
			timeRemaining: (this.state.timeControls[0] * 60000),
			phaseCount: 1,
			timeoutTick: timeoutTick
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
											 startTime={this.state.startTime}
											 timeoutTick={this.state.timeoutTick}
											 handleTimeControlChange={this.handleTimeControlChange}
											 updateStartTime={this.updateStartTime} />
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
					milliseconds = ('000' + (this.props.timeRemaining % 60000 % 1000)).substr(-3),
					blinking = (this.props.timeRemaining <= 0 || this.props.timeoutTick) ? ' blink' : '';

		return (
			<div className="ketchup-timer">
				<p className={"ketchup-timer_time"+blinking}>{minutes+":"+seconds+":"+milliseconds}</p>
				<TimeControl timeControls={this.props.timeControls}
										 handleTimeControlChange={this.props.handleTimeControlChange} />
				<TimeExtras startTime={this.props.startTime}
										updateStartTime={this.props.updateStartTime} />
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

class TimeExtras extends React.Component {

	constructor(props) {
		super(props);
		this.state = { startTimeBuffer: this.props.startTime };

		this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
		this.handleStartTimeSubmit = this.handleStartTimeSubmit.bind(this);
		this.checkStartTime = this.checkStartTime.bind(this);
	}

	handleStartTimeChange(e) {
		this.setState({ startTimeBuffer: e.target.value });
	}

	checkStartTime(e) {
		if (!TwentyFourHourTimeRegex.test(e.target.value)) {
			this.setState({ startTimeBuffer: this.props.startTime });
			e.target.blur();
			return false;
		} else {
			this.props.updateStartTime(e.target.value);
		}
	}

	handleStartTimeSubmit(e) {
		if (e.key === 'Enter') {
			this.checkStartTime(e);
		}
	}

	render() {

		return (

		<div className="ketchup-timer_extras">
			<label className="ketchup-timer_label start">
				START AT
				<input className="global_light"
							 type="text"
							 name="startTime"
							 value={this.state.startTimeBuffer}
							 onChange={this.handleStartTimeChange}
							 onKeyPress={this.handleStartTimeSubmit}
							 onBlur={this.checkStartTime}></input>
			</label>
		</div>

		);
	}

}

ReactDOM.render(
	<KetchupTimer />,
	document.getElementById('ketchup')
);
