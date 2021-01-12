import React from "react";
import axios from "axios";

import Store from "store"
import Calendar from 'react-calendar'
import { Doughnut, Radar, Bar } from 'react-chartjs-2';

import {getRadarEmotionData, getSentimentData, getConceptsData, getCategoryData} from '../utils';
import {getRadarEmotionOptions, getSentimentOptions, getConceptsOptions, getCategoryOptions} from '../utils';


class companyView extends React.Component {
	
	constructor(props) {
        super(props);
		
		this.state = {
			// Change this up to be a bit better,merge things together...
			dropMessage: 'Select Company=>',
			currentCompany: "None",
		
			companyList: [],
			
			// These are the dates that we know have valid Summary Entries...
			validSummaryDates: [],
			
			messages: "Waiting for user input...",
			companyDisp:'',
			
			currentDate: new Date(),
			
			dataCategories: getCategoryData([0], ['']),
			optionsCategories: getCategoryOptions(),
			
			dataConcepts: getConceptsData([0], ['']),
			optionsConcepts: getConceptsOptions(),
			
			dataEntities: [],
			dataKeywords: [],
			dataRelations: [],
			
			dataEmotion: getRadarEmotionData([0]),
			optionsEmotions: getRadarEmotionOptions(),
			
			dataSentiment: getSentimentData([0]),
			optionsSentiment: getSentimentOptions(),
			
        };
		
	};
	
