$(document).ready(function(){
	
	"use strict";
	
	d3.svg.cols = {
		backGrey: "#f8f8f8",
		gridGrey: "#E6E6E6",
		darkGridGrey: "#4D4D4D"	
	};
  
	
	d3.svg.chart = function(selection){
		
		//Colours
		var backGrey = d3.svg.cols.backGrey;
		var gridGrey = d3.svg.cols.gridGrey;
    
		//Default values		
		var props = {
			x: 0,
			y: 0,
			xAxisOn: true,
			xLimits: [0, 100],
			xTicks: false,
			xTickFormat: false,
			xGrid: true,
			yAxisOn: true,
			yLimits: [0, 100],
			yTicks: false,
			yTickFormat: false,
			yGrid: true,
			width: 700,
			height: 500,
			xTitle: "",
			yTitle: "",
			clip: false,
			frameCol: false,
			leftMargin: 70,
			topMargin: 30
		};

		
		var chart = function(){

			var margin = {left:props.leftMargin, right:20, top:props.topMargin, bottom:60};
			var dataWidth = props.width - (margin.left + margin.right);
			var dataHeight = props.height - (margin.top + margin.bottom);
			
			var xScale = d3.scale.linear()
                    .range([margin.left,margin.left+dataWidth])
                    .domain(props.xLimits);
			
			props.xTicks = (props.xTicks!==false ? props.xTicks : xScale.ticks(5));
			
			var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickValues(props.xTicks)
                    .tickSize(6,0,0);						
	
			
			if(props.xTickFormat){
				xAxis.tickFormat(props.xTickFormat);
			}
			
			
			var yScale = d3.scale.linear()
                    .range([margin.top+dataHeight,margin.top])
                    .domain(props.yLimits);					

			props.yTicks = (props.yTicks!==false ? props.yTicks : yScale.ticks(5));				
			
			var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickSize(6,0,0);						

			if(props.yTicks){
				yAxis.tickValues(props.yTicks);
			}
			
			if(props.yTickFormat){
				yAxis.tickFormat(props.yTickFormat);
			}					
		
			var g = selection.append("g")
					     .attr("transform","translate("+props.x+","+props.y+")");

			if(props.frameCol){
				g.append("rect")
					.attr({
						"x": 0,
						"y": 0,
						"width": props.width,
						"height": props.height,
						"fill": "none",	
						"stroke": props.frameCol
					});
			}
			
			if(props.clip){
				g.append("defs")
					.append("clipPath")
					.attr("id",props.clip)
					.append("rect")
					.attr("x",margin.left)
					.attr("y",margin.top)
					.attr("width",dataWidth)
					.attr("height",dataHeight);
			}
      
      //Layers
			var outer = g.append("g").attr("class","outer");	
			var background = g.append("g").attr("class","background");
			var foreground = g.append("g").attr("class","foreground");
								
			if(props.clip){foreground.attr("clip-path","url(#" + props.clip + ")");}
	
			background.append("rect")
				.attr({
					"x": margin.left,
					"y": margin.top,
					"width": dataWidth,
					"height": dataHeight,
					"fill": backGrey,	
					"stroke": "none"								
				});

			outer.append("text")
				.attr("transform","translate(" + (margin.left + dataWidth/2) + "," + (margin.top+dataHeight) + ")")
				.attr({	
					"text-anchor": "middle",
					"dy": 45,
					"class": "xTitle"
				})
				.text(props.xTitle);
				
			outer.append("text")
				.attr("transform","translate(" + (margin.left) + "," + (margin.top+dataHeight/2) + ") rotate(-90)")
				.attr({	
					"text-anchor": "middle",
					"dy": -50
				})
				.text(props.yTitle);

			var xAxisG, yAxisG;
				
			if(props.xAxisOn){
				
				xAxisG = outer.append("g")
                  .attr("class","axis")
                  .call(xAxis)
                  .attr("transform","translate(0," + (margin.top+dataHeight) + ")")
                  .style("pointer-events","none");
								
				xAxisG.selectAll("path, line")
					.attr({
						"fill": "none",
						"stroke": gridGrey
					});
				
			}
			
			if(props.yAxisOn){
				
				yAxisG = outer.append("g")
                  .attr("class","axis")
                  .call(yAxis)
                  .attr("transform","translate(" + margin.left +" ,0)")
                  .style("pointer-events","none");
								
				yAxisG.selectAll("path, line")
					.attr({
						"fill": "none",
						"stroke": gridGrey
					});
				
			}
			
			if(props.xGrid){
				background.append("g")
					.selectAll("line")
					.data(props.xTicks)
					.enter()
					.append("line")
					.attr({
						"fill": "none",
						"stroke": gridGrey
					})
					.attr("x1",function(d){return xScale(d);})
					.attr("y1",function(d){return yScale(props.yLimits[0]);})
					.attr("x2",function(d){return xScale(d);})
					.attr("y2",function(d){return yScale(props.yLimits[1]);})	;
			}
			
			if(props.yGrid){
				background.append("g")
					.selectAll("line")
					.data(props.yTicks)
					.enter()
					.append("line")
					.attr({
						"fill": "none",
						"stroke": gridGrey
					})
					.attr("x1",function(d){return xScale(props.xLimits[0]);})
					.attr("y1",function(d){return yScale(d);})
					.attr("x2",function(d){return xScale(props.xLimits[1]);})	
					.attr("y2",function(d){return yScale(d);});
			}
			
      //Return layers and scales so we can add the actual data
			return({handle:foreground, background:background, outer:outer, scales:{xScale:xScale, yScale:yScale}});
			
		};
		
		var addGetSet = function(prop){
			chart[prop] = function(val){
				if(!arguments.length){return props[prop];}
				props[prop] = val;
				return chart;
			};
		};
		
		for (var prop in props) {
			if(props.hasOwnProperty(prop)){
				addGetSet(prop);
			} 
		}

		return chart;
		
	};
	
	
	
	//Create sliders
	var $es = $("#es div").slider({
		min: 0,
		max: 3,
		value: 1.5,
		step: 0.01,
	});

	var $prev = $("#prev div").slider({
		min: 2,
		max: 100,
		value: 2,
		step: 1,
	});
	
	var $cut = $("#cut div").slider({
		min: -4,
		max: 6,
		value: 1,
		step: 0.01,
	});	
	
	//Add data to slider handles
	(function(){

		var addProps = function($slider, id, form){
			var props = $slider.props = {};
			var format = d3.format(form);
			var span = $("#" + id + " h3 span");
			var theValue = $slider.slider("option", "value");
			props.setVal = function(val){theValue = val;};
			props.getVal = function(){return theValue;};
			props.updateSpan = function(){return span.text(format(theValue));};
			props.updateSpan(theValue);
		};		

		addProps($es, "es", ".2f");
		addProps($prev, "prev", "d");
		addProps($cut, "cut", ".2f");		
		
	})();

	
	//Process data/charts
	var process = (function(){

		var gauss = (function(){
			
			//http://stackoverflow.com/questions/14846767/std-normal-cdf-normal-cdf-or-error-function	
			var out = {};
			
			out.pdf = (function(){
			
				var pow = Math.pow;
				var gConst = 1/pow((2*Math.PI),0.5);
				
				return function(x, mu, sigma){
					mu = (typeof mu==="number") ? mu : 0;
					sigma = (typeof sigma==="number") ? sigma : 1; 
					return (gConst/sigma)*Math.exp(-0.5*pow((x-mu)/sigma,2));	
				};	
			
			})();
			
			//Adapted from science.js https://github.com/jasondavies/science.js/
			out.cdf = (function(){
				
				var erf = (function() {
					var a1 =  0.254829592;
					var a2 = -0.284496736;
					var a3 =  1.421413741;
					var a4 = -1.453152027;
					var a5 =  1.061405429;
					var p  =  0.3275911;
				
					return function(x){
						
						var sign = x < 0 ? -1 : 1;
						if (x < 0) {
							sign = -1;
							x = -x;
						}
					
						var t = 1 / (1 + p * x);
						return sign * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1)* t * Math.exp(-x * x));
					};
					
				})();
				
				return function(x, mu, sigma){
					x = (x - mu) / sigma;
    				return 0.5 * (1 + erf(x/Math.SQRT2));
				};
				
			})();
			
			return out;	
			
		})();
		
							
		var es, prev, cut;
		
		var getParameters = function(){
				es = $es.props.getVal();
				prev = 1/$prev.props.getVal();
				cut = $cut.props.getVal();
		};

		getParameters(); //initiate
		
		var distrib, roc, division;
		
		var minScore = -4;
		var maxScore = 6;
		var stepSize = 0.005;

		/*---Create the base of the chart---*/
		(function base(){
			
			//Dimensions to work from
			var theWidth = 1010;
			var theHeight = 660;
			var outerMarginSize = 40;
			
			//The actual svg element
			var svg = d3.select("#svgHolder")
                  .append("svg")
                  .attr("viewBox","0 0 " + theWidth + " " + theHeight)
                  .attr("preserveAspectRatio","xMinYMin meet");

			var resize =  (function(){
				
				var aR = theWidth/theHeight;
				var container = $("#svgHolder");
								
				return function(){
					var currentWidth = container.width();
					var currentHeight = currentWidth/aR;
										
					svg.attr("width",currentWidth)
						.attr("height",currentHeight);
				}; 
			})();
								
			resize(); //initiate
			$(window).resize(resize); //resize on window resize
			
			svg.append("rect")
				.attr("width",theWidth)
				.attr("height",theHeight)
				.attr("fill","white");
			
			//Everything else goes inside this group element	
			var main = svg.append("g")
                  .attr({
                    "font-family": "Helvetica, Arial, sans-serif",
                    "font-size": 20,
                    "fill": "rgb(50,50,50)"
                  });
			
				
			var dataArea = main.append("g")
							         .attr("transform","translate("+outerMarginSize+","+outerMarginSize+")");
			
			
			distrib = d3.svg.chart(dataArea)
                  .width(600)
                  .height(300)
                  .xLimits([minScore,maxScore])
                  .yLimits([0.0,0.4])
                  .xTicks(d3.range(-4,7,1))
                  .yTickFormat(d3.format(".1f"))
                  .xTitle("Test Score")
                  .yTitle("Probability")
                  .clip("clip_distib")();
													
			roc = d3.svg.chart(dataArea)
							.x(620)
							.width(300)
							.height(300)
							.xLimits([0,1])
              .xTicks(d3.range(0,1.25,0.25))
              .xTickFormat(function(val){return val*100;})
              .yTicks(d3.range(0,1.25,0.25))
              .yTickFormat(function(val){return val*100;})
							.yLimits([0,1])
							.xTitle("False Positive Rate (%)")
							.yTitle("Sensitivity (%)")();
									
			division = d3.svg.chart(dataArea)
                  .y(310)
                  .leftMargin(20)
                  .topMargin(80)
                  .clip("div2clip")
                  .width(930)
                  .height(270)
                  .xLimits([-0.13,1.13])
                  .xTicks(d3.range(0,1.1,0.1))
                  .xTickFormat(function(d){return d*100;})
                  .yAxisOn(false)
                  .xGrid(false)
                  .yGrid(false)
                  .yLimits([0,1])
                  .xTitle("Proportion of Positive Results (%)")();													
	  
		})();	
		

		var mean = 0;
		var sd = 1;
		
		var nasdCol = "#EF4924";  //Controls
		var asdCol = "#A43BDB"; //Autism
		var dataOpacity = 0.51; //Fill opacity of Gaussians and horizontal bars
		var coverOpacity = 0.7; //Fill opacity of "white" cover over Gaussian plot and inside horizontal bars
		var lineWidth = 3;
		
		var curvePoints = d3.range(minScore,maxScore+stepSize,stepSize);	
		
		var processDistrib = (function(){
		
			var mainLayer = distrib.handle.append("g");
			var coverLayer = distrib.handle.append("g");
			var textLayer = distrib.handle.append("g");
			
			var xScale = distrib.scales.xScale;
			var yScale = distrib.scales.yScale;
			var xMinPos = xScale.range()[0];
			var yMinPos = yScale.range()[0];
			var yMaxPos = yScale.range()[1];		
			
			var lines = {
				nasd: d3.svg.line()
                .x(function(d){return xScale(d);})
                .y(function(d){return yScale((1-prev)*gauss.pdf(d,mean,sd));}),
				asd: d3.svg.line()
              .x(function(d){return xScale(d);})
              .y(function(d){return yScale(prev*gauss.pdf(d,mean+es*sd,sd));})			
			};
			

			
			var nasdNorm = mainLayer.append("path")
                      .datum(curvePoints)
                      .attr("stroke",nasdCol)
                      .attr("fill",nasdCol)
                      .attr("fill-opacity",dataOpacity)
                      .attr("stroke-width",lineWidth);
							
			var asdNorm = mainLayer.append("path")
                      .datum(curvePoints)
                      .attr("stroke",asdCol)
                      .attr("fill",asdCol)
                      .attr("fill-opacity",dataOpacity)
                      .attr("stroke-width",lineWidth);
						
			var cover = coverLayer.append("rect")
                    .attr("x",xMinPos)
                    .attr("y",yMaxPos)
                    .attr("height",yMinPos-yMaxPos)
                    .attr({
                      "fill": "white",
                      "fill-opacity":	coverOpacity,
                      "stroke": "none"
                    });
							
			textLayer.append("text")
				.text("Controls")
				.attr("x",480)
				.attr("y",74)
				.attr({
					"fill": nasdCol,
					"font-weight": "bold",
				});
			
			textLayer.append("text")
				.text("Autism")
				.attr("x",480)
				.attr("y",105)
				.attr({
					"fill": asdCol,
					"font-weight": "bold",
				});
		
      //Require update on slider move
			var update = function(){
				nasdNorm.attr("d",function(d){return lines.nasd(d);});
				asdNorm.attr("d",function(d){return lines.asd(d);});
				cover.attr("width",xScale(cut)-xMinPos);					
			};
			
			update(); //initiate
			
			return update;
				
		})();
		
				
		var processRoc = (function(){
			
			var mainLayer = roc.handle.append("g");
			var xScale = roc.scales.xScale;
			var yScale = roc.scales.yScale;
			var markerRadius = 8.5;			

			var fprCalc = function(x){
				return 1 - gauss.cdf(x,mean,sd);				
			};
			
			var sensitivityCalc = function(x){
				return 1 - gauss.cdf(x,mean+es*sd,sd);
			};
			
			var lineFunc = d3.svg.line()
                      .x(function(d){return xScale(fprCalc(d));})
                      .y(function(d){return yScale(sensitivityCalc(d));});
				
			var rocCol = "#58bc46";

			//Reference line
			mainLayer.append("line")
				.attr("stroke",d3.svg.cols.darkGridGrey)
				.attr("fill","none")
				.attr("stroke-width",1)
				.attr("x1",xScale.range()[0])
				.attr("x2",xScale.range()[1])	
				.attr("y1",yScale.range()[0])
				.attr("y2",yScale.range()[1]);
							
			var curve = mainLayer.append("path")
                    .datum(curvePoints)
                    .attr("stroke",rocCol)
                    .attr("fill","none")
                    .attr("stroke-width",lineWidth);	
							
			var marker = mainLayer.append("circle")
                    .datum(curvePoints)
                    .attr("stroke",rocCol)
                    .attr("fill","white")
                    .attr("r",markerRadius)
                    .attr("stroke-width",lineWidth);							
			
      //Require update on slider move
			var update = function(){
				curve.attr("d",function(d){return lineFunc(d);});
				marker.attr("cx",xScale(fprCalc(cut))).attr("cy",yScale(sensitivityCalc(cut)));
			};
			
			update(); //initiate
			
			return update;	
			
		})();
	
    
		var processDivision = (function(){
			
			var mainLayer = division.handle.append("g");
			var outer = division.outer;
			var backTop = division.background.select("rect").attr("y");
			
			var titleCoords = outer.select(".xTitle")
                          .attr("transform")
                          .split("(")[1].split(")")[0].split(",");
								
			var xScale = division.scales.xScale;
			var yScale = division.scales.yScale;
			
			var tickLoc = d3.range(0,1.1,0.1);
			
			var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("top")
                    .tickValues(tickLoc)
                    .tickFormat(function(d){return Math.round(d*100);})
                    .tickSize(6,0,0);
			
			outer.append("g")
				.attr("class","axis")
				.call(xAxis)
				.attr("transform","translate(0," + backTop + ")")
				.style("pointer-events","none")
				.selectAll("path, line")
				.attr({
					"fill": "none",
					"stroke": d3.svg.cols.gridGrey
				});
				
			outer.append("text")
				.attr("transform","translate(" + titleCoords[0] + "," + 80 + ")")
				.attr({	
					"text-anchor": "middle",
					"dy": "-1.8em"
				})
				.text("Proportion of Population (%)");
				
			var labOffset = 0.0625;
			
			var barTop = yScale(0.9);
			var barBottom = yScale(0.6);
			var barHeight = -(barTop-barBottom);
			
			var barTop2 = yScale(0.4);
			var barBottom2 = yScale(0.1);
			var barHeight2 = -(barTop-barBottom);
			
			var midPoint = barBottom  + (barBottom - barTop)/2;
			
			var gridGrey = d3.svg.cols.gridGrey;
			
			mainLayer.selectAll("line.topGrid")
				.data(tickLoc)
				.enter()
				.append("line")
				.attr({
					"fill": "none",
					"stroke": gridGrey,
					"class": "topGrid"
				})
				.attr("x1",function(d){return xScale(d);})
				.attr("y1",function(d){return yScale(1);})
				.attr("x2",function(d){return xScale(d);})
				.attr("y2",function(d){return barTop;});		

			mainLayer.selectAll("line.bottomGrid")
				.data(tickLoc)
				.enter()
				.append("line")
				.attr({
					"fill": "none",
					"stroke": gridGrey,
					"class": "bottomGrid"
				})
				.attr("x1",function(d){return xScale(d);})
				.attr("y1",function(d){return yScale(0);})
				.attr("x2",function(d){return xScale(d);})
				.attr("y2",function(d){return barBottom2;});
		
			var asdBar = mainLayer.append("rect")
                    .attr("class","bar")
                    .attr("x",xScale(0))
                    .attr("y",barTop)
                    .attr("height",barHeight)
                    .attr("stroke","none")
                    .attr("fill",asdCol)
                    .attr("fill-opacity",dataOpacity);
							
			var nasdBar = mainLayer.append("rect")
                      .attr("class","bar")
                      .attr("y",barTop)
                      .attr("height",barHeight)
                      .attr("stroke","none")
                      .attr("fill",nasdCol)
                      .attr("fill-opacity",dataOpacity);			
										
							
			var asdCover = mainLayer.append("rect")
                      .attr("class","cover")
                      .attr("x",xScale(0))
                      .attr("y",barTop)
                      .attr("height",barHeight)
                      .attr("stroke","none")
                      .attr("fill","white")
                      .attr("fill-opacity",coverOpacity);
							
			var nasdCover = mainLayer.append("rect")
                        .attr("class","cover")
                        .attr("y",barTop)
                        .attr("height",barHeight)
                        .attr("stroke","none")
                        .attr("fill","white")
                        .attr("fill-opacity",coverOpacity);

			var asdOut = mainLayer.append("rect")
                    .attr("class","bar")
                    .attr("x",xScale(0))
                    .attr("y",barTop)
                    .attr("height",barHeight)
                    .attr("stroke",asdCol)
                    .attr("fill","none");
							
			var nasdOut = mainLayer.append("rect")
                      .attr("class","bar")
                      .attr("y",barTop)
                      .attr("height",barHeight)
                      .attr("stroke",nasdCol)
                      .attr("fill","none");
					
			
			mainLayer.append("text")
				.attr("transform","translate(" + xScale(-labOffset) + "," + midPoint + ")")
				.text("Autism")
				.attr("text-anchor","middle")
				.attr("fill", asdCol)
				.attr("font-weight", "bold");
				
			mainLayer.append("text")
				.attr("transform","translate(" + xScale(1+labOffset) + "," + midPoint + ")")
				.text("Controls")
				.attr("text-anchor","middle")
				.attr("fill", nasdCol)
				.attr("font-weight", "bold");
			
			var asdBar2 = mainLayer.append("rect")
                      .attr("class","bar")
                      .attr("x",xScale(0))
                      .attr("y",barTop2)
                      .attr("height",barHeight2)
                      .attr("stroke",asdCol)
                      .attr("fill",asdCol)
                      .attr("fill-opacity",dataOpacity);
							
			var nasdBar2 = mainLayer.append("rect")
                      .attr("class","bar")
                      .attr("y",barTop2)
                      .attr("height",barHeight2)
                      .attr("stroke",nasdCol)
                      .attr("fill",nasdCol)
                      .attr("fill-opacity",dataOpacity);
							
			var leftLine = mainLayer.append("line")
                      .attr("x2",xScale(0))
                      .attr("y1",barBottom)
                      .attr("y2",barTop2)
                      .attr("fill","none")
                      .attr("stroke",asdCol);

			var rightLine = mainLayer.append("line")
                        .attr("x2",xScale(1))
                        .attr("y1",barBottom)
                        .attr("y2",barTop2)
                        .attr("fill","none")
                        .attr("stroke",nasdCol);	
							
								
			//Require update on slider move
			var update = function(){
				
				var nasdAll = 1-prev;
				var nasdReject =  gauss.cdf(cut,mean,sd)*nasdAll;
				var nasdAccept =  (1-gauss.cdf(cut,mean,sd))*nasdAll;
				var asdAll = prev;
				var asdReject = gauss.cdf(cut,mean+es*sd,sd)*asdAll;
				var asdAccept = (1-gauss.cdf(cut,mean+es*sd,sd))*asdAll;
				var allpos =  nasdAccept+asdAccept;
				var tp = asdAccept/allpos;
									
				asdBar.attr("width",xScale(asdAll)-xScale(0));
					
				nasdBar.attr("x",xScale(asdAll))
					.attr("width",xScale(1)-xScale(asdAll));
				
				asdCover.attr("width",xScale(asdReject)-xScale(0));
								
				nasdCover.attr("x",xScale(1-nasdReject))
					.attr("width",xScale(nasdReject)-xScale(0));
					
				asdOut.attr("width",xScale(asdAll)-xScale(0));
					
				nasdOut.attr("x",xScale(asdAll))
					.attr("width",xScale(1)-xScale(asdAll));
					
				asdBar2.attr("width",xScale(tp)-xScale(0));
					
				nasdBar2.attr("x",xScale(tp))
					.attr("width",xScale(1)-xScale(tp));
					
				leftLine.attr("x1",xScale(asdReject));
				rightLine.attr("x1",xScale(1-nasdReject));					
									
			};
			
			update(); //initiate
			
			return update;	
			
		})();



		return function(){
			getParameters();
			processDistrib();	
			processRoc();
			processDivision();
		};
		
		
	})();
	
	process();
	
	//Set update functions for sliders
	(function(){
	
		var slideFunc = function($slider, ui){
			$slider.props.setVal(ui.value);
			$slider.props.updateSpan();
			process();	
		};
		
		$es.slider({	slide: function(evt,ui){slideFunc($es, ui);}	});		
		$prev.slider({slide: function(evt,ui){slideFunc($prev, ui);}	});
		$cut.slider({slide: function(evt,ui){slideFunc($cut, ui);}});
	
	})();
	

});
