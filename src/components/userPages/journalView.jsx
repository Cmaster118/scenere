import React from "react";

//import { useEffect } from "react"

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { Radar, Bar } from 'react-chartjs-2';

import { ButtonGroup, ToggleButton } from 'react-bootstrap';

import { withRouter } from "react-router-dom";

//import {isLoggedIn} from '../../utils';
import {getRadarEmotionData } from '../../utils';
import {getRadarEmotionOptions, stackedBarOptions} from '../../utils';

import { stacked3BarData1Data, stacked2BarData1Data, stacked1BarData1Data } from '../../utils';

// This is very lean...
const parseEmotion = (emotionData) => {
	
	let derp = [emotionData.joy, emotionData.anger, emotionData.sadness, emotionData.disgust, emotionData.fear]
	return derp;
}

// Maybe I should move this to getting it from the data...
const AIAspect = [
    { name: 'Emotion', value: 'emotion' },
    { name: 'Sentiment', value: 'sentiment' },
    { name: 'Entities', value: 'entities' },
	{ name: 'Keywords', value: 'keywords' },
	//{ name: 'Relations', value: 'relations' },
];

// This doesnt look right... Fix this later I guess
/*this.onChange = (editorState) => this.setState({editorState});
this.setEditor = (editor) => {
	this.editor = editor;
};*/

// Perhaps the journal would be set here instead?
// I CAN use hooks if need be. So I will note that to try once I get this up and running...
// And can check performance...

// Main Function
const JournalView = (props) => {
		
	const tileClassName = ({ date, view }) => {
	
		// Add class to tiles in month view only
		if (view === 'month') {
			
			const checkDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()

			// Check if a date React-Calendar wants to check is on the list of dates to add class to
			const hasJournal = props.validJournalDates.find( element => element === checkDate)
			const hasAI = props.validJournalScanDates.find( element => element === checkDate)
			
			if (hasAI) {
				return 'btn btn-success';
			} else if (hasJournal) {
				return 'btn btn-warning'
			} else {
				// use the default styling...
				//return 'btn btn-outline-dark'
			}
			
		}
	}
	
	let displayPromptSentance = "Displaying Data for Journal with prompt: " + props.selectedPrompt
	
	let index;
	
	let dayData = props.dataSet
	let promptList = []
	
	let tableDisplay = []
	let displayStats = []
	//let promptName = "Invalid Prompt"
	
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
		
		let sanityCheck = props.selectedAspect in dayData
		if (sanityCheck) {
			//promptName = dayData[props.selectedPrompt]["name"]
			//displayPromptSentance = "Showing Data for prompt: " + promptName
			
			//let dataSet = dayData[props.selectedPrompt]["data"][props.selectedAspect]
			let dataSet = dayData[props.selectedAspect]
			
			switch(props.selectedAspect) {
				case 'emotion':
					let emoValue = parseEmotion( dataSet.document.emotion )
					
					let dataDocEmo = getRadarEmotionData( emoValue )
					let emoOptions = getRadarEmotionOptions()
				
					displayStats.push(
						<div className="row m-2" key="2">
							<div className="col">
							</div>
							<div className="col">
								<div className="card">
									<div className="card-header">
										Emotion Values
									</div>
									<div className="card-body">
										<Radar data={dataDocEmo} options={emoOptions} />
									</div>
								</div>
							</div>
							<div className="col">
							</div>
						</div>
					)
				break;
				case 'sentiment':
					
					const dataBarStack = stacked1BarData1Data( [dataSet.document.score] )
					const barStackOptions = stackedBarOptions()
				
					displayStats.push(
						<div className="row m-2" key="2">
							<div className="col" />
							<div className="col">
								<div className="card">
									<div className="card-header">
										Sentiment Values
									</div>
									<div className="card-body">
										<Bar data={dataBarStack} options={barStackOptions} />
									</div>
								</div>
							</div>
							<div className="col" />
						</div>
					)
				break;
				case 'entities':
					
					//console.log(dataSet)
					for (index in dataSet) {
						let entity = dataSet[index]
						//console.log(entity)
						
						let emoVal = parseEmotion( entity.emotion )
						
						let emoData = getRadarEmotionData( emoVal)
						let emoOptions = getRadarEmotionOptions()
						
						const dataEntSent = stacked3BarData1Data(
							[entity.confidence, entity.relevance, entity.sentiment.score],
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
				
					for (index in dataSet) {
						let keyData = dataSet[index]
						
						let emoVal = parseEmotion( keyData.emotion )
						
						const dataRadar = getRadarEmotionData( emoVal )
						const dataRadarOptions = getRadarEmotionOptions()
						
						//console.log(keyData)
						
						const dataKeySent = stacked2BarData1Data(
							[keyData.relevance, keyData.sentiment.score], 
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
				default:
						console.log("Invalid AI selection somehow")
			}
		}
		else {
			promptList = [{name:"No Prompts", value:"None"}]
		}
	}
	else {
		promptList = [{name:"No Prompts", value:"None"}]
	}

	return (
		<div className="mainView">
			<div className="container-fluid justify-content-center">

				<div className="row m-2">
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
					<div className="col my-2">
						<div className="card shadow">
							<div className="card-header">
								<div>{props.displayMessage}</div>
							</div>
							<div className="card-body">
								<div className="row m-2">
									<div className="col">
										
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
								<div>Journal Contents:</div>
							</div>
							<div className="card-body">
								<p>{props.currentJournal}</p>
							</div>
						</div>
					</div>
				</div>
				
				<div className="row m-2">
					<div className="col">
						<div className="card shadow">
							<div className="card-header">
								<div>{displayPromptSentance}</div>
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

export default withRouter(JournalView);