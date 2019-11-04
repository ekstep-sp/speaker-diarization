var singleTimeSeriesModule = (function(d3Object){

    var parsedData = [];

    function extractXandYaxis(dataToUse) {
        var dataObj = {
            x: [],
            y: [],
            sessionName: '',
        };

        var data = dataToUse.timeline;
        dataObj.sessionName = dataToUse.video_name;
        data.forEach(function(timeLineObj){
            if (dataObj.x.indexOf(timeLineObj.name) < 0) {
                dataObj.x.push(timeLineObj.name);
            }
            if (dataObj.y.indexOf(timeLineObj.progress_report) < 0) {
                dataObj.y.push(timeLineObj.progress_report);
            }
        });
        return dataObj;
    }

    function _generateTimeSeriesGraph(dataToUse, svgEl) {
        // function to plot a single time-series graph
        //console.log('single time series module ', dataToUse);
        // pick the first sample for example
        var sampleData = dataToUse[0];

        document.addEventListener('DOMContentLoaded', function(event){
            initiate(sampleData, svgEl);
        });
    }

    function initiate(dataToUse, svgEl) {
        parsedData = parseData(dataToUse);
        drawChart(parsedData, svgEl);
    }

    function parseData(dataToParse) {
        let data = dataToParse.timeline;
        data.forEach(function(obj){
        parsedData.push({name: obj.name, value: obj.progress_report});
        });
        console.log(parsedData);
        return parsedData;
    }

    function drawChart(dataToUse, svgEl) {
        let svgwidth = svgEl.node().getBoundingClientRect().width;
        let svgheight = svgEl.node().getBoundingClientRect().height;

        var margin = { top: 20, right: 20, bottom: 30, left: 50 };
        var width = svgwidth - margin.left - margin.right;
        var height = svgheight - margin.top - margin.bottom;

        var globalChartGroup = svgEl.append('g').attr('id', 'globalChartGroup').attr("transform","translate(" + margin.left + "," + margin.top + ")");   
        var x = d3Object.scalePoint().rangeRound([0,width]);
        var y = d3Object.scaleLinear().rangeRound([height,0]);
        var line = d3Object.line()
                           .x(function(d){
                            return x(d.name);
                           })
                           .y(function(d){
                            return y(d.value)
                           });
        x.domain(dataToUse.map(function(d){return d.name}));
        y.domain(d3Object.extent(dataToUse, function(d){return d.value}));

        // append the axis
        globalChartGroup.append("g")
                        .attr('id', 'XaxisGroup')
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3Object.axisBottom(x))
                        // .select(".domain").remove()
                        .append("text").attr("fill", "#000").attr('y',-10).attr("x", (globalChartGroup.node().getBoundingClientRect().width - 100)).attr("dx", "0em").attr("text-anchor", "start").text("Week Numbers");
        globalChartGroup.append("g").attr('id', 'YaxisGroup').call(d3Object.axisLeft(y)).append("text").attr("fill", "#000").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("Progress (numbers)");
        // append the path
        globalChartGroup.append("path").attr('id','linePath').datum(dataToUse).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 1.5).attr("d", line);
    }
    return {
        generateTimeSeriesGraph: _generateTimeSeriesGraph
    }
})(d3)