import React from "react";

const ContactNotEmail = (props) => {
	
	return (
		<div id="contact">
			<div className="container">
				<div className="row m-4">
					<div className="col">
						<div className="col" />
						<div className="col-10">
							<h3>
								Contact Info
							</h3>
						</div>
						<div className="col" />
					</div>
				</div>
				<div className="row m-2">
					
					<div className="col-md-4 offset-1">
						<h5>
							Address
						</h5>
						<span>
							Address Here
						</span>
					</div>
					
				</div>				
				<div className="row m-2">
					
					<div className="col-md-4 offset-1">
						<h5>
							Phone
						</h5>
						<span>
							Phone Here
						</span>
					</div>
					
				</div>				
				<div className="row m-2">
					
					<div className="col-md-4 offset-1">
						<h5>
							Email
						</h5>
						<span>
							Email Here
						</span>
					</div>
					
				</div>
			</div>
		</div>
	);
		
}

export default ContactNotEmail;