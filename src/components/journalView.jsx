import React from "react";
import axios from "axios";

import Store from "store"
import Calendar from 'react-calendar'
import { Doughnut, Radar, Bar } from 'react-chartjs-2';

//import {isLoggedIn} from '../utils';
import {getRadarEmotionData, getSentimentData, getConceptsData, getCategoryData} from '../utils';
import {getRadarEmotionOptions, getSentimentOptions, getConceptsOptions, getCategoryOptions} from '../utils';

class journalView extends React.Component {

	constructor(props) {
        super(props);
		
		this.state = {
			messages: "Waiting for user input...",
			journalData: "",
			
			currentDate: new Date(),
			
			// These are the dates that we know have valid Journal entries
			validJournalDates: [],
			// These are the dates that we know have a valid Journal, AND an valid AI response!
			validJournalScanDates: [],
			
			dataCategories: getCategoryData([0], ['']),
			optionsCategories: getCategoryOptions(),
			
			dataConcepts: getConceptsData([0],['']),
			optionsConcepts: getConceptsOptions(),
			
			dataEntities: [],
			dataKeywords: [],
			dataRelations: [],
			
			dataEmotion: getRadarEmotionData([0]),
			optionsEmotions: getRadarEmotionOptions(),
			
			dataSentiment: getSentimentData([0]),
			optionsSentiment: getSentimentOptions(),

        };
		
		// This doesnt look right... Fix this later I guess
		this.onChange = (editorState) => this.setState({editorState});
		this.setEditor = (editor) => {
			this.editor = editor;
		};
		
	};
	
	componentDidMount() {
		
		this.loadFromCookies();
		
	};
	
	loadFromCookies = () => {
		// Security here given our user....
		// console.log(this.props.currentUser)
		
		// Change this so that it is for the currentuser, I got that up here done, but LETS TRY
		let journalDates = Store.get(this.props.currentUser+'-ValidDates')
		
		try{
			this.setState({validJournalScanDates: journalDates.AIDates, validJournalDates: journalDates.journalDates})
			console.log("Got the journal data from the cookies")
		} catch{
			//console.log("No cookies to load the data from")
		}
	};
	
	loadTestData = () => {
		// And here is our testdata for display
		let AIdata = Store.get('testData')
		//try{
			//console.log(AIdata)
			
			// Categories!
			const catData = AIdata.categories
			
			let catLabels = []
			let catScores = []
			
			var index;
			for (index in catData) {
				const cat = catData[index]
				//console.log(cat)
				
				catLabels.push(cat.label)
				catScores.push(cat.score)
			}
			
			// Concepts!
			const conData = AIdata.concepts
			
			let conLabels = []
			let conRelevance = []
			let conDatabase = []
			
			for (index in conData) {
				const con = conData[index]
				
				conLabels.push(con.text)
				conRelevance.push(con.relevance)
				conDatabase.push(con.dbpedia_resource)
			}
			
			// Emotions!
			const emDataObj = AIdata.emotion.document.emotion
			const emData = [emDataObj.anger, emDataObj.disgust, emDataObj.fear, emDataObj.joy, emDataObj.sadness]
			
			// Entities!
			const entData = AIdata.entities
			
			let entity = []

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
			}
			
			// Keywords!
			const keyData = AIdata.keywords
			
			let keyword = []

			for (index in keyData) {
				const key = keyData[index]
				
				//console.log(key.emotion)
				//console.log(key.sentiment)
				
				const keyEmotion = [key.emotion.anger, key.emotion.disgust, key.emotion.fear, key.emotion.joy, key.emotion.sadness]
				
				const senDataScore = key.sentiment.score
				const oppData = 1-Math.abs(senDataScore)
				
				let arrangedDataScore = [0, 0]
				if (senDataScore > 0) {
					arrangedDataScore = [senDataScore, oppData]
				} else {
					arrangedDataScore = [oppData, senDataScore]
				}
				
				const keyStore = {
					id:index,
					
					text:key.text,
					count:key.count,
					relevance:key.relevance,
					
					emotion:keyEmotion,
					sentiment:arrangedDataScore,
				}
				
				keyword.push(keyStore)
			}
			
			// Relations!
			let relation = []
			
			const relDat = AIdata.relations

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

