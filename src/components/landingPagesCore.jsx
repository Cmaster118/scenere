import React from "react";

import { withRouter } from "react-router-dom";

import { Header, Features, About, ContactUs, BetaContact} from "./landingPages";
// Services, Testimonials, ContactInfo,

// I honestly dont know what to put in the Free pages yet...

class FreePages extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			
        };
	}
	
	// Rendering this with Bootstrap React.... To see if there is anything really interesting I can do with it
	// So far it doesnt look all that different 
	render() {
		
		return (
			<div className="freePages">
			
				<Header />
				<BetaContact 
					APIHost={this.props.APIHost}
				/>
				<Features />
				<About />
				{/* <Services /> */}
				{/* <Testimonials /> */}
				<ContactUs 
					APIHost={this.props.APIHost}
				/>
				{/* <ContactInfo /> */}
				{/*Would this be better as an empty set?*/}
			</div>
		);
	}
}

export default withRouter(FreePages);