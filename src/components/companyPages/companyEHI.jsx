import React from "react";

import { ButtonGroup, ToggleButton } from 'react-bootstrap';
//import { ProgressBar } from 'react-bootstrap';

import { withRouter, } from "react-router-dom";

import { Line } from 'react-chartjs-2';
import { arbitraryLineData } from '../../utils';
import { arbitraryLineOptions } from '../../utils';

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
	
	const currentTimeIndex = props.timeIndex
	
	let timescaleList = []
	let promptList = []
	for (let key in props.EHIData) {
		// Name should be changed for later....
		promptList.push( {name:key, value:key} )
	}
	
	if (promptList.length === 0) {
		promptList.push( {name:"No Prompts!", value:"none"} )
	}
	
	const usedPrompt = props.EHIselectedPrompt
	const usedTimescale = props.EHIselectedTimescale
	
	let dataSet = []
	if (!(props.EHIData[usedPrompt] === undefined)) {
		
		for (let timescale in props.EHIData[usedPrompt]) {
			// Name should be changed for later....
			timescaleList.push( {name:timescale, value:timescale} )
		}
		
		if (!(props.EHIData[usedPrompt][usedTimescale] === undefined)) {
			dataSet = props.EHIData[usedPrompt][usedTimescale]
		}
	}
	
	if (timescaleList.length === 0) {
		timescaleList.push( {name:"Nothing to select!", value:"none"} )
	}
	
	const dataLabels = []
	const dataData = []
	
	let lineOptions = arbitraryLineOptions()
	let lineData = arbitraryLineData([], [[]])
	// Redefine this down here so that I can reorganize the above stuff...
	if (!(dataSet === undefined)) {
		for (let timecode in dataSet) {
			dataLabels.push(timecode)
			dataData.push(dataSet[timecode])
		}
		
		let dayCount = historyGraphTimings[currentTimeIndex].dayLength
		if (dayCount === 0) {
			dayCount = dataLabels.length
		}
		
		let ehiDaysLabels = dataLabels.slice(-dayCount)
		let ehiDaysData = {
			label:"EHI index",
			// May not have to slice the second time?
			data:dataData.slice(-dayCount)
		}
		
		lineData = arbitraryLineData(ehiDaysLabels, [ehiDaysData])
	}

	return (
		<div className="EHIDisplay">
			<div className="container-fluid">
				
				<div className="row m-1">
					<div className="col">
					
						<div className="card shadow">
							<div className="card-header">
								EHI Controls V1
							</div>
							<div className="card-body">
							
								<div className="row m-2">
									<div className="col">
										<ButtonGroup toggle>
											{promptList.map((radio, idx) => (
											<ToggleButton
												key={idx}
												type="radio"
												variant="primary"
												name="radio"
												value={radio.value}
												checked={usedPrompt === radio.value}
												onChange={props.EHISetPrompt}
												>
												{radio.name}
											</ToggleButton>
											))}
										</ButtonGroup>
									</div>
								</div>
								
								<div className="row m-2">
									<div className="col">
										<ButtonGroup toggle>
											{timescaleList.map((radio, idx) => (
											<ToggleButton
												key={idx}
												type="radio"
												variant="secondary"
												name="radio"
												value={radio.value}
												checked={usedTimescale === radio.value}
												onChange={props.EHISetTimescale}
												>
												{radio.name}
											</ToggleButton>
											))}
										</ButtonGroup>
									</div>
								</div>
							</div>
						</div>
			
					</div>
				</div>
			
				<div className="row m-1">
					<div className="col">
						<div className="card shadow">
							<div className="card-header">
								<div>
									<i><b>
										Employee Health Index:
									</b></i>
								</div>
								<div>
									Prompt: {usedPrompt}
								</div>
								<div>
									Scale: {usedTimescale}
								</div>
							</div>
							<div className="card-body">
								<Line
									data={lineData} 
									options={lineOptions}
								/>
								
								<GraphTimingButtons
									graphState={currentTimeIndex}
									onToggle={props.EHITimeToggle}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withRouter(EHIDisplay);