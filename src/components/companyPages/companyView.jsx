import React from "react";

import { withRouter } from "react-router-dom";
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

//import Store from "store"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { ProgressBar } from 'react-bootstrap';

import { Radar, Bar } from 'react-chartjs-2';
import { testMaxMin, testBarMulti, stackedBarData3Test, stackedBarData2Test, stackedBarData, sentimentBarData } from '../../utils';
import { getRadarEmotionOptions, testBarMultiOptions, stackedBarOptions, sentimentBarOptions } from '../../utils';
//import { makeCompanyTestData, makeCompanyTestDataOtherFormat } from "../../utils";

// Move all of the functions here to a seperate file, a repository, so that I can fast make layouts sometime

// This is garunteed
const AIAspect = [
    { name: 'Emotion', value: 'emotion' },
    { name: 'Sentiment', value: 'sentiment' },
    { name: 'Entities', value: 'entities' },
	{ name: 'Keywords', value: 'keywords' },
	//{ name: 'Relations', value: 'relations' },
];
// This is also garunteed...
const daySet = [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
	{ name: 'Thursday', value: 'thu' },
	{ name: 'Friday', value: 'fri' },
	{ name: 'Saturday', value: 'sat' },
	{ name: 'Sunday', value: 'sun' },
	{ name: 'All', value: 'allDay' },
];

// This is very lean...
const parseEmotion = (emotionData) => {
	
	let derp = [emotionData.joy, emotionData.anger, emotionData.sadness, emotionData.disgust, emotionData.fear]
	return derp;
}

