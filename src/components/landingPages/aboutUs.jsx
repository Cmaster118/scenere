import React from "react";

const testLeft = (props) => {
	
	return (
		<div id='about'>
			<div className="container">
				<div className="row m-4">
					<div className="col">
						<h2 className="section-title">
							About Us
						</h2>
						<p className="text-muted section-subtitle">
							Lorem ipsum
						</p>
					</div>
				</div>
				<div className="row m-4">
					<div className="col text-muted">
						Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.
					</div>
				</div>
				<div className="row m-4">
					<h5 className="col about-subsection">
						Title of Subsection
					</h5>
				</div>
				<div className="row my-2 about-text text-muted">
					<div className="col">
						<ul>
							<li>
								Lorem ipsum dolor sit amet
							</li>
							<li>
								Lorem ipsum dolor sit amet
							</li>
							<li>
								Lorem ipsum dolor sit amet
							</li>
							<li>
								Lorem ipsum dolor sit amet
							</li>
						</ul>
					</div>
					
					<div className="col list-style">
						<ul>
							<li>
								Lorem ipsum dolor sit amet
							</li>
							<li>
								Lorem ipsum dolor sit amet
							</li>
							<li>
								Lorem ipsum dolor sit amet
							</li>
							<li>
								Lorem ipsum dolor sit amet
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
		
}

export default testLeft;