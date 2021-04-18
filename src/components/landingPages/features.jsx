import React from "react";
import { Alarm, Award, Flag, Hexagon } from 'react-bootstrap-icons';

const testAnother = (props) => {
	
	return (
		<div className="text-center" id='features'>
			<div className="container">
				<div className="row m-3">
					<div className="col">
						<h2 className="section-title">
							Features
						</h2>
						<p className="text-muted section-subtitle">
							Lorem ipsum
						</p>
					</div>
				</div>
				
				<div className="row my-2">
					<div className="col-sm-6 col-md-6 col-lg-3">
						<div className="row">
							<div className="col"/>
							<div className="col">
								<Alarm className="iconBG" color="white" size={72} />
							</div>
							<div className="col"/>
						</div>
						<div className="row">
							<div className="col">
								<h3>
									Feature Title
								</h3>
							</div>
						</div>
						<div className="row">
							<p className="col text-muted">
								Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.	
							</p>
						</div>
					</div>
					<div className="col-sm-6 col-md-6 col-lg-3">
						<div className="row">
							<div className="col"/>
							<div className="col">
								<Award className="iconBG" color="white" size={72} />
							</div>
							<div className="col"/>
						</div>
						
						<div className="row">
							<div className="col">
								<h3>
									Feature Title
								</h3>
							</div>
						</div>
						<div className="row">
							<p className="col text-muted">
								Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.	
							</p>
						</div>
					</div>
					<div className="col-sm-6 col-md-6 col-lg-3">
						<div className="row">
							<div className="col"/>
							<div className="col">
								<Flag className="iconBG" color="white" size={72} />
							</div>
							<div className="col"/>
						</div>
						<div className="row">
							<div className="col">
								<h3>
									Feature Title
								</h3>
							</div>
						</div>
						<div className="row">
							<p className="col text-muted">
								Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.	
							</p>
						</div>
					</div>
					<div className="col-sm-6 col-md-6 col-lg-3">
						<div className="row">
							<div className="col"/>
							<div className="col">
								<Hexagon className="iconBG" color="white" size={72} />
							</div>
							<div className="col"/>
						</div>
						<div className="row">
							<div className="col">
								<h3>
									Feature Title
								</h3>
							</div>
						</div>
						<div className="row">
							<p className="col text-muted">
								Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.	
							</p>
						</div>
					</div>
					
				</div>
			</div>
		</div>
	);
		
}

export default testAnother;