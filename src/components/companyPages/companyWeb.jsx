import React from "react";
//import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import { Alert } from 'react-bootstrap';
import { Accordion, Card } from 'react-bootstrap';

//APIGetDivisionWebDates
import { APIGetDivisionWeb } from "../../utils";
import { convertScanToWidth, convertScanToColor, graphOptions } from "../../utils";
import { ShowWebInfoComponent } from "../../utils";

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import { withRouter } from "react-router-dom";
//, deleteStorageKey
//import { timedLoadStorage, timedSaveStorage} from "../../utils";

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
			
			'toSet':[ {to:1, sentiment:0.8, freq:2}, {to:2, sentiment:-0.87, freq: 4} ],
		},
		{
			'id':1,
			'name': "Premade 2",
			'isTracked': true,
			
			'toSet':[ {to:0, sentiment:0.25, freq: 5} ],
		}
	]
	
	const maxRels = 5
	const MaxWeight = 7
	const numIDs = 20
	
	for (let i = 2; i < numIDs; i++) {
		
		let toStuff = []
		for (let j = 0; j < Math.floor(Math.random()*(maxRels+1)); j++ ) {
			
			toStuff.push({
				to:Math.floor(Math.random()*(numIDs)), 
				sentiment:2*Math.random()-1,
				freq:Math.floor(Math.random()*MaxWeight),
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

//const waitTimeMS = 100
class ViewCompanyWeb extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			loadedDataDate: "None",
			loadedData: [],
			graphDataPrimary: this.GenerateGraph( [] ),
			
			selectedNodes: ["None"],
			selectedToEdges: ["None"],
			selectedFromEdges: ["None"],
			
			getWebStatus: 0,
			getDatesWebStatus: 0,
			getDatesWebError: [],
			
			selectedWebDay: new Date(),
			
			pageIsLoaded: false,
        };
		this.waitForParent = undefined;
	}
	
	componentDidMount = () => {
		
		/*
		let isLoaded = this.checkParentIsLoaded()
		if (!isLoaded) {	
			// Wait until app.js has loaded....
			this.waitForParent = setInterval(this.checkParentIsLoaded, waitTimeMS)
		}
		*/
	}
	
	checkParentIsLoaded = () => {
		if (this.props.parentHasLoaded) {
			clearInterval(this.waitForParent)
			//!! TOO MANY RESTARTS !!
			console.log("Web Has Finished Loading!")
			//this.loadFromLocalStorage()
			
			return true
		}
		else {
			return false
		}
	}
	
	loadFromLocalStorage = () => {
		//let lastWebDate = timedLoadStorage('lastGotWeb');
		let lastWebDate = 0
		
		if (lastWebDate === 0) {
			//console.log("No User In the Storage!")
		}
		else if (lastWebDate === 1) {
			//console.log("Session was expired!")
		}
		else if (lastWebDate === 2) {
			//console.log("Invalid Save!")
		}
		else {
			
			if (lastWebDate.loadedDate === "recent") {
				this.getCompanyWebRecent()
			}
			else {
				this.getCompanyWebPrevious(lastWebDate)
			}
		}
		
		this.setState({
			pageIsLoaded: true,
		})
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
			}
		}

		return defineGraph
	}
	
	selectStuffPrimary = (event) => {
		
		var { nodes, edges } = event;
		
		let selectedNodeID = -1
		
		if (nodes.length > 0) {
			
			//console.log(this.state.graphDataPrimary['nodes'])
			
			let nodeSet = []
			for(let index in nodes) {
				//console.log( this.state.graphDataPrimary['nodes'][nodes[index]] )
				nodeSet.push( 
					<div key={index}>
						{this.state.graphDataPrimary['nodes'][nodes[index]]["label"]}
					</div>
				)
				
				selectedNodeID = nodes[index]
			}
			
			this.setState({
				selectedNodes: nodeSet,
			})
		}
		else {
			this.setState({
				selectedNodes: ["None"],
			})
		}
		
		
		if (edges.length > 0) {
			
			let edgeToSet = []
			let edgeFromSet = []
			for (let index in edges) {
				
				for (let edgeIndex in this.state.graphDataPrimary['edges']) {
					let checkingIndex = this.state.graphDataPrimary['edges'][edgeIndex]["id"]
					if (edges[index] === checkingIndex) {
						
						if ( selectedNodeID === this.state.graphDataPrimary['edges'][edgeIndex]["to"] ) {
							edgeToSet.push( 
								<div key={index}>
									<div className="row">
										<div className="col"/>
										<div className="col">
											{this.state.graphDataPrimary['nodes'][this.state.graphDataPrimary['edges'][edgeIndex]["from"]]['label']}
										</div>
										<div className="col">
											{this.state.graphDataPrimary['edges'][edgeIndex]["label"]}
										</div>
										<div className="col"/>
									</div>
								</div>
							)
						}
						if ( selectedNodeID === this.state.graphDataPrimary['edges'][edgeIndex]["from"] ) {
							edgeFromSet.push( 
								<div key={index}>
									<div className="row">
										<div className="col"/>
										<div className="col">
											{this.state.graphDataPrimary['nodes'][this.state.graphDataPrimary['edges'][edgeIndex]["to"]]['label']}
										</div>
										<div className="col">
											{this.state.graphDataPrimary['edges'][edgeIndex]["label"]}
										</div>
										<div className="col"/>
									</div>
								</div>
							)
						}
						break
					}
				}
			}
			
			if (edgeToSet.length === 0) {
				edgeToSet = ["None"]
			}
			if (edgeFromSet.length === 0) {
				edgeFromSet = ["None"]
			}
			
			this.setState({
				selectedToEdges: edgeToSet,
				selectedFromEdges: edgeFromSet,
			})
		}
		else {
			this.setState({
				selectedToEdges: ["None"],
				selectedFromEdges: ["None"],
			})
		}
	}
	
	timedRefresh = () => {
		//console.log('Token Refreshed!');
	}
	
	getCompanyWebFailure = (incomingError) => {
		//console.log(incomingError)
		if (incomingError['action'] ===	 0) {
			//Network Error
		}
		else if (incomingError['action'] === 1) {
			//Unauthorized
			this.props.refreshToken(this.getCompanyWebRecent)
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
	getCompanyWebCallback = (incomingWeb) => {
		let webThing = []
		if (incomingWeb.length > 0) {
			// There should ONLY BE 1
			webThing = incomingWeb[0]["webStructure"]
		}
		this.setState({
			loadedData: webThing,
			graphDataPrimary: this.GenerateGraph( webThing ),	
			loadedDataDate: "Current",
			getWebStatus: 2,
		})
		
		// We will have to check for remember here....
		//timedSaveStorage( "lastGotWeb", {loadedDate:"recent"}, 0)
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
	
	getCompanyWebPreviousFailure = (incomingError) => {
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
	getCompanyWebPreviousCallback = (incomingWeb) => {
		let webThing = []
		let webDate = "Unknown"
		if (incomingWeb.length > 0) {
			// There should ONLY BE 1
			webThing = incomingWeb[0]["webStructure"]
			webDate = incomingWeb[0]['forDate']
		}
		
		this.setState({
			loadedData: webThing,
			graphDataPrimary: this.GenerateGraph( webThing ),	
			loadedDataDate: webDate,
			getWebStatus: 2,
		})
		
		//timedSaveStorage( "lastGotWeb", {loadedDate:webDate}, 0)
	}
	getCompanyWebPrevious = (incomingDate) => {
		if (!(this.props.currentDivisionID === -1)) {
			let checkData = undefined
			if (checkData === undefined) {

				//console.log("Division Web was not in the cookies...")
				APIGetDivisionWeb( this.props.currentDivisionID, incomingDate, this.getCompanyWebPreviousCallback, this.getCompanyWebPreviousFailure)
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
		
		this.getCompanyWebPrevious(selectedDate)
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
					hasWeb = this.props.validDivisionWebDates.find( element => element['forDate'] === checkDate)
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
			click: this.selectStuffPrimary,
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
		
		// In case I want to swap things over....
		let displayNodes = []
		displayNodes = this.state.selectedNodes
		let displayToEdges = []
		displayToEdges = this.state.selectedToEdges
		let displayFromEdges = []
		displayFromEdges = this.state.selectedFromEdges
	
		let showError = []
		for (let index in this.state.getDatesWebError) {
			showError.push(
				<div>
					{this.state.getDatesWebError[index]["text"]}
				</div>
			)
			
		}
	
		return (
			<div className="companyWebPage bg-secondary">
			
				<div className="container bg-light border">
					<div className="row">
						<div className="col">
							<button className="btn btn-secondary" onClick={this.loadData}>
								Load Example Data
							</button>
							<button className="btn btn-dark" onClick={this.getCompanyWebRecent}>
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
											<u>Selected Node(s):</u>
										</div>
									</div>
									<div className="row">
										<div className="col">
											{displayNodes}
										</div>
									</div>
								</div>
								<div className="border-top">
									<div className="row">
										<div className="col">
											<u>Edge(s) coming TO this one:</u>
										</div>
									</div>
									<div className="row">
										<div className="col">
											{displayToEdges}
										</div>
									</div>
								</div>
								<div className="border-top">
									<div className="row">
										<div className="col">
											<u>Edge(s) coming FROM this one:</u>
										</div>
									</div>
									<div className="row">
										<div className="col">
											{displayFromEdges}
										</div>
									</div>
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

export default withRouter(ViewCompanyWeb);