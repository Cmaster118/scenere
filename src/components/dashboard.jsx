import React from "react";
import { withRouter, Link } from "react-router-dom";

//import { Alert } from 'react-bootstrap'

const modeSelector = (props) => {

	return (
		<div className="defaultView">
			<div className="container">
				<div className="row my-5">
					<div className="col m-1">
					
						<div className="card shadow">
							<div className="card-header">
								<h3>
									This is an empty dashboard for the time being...
								</h3>
							</div>
							<div className="card-body">
								<Link className="list-group-item" to={props.toUserPage}>Go To User Mode</Link>
								
								{ (props.userLoadedCompanyList.length) > 0
									? <Link className="list-group-item" to={props.toCompanyPage}>Go to Company Mode</Link>
									: <div className="list-group-item">No Companies to view!</div>
								}
							</div>
						</div>
						
					</div>
				</div>
			</div>
		</div>
		
	)
}

export default withRouter(modeSelector);