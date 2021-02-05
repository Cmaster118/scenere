import React from "react";
import axios from "axios";

import { withRouter } from "react-router-dom";
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

import Store from "store"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { ProgressBar } from 'react-bootstrap';

import { Radar, Bar } from 'react-chartjs-2';
import { testMaxMin, testBarMulti, stackedBarData3Test, stackedBarData2Test, stackedBarData, sentimentBarData } from '../utils';
import { getRadarEmotionOptions, testBarMultiOptions, stackedBarOptions, sentimentBarOptions } from '../utils';
//import { makeCompanyTestData, makeCompanyTestDataOtherFormat } from "../utils";

// Move all of the functions here to a seperate file, a repository, so that I can fast make layouts sometime

// This is garunteed
const AIAspect = [
    { name: 'Emotion', value: 'emotion' },
    { name: 'Sentiment', value: 'sentiment' },
    { name: 'Entities', value: 'entities' },
	{ name: 'Keywords', value: 'keywords' },
	{ name: 'Relations', value: 'relations' },
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

class companyViewSummary extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			selectedPrompt:"p1",
			selectedAspect:"emotion",
			seletedDay:"mon",
			
			currentDate: new Date(),
			validSummaryDates: [],
			
			dropMessage: 'Select Company=>',
			companyList: [],
			
			// hmmmm
			dataSet: {mon:{},tue:{},wed:{},thu:{},fri:{},sat:{},sun:{},allDay:{}},
			
			messages:"Display based on the previous stucture, but with much more buttons and graph examples!",
        };
	}
	
	backButton = () => {
		this.props.history.goBack()
	}
	
	selectPrompt = (event) => {
		this.setState({
			selectedPrompt:event.currentTarget.value
		});
	}
	selectAI = (event) => {
		this.setState({
			selectedAspect:event.currentTarget.value
		});
	}
	selectDay = (event) => {
		this.setState({
			seletedDay:event.currentTarget.value
		});
	}
	
	changeRequest = () => {
		//console.log( Store.get("testData") )
		
		//let overwriteData = this.state.dataSet
		//console.log(overwriteData)
		
		this.setState({
			//dataSet:overwriteData
		})
	}
	
	// Get Company List from the server
	getCompanyList = () => {
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
	
		axios.get(this.props.APIHost +"/getUsersCompanies", config)
		.then( 	res => {
				// Should respond with a 1 length thing
				if (res.data.length > 0) {
					// Normal behaviour
					console.log("Got the list of companies")
					//console.log(res)
					
					// Companies this user is 'owner' of
					//console.log(res.data[0].companyOwner)
					// Companies that this user is Allowed to see
					//console.log(res.data[0].companyAllowsView)
					// Companies this user is sent updates on
					//console.log(res.data[0].companySendsTo)
					
					// Merge these three into a single set for viewing for now?
					let adding = []
					
					var index;
					for (index in res.data[0].companyOwner) {
						let name = res.data[0].companyOwner[index]
						if ( !adding.includes(name) ) {
							adding.push(name)
							//console.log(name)
						}							
					}
					for (index in res.data[0].companyAllowsView) {
						let name = res.data[0].companyAllowsView[index]
						
						if ( !adding.includes(name) ) {
							adding.push(name)
							//console.log(name)
						}							
					}
					for (index in res.data[0].companySendsTo) {
						let name = res.data[0].companySendsTo[index]
						if ( !adding.includes(name) ) {
							adding.push(name)
							//console.log(name)
						}							
					}
					
					Store.set(this.props.currentUser+'-companyList', {'theList':adding})
					this.setState({companyList: adding})
				}
				else {
					// This should not trigger
				}
			})
			.catch( err => {
				if (err.response.status === 401) {
					this.props.forceLogout()
					this.props.history.push(this.props.reRouteTarget)
				}
			});
	}
	
	getCookiesListData = () => {
		let getDates = Store.get(this.props.currentUser+'-companyList')
		
		try {
			this.setState({companyList: getDates['theList']})
		}
		catch {
			console.log("Not in the cookies")
		}
	}
	
	// Dates Stuff...
	getCookiesValidDates = () => {
		let getDates = Store.get(this.props.currentUser+'-'+this.state.currentCompany+'-ValidDates')
		
		try {
			this.setState({validSummaryDates: getDates['dates']})
		}
		catch {
			console.log("Not in the cookies")
		}
	}
	
	getValidDates = () => {
		
		if (this.state.currentCompany === "None") {
			console.log("Select Valid Company!")
			return false
		}
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		axios.get(this.props.APIHost + "/getCompanyWeekDates?reComp="+this.state.currentCompany, config)
		.then( 	res => {
				let tempSumArray = []
				
				console.log("Got Valid Dates!")
				Store.remove(this.props.currentUser+'-'+this.state.currentCompany+'-ValidDates')

				var item = ""
				for (item in res.data){
					
					// THESE DATES HAVE THE WRONG TIMEZONE COMING IN, SO THE RESULTING DAY CAN BE WRONG!!!!
					// CHANGE THIS!!!
					const newDate = new Date(res.data[item].forDate)
					let checkDate = 0
				
					// This is the "Anchor Date"
					if (res.data[item].hasMon) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1) )
					}
					if (res.data[item].hasTue) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+2) )
					}
					if (res.data[item].hasWed) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+3) )
					}
					if (res.data[item].hasThu) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+4) )
					}
					if (res.data[item].hasFri) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+5) )
					}
					if (res.data[item].hasSat) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+6) )
					}
					if (res.data[item].hasSun) {
						tempSumArray.push( checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+7) )
					}
					
					tempSumArray.push( checkDate )
				}
				
				Store.set(this.props.currentUser+'-'+this.state.currentCompany+'-ValidDates', {'dates':tempSumArray})
				//console.log(tempSumArray)
				
				this.setState({validSummaryDates: tempSumArray})
		})
		.catch( err => {
			if (err.response.status === 401) {
				this.props.forceLogout()
				this.props.history.push(this.props.reRouteTarget)
			}
		});
	}
	
	pickDate = (selectedDate) => {
		// Try this for now, get the week from the server, load that data set into the memory...
		if (this.state.currentCompany === "None") {
			console.log("Select Valid Company!")
			return false
		}
		
		console.log("requesting date")
		this.setState({currentDate: selectedDate})
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};

		selectedDate.setDate(selectedDate.getDate()-selectedDate.getDay()+1)
		const dateReq = selectedDate.toJSON().split("T")[0]
		
		axios.get(this.props.APIHost +"/getCompanyWeekSummary/?reqDate="+dateReq+"&reComp="+this.state.currentCompany, config)
		.then( 
			res => {
				// What if it is > 1?
				if (res.data.length > 0) {
					console.log("obtained a company summary")
					
					// Check for matching stuff on this end?
					//console.log(res.data[0].summaryResult)
					// Save in the cookies for non-login access...
					//Store.set('testSummaryData', res.data[0].summaryResult)
					
					//console.log(res.data)
					
					let incomingDict = {
						mon:res.data[0].monResult,
						tue:res.data[0].tueResult,
						wed:res.data[0].wedResult,
						thu:res.data[0].thuResult,
						fri:res.data[0].friResult,
						sat:res.data[0].satResult,
						sun:res.data[0].sunResult,
						allDay:res.data[0].summaryResult,
					}
					
					this.setState({
						dataSet:incomingDict
					})
					
				}
				else{
					console.log("No entry for that day")
					this.setState( {
						messages: "No entry for that day",
						companyDisp: ":/",
					})
				}
				// LEts not store it in the cookies for now...
		})
		.catch( err => {
			if (err.response.status === 401) {
				this.props.forceLogout()
				this.props.history.push(this.props.reRouteTarget)
			}
		});
	}
	
	setCurrentCompany = (event) => {
	
		this.setState({dropMessage: event.target.value, currentCompany: event.target.value})
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		let tableDisplay = []
		let index;
		
		// Read the data from our state machine,
		const currentPrompt = this.state.selectedPrompt
		const currentDay = this.state.seletedDay
		const currentAspect = this.state.selectedAspect
		
		let promptList = []
		
		// At least this is garunteed to exist
		let dayData = this.state.dataSet[currentDay]
		// Check to see if the lower states exist...
		
		let displayStats = [];
		let promptName = "NO DATA FOUND!";
		
		
		// This will trip if we have data
		if (!(dayData === null)) {
			
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
			
			let sanityCheck = currentPrompt in dayData
			if (sanityCheck) {
				// Switch state this bugger...
				promptName = dayData[currentPrompt]["name"]
				let dataSet = dayData[currentPrompt]["data"][currentAspect]
				let purity = dayData.responsePurity
				
				displayStats.push(
					<div className="row m-2" key="1">
						<div className="col">
							<div className="progressBar">
								<ProgressBar now={ purity } label={`${purity}% Response Rate`} />
							</div>
						</div>
					</div>
				)
				
				switch(currentAspect) {
					case "emotion":
						let emoMax = parseEmotion( dataSet.max )
						let emoAve = parseEmotion( dataSet.ave )
						let emoMin = parseEmotion( dataSet.min )
						
						console.log(dataSet.max)
						console.log(dataSet.ave)
						console.log(dataSet.min)
						
						const dataRadarTest = testMaxMin( emoMax, emoAve, emoMin )
						const radarOptionsTest = getRadarEmotionOptions()
						
						let emoThresh = parseEmotion( dataSet.threshold )
						const dataBarTest = testBarMulti( emoThresh )
						const barOptionsTest = testBarMultiOptions()
						
						displayStats.push(
							<div className="row m-2" key="2">
								<div className="col">
									<div className="card">
										<div className="card-header">
											Averages + Max and min?
										</div>
										<div className="card-body">
											<Radar ref={this.chartReference} data={dataRadarTest} options={radarOptionsTest} />
										</div>
									</div>
								</div>
								<div className="col">
									<div className="card">
										<div className="card-header">
											"How many have hit this threshold"?
										</div>
										<div className="card-body">
											<Bar ref={this.chartReference} data={dataBarTest} options={barOptionsTest} />
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
							<div className="row m-2" key="2">
								<div className="col">
									<div className="card">
										<div className="card-header">
											Sentiment Values
										</div>
										<div className="card-body">
											<Bar ref={this.chartReference} data={dataBarStack} options={barStackOptions} />
										</div>
									</div>
								</div>
								<div className="col">
									<div className="card">
										<div className="card-header">
											"How many have hit this threshold"?
										</div>
										<div className="card-body">
											<Bar ref={this.chartReference} data={dataBarNorm} options={barOptionsNorm} />
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
							console.log(entity)
							
							let emoMax = parseEmotion( entity.emotion.max )
							let emoAve = parseEmotion( entity.emotion.min )
							let emoMin = parseEmotion( entity.emotion.ave )
							
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
									<td colSpan="3"><Bar ref={this.chartReference} data={dataEntSent} options={dataEntOptions} /></td>
									<td><Radar ref={this.chartReference} data={emoData} options={emoOptions} /></td>
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
							let emoAve = parseEmotion( keyData.emotion.min )
							let emoMin = parseEmotion( keyData.emotion.ave )
							
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
									<td colSpan="2"><Bar ref={this.chartReference} data={dataKeySent} options={dataKeyOptions} /></td>
									<td><Radar ref={this.chartReference} data={dataRadar} options={dataRadarOptions} /></td>
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
									<td style={{width:"30%"}}><Bar ref={this.chartReference} data={scoreData} options={scoreOptions} /></td>
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
		}
		else {
			// There was NO DATA in the day here, so we have to display nothing...
			promptList = [{name:"No Prompts", value:"None"}]
		}
		
		const tileClassName = ({ date, view }) => {
		
			// Add class to tiles in month view only
			if (view === 'month') {
				
				const checkDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()
				
				//console.log(checkDate)
				//console.log(this.state.validJournalDates)

				// Check if a date React-Calendar wants to check is on the list of dates to add class to
				const hasSummary = this.state.validSummaryDates.find( element => element === checkDate)
				
				if (hasSummary) {
					return 'btn btn-success'
				} else {
					//return 'btn btn-outline-dark'
				}
				
			}
		}
		
		var dropDownInternal = []
		
		for (index in this.state.companyList) {
			let comp = this.state.companyList[index]
			dropDownInternal.push( 
				<button className="dropdown-item" key={index} onClick={this.setCurrentCompany} value={ comp }>
					{comp}
				</button> 
			)
		}
		
		return (
			<div className="testStuff">
				<div className="container">
				
					<div className="row">
						<div className="col-sm-3 m-2">	
							<button className="btn btn-primary" onClick={this.backButton}>
								Go Back
							</button>
						</div>
						<div className="col-sm m-2">	
							Page Title Test!
						</div>
					</div>
					
					<div className="row m-2">
						<div className="col-lg-3 border m-2">					
							<div>
								<Calendar 
									onChange={this.pickDate}
									value={this.state.currentDate}
									tileClassName={tileClassName}

									minDetail={'year'}
									maxDetail={'month'}
								/>
							</div>
						</div>
						<div className="col border m-2">					
							<p>{this.state.messages}</p>
						</div>
					</div>
					
					<div className="row">
						<div className="col">
							<div className="dropdown">
							  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							  {this.state.dropMessage}
							  </button>
							  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								{dropDownInternal}
							  </div>
							</div>
						</div>
						<div className="col">
							<button onClick={this.getCompanyList}> Get Comp List (server)</button>
							<button onClick={this.getCookiesListData}> Get Comp List (cookies)</button>
							
							<button onClick={this.getValidDates}> Get Valid Dates (server)</button>
							<button onClick={this.getCookiesValidDates}> Get Valid Dates (cookies)</button>
						</div>
					</div>
					
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
									checked={this.state.seletedDay === radio.value}
									onChange={this.selectDay}
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
									checked={this.state.selectedPrompt === radio.value}
									onChange={this.selectPrompt}
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
									checked={this.state.selectedAspect === radio.value}
									onChange={this.selectAI}
									>
									{radio.name}
								</ToggleButton>
								))}
							</ButtonGroup>
						</div>
					</div>
					
					<div className="row m-2">
						<div className="col">
							Showing Data for {promptName}
						</div>
					</div>
					
					{displayStats}
					
					<div className="row  my-2">
						<p>
							
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(companyViewSummary);