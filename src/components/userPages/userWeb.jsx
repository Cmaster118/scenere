import React from "react";
//import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import { Alert } from 'react-bootstrap';
import { Accordion, Card } from 'react-bootstrap';

//APIGetDivisionWebDates
import { APIGetUserWeb } from "../../utils";
import { convertScanToWidth, convertScanToColor, graphOptions } from "../../utils";
import { ShowWebInfoComponent } from "../../utils";

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { withRouter } from "react-router-dom";

// How would these even work???
//import "./styles.css";
// need to import the vis network css in order to show tooltip
//import "./network.css";

const GenerateTestInfo = () => {
	
	let toSetList = []
	
	const maxNodes = Math.floor(20*Math.random())
	for (let i = 1; i < maxNodes; i++) {
		toSetList.push(
			{"dispName":"Other User " + i, to:i, sentiment:2*Math.random()-1, freq:Math.random()*7}
		)
	}
	
	let testInfo = [{
		'id':0,
		"name": "This Users Name",
		'isTracked': true,
		
		'toSet':toSetList,
	}]
	
	return testInfo
}

class UserWeb extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			loadedDataDate: "None",
			loadedData: 0,
			graphDataPrimary: this.GenerateGraph( [] ),
			
			selectedNodes: ["None"],
			
			getWebStatus: 0,
			getDatesWebStatus: 0,
			getDatesWebError: [],
			
			selectedWebDay: new Date(),
        };
	}
	
	timedRefresh = () => {
		//console.log('Token Refreshed!');
	}
	
	GenerateGraph = (incomingData) => {
		
		let trunMulti = 100
		
		let defineGraph = {nodes:[], edges: []}
		
		for (let index in incomingData) {
			
			let borderColor = "#000000"
			let backgroundColor = "#FFF0F0"
			if (incomingData[index]["isTracked"]) {
				//borderColor = "#000000"
				backgroundColor = "#FFFFFF"
			}
			
			defineGraph["nodes"].push({ 
				id: incomingData[index]["id"], 
				label: incomingData[index]["name"],
				
				color: {
					border:borderColor,
					background:backgroundColor,
				},
			})
			
			for (let indexTo in incomingData[index]["toSet"]) {
				defineGraph["edges"].push({ 
					from: incomingData[index]["id"], 
					to: incomingData[index]["toSet"][indexTo]["to"],
					
					label: (Math.floor(trunMulti*incomingData[index]["toSet"][indexTo]["sentiment"])/trunMulti).toString() + ", " + Math.floor(incomingData[index]["toSet"][indexTo]["freq"]).toString(),
					
					// length: 1,
					width: convertScanToWidth(incomingData[index]["toSet"][indexTo]["freq"]),
					color: convertScanToColor(incomingData[index]["toSet"][indexTo]["sentiment"]), 
					
					//length: 400,
				})
				
				// Check to see if we already have the node before we go in...
				let sanityCheck = false
				for (let j in defineGraph["nodes"]) {
					if(defineGraph["nodes"][j]["id"] === incomingData[index]["toSet"][indexTo]["to"]) {
						sanityCheck = true
						break
					}
				}
				if (sanityCheck) {
					continue
				}
				
				defineGraph["nodes"].push({ 
					id: incomingData[index]["toSet"][indexTo]["to"], 
					label: incomingData[index]["toSet"][indexTo]["dispName"],
					
					color: {
						border:borderColor,
						background:"#FFF0F0",
					},
				})
			}
		}

		return defineGraph
	}
	
	selectStuffPrimary = (event) => {
		//var { nodes, edges } = event;
	}
	
	getUserWebFailure = (incomingError) => {
		//console.log(incomingError)
		if (incomingError['action'] ===	 0) {
			//Network Error
		}
		else if (incomingError['action'] === 1) {
			//Unauthorized
			this.props.refreshToken(this.getUserWebRecent)
			return
		}
		else if (incomingError['action'] === 3) {
			// Obtain error!
		}
		
		this.setState({
			getWebStatus: 3,
			getDatesWebError: incomingError["messages"],
		})
	}
	getUserWebCallback = (incomingWeb) => {
		let webThing = []
		if (incomingWeb.length > 0) {
			// There should ONLY BE 1
			webThing = incomingWeb[0]["webStructure"]
		}
		
		if (typeof(webThing) === 'object') {
			webThing = [webThing]
		}
		
		this.setState({
			loadedData: webThing.length,
			graphDataPrimary: this.GenerateGraph( webThing ),	
			loadedDataDate: "Current",
			getWebStatus: 2,
		})
	}
	getUserWebRecent = () => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {
				
				//console.log("Division Web was not in the cookies...")
				APIGetUserWeb( undefined, this.getUserWebCallback, this.getUserWebFailure)
				this.setState({
					getWebStatus: 1,
				})
			}
			else {
				//this.getCompanyWebCallback(???)
			}
		}
		else {
			this.props.history.push(this.props.reRouteTarget)
		}
	}
	
	getUserWebPreviousFailure = (incomingError) => {
		//console.log(incomingError)
		if (incomingError['action'] ===	 0) {
			//Network Error
		}
		else if (incomingError['action'] === 1) {
			//Unauthorized

			this.props.refreshToken(this.timedRefresh)
			return
		}
		else if (incomingError['action'] === 3) {
			// Obtain error!
		}
		
		this.setState({
			getWebStatus: 3,
			getDatesWebError: incomingError["messages"],
		})
	}
	getUserWebPreviousCallback = (incomingWeb) => {
		let webThing = []
		let webDate = "Unknown"
		if (incomingWeb.length > 0) {
			// There should ONLY BE 1
			webThing = incomingWeb[0]["webStructure"]
			webDate = incomingWeb[0]['forDate']
		}
		
		if (typeof(webThing) === 'object') {
			webThing = [webThing]
		}
		
		this.setState({
			loadedData: incomingWeb.length,
			graphDataPrimary: this.GenerateGraph( webThing ),	
			loadedDataDate: webDate,
			getWebStatus: 2,
		})
	}
	getUserWebPrevious = (incomingDate) => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {

				//console.log("Division Web was not in the cookies...")
				APIGetUserWeb( incomingDate, this.getUserWebPreviousCallback, this.getUserWebPreviousFailure)
				this.setState({
					getWebStatus: 1,
				})
			}
			else {
				//this.getCompanyWebPreviousCallback(???)
			}
		}
		else {
			this.props.history.push(this.props.reRouteTarget)
		}
	}
	
	// Will need to do a selected Date....
	pickDate = (selectedDate) => {
		this.setState({
			selectedWebDay:selectedDate,
		})
		
		this.getUserWebPrevious(selectedDate)
	}
	
	loadData = () => {
		const dert = GenerateTestInfo()
		
		// If something, set to current, if not, set to the date?
		let whenPicked = "Current"
		
		this.setState({
			loadedDataDate: whenPicked,
			loadedData: dert.length,
			graphDataPrimary: this.GenerateGraph( dert ),
		})
	}
	
	render() {
		
		const tileClassName = ({ date, view }) => {
	
			let hasWeb = false
			
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
					hasWeb = this.props.validUserWebDates.find( element => element['forDate'] === checkDate)
				}
				catch {
					// This should trigger if DAY is not in the validSummaryDates
					// Basically just skipping it
				}
			}
			
			if (hasWeb) {
				return 'btn btn-success'
			} else {
				//return 'btn btn-outline-dark'
			}
				
		}

		const eventsPrimary = {
			select: this.selectStuffPrimary,
		};
		
		let show0 = this.state.getWebStatus === 0
		let show1 = this.state.getWebStatus === 1
		let show2 = this.state.getWebStatus === 2
		let show3 = this.state.getWebStatus === 3
		
		let displayMessage = "Showing Current Web" 
		if (this.state.loadedDataDate === "None") {
			displayMessage = "No Data!"
		}
		else if (this.state.loadedDataDate !== "Current") {
			displayMessage = "Showing Legacy Web From: " + this.state.loadedDataDate
		}
	
		let showError = []
		for (let index in this.state.getDatesWebError) {
			showError.push(
				<div>
					{this.state.getDatesWebError[index]["text"]}
				</div>
			)
			
		}
	
		return (
			<div className="UserWebStuff bg-secondary">
			
				<div className="container bg-light border">
					<div className="row">
						<div className="col">
							<button className="btn btn-secondary" onClick={this.loadData}>
								Load Example Data
							</button>
							<button className="btn btn-dark" onClick={this.getUserWebRecent}>
								Load Most Recent Web From Server
							</button>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<Accordion>
								<Accordion.Toggle as={Card.Header} className="border" variant="link" eventKey="open">
									Get a Previous Web
								</Accordion.Toggle>
								
								<Accordion.Collapse eventKey="open">
								
									<div className="row">
										<div className="col"/>
										<div className="col-">
											<Calendar 
												onChange={this.pickDate}
												value={this.state.selectedWebDay}
												tileClassName={tileClassName}

												minDetail={'year'}
												maxDetail={'month'}
											/>
										</div>
										<div className="col"/>
									</div>
								</Accordion.Collapse>
								
							</Accordion>
						</div>
					</div>
					
					<div className="border">
						{this.state.loadedData === 0 ?
							<div className="row my-5">
								{show0 && <div className="col">Waiting for signal to get data</div>}
								{show1 && <div className="col">Getting Data...</div>}
								{show2 && <div className="col">Server reported no web!</div>}
							</div>
							:
							<div>
								<div>
									<div className="row">
										<div className="col">
											<u>{displayMessage}</u>
										</div>
									</div>
									<Graph
										graph={this.state.graphDataPrimary}
										options={graphOptions}
										events={eventsPrimary}
										getNetwork={network => {
											//  if you want access to vis.js network api you can set the state in a parent component using this property
										}}
									/>
								</div>
							</div>
						}
					</div>
					<ShowWebInfoComponent/>
					
				</div>
				
				<Alert show={show1} variant="warning">
					<Alert.Heading>Waiting</Alert.Heading>
					<hr />
					<p>
					  Waiting for server...
					</p>
					<hr />
				</Alert>
				
				<Alert show={show3} variant="danger">
					<Alert.Heading>Error!</Alert.Heading>
					<hr />
						{showError}
					<hr />
				</Alert>
			</div>
		);
	}
}

export default withRouter(UserWeb);