	loadTestData = () => {
		// And here is our testdata for display
		let AIdata = Store.get('testSummaryData')
		//try{
			
			//console.log(AIdata)
			// This AI data is going to be a Liiiiiittle more complex...
			
			// Categories!
			const catData = AIdata.categories
			
			let catLabels = []
			let catScores = []
			
			var index;
			var batchIndex;
			for (index in catData) {
				const cat = catData[index]
				
				var maxVal = 0
				var relSum = 0
				for (batchIndex in cat.batchData) {
					const catRel = cat.batchData[batchIndex]
					// For now, we will average this...
					relSum += catRel.score
					maxVal += 1
				}
				relSum /= maxVal
				
				catLabels.push(index)
				catScores.push(relSum)
			}
			
			// Concepts!
			const conData = AIdata.concepts
			//console.log(conData)
			let conLabels = []
			let conRelevance = []
			let conDatabase = []
			
			var i
			
			for (index in conData) {
				const con = conData[index]
				
				maxVal = 0
				let conSum = 0
				
				for (i in con.batchData) {
					conSum += con.batchData[i]
					maxVal += 1
				}
				
				conSum /= maxVal
				
				conLabels.push(index)
				conRelevance.push(conSum)
				conDatabase.push(con.dbpedia_resource)
			}
			
			// Emotions!
			
			// Doin average for now!
			maxVal = 0
			var emSum = [0,0,0,0,0]
			var emSet = []
			
			const emDataObj = AIdata.emotion
			for (index in emDataObj) {
				const emData = emDataObj[index]
				const totalData = [emData.anger, emData.disgust, emData.fear, emData.joy, emData.sadness]
				
				maxVal += 1
				for( i in emSum ){
					emSum[i] += totalData[i]
				}
				
				emSet.push(totalData)
				
			}
			for( i in emSum ){
				emSum[i] /= maxVal
			}
			
			// Redo this for later...
			emSet.unshift(emSum)
			
			// Entities!
			const entData = AIdata.entities
			//console.log(entData)
			
			/*let entity = []

			for (index in entData) {
				const ent = entData[index]
				//console.log(ent)
				
				// What about this?
				//console.log(ent.disambiguation)
				
				const entEmotion = [ent.emotion.anger, ent.emotion.disgust, ent.emotion.fear, ent.emotion.joy, ent.emotion.sadness]
				
				const senDataScore = ent.sentiment.score
				const oppData = 1-Math.abs(senDataScore)
				
				let arrangedDataScore = [0, 0]
				if (senDataScore > 0) {
					arrangedDataScore = [senDataScore, oppData]
				} else {
					arrangedDataScore = [oppData, senDataScore]
				}
				
				const entStore = {
					id:index,
					
					text:ent.text,
					type:ent.type,
					
					count:ent.count,
					relevance:ent.relevance,
					
					emotion:entEmotion,
					sentiment:arrangedDataScore,
				}
				
				entity.push(entStore)
			}*/
			
			// Keywords!
			const keyData = AIdata.keywords
			
			let keyword = []

			for (index in keyData) {
				const key = keyData[index]
				
				//console.log(key.emotion)
				//console.log(key.sentiment)
				
				let keyEmSum = [0,0,0,0,0]
				let keyRelSum = 0
				let keySenSum = 0
				maxVal = 0
				
				for (i in key.batchData) {
					const keyData = key.batchData[i]
					
					const keyEmotion = [keyData.emotion.anger, keyData.emotion.disgust, keyData.emotion.fear, keyData.emotion.joy, keyData.emotion.sadness]
					for( i in keyEmSum ){
						keyEmSum[i] += keyEmotion[i]
					}
					
					keyRelSum += keyData.relevance
					keySenSum += keyData.sentiment.score
					
					maxVal += 1
				}
				
				for( i in keyEmSum ){
					keyEmSum[i] /= maxVal
				}
				
				keySenSum /= maxVal
				
				const keySenOne = 0.5*(keySenSum + 1) /maxVal
				const keySenOpp = 0.5*(keySenSum - 1) /maxVal
				
				let keySenScore = [keySenOne, keySenOpp]
				
				const keyStore = {
					id:index,
					
					text:index,
					count:key.totalCount,
					relevance:keyRelSum,
					
					emotion:keyEmSum,
					sentiment:keySenScore,
				}
				
				keyword.push(keyStore)
			}
			
			// Relations!
			/*let relation = []
			
			const relDat = AIdata.relations
			//console.log(relDat)

			for (index in relDat) {
				const rel = relDat[index]
				
				// Probobly combine these?
				
				const relStore = {
					id: index,
					init:rel.arguments[0].text,
					action:rel.type,
					target:rel.arguments[1].text,
					score:rel.score,
				}
				
				relation.push(relStore)

			}*/
		
			maxVal = 0
			let senSum = 0
		
			// Sentiment!
			const senDataScore = AIdata.sentiment
			for (index in senDataScore) {
				senSum += senDataScore[index].score
				maxVal += 1
			}
						
			const senOne = 0.5*(senSum + 1) /maxVal
			const senOpp = 0.5*(senSum - 1) /maxVal
			
			let arrangedDataScore = [senOne, senOpp]
			
			this.setState({
				
				dataCategories:getCategoryData(catScores, catLabels),
				dataConcepts:getConceptsData(conRelevance, conLabels),
				dataEmotion:getRadarEmotionData(emSum),
				
				//dataEntities: entity,
				dataKeywords: keyword,
				//dataRelations: relation,
			
				dataSentiment:getSentimentData(arrangedDataScore),
				
			})
			
		//} catch{
			//console.log("Error!")
		//}
	}
	
	getCookiesValidDates = () => {
		let getDates = Store.get(this.props.currentUser+'-'+this.state.currentCompany+'-ValidDates')
		this.setState({validSummaryDates: getDates['dates']})
	}
	
