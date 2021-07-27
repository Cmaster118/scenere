import React from "react";

import { withRouter } from "react-router-dom";
import { ButtonGroup, ToggleButton, Table, Accordion, Card } from 'react-bootstrap';

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { ProgressBar, Alert } from 'react-bootstrap';

import { Radar, Bar } from 'react-chartjs-2';
import { frequencyBarData, testMaxMin, testBarMulti, stackedBarData3Test, stackedBarData2Test, stackedBarData, sentimentBarData } from '../../utils';
import { getBarOptionsFreq, getRadarEmotionOptions, testBarMultiOptions, stackedBarOptions, sentimentBarOptions } from '../../utils';
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

const convertSummaryType = [
	"Daily",
	"Weekly",
	"Monthy",
	"Annual",
]

// This is very lean...
const parseEmotion = (emotionData) => {
	
	let derp = [emotionData.joy, emotionData.anger, emotionData.sadness, emotionData.disgust, emotionData.fear]
	return derp;
}

class  MultiIteration extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			selected: "frequencyPercent",
		}	
	}
	
	changeSelected = (event) => {
		this.setState({
			selected:event.target.id,
		})
	}
	
	render() {
		
		let purity = this.props.dataSet["responsePurity"]
		
		let showPrompts = []
		for (let index in this.props.givenPrompt.promptChoices) {
			showPrompts.push(
				<div key={index}>
					{index + ": " + this.props.givenPrompt.promptChoices[index]}
				</div>
			)
		}
		
		let displayData = {}
		let buttonSet = []
		for (let index in this.props.dataSet["data"]) {
			let activeSet = "outline-"
			if (this.state.selected === index) {
				activeSet = ""
				
				for (let i in this.props.givenPrompt.promptChoices) {
					if (i in this.props.dataSet.data[index]) {
						displayData[i] = this.props.dataSet.data[index][i]
					}
					else {
						displayData[i] = 0
					}
				}
				
			}
			
			buttonSet.push(
				<div className={"btn btn-"+activeSet+"primary"} id={index} onClick={this.changeSelected} key={index}>
					{index}
				</div>
			)
		}
		
		const dataBarSet = frequencyBarData( displayData )
		const barOptionsFreq = getBarOptionsFreq()
		
		return (
			<div className="MultiIteration">
				<Accordion>
					
					<Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
						<div className="row" key="0">
							<div className="col">
								{this.props.givenPrompt["text"]}
							</div>
						</div>
						<div className="row" key="1">
							<div className="col">
								<div className="progressBar">
									<ProgressBar now={ purity } label={`${purity}% Response Rate`} />
								</div>
							</div>
						</div>
					</Accordion.Toggle>
				
					<Accordion.Collapse eventKey="0">
					
						<Card>
							<Card.Body>
								{buttonSet}
								<div className="row">								
									<div className="col">
										<Bar data={dataBarSet} options={barOptionsFreq} />
									</div>
								</div>
								
								<div className="row">
									<div className="col">
										{showPrompts}
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

class LikertIteration extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: "frequencyPercent",
		}	
	}
	
	changeSelected = (event) => {
		this.setState({
			selected:event.target.id,
		})
	}

	render() {
		let purity = this.props.dataSet["responsePurity"]
		
		let displayData = {}
		let buttonSet = []
		let magicSet = ["Ext Dis", "Dis", "Neu", "Agr", "Ext Agr"]
		
		for (let index in this.props.dataSet["data"]) {
			let activeSet = "outline-"
			if (this.state.selected === index) {
				activeSet = ""
				
				for (let i in magicSet) {
					if (i in this.props.dataSet.data[index]) {
						displayData[i] = this.props.dataSet.data[index][i]
					}
					else {
						displayData[i] = 0
					}
				}
				
			}
			
			buttonSet.push(
				<div className={"btn btn-"+activeSet+"primary"} id={index} onClick={this.changeSelected} key={index}>
					{index}
				</div>
			)
		}

		// These come in as an object, not an array....
		// Shift this to accept an array?
		const dataBarSet = frequencyBarData( displayData )
		const barOptionsFreq = getBarOptionsFreq()
		
		return (
			<div className="LikertIteration">
				<Accordion>
					
					<Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
						<div className="row" key="0">
							<div className="col">
								{this.props.givenPrompt["text"]}
							</div>
						</div>
						<div className="row" key="1">
							<div className="col">
								<div className="progressBar">
									<ProgressBar now={ purity } label={`${purity}% Response Rate`} />
								</div>
							</div>
						</div>
					</Accordion.Toggle>
				
					<Accordion.Collapse eventKey="0">
					
						<Card>
							<Card.Body>
								{buttonSet}
								<div className="row">
									<div className="col">
										<Bar data={dataBarSet} options={barOptionsFreq} />
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

class RatingIteration extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			selected: "frequencyPercent",
		}	
	}
	
	changeSelected = (event) => {
		this.setState({
			selected:event.target.id,
		})
	}
	
	render() {
	
		let magicAmount = 10
		
		let displayData = {}
		let buttonSet = []
		for (let index in this.props.dataSet["data"]) {
			let activeSet = "outline-"
			if (this.state.selected === index) {
				activeSet = ""
				
				for (let i = 1; i <= magicAmount; i++) {
					if (i in this.props.dataSet.data[index]) {
						displayData[i] = this.props.dataSet.data[index][i]
					}
					else {
						displayData[i] = 0
					}
				}
				
			}
			
			buttonSet.push(
				<div className={"btn btn-"+activeSet+"primary"} id={index} onClick={this.changeSelected} key={index}>
					{index}
				</div>
			)
		}
		
		let purity = this.props.dataSet["responsePurity"]
		const dataBarSet = frequencyBarData( displayData )
		const barOptionsFreq = getBarOptionsFreq()
		
		return (
			<div className="RatingIteration">
				<Accordion>
					
					<Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
						<div className="row" key="0">
							<div className="col">
								{this.props.givenPrompt["text"]}
							</div>
						</div>
						<div className="row" key="1">
							<div className="col">
								<div className="progressBar">
									<ProgressBar now={ purity } label={`${purity}% Response Rate`} />
								</div>
							</div>
						</div>
					</Accordion.Toggle>
				
					<Accordion.Collapse eventKey="0">
					
						<Card>
							<Card.Body>
								{buttonSet}
								<div className="row">
									<div className="col">
										<Bar data={dataBarSet} options={barOptionsFreq} />
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
		
		let purity = this.props.dataSet["responsePurity"]
		if (purity < 0) {
			purity = 0
		}
		
		let dataSet = this.props.dataSet["data"][this.state.selectedAspect]
		
		let displayStats = []
		let tableDisplay = []
		
		if (!(dataSet === null) && !(dataSet === undefined)) {
			
			// Check to see if we actually HAVE any data just before we do this...
			try{
				switch(this.state.selectedAspect) {
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
							<Table bordered responsive key="2">
								<thead>
									<tr>
										<th scope="col">Emotion Data</th>
										<th scope="col">Num Journals in data</th>
									</tr>
								</thead>
								
								<tbody>
									<tr key={0}>
										<th scope="row"> <Radar data={dataDocumentEmo} options={radarOptions} /> </th>
										<td> <Bar data={dataBar} options={barOptions} /> </td>
									</tr>
								</tbody>
							</Table>
						)
						
						break;
					case 'sentiment':
					
						const dataBarStack = stackedBarData( [dataSet.min], [dataSet.ave], [dataSet.max] )
						const barStackOptions = stackedBarOptions()
						
						let dataTresh = [dataSet.thresholdPos, dataSet.thresholdNeg]
						const dataBarNorm = sentimentBarData( dataTresh )
						const barOptionsNorm = sentimentBarOptions()
					
						//<th scope="col">Whole Journal Emotion Data</th>
						displayStats.push(
							<Table bordered responsive key="2">
								<thead>
									<tr>
										<th scope="col">Sentiment Values</th>
										<th scope="col">Num Journals in data</th>
									</tr>
								</thead>
								
								<tbody>
									<tr key={0}>
										<th scope="row"><Bar data={dataBarStack} options={barStackOptions} /></th>
										<td><Bar data={dataBarNorm} options={barOptionsNorm} /></td>
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
					
						//console.log(dataSet)
						
						for (let index in dataSet) {
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
						
						if (tableDisplay.length === 0) {
							tableDisplay.push(
								<tr key={0}>
									<td colSpan="5">"Nothing!"</td>
								</tr>
							)
						}
					
						displayStats.push(
							<Table bordered responsive key="2">
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
					case 'relations':
					
						//console.log(dataSet)
						
						for (let index in dataSet) {
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
						
						if (tableDisplay.length === 0) {
							tableDisplay.push(
								<tr key={0}>
									<th scope="row">"Nothing!"</th>
								</tr>
							)
						}
					
						displayStats.push(
							<Table bordered responsive key="2">
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
							</Table>
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
			// There was NO DATA in the day here, so we have to display nothing...
			
			displayStats.push(
				<div className="row m-2 border" key="2">
					<div className="col">
						<p>There was no data to read!</p>
					</div>
				</div>
			)
		}
		
		return (
			<div className="JournalIteration">
				<Accordion>
				
					<Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
						<div className="row" key="0">
							<div className="col">
								{this.props.givenPrompt["text"]}
							</div>
						</div>
						<div className="row" key="1">
							<div className="col">
								<div className="progressBar">
									<ProgressBar now={ purity } label={`${purity}% Response Rate`} />
								</div>
							</div>
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
							
								{displayStats}
							</Card.Body>
						</Card>
						
					</Accordion.Collapse>
					
				</Accordion>
			</div>
		)
	}
}

const companyViewSummary = (props) => {

	const currentSummaryDate = props.dataSet["forDate"]
	let showResult = []
	let i = 0
	for (let index in props.dataSet.summaryResult) {
		let promptType = -1
		
		let promptSet = {"text":"No Text!"}
		try {
			promptSet = props.dataSet["promptList"].find( element => element.identifier === index )
			promptType = promptSet["promptType"]
		}
		catch (error) {}
		
		//console.log(props.dataSet.summaryResult[index])
		// What about the order of things?
		// It will normally be in the order on the site...
		// I may have to prioritise reordering this
		
		let promptBody = "No Prompt!"
		switch ( promptType ) {
			// Journal!
			case 0:
				promptBody = <JournalIteration
					givenPrompt={promptSet}
					dataSet={props.dataSet.summaryResult[index]}
				/>
				break;
			// Likert
			case 1:
				promptBody = <LikertIteration
					givenPrompt={promptSet}
					dataSet={props.dataSet.summaryResult[index]}
				/>
				break;
			// Rating
			case 2:
				promptBody = <RatingIteration
					givenPrompt={promptSet}
					dataSet={props.dataSet.summaryResult[index]}
				/>
				break;
			// Multi
			case 3:
				promptBody = <MultiIteration
					givenPrompt={promptSet}
					dataSet={props.dataSet.summaryResult[index]}
				/>
				break;
			default:
				promptBody = promptBody = <JournalIteration
					givenPrompt={ {"text":"No Prompt!"} }
					dataSet={props.dataSet.summaryResult[index]}
				/>
				break;
		}
		
		//console.log(props.dataSet.summaryResult[index])
		
		showResult.push(
			<div className="row" key={i}>
				<div className="col">
					<div>{promptBody}</div>
					<hr />
				</div>
			</div>
		)
		i += 1
	}
	
	if (showResult.length === 0) {
		showResult.push(
			<div className="row" key={0}>
				<div className="col">
					<div>No Data to Display!</div>
					<hr />
				</div>
			</div>
		)
	}
	
	const tileClassName = ({ date, view }) => {
	
		let hasSummary = false
		let numValues = 0
		
		let year = String( date.getFullYear() )
		let month =	String( date.getMonth()+1 )

		if (month < 10) {
			month = "0"+month
		}
		
		let day = String(date.getDate())
		if (day < 10) {
			day = "0"+day
		}
		
		const checkDate = year+"-"+month+"-"+day
	
		// Add class to tiles in month view only
		if (view === 'month') {
			// Check if a date React-Calendar wants to check is on the list of dates to add class to
			try {
				hasSummary = props.validSummaryDates['day'].find( element => element['date'] === checkDate)
				numValues = hasSummary['num']
			}
			catch {
				// This should trigger if DAY is not in the validSummaryDates
				// Basically just skipping it
			}
		}
		
		if (hasSummary) {
			if (numValues > 0) {
				return 'btn btn-success'
			}
			else {
				return 'btn btn-warning'
			}
		} else {
			//return 'btn btn-outline-dark'
		}
			
	}
	
	let messageLine1 = "Showing Company Summary for: " + props.currentCompany
	let messageLine2 = "For Date: " + currentSummaryDate
	let messageLine3 = "Summary Type: " + convertSummaryType[props.summaryType]
	
	//let showIdle = props.getCompanyWeeklySummaryStatus === 0
	let showWaiting = props.getCompanyWeeklySummaryStatus === 1
	let showSuccess = false//props.getCompanyWeeklySummaryStatus === 2
	let showError = props.getCompanyWeeklySummaryStatus === 3
	
	let errorParse = []
		for (let index in props.getCompanyWeeklySummaryError) {
			errorParse.push(
				props.getCompanyWeeklySummaryError[index]["text"]
			)
		}
		if (errorParse.length === 0) {
			errorParse.push(
				"Unknown!"
			)
		}
	
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
				</div>
				
				<div className="row m-2">
					<div className="col">
						<div className="card shadow">
							<div className="card-header">
								<div>{messageLine1}</div>
								<div>{messageLine2}</div>
								<div>{messageLine3}</div>
							</div>
							<div className="card-body">
								{showResult}
							</div>
						</div>
					</div>
				</div>
				
				<Alert show={showWaiting} variant="warning">
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

export default withRouter(companyViewSummary);