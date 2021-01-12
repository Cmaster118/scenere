import React from "react";
// import axios from "axios";

import Store from "store"

class landing extends React.Component {

	// Lets test this out, before we move this over to the App js file
	constructor(props) {
        super(props);
		this.chartReference = React.createRef();
		
        this.state = {
			userToken: null,
        };
	}
	
	getFromCookies = () => {
		Store.get('rememberSomething')
	};
	
	render() {
	
		return (
			<div className="landing">
				<div className="container">
					<div className="row align-items-center my-5">
						<div className="col-lg-12">
							<h3>
								Sample Title
							</h3>
						</div>
					</div>
					<div className="row align-items-center my-2">
						<div class="col-lg-7">
							<img
							class="img-fluid rounded mb-4 mb-lg-0"
							src="http://placehold.it/900x400"
							alt=""
							/>
						</div>
						<div className="col m-5 ">
							<p>
								Explainations ahoy!
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default landing;