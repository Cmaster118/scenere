import React from "react";
//import axios from "axios";

import { withRouter, } from "react-router-dom";

//import Store from "store"

//import { ProgressBar } from 'react-bootstrap';

import { Line } from 'react-chartjs-2';
import { arbitraryLineData } from '../utils';
import { arbitraryLineOptions } from '../utils';

// Test Data crap from that utils...
//import { generateTestEHIX, generateTestEHIY } from '../utils';

class StyleButton extends React.Component {
	constructor() {
		super();
		this.onToggle = (e) => {
			e.preventDefault();
			this.props.onToggle(this.props.value);
		};
	}

	render() {
		let className = 'btn btn-outline-primary';
		if (this.props.active) {
			className += ' active';
		}
		
		return (
			<button className={className} onClick={this.onToggle}>
				{this.props.label}
			</button>
		);
	}
}

// Hm, this may be okay? The value should be its index...?
const historyGraphTimings = [
	{label:'Max', value:0, dayLength:0, weekLength:0},
	{label:'1Year', value:1, dayLength:365, weekLength:52},
	{label:'6Months', value:2, dayLength:183, weekLength:28},
	{label:'3Months', value:3, dayLength:63, weekLength:13},
	{label:'1Months', value:4, dayLength:31,  weekLength:4},
	{label:'1Week', value:5, dayLength:7, weekLength:1},
];

const GraphTimingButtons = (props) => {
	const currentDisplay = props.graphState;
	
	return (
		<div className="EHIControls">
			{historyGraphTimings.map((type) =>
				<StyleButton
					key={type.label}
					active={currentDisplay === type.value}
					label={type.label}
					onToggle={props.onToggle}
					value={type.value}
				/>
			)}
		</div>
	);
};


// This will show the EHI in chart form...
const EHIDisplay = (props) => {
	
	const currentDayTimeIndex = props.timeIndexDay
	const currentWeekTimeIndex = props.timeIndexWeek
	
	const dayLabels = props.ehiDayLabels
	const dayData = props.ehiDayData
	
	let dayCount = historyGraphTimings[currentDayTimeIndex].dayLength
	if (dayCount === 0) {
		dayCount = dayLabels.length
	}
	
	let ehiDaysLabels = dayLabels.slice(-dayCount)
	let ehiDaysData = {
		label:"EHI index",
		// May not have to slice the second time?
		data:dayData.slice(-dayCount)
	}
	
	const weekLabels = props.ehiWeekLabels
	const weekData = props.ehiWeekData
	
	dayCount = historyGraphTimings[currentWeekTimeIndex].weekLength
	if (dayCount === 0) {
		dayCount = weekLabels.length
	}
	
	let ehiWeeksLabels = weekLabels.slice(-dayCount)
	let ehiWeeksData = {
		label:"EHI index",
		// May not have to slice the second time?
		data:weekData.slice(-dayCount)
	}
	
	if (ehiWeeksLabels.length === 1) {
		ehiWeeksLabels.unshift("")
		ehiWeeksLabels.push("")
		
		ehiWeeksData.data.unshift(ehiWeeksData.data[0])
		ehiWeeksData.data.push(ehiWeeksData.data[0])
	}
	
	let lineDataDays = arbitraryLineData(ehiDaysLabels, [ehiDaysData])
	let lineDataWeeks = arbitraryLineData(ehiWeeksLabels, [ehiWeeksData])
	let lineOptions = arbitraryLineOptions()
	
	return (
		<div className="EHIDisplay">
			<div className="row m-1">
				<div className="col-6">
					<div className="card">
						<div className="card-header">
							Employee Health Index Daily Data
						</div>
						<div className="card-body">
							<Line
								data={lineDataDays} 
								options={lineOptions}
							/>
							
							<GraphTimingButtons
								graphState={currentDayTimeIndex}
								onToggle={props.onDayToggle}
							/>
						</div>
					</div>
				</div>
				<div className="col-6">
					<div className="card">
						<div className="card-header">
							Employee Health Index Weekly Data
						</div>
						<div className="card-body">
							<Line
								data={lineDataWeeks} 
								options={lineOptions}
							/>
							
							<GraphTimingButtons
								graphState={currentWeekTimeIndex}
								onToggle={props.onWeekToggle}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withRouter(EHIDisplay);