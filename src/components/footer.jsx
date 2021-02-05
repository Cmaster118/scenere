import React from "react";

class footer extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {

        };
	}
	// fixed-bottom
	render() {
		return (
			<div className="footer">
				<footer className="py-3 bg-dark fixed-bottom">
					<div className="container">
						<p className="m-0 text-center text-white">
							Copyright &copy; Nightingale Technologies 2020
						</p>
					</div>
				</footer>
			</div>
		);
	}
}

export default footer;