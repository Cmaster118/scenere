import React from "react";

import { Accordion, Card } from 'react-bootstrap';

import { ChevronDown } from 'react-bootstrap-icons';

export class ShowWebInfoComponent extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
		}
	}
	
	render() {
		return (
			<div className="showingWebData">
				<div className="row">
					<div className="col">
						<Accordion>
							<Accordion.Toggle as={Card.Header} className="border btn btn-outline-dark btn-block" variant="link" eventKey="open">
								<div className="row">
									<div className="col-1">

									</div>
									<div className="col">
										What am I looking at here?
									</div>
									<div className="col-1">
										<ChevronDown />
									</div>
								</div>
							</Accordion.Toggle>
							
							<Accordion.Collapse eventKey="open" className="border">
							
								<div className="row">
									<div className="col"/>
									<div className="col-">
										<p>
											This is a <u>'Contact Web'</u>
										</p>
										<p>
											Users can sync their Microsoft accounts to their Scenere account
										</p>
										<p>
											They can have their outgoing work emails scanned
											and the results tallied and displayed here
											<br />
											If you would like, press "Load Example data"
											to see what one looks like
										</p>
										<h5>
											<u>The legend is as follows:</u>
										</h5>
										<ul>
											<li>
												White labels are a tracked user
											</li>
											<li>
												Red labels are untracked users
											</li>
											<li>
												The arrows are average sentiment/Number of emails
												<br />
												Color and size is according to those values
											</li>
										</ul>
									</div>
									<div className="col"/>
								</div>
								
							</Accordion.Collapse>
							
						</Accordion>
					</div>
				</div>
			</div>
		)
	}
}