const companyViewSummary = (props) => {
	
	//console.log(props.dataSet)
		
	let tableDisplay = []
	let index;
	
	// Read the data from our state machine,
	const currentPrompt = props.selectedPrompt
	const currentDay = props.selectedDay
	const currentAspect = props.selectedAspect
	
	let promptList = []
	
	// At least this is garunteed to exist
	let dayData = props.dataSet[currentDay]
	// Check to see if the lower states exist...
	
	let displayStats = [];
	let promptName = "not valid prompt";
	
	// This will trip if we have data
	if (!(dayData === null) && !(dayData === undefined)) {
		
		let key;
		for (key in dayData) {

			if ( !(dayData[key].name === undefined) ) {
				promptList.push( {name:dayData[key].name, value:key} )
			}
		}
		
		// At this point if the array is still empty,we have nothing...
		if (promptList.length === 0) {
			promptList = [{name:"No Prompts", value:"None"}]
		}
		
		//console.log(currentPrompt)
		//console.log(dayData)
		let sanityCheck = currentPrompt in dayData
		if (sanityCheck) {
			// Switch state this bugger...
			promptName = dayData[currentPrompt]["name"]
			let purity = dayData[currentPrompt]["responsePurity"]
			
			displayStats.push(
				<div className="row m-2" key="1">
					<div className="col">
						<div className="progressBar">
							<ProgressBar now={ purity } label={`${purity}% Response Rate`} />
						</div>
					</div>
				</div>
			)
			
			// Check to see if we actually HAVE any data just before we do this...
			try{
				let dataSet = dayData[currentPrompt]["data"][currentAspect]
			
				switch(currentAspect) {
					case "emotion":
						let emoMax = parseEmotion( dataSet.max )
						let emoAve = parseEmotion( dataSet.ave )
						let emoMin = parseEmotion( dataSet.min )
						
						const dataDocumentEmo = testMaxMin( emoMax, emoAve, emoMin )
						const radarOptions = getRadarEmotionOptions()
						
						let emoThresh = parseEmotion( dataSet.threshold )
						const dataBar = testBarMulti( emoThresh )
						const barOptions = testBarMultiOptions()
						
						displayStats.push(
							<div className="row m-2 justify-content-center" key="2">
								<div className="col-sm col-md col-lg-3">
									<div className="card shadow">
										<div className="card-header">
											Averages + Max and min?
										</div>
										<div className="card-body">
											<Radar data={dataDocumentEmo} options={radarOptions} />
										</div>
									</div>
								</div>
								<div className="col-sm col-md col-lg-3">
									<div className="card shadow">
										<div className="card-header">
											"How many have hit this threshold"?
										</div>
										<div className="card-body">
											<Bar data={dataBar} options={barOptions} />
										</div>
									</div>
								</div>
							</div>
						)
						
						break;
					case 'sentiment':
					
						const dataBarStack = stackedBarData( [dataSet.min], [dataSet.ave], [dataSet.max] )
						const barStackOptions = stackedBarOptions()
						
						let dataTresh = [dataSet.thresholdPos, dataSet.thresholdNeg]
						const dataBarNorm = sentimentBarData( dataTresh )
						const barOptionsNorm = sentimentBarOptions()
					
						displayStats.push(
							<div className="row m-2 justify-content-center" key="2">
								<div className="col-sm col-md col-lg-3">
									<div className="card shadow">
										<div className="card-header">
											Sentiment Values
										</div>
										<div className="card-body">
											<Bar data={dataBarStack} options={barStackOptions} />
										</div>
									</div>
								</div>
								<div className="col-sm col-md col-lg-3">
									<div className="card shadow">
										<div className="card-header">
											"How many have hit this threshold"?
										</div>
										<div className="card-body">
											<Bar data={dataBarNorm} options={barOptionsNorm} />
										</div>
									</div>
								</div>
							</div>
						)
					
						break;
					case 'entities':
					
						//console.log(dataSet)
					
						for (index in dataSet) {
							let entity = dataSet[index]
							//console.log(entity)
							
							let emoMax = parseEmotion( entity.emotion.max )
							let emoAve = parseEmotion( entity.emotion.ave )
							let emoMin = parseEmotion( entity.emotion.min )
							
							let emoData = testMaxMin( emoMax, emoAve, emoMin )
							let emoOptions = getRadarEmotionOptions()
							
							const dataEntSent = stackedBarData3Test( 
								[entity.confidence.min, entity.relevance.min, entity.sentiment.min],
								[entity.confidence.ave, entity.relevance.ave, entity.sentiment.ave],
								[entity.confidence.max, entity.relevance.max, entity.sentiment.max],
							)
							const dataEntOptions = stackedBarOptions()
							
							tableDisplay.push(
								<tr key={index}>
									<th scope="row">{entity.text}</th>
									<td>{entity.type}</td>
									<td>{entity.count}</td>
									<td colSpan="3"><Bar data={dataEntSent} options={dataEntOptions} /></td>
									<td><Radar data={emoData} options={emoOptions} /></td>
								</tr>
							)
						}
						
						displayStats.push(
							<table className="table" key="2">
								<thead>
									<tr>
										<th scope="col">Name</th>
										<th scope="col">Type</th>
										<th scope="col">#Appearances</th>
										<th scope="col">Confidence</th>
										<th scope="col">Relevance</th>
										<th scope="col">Sentiment</th>
										<th scope="col">Emotion</th>
									</tr>
								</thead>
								
								<tbody>
									{tableDisplay}
								</tbody>
							</table>
						)
					
						break;
					case 'keywords':
					
						//console.log(dataSet)
						
						for (index in dataSet) {
							let keyData = dataSet[index]
							
							//const dataKeySent = stackedBarData( [keyData.sentiment.min], [keyData.sentiment.ave], [keyData.sentiment.max] )
							//const dataKeyOptions = stackedBarOptions()
							
							let emoMax = parseEmotion( keyData.emotion.max )
							let emoAve = parseEmotion( keyData.emotion.ave )
							let emoMin = parseEmotion( keyData.emotion.min )
							
							const dataRadar = testMaxMin( emoMax, emoAve, emoMin )
							const dataRadarOptions = getRadarEmotionOptions()
							
							const dataKeySent = stackedBarData2Test(
								[keyData.relevance.min, keyData.sentiment.min], 
								[keyData.relevance.ave, keyData.sentiment.ave], 
								[keyData.relevance.max, keyData.sentiment.max] 
							)
							const dataKeyOptions = stackedBarOptions()
							
							tableDisplay.push(
								<tr key={index}>
									<th scope="row">{keyData.text}</th>
									<td>{keyData.count}</td>
									<td colSpan="2"><Bar data={dataKeySent} options={dataKeyOptions} /></td>
									<td><Radar data={dataRadar} options={dataRadarOptions} /></td>
								</tr>
							)
						}
					
						displayStats.push(
							<table className="table" key="2">
								<thead>
									<tr>
										<th scope="col">Name</th>
										<th scope="col">#Appearances</th>
										<th scope="col">Relevance Score</th>
										<th scope="col">Sentiment</th>
										<th scope="col">Emotion</th>
									</tr>
								</thead>
								
								<tbody>
									{tableDisplay}
								</tbody>
							</table>
						)
						
						break;
					case 'relations':
					
						//console.log(dataSet)
						
						for (index in dataSet) {
							let relData = dataSet[index]
							
							const scoreData = stackedBarData( [relData.score.min], [relData.score.ave], [relData.score.max] )
							const scoreOptions = sentimentBarOptions()
							
							tableDisplay.push(
								<tr key={index}>
									<th scope="row">{relData.count}</th>
									<td>{relData.arguments[0].text}</td>
									<td>{relData.type}</td>
									<td>{relData.arguments[1].text}</td>
									<td style={{width:"30%"}}><Bar data={scoreData} options={scoreOptions} /></td>
								</tr>
							)
						}
					
						displayStats.push(
							<table className="table" key="2">
								<thead>
									<tr>
										<th scope="col">#Appearances</th>
										<th scope="col">Actor</th>
										<th scope="col">Action</th>
										<th scope="col">Target</th>
										<th scope="col">Score</th>
									</tr>
								</thead>
								
								<tbody>
									{tableDisplay}
								</tbody>
							</table>
						)
					
						break;
					default:
						console.log("Invalid AI selection somehow")
						
					}
				}
			catch (error) {
				
				displayStats.push(
					<div className="row m-2 border" key="2">
						<div className="col">
							<p>There was no data to read!</p>
						</div>
					</div>
				)
				
			}
		}
		else {
			displayStats.push(
				<div className="row m-2 border" key="2">
					<div className="col">
						<p>Select a Prompt</p>
					</div>
				</div>
			)
		}
	}
	else {
		// There was NO DATA in the day here, so we have to display nothing...
		promptList = [{name:"No Prompts", value:"None"}]
		
		displayStats.push(
			<div className="row m-2 border" key="2">
				<div className="col">
					<p>There was no data to read!</p>
				</div>
			</div>
		)
	}
	
	const tileClassName = ({ date, view }) => {
	
		// Add class to tiles in month view only
		if (view === 'month') {
			
			const checkDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()

			// Check if a date React-Calendar wants to check is on the list of dates to add class to
			const hasSummary = props.validSummaryDates.find( element => element === checkDate)
			
			if (hasSummary) {
				return 'btn btn-success'
			} else {
				//return 'btn btn-outline-dark'
			}
			
		}
	}
	
	let messageLine1 = "Showing Company Summary for: " + props.currentCompany
	let messageLine2 = "For week of: " + props.anchorDate
	
	//console.log(props.currentDate)
	
	return (
		<div className="companyView">
			<div className="container-fluid">
				
				<div className="row m-2 justify-content-center">
					<div className="col- m-2">					
						<div>
							<Calendar 
								className="shadow"
								onChange={props.pickDate}
								value={props.currentDate}
								tileClassName={tileClassName}

								minDetail={'year'}
								maxDetail={'month'}
							/>
						</div>
					</div>
					<div className="col m-2">
						<div className="card shadow">
							<div className="card-header">
								<div>{messageLine1}</div>
								<div>{messageLine2}</div>
							</div>
							<div className="card-body">
								<div className="row m-2">
									<div className="col">
										<ButtonGroup toggle>
											{daySet.map((radio, idx) => (
											<ToggleButton
												key={idx}
												type="radio"
												variant="secondary"
												name="radio"
												value={radio.value}
												checked={props.selectedDay === radio.value}
												onChange={props.setDay}
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
											{promptList.map((radio, idx) => (
											<ToggleButton
												key={idx}
												type="radio"
												variant="primary"
												name="radio"
												value={radio.value}
												checked={props.selectedPrompt === radio.value}
												onChange={props.setPrompt}
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
											{AIAspect.map((radio, idx) => (
											<ToggleButton
												key={idx}
												type="radio"
												variant="info"
												name="radio"
												value={radio.value}
												checked={props.selectedAspect === radio.value}
												onChange={props.setAI}
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
				
				<div className="row m-2">
					<div className="col">
						<div className="card shadow">
							<div className="card-header">
								<div>Showing Data for prompt: {promptName}</div>
							</div>
							<div className="card-body">
								{displayStats}
							</div>
						</div>
					</div>
				</div>
				
				<div className="row  my-2">
					<p>
						
					</p>
				</div>
			</div>
		</div>
	);
}

export default withRouter(companyViewSummary);