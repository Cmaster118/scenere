import React from "react";

const Header = (props) => {
	
	return (
		<header className="header">
			<div className='intro'>
				<div className='overlay'>
					<div className="container">
						<div className="row">
							<div className="col col-md-offset-2 intro-text">
								<h1>
									Project Scenere
								</h1>
								<h5>
									Welcome to the Alpha!
								</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
		
}

export default Header;