	getValidDates = () => {
		
		if (this.props.authToken == null) {
			console.log("Not logged in")
			return false
		}
		
		if (this.state.currentCompany === "None") {
			console.log("Select Valid Company!")
			return false
		}
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		axios.get("http://10.0.0.60:8000/getCompanyDates?reComp="+this.state.currentCompany, config)
		.then( 	res => {
				let tempSumArray = []
				
				console.log("Got Valid Dates!")
				Store.remove(this.props.currentUser+'-'+this.state.currentCompany+'-ValidDates')

				var item = ""
				for (item in res.data){
					
					// THESE DATES HAVE THE WRONG TIMEZONE COMING IN, SO THE RESULTING DAY CAN BE WRONG!!!!
					// CHANGE THIS!!!
					const newDate = new Date(res.data[item].forDate)
					const checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1)
				
					tempSumArray.push( checkDate )
				}
				
				Store.set(this.props.currentUser+'-'+this.state.currentCompany+'-ValidDates', {'dates':tempSumArray})
				//console.log(tempSumArray)
				
				this.setState({validSummaryDates: tempSumArray})
		})
		.catch( err => {
			console.log(err)
		});
	}
	
	getCompanyList = () => {

		// We will change this to its own function eventually...
		if (this.props.authToken == null) {
			console.log("Not logged in")
			return false
		}
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
	
		axios.get("http://10.0.0.60:8000/getUsersCompanies", config)
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
					
					this.setState({companyList: adding})
				}
				else {
					// This should not trigger
				}
			})
			.catch( err => {
				console.log(err)
			});
	}
	
	pickDate = (selectedDate) => {
		
		if (this.state.currentCompany === "None") {
			console.log("Select Valid Company!")
			return false
		}
		
		// Okay, so check to see if we HAVE the journal entry in our storage
		// If we do, show that!
	
		// Change this so that it is for the currentuser, I got that up here done, but LETS TRY
		let summaryData = Store.get(this.props.currentUser+'-'+this.state.currentCompany+'-Summary-'+selectedDate)
		
		try{
			
			// TO DO, THIS ONE!
			console.log(summaryData.content)
			console.log("Got the summary entry from storage?!")
		} catch{
			
			// So, we need to get the summary data from the server...
			// We need the company name we want here, and the user, which we have...
			
			// We will change this to its own function eventually...
			if (this.props.authToken == null) {
				console.log("Not logged in")
				return false
			}
			
			const config = {
				headers: { Authorization: `JWT ${this.props.authToken}` }
			};
			
			console.log("requesting date")
			this.setState({currentDate: selectedDate})
			
			const dateReq = selectedDate.toJSON().split("T")[0]
			
			axios.get("http://10.0.0.60:8000/getCompanySummary/?reqDate="+dateReq+"&reComp="+this.state.currentCompany, config)
			.then( 
				res => {
					// What if it is > 1?
					if (res.data.length > 0) {
						console.log("obtained a company summary")
						
						// Check for matching stuff on this end?
						//console.log(res.data[0].summaryResult)
						// Save in the cookies for non-login access...
						Store.set('testSummaryData', res.data[0].summaryResult)
						
						this.loadTestData();
						
						this.setState( {
							messages: "Showing " + this.state.currentCompany + ": Summary Entry for: " + this.state.currentDate.toString(),
							companyDisp: ">:(",
						} )
						
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
				console.log(err)
			});
		
		}
	};
	
	tileClassName = ({ date, view }) => {
		
		// Add class to tiles in month view only
		if (view === 'month') {
			
			const checkDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()
			
			//console.log(checkDate)
			//console.log(this.state.validJournalDates)

			// Check if a date React-Calendar wants to check is on the list of dates to add class to
			const hasSummary = this.state.validSummaryDates.find( element => element === checkDate)
			
			if (hasSummary) {
				return 'btn-dark';
			} else {
				return 'btn-light'
			}
			
		}
	}
	
	setCurrentCompany = (event) => {
	
		this.setState({dropMessage: event.target.value, currentCompany: event.target.value})
	}
	
	render() {
		
		var dropDownInternal = []
		
		let index;
		for (index in this.state.companyList) {
			let comp = this.state.companyList[index]
			dropDownInternal.push( 
				<button className="dropdown-item" key={index} onClick={this.setCurrentCompany} value={ comp }>
					{comp}
				</button> 
			)
		}
		
		// Entities
		var entitiesDisplay = [];
		
		if (this.state.dataEntities.length > 0) { 
			for (index in this.state.dataEntities) {
				const ent = this.state.dataEntities[index]
				
				const emotionData = getRadarEmotionData(ent.emotion)
				const sentimentData = getSentimentData(ent.sentiment)
				
				entitiesDisplay.push(
					<tr key={ent.id}>
						<th scope="row">{ent.text}</th>
						<td>{ent.type}</td>
						<td>{ent.count}</td>
						<td>{ent.relevance}</td>
						<td> <Radar ref={this.chartReference} data={emotionData} options={this.state.optionsEmotions} /> </td>
						<td> <Doughnut ref={this.chartReference} data={sentimentData} options={this.state.optionsSentiment} /> </td>
					</tr>
				)
			}
		}
		else {
			entitiesDisplay.push(
				<p>
					None Found!
				</p>
			)
		}
		
		// Keywords
		var keywordsDisplay = [];
		
		if (this.state.dataKeywords.length > 0) { 
			for (index in this.state.dataKeywords) {
				const key = this.state.dataKeywords[index]
				
				const emotionData = getRadarEmotionData(key.emotion)
				const sentimentData = getSentimentData(key.sentiment)
				
				keywordsDisplay.push(
					<tr key={key.id}>
						<th scope="row">{key.text}</th>
						<td>{key.count}</td>
						<td><Radar ref={this.chartReference} data={emotionData} options={this.state.optionsEmotions} /></td>
						<td><Doughnut ref={this.chartReference} data={sentimentData} options={this.state.optionsSentiment} /></td>
					</tr>
				)
			}
		}
		else {
			keywordsDisplay.push(
				<p>
					None Found!
				</p>
			)
		}
		
		// R E L A T I O N S
		var relationsDisplay = [];
		
		if (this.state.dataRelations.length > 0) { 
		
			for (index in this.state.dataRelations) {
				const rel = this.state.dataRelations[index]
				relationsDisplay.push(
					<tr key={rel.id}>
						<th scope="row">{rel.init}</th>
						<td>{rel.action}</td>
						<td>{rel.target}</td>
						<td>{rel.score}</td>
					</tr>
				)
			}
		}
		else {
			relationsDisplay.push(
				<p>
					None Found!
				</p>
			)
		}
		
		return (
			<div className="companyView">
				<div className="container">
					
					<div className="row">
						<div className="col-lg-3 border m-2">					
							<div>
								<Calendar 
									onChange={this.pickDate}
									value={this.state.currentDate}
									tileClassName={this.tileClassName}
									
									minDetail={'year'}
									maxDetail={'month'}
								/>
							</div>
						</div>
						<div className="col border m-2">					
							<p>{this.state.messages}</p>
							<p>{this.state.companyDisp}</p>
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
							<button onClick={this.loadTestData}> Get Summary Test </button>
						
							<button onClick={this.getCompanyList}> Get Comp List </button>
							<button onClick={this.getValidDates}> Get Valid Dates (server)</button>
							<button onClick={this.getCookiesValidDates}> Get Valid Dates (cookies)</button>
						</div>
					</div>
					
					<div className="row my-2">
						<div className="col border mx-2">
							<Radar ref={this.chartReference} data={this.state.dataEmotion} options={this.state.optionsEmotions} />
						</div>
						<div className="col border mx-2">
							<Doughnut ref={this.chartReference} data={this.state.dataSentiment} options={this.state.optionsSentiment} />
						</div>
					</div>
					<div className="row  my-2">
						<div className="col border mx-2">
							<Bar ref={this.chartReference} data={this.state.dataCategories} options={this.state.optionsCategories} />
						</div>
						<div className="col border mx-2">
							<Bar ref={this.chartReference} data={this.state.dataConcepts} options={this.state.optionsConcepts} />
						</div>
					</div>
					
					<div className="row my-2">
						<div className="col">
							<h3>Entities!</h3>
						</div>
					</div>
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Name</th>
								<th scope="col">Type</th>
								<th scope="col">#Appearances</th>
								<th scope="col">Relevance Score</th>
								<th scope="col">Emotion</th>
								<th scope="col">Sentiment</th>
							</tr>
						</thead>
						
						<tbody>
							{entitiesDisplay}
						</tbody>
					</table>
					
					<div className="row my-2">
						<div className="col">
							<h3>Keywords!</h3>
						</div>
					</div>
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Word</th>
								<th scope="col">#Appearances</th>
								<th scope="col">Emotion</th>
								<th scope="col">Sentiment</th>
							</tr>
						</thead>
						
						<tbody>
							{keywordsDisplay}
						</tbody>
					</table>
					
					<div className="row my-2">
						<div className="col">
							<h3>Relations!</h3>
						</div>
					</div>
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Thing</th>
								<th scope="col">Action</th>
								<th scope="col">Target</th>
								<th scope="col">Score</th>
							</tr>
						</thead>
						
						<tbody>
							{relationsDisplay}
						</tbody>
					</table>
					
					<div className="row  my-2">
						<p>
							PADDING
						</p>
					</div>
				</div>
			</div>
		)
	}
}

export default companyView;