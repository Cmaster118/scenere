import React from "react";

import { Accordion, Card } from 'react-bootstrap';

class footer extends React.Component {
	
	// Imma just cheat and put this stuff here...
	constructor(props) {
        super(props);
        this.state = {
			
			ENABLEBUTTON: false,
			
			debugFlag: false,
			debugDisplay: {},
        };
	}
	
	checkDebugFlag = () => {
		return this.state.debugFlag
	}
	
	changeFlag = (inputBool) => {

		if (typeof inputBool !== "boolean" ) {
			return false
		}
		
		//setDebugMode(inputBool)
		
		this.setState({
			debugFlag: inputBool,
		})
		
		return true
	}
	
	clearDebug = () => {
		this.setState({
			debugDisplay: {},
		})
	}
	
	clearPage = (pageName) => {
		let copySet = this.state.debugDisplay
		copySet[pageName] = {}
		
		this.setState({
			debugDisplay: copySet,
		})
	}
	
	changeKey = (pageName, itemTag, itemValue) => {

		if (!this.state.debugFlag) {
			return false
		}

		let copySet = this.state.debugDisplay
		
		if (!(pageName in copySet)) {
			copySet[pageName] = {}
		}
		
		copySet[pageName][itemTag] = itemValue
		
		this.setState({
			debugDisplay: copySet,
		})
		
		return true
	}
	
	buttonTrigger = () => {
		this.changeFlag(!this.state.debugFlag)
	}

	render() {
		
		let displayDebug = []
		
		if (this.state.debugFlag) {

			let index = 0
			for (let key in this.state.debugDisplay) {
				
				let pageStuff = [
					(
						<div className="row" key={index++}>
							<div className="col">
								<u>Name</u>
							</div>
							<div className="col">
								<u>Value</u>
							</div>
						</div>
					)
				]
				
				for (let contentKey in this.state.debugDisplay[key]) {
					
					if (typeof contentKey !== "string" || typeof this.state.debugDisplay[key][contentKey] === "object") {
						continue
					}
					
					pageStuff.push(
						<div className="row" key={index}>
							<div className="col">
								{contentKey}
							</div>
							<div className="col">
								{this.state.debugDisplay[key][contentKey]}
							</div>
						</div>
					)
					index += 1
				}
				
				displayDebug.push(
					<div className="row" key={key}>
						<div className="col">
							<Accordion>
								<Accordion.Toggle as={Card.Header} className="border" variant="link" eventKey={"key"+index}>
									{key}
								</Accordion.Toggle>
								
								<Accordion.Collapse eventKey={"key"+index}>
									<div>
										{pageStuff}
									</div>
								</Accordion.Collapse>
							</Accordion>
						</div>
					</div>
				)
				index += 1
			}
		}
		
		let switchClass = "btn btn-secondary"	
		if (!this.state.debugFlag) {
			switchClass = "btn btn-outline-secondary"
		}
		
		let showClear = (this.state.ENABLEBUTTON && this.state.debugFlag)
		
		return (
			<div className="footer fixed-bottom">
				<footer className="py-3 bg-dark">
					<div className="container">

						<div className="row">
							{this.state.debugFlag ?
								<div className="col">
									<Accordion className="text-white">
										<Accordion.Toggle as={Card.Header} className="border" variant="link" eventKey={"opener"}>
											Debug Mode
										</Accordion.Toggle>
										<Accordion.Collapse eventKey={"opener"}>
											<div>
												{displayDebug}
											</div>
										</Accordion.Collapse>
									</Accordion>
								</div>
								:
								<div className="col">
									<p className="m-0 text-center text-white">
										Copyright &copy; Nightingale Technologies 2021
									</p>
								</div>
							}
							{showClear &&
								<div className="col-">
									<button className="btn btn-outline-secondary" onClick={this.clearDebug}>
										c
									</button>
								</div>
							}
							{this.state.ENABLEBUTTON &&
								<div className="col-">
									<button className={switchClass} onClick={this.buttonTrigger}>
										.
									</button>
								</div>
							}
						</div>
					</div>
				</footer>
			</div>
		);
	}
}

export default footer;