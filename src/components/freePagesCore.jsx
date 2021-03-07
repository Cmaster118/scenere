import React from "react";

import { withRouter } from "react-router-dom";
//import { ButtonGroup, ToggleButton } from 'react-bootstrap';

//import Store from "store"

//import {makeCompanyTestData} from "../utils";

// I honestly dont know what to put in the Free pages yet...

class FreePages extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
			// hmmmm
			example: 0,
        };
	}
	
	backButton = () => {
		this.props.history.goBack()
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		return (
			<div className="freePages">
				<div className="container">
					<div className="row">
						<div className="col">
							Non-Authorized Pages
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(FreePages);