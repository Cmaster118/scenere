import React from "react";

import { withRouter } from "react-router-dom";

import { getHostName } from '../../utils';

class UserSync extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	
	render() {
		return (
			<div className="userSyncSettings">
				<div className="container">
					<div className="row">
						<div className="col">
							<div className="card shadow">
								<div className="card-header">
									Email Sync Settings
								</div>
								<div className="card-body">
									<ul className="list-group">
										<div className="list-group-item">
											Explination under construction...
										</div>
										<div className="list-group-item">
											<a href={getHostName()+"/syncHome"}>To the Email Sync Page!</a>
										</div>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(UserSync);