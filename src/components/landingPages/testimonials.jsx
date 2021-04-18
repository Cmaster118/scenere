import React from "react";

const testRight = (props) => {
	
	return (
		<div className="landing">
			<div className="container justify-content-center text-center">
				<div className="row m-4">
					<div className="col" />
					<div className="col">
						<h3>
							Title of Section
						</h3>
					</div>
					<div className="col" />
				</div>
				<div className="row my-2">
				
					<div id="carouselTest" className="col text-center carousel slide text-light bg-dark" data-ride="carousel">
						<ol className="carousel-indicators">
							<li data-target="#carouselTest" data-slide-to="0" className="active"></li>
							<li data-target="#carouselTest" data-slide-to="1"></li>
							<li data-target="#carouselTest" data-slide-to="2"></li>
						</ol>
						<div className="carousel-inner">
							<div className="carousel-item active">
								<img className="d-block w-100" src="" alt="First Slide" height="200"/>
							</div>
							<div className="carousel-item">
								<img className="d-block w-100" src="" alt="Second Slide" height="200"/>
							</div>
							<div className="carousel-item">
								<img className="d-block w-100" src="" alt="Third Slide" height="200"/>
							</div>
						</div>
						<a className="carousel-control-prev" href="#carouselTest" role="button" data-slide="prev">
							<span className="carousel-control-prev-icon" aria-hidden="true"></span>
							<span className="sr-only">Previous</span>
						</a>
						<a className="carousel-control-next" href="#carouselTest" role="button" data-slide="next">
							<span className="carousel-control-next-icon" aria-hidden="true"></span>
							<span className="sr-only">Next</span>
						</a>
					</div>
					
				</div>
			</div>
		</div>
	);
		
}

export default testRight;