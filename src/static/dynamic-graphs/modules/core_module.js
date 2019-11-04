// create svg for time-series and word-cloud
var coreModule = (function(d3Object){

    var maxScreenWidth = window.innerWidth;     // width will be numeric
    var maxScreenHeight = window.innerHeight;   // height will be numeric

    console.log('inner width and height ', maxScreenWidth + '  ' + maxScreenHeight);

    function _initiateD3Graphs() {
        var tsSVG = d3Object.select('.time-series-container')
                            .append('svg')
                            .attr('id','timeSeriesSVG')
                            .attr('class', 'time-series-svg');

        var wcSVG = d3Object.select('.word-cloud-container')
                            .append('svg')
                            .attr('id','wordCloudSVG')
                            .attr('class', 'word-series-svg');

        var dataObject = dataModule.getDataObject();
        // send data to create time-series graph
        // timeSeriesModule.generateTimeSeriesGraph(dataObject, tsSVG);
        // send data to create word-cloud graph
        singleTimeSeriesModule.generateTimeSeriesGraph(dataObject, tsSVG);
    }
    return {
        initiateD3Graphs: _initiateD3Graphs
    }
})(d3)