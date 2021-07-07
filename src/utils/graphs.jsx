// First version of a Line graph with Arbitrary everything...
export const arbitraryLineData = (inputXAxis, inputDataList) => {
	
	let builtData = []
	let dataIndex = 0
	for (dataIndex in inputDataList) {
		builtData.push({
			label: inputDataList[dataIndex].label,
			data: inputDataList[dataIndex].data,
			fill: false,
			backgroundColor: 'rgb(99, 255, 132)',
			borderColor: 'rgba(255, 132, 99, 0.2)',
		})
	}
	
	const data = {
		labels: inputXAxis,
		datasets: builtData,
	}
	
	return data
}

export const arbitraryLineOptions = () => {
	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	}
	
	return options
}

// Initial tests show good results, So I should merge these into as few functions as I can....
// Right now its too many...
export const getRadarEmotionData = (inputData) => {
	
	const data = {
		labels: ['Joy', 'Anger', 'Sadness', 'Disgust', 'Fear'],
			datasets: [ 
			{
				label: 'Confidence Levels',
				data: inputData,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getRadarEmotionOptions = () => {
	const options = {
	  scale: {
		ticks: { 
			beginAtZero: true,
			suggestedMin: 0,
			suggestedMax: 1,
		},
	  },
	}
	
	return options
}

export const getSentimentData = (inputData) => {
	const data = {
	labels: ['Positive', 'Negative'],
	datasets: [
			{
			label: ['Sentiment'], 
			data: inputData,
			backgroundColor: [
				'rgba(99, 255, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(99, 255, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getSentimentOptions = () => {
	const options = {
		cutoutPercentage: 50,
	}
	
	return options
}

export const getConceptsData = (inputData, labels) => {
	const data = {
	labels: labels,
	datasets: [
			{
			label: 'Concepts Relevance',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getConceptsOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}

// This can probobly be merged with the other one... but it is here for perhaps a color shift?
export const getCategoryData = (inputData, labels) => {
	const data = {
	labels: labels,
	datasets: [
			{
			label: 'Categories Score',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getCategoryOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}

// Now we can test to see how this would actually look.
export const testMaxMin = (inputMax, inputAve, inputMin) => {
	const data = {
		labels: ['Joy', 'Anger', 'Sadness', 'Disgust', 'Fear'],
			datasets: [ 
			{
				label: 'Max',
				data: inputMax,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
			{
				label: 'Ave',
				data: inputAve,
				backgroundColor: 'rgba(99, 132, 255, 0.2)',
				borderColor: 'rgba(99, 132, 255, 1)',
				borderWidth: 1,
			},
			{
				label: 'Min',
				data: inputMin,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

// How can I make this not terrible back here?
export const testBarMulti = (inputData) => {
	const data = {
	labels: ['Joy', 'Anger', 'Sadness', 'Disgust', 'Fear'],
	datasets: [
			{
			label: '# Above Threshold',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}
export const testBarMultiOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}

export const stackedBarData = (inputData1, inputData2, inputData3) => {
	const data = {
		labels: ['Value'],
		datasets: [
			{
				label: 'Minimum',
				data: inputData1,
				backgroundColor: 'rgb(255, 99, 132)',
			},
			{
				label: 'Average',
				data: inputData2,
				backgroundColor: 'rgb(54, 162, 235)',
			},
			{
				label: 'Maximum',
				data: inputData3,
				backgroundColor: 'rgb(75, 192, 192)',
			},
		],
	}
	
	return data
}
export const stackedBarOptions = () => {
	const options = {
		scales: {
			yAxes: [
				{
					//stacked: true,
					ticks: {
						beginAtZero: true,
						suggestedMin: -1,
						suggestedMax: 1,
					},
				},
			],
			xAxes: [
				{
					//stacked: true,
				},
			],
		},
	}
	
	return options
}

export const stacked1BarData1Data = (inputData) => {
	const data = {
		labels: ['Value'],
		datasets: [
			{
				label: 'Value',
				data: inputData,
				backgroundColor: 'rgb(54, 162, 235)',
			},
		],
	}
	
	return data
}

export const stackedBarData2Test = (inputData1, inputData2, inputData3) => {
	const data = {
		labels: ['Relevance', 'Sentiment'],
		datasets: [
			{
				label: 'Minimum',
				data: inputData1,
				backgroundColor: 'rgb(255, 99, 132)',
			},
			{
				label: 'Average',
				data: inputData2,
				backgroundColor: 'rgb(54, 162, 235)',
			},
			{
				label: 'Maximum',
				data: inputData3,
				backgroundColor: 'rgb(75, 192, 192)',
			},
		],
	}
	
	return data
}

export const stacked2BarData1Data = (inputData) => {
	const data = {
		labels: ['Relevance', 'Sentiment'],
		datasets: [
			{
				label: 'Value',
				data: inputData,
				backgroundColor: 'rgb(54, 162, 235)',
			},
		],
	}
	
	return data
}

export const stackedBarData3Test = (inputData1, inputData2, inputData3) => {
	const data = {
		labels: ['Confidence', 'Relevance', 'Sentiment'],
		datasets: [
			{
				label: 'Minimum',
				data: inputData1,
				backgroundColor: 'rgb(255, 99, 132)',
			},
			{
				label: 'Average',
				data: inputData2,
				backgroundColor: 'rgb(54, 162, 235)',
			},
			{
				label: 'Maximum',
				data: inputData3,
				backgroundColor: 'rgb(75, 192, 192)',
			},
		],
	}
	
	return data
}

export const stacked3BarData1Data = (inputData) => {
	const data = {
		labels: ['Confidence', 'Relevance', 'Sentiment'],
		datasets: [
			{
				label: 'Value',
				data: inputData,
				backgroundColor: 'rgb(54, 162, 235)',
			},
		],
	}
	
	return data
}


export const sentimentBarData = (inputData) => {
	const data = {
		labels: ['Positive', 'Negative'],
		datasets: [
			{
			label: '# Above Threshold',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}
export const sentimentBarOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}

export const frequencyBarData = ( inputData ) => {
	
	//console.log(inputData)
	
	let labelsSet = []
	let dataSet = []
	for (let index in inputData) {
		labelsSet.push( index )
		dataSet.push( inputData[index] )
	}
	
	const data = {
		labels: labelsSet,
		datasets: [
			{
			label: ['# Obtained'],
			data: dataSet,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}
export const getBarOptionsFreq = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						//suggestedMax: 1,
					},
				},
			],
		},
	}
	
	return options
}

// -------------------------------This is where my template stuff is ---------------------------------------------------------------
export const getDoughData = (inputData) => {
	const data = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [
			{
				label: '# of Votes',
				data: inputData,
				backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
				borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getDoughOptions = () => {
	const options = {
		cutoutPercentage: 50,
	}
	
	return options
}

export const getRadarData = (inputData) => {
	const data = {
		labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
			datasets: [ 
			{
				label: '# of Votes',
				data: inputData,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getRadarOptions = () => {
	const options = {
	  scale: {
		ticks: { beginAtZero: true },
	  },
	}
	
	return options
}

export const getLineData = (inputData, inputData2) => {
	const data = {
		labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
			datasets: [ 
			{
				label: '# of Votes',
				data: inputData,
				fill: false,
				backgroundColor: 'rgb(99, 255, 132)',
				borderColor: 'rgba(99, 255, 132, 0.2)',
			},
			{
				label: '# of Votes2',
				data: inputData2,
				fill: false,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			},
		],
	}
	
	return data
}

export const getLineOptions = () => {
	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	}
	
	return options
}

export const getBarData = (inputData) => {
	const data = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [
			{
			label: '# of Votes',
			data: inputData,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getBarOptions = () => {
	const options = {
		scales: {
			yAxes: [{
					ticks: {
						beginAtZero: true,
						
					},
				},
			],
		},
	}
	
	return options
}

export const getScatterData = (inputData, inputData2) => {
	const data = {
		labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
			datasets: [ 
			{
				label: '# of Votes',
				data: inputData,
				backgroundColor: 'rgba(99, 255, 132, 0.2)',
				borderColor: 'rgba(99, 255, 132, 1)',
				borderWidth: 1,
			},
			{
				label: '# of Votes2',
				data: inputData2,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			},
		],
	}
	
	return data
}

export const getScatterOptions = () => {
	const options = {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true,
				},
			},],
		},
	}
	
	return options
}
