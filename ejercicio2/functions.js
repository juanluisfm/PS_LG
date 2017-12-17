var chartData = {};
var pieData = {};
var sumTotal = 0;

function getData1(data) {
	for (var i = 0; i < data.length; i++) {
		var cat = data[i].cat.toUpperCase();
		var val = data[i].value;
		var date = data[i].d;
		
		if (chartData[cat]) {
			var dateData = [date, val];
			var serieData = chartData[cat];
			serieData[serieData.length] = dateData;
			pieData[cat] = pieData[cat] + val;
		} else {
			var dateData = [[date, val]];
			chartData[cat] = dateData;
			pieData[cat] = val;
		}
		
		sumTotal += val;
	}
}

function getData2(data) {
	for (var i = 0; i < data.length; i++) {
		var cat = data[i].categ.toUpperCase();
		var val = data[i].val;
		var date = new Date(data[i].myDate).getTime();
		
		if (chartData[cat]) {					
			var dateData;
			var serieData = chartData[cat];
			
			var index = contains(date, serieData);
			
			if (index != -1) {
				dateData = serieData[index];
				dateData[1] = dateData[1] + val;
			} else {
				dateData = [date, val];
				serieData[serieData.length] = dateData;
			}
			
			pieData[cat] = pieData[cat] + val;
		} else {
			var dateData = [[date, val]];
			chartData[cat] = dateData;
			pieData[cat] = val;
		}
		
		sumTotal += val;
	}
}

function getData3(data) {
	for (var i = 0; i < data.length; i++) {
		var raw = data[i].raw;
		var val = data[i].val;
		var date = new Date(getDate(raw)).getTime();
		var cat = getCategory(raw).toUpperCase();
		
		if (chartData[cat]) {					
			var dateData;
			var serieData = chartData[cat];
			
			var index = contains(date, serieData);
			
			if (index != -1) {
				dateData = serieData[index];
				dateData[1] = dateData[1] + val;
			} else {
				dateData = [date, val];
				serieData[serieData.length] = dateData;
			}
			
			pieData[cat] = pieData[cat] + val;
		} else {
			var dateData = [[date, val]];
			chartData[cat] = dateData;
			pieData[cat] = val;
		}
		
		sumTotal += val;
	}
}

function getDate(raw) {
	var regExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
	var match = regExp.exec(raw);
	return match[0];
}

function getCategory(raw) {
	var regExp = /(#CAT \d*#)/
	var match = regExp.exec(raw);
	return match[0].substring(1,match[0].length-1);
}

function contains(date, serieData) {
	var exists = false;
	var i = 0;
	
	while (i < serieData.length && !exists) {
		exists = serieData[i][0] == date;
		
		if (!exists) {
			i++;
		}
	}
	
	if (!exists) {
		i = -1;
	}
	
	return i;
}

function Comparator(a, b) {
	if (a[0] < b[0]) return -1;
	if (a[0] > b[0]) return 1;
	return 0;
}

function readData() {

	$.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data1.json', function(data) {
		
		getData1(data);
	
		$.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data2.json', function(data2) {
			getData2(data2);
			
			$.getJSON('http://s3.amazonaws.com/logtrust-static/test/test/data3.json', function(data3) {
				getData3(data3);
				
				var series = [];
				var pieSeries = [];
								
				for (var category in chartData) {
					var array = chartData[category];
					array = array.sort(Comparator);
				
					series[series.length] = {
						name: category,
						data: chartData[category]
					}
					
					pieSeries[pieSeries.length] = {
						name: category,
						y: (pieData[category]/sumTotal)*100
					}
				}
				
				var chart1 = Highcharts.chart('chart1', {
					chart: {
						type: 'line'
					},
					title: {
						text: 'Chart 1'
					},
					xAxis: {
						type: 'datetime'
					},
					series: series
				});
				
				var chart2 = Highcharts.chart('chart2', {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie'
					},
					title: {
						text: 'Pie Chart'
					},
					series: [{
						name: 'Categories',
						colorByPoint: true,
						data: pieSeries
					}]
				});
			});
		});
		
	});
	
	
}