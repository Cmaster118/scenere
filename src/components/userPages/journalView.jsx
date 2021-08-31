import React from "react";

//import { useEffect } from "react"

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { Radar, Bar } from 'react-chartjs-2';

import { ButtonGroup, ToggleButton, Alert, Accordion, Card, Table } from 'react-bootstrap';

import { withRouter } from "react-router-dom";
import { Editor, EditorState, convertFromRaw } from 'draft-js';

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

const styles = {
  editor: {
    //border: '1px solid gray',
    minHeight: '6em',
	textAlign: 'left',
  }
};

const MultiIteration = (props) => {
	
	let buttonSet = []
	for (let key in props.promptQuestions) {
		
		let isActive = "outline-"
		if ( Number(props.selected) === Number(key)) {
			isActive = ""
		}
		
		buttonSet.push(
			<button type="button" key={key} value={key} className={"btn disabled btn-"+isActive+"primary"}>{props.promptQuestions[key]}</button>
		)
	}
	
	return (
		<div className="MultiIteration">
			{buttonSet}
		</div>
	)
}

const RatingIteration = (props) => {
	
	// Definetly a better way to do this
	let isActive = ["outline-", "outline-", "outline-", "outline-", "outline-", "outline-"]
	if (props.selected >= 0 && props.selected < isActive.length) {
		isActive[props.selected] = ""
	}
	
	let buttonSet = []
	for (let index in isActive) {
		buttonSet.push(
			<button type="button" key={index} value={index} className={"btn disabled btn-"+isActive[index]+"primary"}>{index}</button>
		)
	}
	
	return (
		<div className="RatingIteration">
			{buttonSet}
		</div>
	)
}

const LikertIteration = (props) => {
	
	let isActive = ["outline-", "outline-", "outline-", "outline-", "outline-"]
	if (props.selected >= 0 && props.selected < isActive.length) {
		isActive[props.selected] = ""
	}
	
	let buttonSet = []
	for (let index in isActive) {
		buttonSet.push(
			<button type="button" key={index} value={index} className={"btn disabled btn-"+isActive[index]+"primary"}>{index-2}</button>
		)
	}
	
	return (
		<div className="LikertIteration">
			<span className="btn btn-link disabled" disabled>Highly Disagree</span>
			{buttonSet}
			<span className="btn btn-link disabled" disabled>Highly Agree</span>
		</div>
	)
}