				// How do I Show this?
			}
			
			// Sentiment!
			const senDataScore = AIdata.sentiment.document.score
			
			const senOne = 0.5*(senDataScore + 1)
			const senOpp = 0.5*(senDataScore - 1)
			
			let arrangedDataScore = [senOne, senOpp]

			this.setState({
				
				dataCategories:getCategoryData(catScores, catLabels),
				dataConcepts:getConceptsData(conRelevance, conLabels),
				dataEmotion:getRadarEmotionData(emData),
				
				dataEntities: entity,
				dataKeywords: keyword,
				dataRelations: relation,
			
				dataSentiment:getSentimentData(arrangedDataScore),
				
			})
			
		//} catch{
			//console.log("Error!")
		//}
	}
	
	saveToCookies = () => {
		
		Store.set(this.props.currentUser+'-ValidDates', { journalDates:this.state.validJournalDates, AIDates:this.state.validJournalScanDates })
		console.log("Saved to cookies!")
	};
	
	getJournalDates = () => {
		
		if (this.props.authToken == null) {
			console.log("Not logged in")
			return false
		}
		
		const config = {
			headers: { Authorization: `JWT ${this.props.authToken}` }
		};
		
		// IF ANY GETS FAILS DUE TO BAD TOKEN, WE NEED TO SEND IT UP THE CHAIN TO DO SOMETHING ABOUT IT
		
		// So, this will give you EVERY SINGLE VALID ENTRY WE HAVE
		// WITHOUT. I REPEAT. WITHOUT THE JOURNAL CONTENT
		axios.get("http://10.0.0.60:8000/getJournalDates", config)
		.then( 
			res => {
				
				console.log("Got Data!")
				
				let tempAIArray = []
				let tempJoArray = []
				
				Store.remove(this.props.currentUser+'-ValidDates')

				var item = ""
				for (item in res.data){
					
					// THESE DATES HAVE THE WRONG TIMEZONE COMING IN, SO THE RESULTING DAY CAN BE WRONG!!!!
					// CHANGE THIS!!!
					const newDate = new Date(res.data[item].createdDate)
					
					const checkDate = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+(newDate.getDate()+1)
					
					if (res.data[item].hasAI) {
						tempAIArray.push( checkDate )
					} else {
						tempJoArray.push( checkDate )
					}
				}
				
				this.setState({validJournalScanDates: tempAIArray, validJournalDates: tempJoArray})
				
		})
		.catch( err => {
			console.log(err)
		});
		
		return false
	};
	
	pickDate = (selectedDate) => {
		
		// Okay, so check to see if we HAVE the journal entry in our storage
		// If we do, show that!
	
		// Change this so that it is for the currentuser, I got that up here done, but LETS TRY
		let journal = Store.get(this.props.currentUser+'-Journal-'+selectedDate)
		
		try{
			
			// TO DO, THIS ONE!
			console.log(journal.content)
			
			console.log("Got the Journal entry from storage?!")
		} catch{
			//console.log("No cookies to load the data from")
		
			// If we DONT, ask the server
			// need to be able to check if it was changed...
			// Probobly need to add a "last Edited" field...
			// And and edit history... but that is for later
			
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
			
			axios.get("http://10.0.0.60:8000/getUserJournal/?reqDate="+dateReq, config)
			.then( 
				res => {
					// What if it is > 1?
					if (res.data.length > 0) {
						console.log("obtained a journal entry")
						
						if (res.data[0].hasAI) {
							console.log("Saved to the storage")
							
							// Save in the cookies for non-login access...
							Store.set('testData', res.data[0].AIresult)
							
							this.loadTestData()
						}
						
						this.setState( {
							messages: "Showing Journal Entry for: " + this.state.currentDate.toString(),
							journalDisp: res.data[0].content,
						} )
						
					}
					else{
						console.log("No entry for that day")
						this.setState( {
							messages: "No entry for that day",
							journalDisp: "",
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
			const hasJournal = this.state.validJournalDates.find( element => element === checkDate)
			const hasAI = this.state.validJournalScanDates.find( element => element === checkDate)
			
			if (hasAI) {
				return 'btn-dark';
			} else if (hasJournal) {
				return 'btn-info'
			} else {
				return 'btn-light'
			}
			
		}
	}

	render() {
		
		// Entities
		var entitiesDisplay = [];
		
		if (this.state.dataEntities.length > 0) { 
			var index;
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
		}
		
		return (
			<div className="mainView">
				
				<div className="container">
					<div className="row ">
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
							<p>{this.state.journalDisp}</p>
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
					
					<div className="row my-2">
						<div className="col-lg-2 border mx-2">
							<p> Debug! </p>
							<button onClick={this.loadTestData}> Load Data </button>
							<button onClick={this.getJournalDates}> Get dates </button>
							<button onClick={this.saveToCookies}> Save dates </button>
							<button onClick={this.loadFromCookies}> Load dates </button>
						</div>
					</div>
					
					<div className="row  my-2">
						<p>
							PADDING
						</p>
					</div>
				</div>
				
			</div>
		);
	}
}

export default journalView;