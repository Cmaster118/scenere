import React from "react";
//import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import { Alert } from 'react-bootstrap';
import { Accordion, Card } from 'react-bootstrap';

//APIGetDivisionWebDates
import { APIGetDivisionWeb } from "../../utils";

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { withRouter } from "react-router-dom";

// How would these even work???
//import "./styles.css";
// need to import the vis network css in order to show tooltip
//import "./network.css";

const GenerateTestInfo = () => {
	
	let testInfo = [

		// These will be assembled One at a time in a storage facility...
		// Each probobly assigned their ID number in the database... That would work
		// Or a temporay one (Probobly in the negatives?) if for some reason we need to show that...
		
		// Use the sentiment as a weight....
		{
			'id':0,
			"name": "Premade 1",
			'isTracked': true,
			
			'toSet':[ {to:1, sentiment:0.8}, {to:2, sentiment:-0.87} ],
		},
		{
			'id':1,
			'name': "Premade 2",
			'isTracked': true,
			
			'toSet':[ {to:0, sentiment:0.25} ],
		}
	]
	
	const maxRels = 5
	
	const numIDs = 20
	
	for (let i = 2; i < numIDs; i++) {
		
		let toStuff = []
		for (let j = 0; j < Math.floor(Math.random()*(maxRels+1)); j++ ) {
			
			toStuff.push({
				to:Math.floor(Math.random()*(numIDs)), 
				sentiment:2*Math.random()-1,
			})
		}
		
		let trackStuff = Math.random() > 0.5
		
		testInfo.push(
			{
				'id':i,
				"name": "Random "+i,
				'isTracked': trackStuff,
				
				'toSet':toStuff,
			}
		)
	}
	
	return testInfo
}

const graphOptions = {
	nodes: {
		mass:1.1,
		shape: "box",
		//shape: "dot",
		//size: 10,
		/*
		color: {
			border:"#000000",
			background:"#FFFFFF",
		},
		*/
		//physics: false
		chosen: {
			node: function(values, id, selected, hovering) {
				values.shadow = true;
				values.color = "#AAFFAA";
				//console.log(values)
			},
			label: function(values, id, selected, hovering) {
				//console.log(values)
				values.mod = 'bold';
			}
		}
	},
	edges: {
		color: "#000000",
		arrowStrikethrough: true,
		//smooth: {"type":"curvedCW"},
		//smooth: {"type":"continuous"},
		smooth: {"type":"dynamic"},
		//physics: false,
		chosen: {
			edge: function(values, id, selected, hovering) {
				//console.log(values)
				values.shadow = true;
				values.width = 3;
			},
			label: function(values, id, selected, hovering) {
				//console.log(values)
				values.size = 20;
				values.mod = 'bold';
				//values.mod = 'italic';
				
				//values.strokeWidth = 15;
			}
		}
	},
	layout: {
		hierarchical: false
	},
	interaction:{
		hover:true,
		dragNodes: true,
	},
	physics: {
		//enabled: false,
		solver: 'barnesHut',
		maxVelocity: 50,
		minVelocity: 0.1,
		
		/*
		barnesHut: {
				gravitationalConstant: -80000, 
				springConstant: 0.001, 
				springLength: 200
			}
		*/
	},
	height: "500px"
};

const convertScanToWidth = (senti) => {
	// Sentiment goes from -1 to 1...
	return Math.abs(2*senti)+0.1
}
const convertScanToColor = (senti) => {
	
	let red = 0
	let green = 0
	let blue = 0
	
	if (senti < 0) {
		red = Math.floor(255*(-senti))
	}
	else {
		green = Math.floor(255*senti)
	}
	
	let redHex = red.toString(16)
	if (red < 15) {
			redHex = "0"+redHex
	}
	
	let greenHex = green.toString(16)
	if (green < 15) {
			greenHex = "0"+greenHex
	}
	
	let blueHex = blue.toString(16)
	if (blue < 15) {
			blueHex = "0"+blueHex
	}
	
	return "#" + redHex + greenHex + blueHex
}