class JournalIteration extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			selectedAspect: "emotion",
		}	
	}
	
	setAspect = (event) => {
		this.setState({
			selectedAspect:event.currentTarget.value
		})
	}
	
	render() {
		
		// Making the Editor
		let givenState = EditorState.createEmpty()
		
		if (!(this.props.richText === null)) {
			let richData = convertFromRaw( this.props.richText )
			givenState = EditorState.createWithContent(richData)
		}
		
		// GETTING WHICH DATA IS SELECTED!
		let displayStats = []
		let tableDisplay = []
		let dayData = this.props.AIresults
		if (!(dayData === null) && !(dayData === undefined)) {
		
			let sanityCheck = this.state.selectedAspect in dayData
			if (sanityCheck) {
				
				let dataSet = dayData[this.state.selectedAspect]
				
				switch(this.state.selectedAspect) {
					case 'emotion':
						let emoValue = parseEmotion( dataSet.document.emotion )
						
						let dataDocEmo = getRadarEmotionData( emoValue )
						let emoOptions = getRadarEmotionOptions()
					
						displayStats.push(
							<Table bordered responsive key="1">
								<thead>
									<tr>
										<th scope="col">Whole Journal Emotion Data</th>
									</tr>
								</thead>
								<tbody>
									<tr key={0}>
										<td>
											<Radar data={dataDocEmo} options={emoOptions} />
										</td>
									</tr>
								</tbody>
							</Table>
						)
					break;
					case 'sentiment':
						
						const dataBarStack = stacked1BarData1Data( [dataSet.document.score] )
						const barStackOptions = stackedBarOptions()
					
						displayStats.push(
						
							<Table bordered responsive key="1">
								<thead>
									<tr>
										<th scope="col">Whole Journal Sentiment Data</th>
									</tr>
								</thead>
								<tbody>
									<tr key={0}>
										<td>
											<Bar data={dataBarStack} options={barStackOptions} />
										</td>
									</tr>
								</tbody>
							</Table>
							
						)
					break;
					case 'entities':
						
						//console.log(dataSet)
						for (let index in dataSet) {
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
						
						if (tableDisplay.length === 0) {
							tableDisplay.push(
								<tr key={0}>
									<td colSpan="7">"Nothing!"</td>
								</tr>
							)
						}
						
						displayStats.push(
							<Table bordered responsive key="2">
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
							</Table>
						)
					break;
					case 'keywords':
					
						for (let index in dataSet) {
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
						
						if (tableDisplay.length === 0) {
							tableDisplay.push(
								<tr key={0}>
									<td colSpan="5">"Nothing!"</td>
								</tr>
							)
						}
					
						displayStats.push(
							<Table bordered responsive key="3">
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
							</Table>
						)
					break;
					default:
							console.log("Invalid AI selection somehow")
				}
			}
		}
		
		if (displayStats.length === 0) {
			displayStats.push(
				"Nothing to display!"
			)
		}
		
		return (
			<div className="JournalIteration">
				{/*props.content*/}
				
				<Accordion>
				
					<Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
						<div style={styles.editor} >
							<Editor
								editorState={givenState}
								placeholder={"Nothing Here!"}
								readOnly={true}
							/>
						</div>
					</Accordion.Toggle>
				
					<Accordion.Collapse eventKey="0">
					
						<Card>
							<Card.Body>
								<div className="row my-2">
									<div className="col">
										<ButtonGroup toggle>
											{AIAspect.map((radio, idx) => (
												<ToggleButton
													key={idx}
													type="radio"
													variant="info"
													name="radio"
													value={radio.value}
													checked={this.state.selectedAspect === radio.value}
													onChange={this.setAspect}
													>
													{radio.name}
												</ToggleButton>
											))}
										</ButtonGroup>
									</div>
								</div>
								
								<hr />
								
								<div className="row my-2">
									<div className="col">
										{displayStats}
									</div>
								</div>

							</Card.Body>
						</Card>
						
					</Accordion.Collapse>
					
				</Accordion>
			</div>
		)
	}
}

// Main Function
const JournalView = (props) => {
		
	const tileClassName = ({ date, view }) => {
	
		// Add class to tiles in month view only
		if (view === 'month') {
			
			const checkDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()

			// Check if a date React-Calendar wants to check is on the list of dates to add class to
			let hasJournal = false
			for (let index in props.validJournalDates) {
				if (checkDate === index) {
					hasJournal = true
					break
				}
			}
			
			let hasAI = false
			for (let index in props.validJournalScanDates) {
				if (checkDate === index) {
					hasAI = true
					break
				}
			}
			
			// Backup Check...
			if (!hasJournal) {
				for (let index in props.validNonJournalDates) {
					if (checkDate === index) {
						hasJournal = true
						break
					}
				}
			}
			
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
	
	// Scanning for divisions...
	let foundData = []
	for (let index in props.viewJournalData) {
		if (props.viewJournalData[index]["onlyDivision"]) {
			let checkThing = false
			for (let deepIndex in foundData) {
				if (foundData[deepIndex]["id"] === props.viewJournalData[index]["targetDivision"]["id"] ) {
					checkThing = true
					break
				}
			}
			
			if (!checkThing) {
				foundData.push( props.viewJournalData[index]["targetDivision"] )
			}	
		}
		else {
			let checkThing = false
			for (let deepIndex in foundData) {
				if (foundData[deepIndex]["id"] === -1 ) {
					checkThing = true
					break
				}
			}
			let newSet = {
				"divisionName":"None",
				"id":-1,
			}
			if (!checkThing) {
				foundData.push( newSet )
			}
		}
	}
	for (let index in props.viewNonJournalData) {
		if (props.viewNonJournalData[index]["onlyDivision"]) {
			let checkThing = false
			for (let deepIndex in foundData) {
				if (foundData[deepIndex]["id"] === props.viewNonJournalData[index]["targetDivision"]["id"] ) {
					checkThing = true
					break
				}
			}
			if (!checkThing) {
				foundData.push( props.viewNonJournalData[index]["targetDivision"] )
			}
		}
		else {
			let checkThing = false
			for (let deepIndex in foundData) {
				if (foundData[deepIndex]["id"] === -1 ) {
					checkThing = true
					break
				}
			}
			let newSet = {
				"divisionName":"None",
				"id":-1,
			}
			if (!checkThing) {
				foundData.push( newSet )
			}
		}
	}
	
	let displayButtonSet = []
	for (let index in foundData) {
		let dispClass = "btn btn-outline-secondary"
		if (String(props.selectedJournalViewDiv) === index) {
			dispClass = "btn btn-secondary"
		}
		
		displayButtonSet.push(
			<button key={index} className={dispClass} value={index} onClick={props.changeSelectedJournalViewDiv}>
				{foundData[index]["divisionName"]}
			</button>
		)
	}
	
	if (displayButtonSet.length === 0) {
		displayButtonSet.push(
			<div key={0} className="btn btn-outline-secondary">
				Nothing!
			</div>
		)
	}
	
	let selectedDivID = -1
	if (props.selectedJournalViewDiv >= 0 && props.selectedJournalViewDiv < foundData.length) {
		selectedDivID = foundData[props.selectedJournalViewDiv]["id"]
	}
	
	let showResult = []
	for (let index in props.viewNonJournalData) {
		
		try{
			if (!(props.viewNonJournalData[index]["targetDivision"]["id"] === selectedDivID)) {
				continue
			}
		}
		catch{
			// if it ISNT a "No seleted set"... then skip it
			if (!(selectedDivID === -1)) {
				continue
			}
		}
		
		let promptTitle = "No Prompt Data!"
		let promptBody = "Prompt Showing Error!"
		if (props.viewNonJournalData[index]["usedPromptKey"] !== null) {
			promptTitle = props.viewNonJournalData[index]["usedPromptKey"]["text"]
			
			switch ( props.viewNonJournalData[index]["usedPromptKey"]["promptType"] ) {
				// Likert
				case 1:
					promptBody = <LikertIteration
						selected={ props.viewNonJournalData[index]["chosenValue"]}
					/>
					break;
				// Rating
				case 2:
					promptBody = <RatingIteration
						selected={ props.viewNonJournalData[index]["chosenValue"]}
					/>
					break;
				// Multi
				case 3:
					promptBody = <MultiIteration
						promptQuestions={ props.viewNonJournalData[index]["usedPromptKey"]["promptChoices"] }
						selected={ props.viewNonJournalData[index]["chosenValue"]}
					/>
					break;
				default:
					//promptBody = "Prompt Showing Error!"
					break;
			}
		}
		else {
			// Well, if we have no prompt, then whatever data is in there we cant parse....
			continue
		}
		
		//if () {
			//<RatingIteration />
		//}
		
		showResult.push(
			<div className="row" key={index}>
				<div className="col">
					<h5>{promptTitle}</h5>
					<div>{promptBody}</div>
					<hr />
				</div>
			</div>
		)
		//props.viewNonJournalData[index]["usedPromptKey"]["promptType"]
		//props.viewNonJournalData[index]["usedPromptKey"]["promptChoices"]
		//props.viewNonJournalData[index]["chosenValue"]
	}
	for (let index in props.viewJournalData) {
		
		try {
			if (!(props.viewJournalData[index]["targetDivision"]["id"] === selectedDivID)) {
				continue
			}
		}
		catch{
			// Well, this doesnt even have a selected Div ID so....
			if (!(selectedDivID === -1)) {
				continue
			}
		}
		
		let promptTitle = "No Prompt Data!"
		let promptBody = "No Prompt!"
		
		if (props.viewJournalData[index]["usedPromptKey"] !== null) {
			promptTitle = props.viewJournalData[index]["usedPromptKey"]["text"]
			
			// It ISNT a journal!??!?!
			if ( props.viewJournalData[index]["usedPromptKey"]["promptType"] !== 0 ) {
				continue
			}
		}
		else {
			// Well, how I have structured this, if it appears in this for loop, then we can assume its a journal for now?
			// I should have a specific NULL prompt I give these....
		}
		
		try {
			promptBody = <JournalIteration
				content={ props.viewJournalData[index]["content"] }
				richText={ props.viewJournalData[index]["richText"] }
				
				hasAI={props.viewJournalData[index]["hasAI"]}
				AIresults={ props.viewJournalData[index]["AIresult"] }
			/>
		}
		catch {
			console.log("MISSING A JOURNAL'S CONTENT!")
		}
		
		let markLength = showResult.length
		showResult.push(
			<div className="row" key={index + markLength}>
				<div className="col">
					<h5>{promptTitle}</h5>
					<div>{promptBody}</div>
					<hr />
				</div>
			</div>
		)
	}
	
	//let showIdle = props.pickJournalCalenderDateStatus === 0 || props.pickNonJournalCalenderDateStatus === 0
	let showSubmit = props.pickJournalCalenderDateStatus === 1 || props.pickNonJournalCalenderDateStatus === 1
	let showSuccess = false//props.pickJournalCalenderDateStatus === 2 || props.pickNonJournalCalenderDateStatus === 2
	let showError = props.pickJournalCalenderDateStatus === 3 || props.pickNonJournalCalenderDateStatus === 3
	
	let alreadyStacked = false
	
	let errorParse = []
	for (let index in props.journalViewErrors) {

		// This means its a refresh, and the user just needs to do it again...
		if (props.journalViewErrors[index]["mod"] === 1 && !alreadyStacked) {
			alreadyStacked = true
			
			errorParse.push(
				props.journalViewErrors[index]["text"]
			)
		}

	}
	for (let index in props.nonJournalViewErrors) {

		// This means its a refresh, and the user just needs to do it again...
		if (props.nonJournalViewErrors[index]["mod"] === 1 && !alreadyStacked) {
			alreadyStacked = true
			errorParse.push(
				props.nonJournalViewErrors[index]["text"]
			)
		}

	}
	if (errorParse.length === 0) {
		errorParse.push(
			"Unknown!"
		)
	}

	return (
		<div className="mainView">
			<div className="container-fluid justify-content-center">

				<div className="row m-2 justify-content-center">
					<div className="col- m-2 ">
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
				</div>
				<div className="row m-2">
					<div className="col">
						<div className="card shadow">
							<div className="card-header">
								Prompt Data for {props.currentDate.toString()}
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col">
										Select a Division:
									</div>
								</div>
								<div className="row">
									<div className="col">
										{displayButtonSet}
									</div>
								</div>
								<hr />
								{showResult}
							</div>
						</div>
					</div>
				</div>

				<Alert show={showSubmit} variant="warning">
					<Alert.Heading>Waiting</Alert.Heading>
					<hr />
					<p>
					  Waiting for server response...
					</p>
					<hr />
				</Alert>
				
				<Alert show={showSuccess} variant="success">
					<Alert.Heading>Success!</Alert.Heading>
					<hr />
					<p>
					  Successfully obtained data!
					</p>
					<hr />
				</Alert>
				
				<Alert show={showError} variant="danger">
					<Alert.Heading>Error!</Alert.Heading>
					<hr />
					<p>
					  {errorParse}
					</p>
					<hr />
				</Alert>
					
			</div>
		</div>
	);
}

export default withRouter(JournalView);