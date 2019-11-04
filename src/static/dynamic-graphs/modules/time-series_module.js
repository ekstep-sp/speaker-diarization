var timeSeriesModule = (function(d3Object){

    function _getPlotLinesDefinition(dataToUse) {
        let plotLinesArray = [];
        dataToUse.forEach(function(session){
            let plotLineObject = {};
            plotLineObject['name'] = `plotline_${session.video_name}`;
            plotLineObject['value'] = d3Object.line()
                                        .x(function(d) { return x(d.name); })
                                        .y(function(d) { return y(d.progress_report); });
            plotLineObject['data'] = session.timeline;
            plotLinesArray.push(plotLineObject);
        });
        return plotLinesArray;
    }

    function _getScalingValuesForAxis(dataToUse) {
        // this function assumes the variable is a complete [] data object
        if (Array.isArray(dataToUse) && dataToUse.length > 0) {
            let returnObj = {
                x: [],
                y: [],
            }
            dataToUse.forEach(function(session){
                // combine the unique names for
                let timelineArray = [];
                let progressReportArray = [];
                // extract names for x axis and y axis
                session.timeline.forEach(function(timelineEntry){
                    if (timelineEntry.hasOwnProperty('name') && !!timelineEntry.name) {
                        timelineArray.push(timelineEntry.name);
                    }
                    if (timelineEntry.hasOwnProperty('progress_report') && timelineEntry.progress_report !== undefined) {
                        progressReportArray.push(timelineEntry.progress_report.toString());
                    }
                });
                returnObj.x = timelineArray.sort(function(a,b){return a.split('_')[1] - b.split('_'[1])});
                returnObj.y = progressReportArray.sort(function(a,b){return parseFloat(a) - parseFloat(b)});

                // set minimum and maximum value of the x and y axis
                returnObj['x_min'] = returnObj.x[0];
                returnObj['x_max'] = returnObj.x[returnObj.x.length - 1];
                returnObj['y_min'] = returnObj.y[0];
                returnObj['y_max'] = returnObj.y[returnObj.y.length - 1];
            });
            return returnObj;
        }
        else return {x: undefined,y: undefined};
    }

    function _generateTimeSeriesGraph(dataToUse, svgEl) {
        if (!!dataToUse && Array.isArray(dataToUse) && dataToUse.length > 0) {
            console.log(dataToUse);
            // detect total lines needed to plot
            
            var svgW = Math.floor(svgEl.node().getBoundingClientRect().width);
            var svgH = Math.floor(svgEl.node().getBoundingClientRect().height);
            
            // var xScale = d3Object.scaleLinear().range([0, svgW-100]);
            // var yScale = d3Object.scaleLinear().range([svgH-100, 0]);
            
            var totalPlotLines = dataToUse.length;
            console.log('total plot lines will be ', totalPlotLines);
            // define plotlines
            var plotLinesArray = _getPlotLinesDefinition(dataToUse);
            console.log(plotLinesArray);
            // create a group where graph will be displayed

           var globalGraphGroup =  svgEl.append('g').attr('width', '80%').attr('transform', 'translate('+50+','+'0)').attr('id', 'globalGraphGroup');
           // load data into the group
           var scalingObject = _getScalingValuesForAxis(dataToUse);
           
           console.log(scalingObject);

           var xScale = d3Object.scaleBand()
           .domain(scalingObject.x)
           .range([0, svgW-100]);
           
           var yScale = d3Object.scaleBand()
           .domain([scalingObject.y])
           .range([svgH-100, 0]);

            // xScale.domain([0, scalingObject.x.length]);
            // yScale.domain([0, scalingObject.y_max]);
            // finally add lines to the graph
            if(_addLinesToGraph(globalGraphGroup, plotLinesArray)) {
                _displayAxis(xScale, yScale, globalGraphGroup, svgW, svgH);
            }
            else {
                // nothing. error has been already thrown
            }

        }
        else {
            console.log('Data provided is either empty or not of array type');
        }
    }

    function _displayAxis(xAxisObj, yAxisObj, Element, svgWidth, svgHeight) {
        // render the axis
        try {
            // Add the X Axis
            Element.append("g")
               .attr('id', 'xAxisGroup')
               .attr("transform", "translate(0," + (svgHeight-30) + ")")
               .call(d3Object.axisBottom(xAxisObj));

               console.log("OKKKKK");

            // Add the Y Axis
            Element.append("g")
               .attr('id', 'yAxisGroup')
               .attr("transform", "translate(" +30+ ","+60+")" )
               .call(d3Object.axisLeft(yAxisObj));

        } catch(e) {
            console.log('error occured while rendering axis ');
            console.log(e);
        }
    }

    function _addLinesToGraph(Element, plotLinesDefinition) {
        try {
            plotLinesDefinition.forEach(function(plotlineObj){
                Element.append("path")
                          .data(plotlineObj.data)
                          .attr("class", "line")
                          .attr('stroke', 'red')
                          .attr('x', function(d){return d.name})
                          .attr('y', function(d){return d.progress_report});
        });
        return true;
    } catch(e) {
            console.log('error occured while adding lines to graph');
            console.log(e);
            return false;
        }
    }
    return {
        generateTimeSeriesGraph: _generateTimeSeriesGraph
    }
})(d3)