class ViewCompanyWeb extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			loadedDataDate: "None",
			loadedData: [],
			graphDataPrimary: this.GenerateGraph( [] ),
			
			selectedNodes: ["None"],
			
			getWebStatus: 0,
			getDatesWebStatus: 0,
			errorMessage: "",
			
			webDates: [],
			selectedWebDay: new Date(),
        };
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
					
					label: (Math.floor(trunMulti*incomingData[index]["toSet"][indexTo]["sentiment"])/trunMulti).toString(),
					
					// length: 1,
					width: convertScanToWidth(incomingData[index]["toSet"][indexTo]["sentiment"]),
					color: convertScanToColor(incomingData[index]["toSet"][indexTo]["sentiment"]), 
					
					//length: 400,
				})
			}
		}

		return defineGraph
	}
	
	selectStuffPrimary = (event) => {
		
		var { nodes, edges } = event;
		
		if (nodes.length > 0) {
			
			let nodeSet = []
			for(let index in nodes) {
				nodeSet.push( this.state.loadedData[nodes[index]]["name"] )
			}
			
			this.setState({
				selectedNodes: nodeSet,
			})
		}
		else {
			this.setState({
				selectedNodes: "None",
			})
		}
		if (edges.length > 0) {
			//console.log("Selected Edges:")
			//console.log(edges)
		}
	}
	
	getCompanyWebFailure = (incomingError) => {
		
		if (incomingError['action'] ===	 0) {
			//Network Error
		}
		else if (incomingError['action'] === 1) {
			//Unauthorized
			this.props.refreshToken(this.getCompanyWebRecent)
			return
		}
		
		this.setState({
			getWebStatus: 3,
			errorMessage: incomingError["messages"],
		})
	}
	getCompanyWebCallback = (incomingWeb) => {
		//console.log(incomingWeb)
		
		this.setState({
			loadedData: incomingWeb["webStructure"],
			graphDataPrimary: this.GenerateGraph( incomingWeb["webStructure"] ),
			loadedDataDate: "Current",
			getWebStatus: 2,
		})
	}
	getCompanyWebRecent = () => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {
				
				//console.log("Division Web was not in the cookies...")
				APIGetDivisionWeb( this.props.currentDivisionID, undefined, this.getCompanyWebCallback, this.getCompanyWebFailure)
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
	
	// Move this up? Move it down? Think of a way to resort this!
	getDivisionWebDatesFailure = (incomingError) => {
		
		if (incomingError['action'] ===	 0) {
			//Network Error
		}
		else if (incomingError['action'] === 1) {
			//Unauthorized
			this.props.refreshToken(this.getDivisionWebDates)
			return
		}
		
		this.setState({
			getDatesWebStatus: 3,
			errorMessage: incomingError["messages"],
		})
	}
	getDivisionWebDatesCallback = (incomingDates) => {
		//console.log(incomingWeb)
		
		this.setState({
			webDates: incomingDates,
			getDatesWebStatus: 2,
		})
	}
	getDivisionWebDates = () => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {
				
				//APIGetDivisionWebDates( this.props.currentDivisionID, this.getDivisionWebDatesCallback, this.getDivisionWebDatesFailure)
				this.setState({
					getDatesWebStatus: 1,
				})
			}
			else {
				//this.getDivisionWebDatesCallback(???)
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
	}
	
	loadData = () => {
		const dert = GenerateTestInfo()
		
		// If something, set to current, if not, set to the date?
		let whenPicked = "Current"
		
		this.setState({
			loadedDataDate: whenPicked,
			loadedData: dert,
			graphDataPrimary: this.GenerateGraph( dert ),
		})
	}
	
	render() {
		
		const tileClassName = ({ date, view }) => {
	
			let hasWeb = false
			
			/*
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
			*/
		
			// Add class to tiles in month view only
			if (view === 'month') {
				// Check if a date React-Calendar wants to check is on the list of dates to add class to
				try {
					//hasWeb = props.validSummaryDates['day'].find( element => element['date'] === checkDate)
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
	
		return (
			<div className="TestStuff bg-secondary">
			
				<div className="container bg-light border">
					<div className="row">
						<div className="col">
							<button className="btn btn-secondary" onClick={this.loadData}>
								Load Example Data
							</button>
							<button className="btn btn-dark" onClick={this.getCompanyWebRecent}>
								Load (Actual) Web From Server
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
						{this.state.loadedData.length === 0 ?
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
								<div className="border-top">
									<div className="row">
										<div className="col">
											<u>Selected Nodes:</u>
										</div>
									</div>
									<div className="row">
										<div className="col">
											{this.state.selectedNodes}
										</div>
									</div>
								</div>
							</div>
						}
					</div>
					
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
					<p>
						There was an Error!
						{this.state.errorMessage}
					</p>
					<hr />
				</Alert>
			</div>
		);
	}
}

export default withRouter(ViewCompanyWeb);