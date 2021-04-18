import React from "react";

class footer extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {

        };
	}
	// 
	render() {
		return (
			<div className="footer fixed-bottom">
				<footer className="py-3 bg-dark">
					<div className="container">
						<p className="m-0 text-center text-white">
							Copyright &copy; Nightingale Technologies 2021
						</p>
					</div>
				</footer>
			</div>
		);
	}
}

export default footer;