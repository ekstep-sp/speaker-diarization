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

        var wcSVGLeft = d3Object.select('.word-cloud-container')
                            .append('svg')
                            .attr('id','wordCloudSVGLeft')
                            .attr('class', 'word-series-svg');
                                    // .append('div')
        // .attr('class','wordCloudSVGLeftContainer')

        var wcSVGRight = d3Object.select('.word-cloud-container')
                            .append('svg')
                            .attr('id','wordCloudSVGRight')
                            .attr('class', 'word-series-svg');
        // .append('div')
        // .attr('class','wordCloudSVGRightContainer')

        var dataObject = dataModule.getDataObject();
        // send data to create time-series graph
        // timeSeriesModule.generateTimeSeriesGraph(dataObject, tsSVG);
        // send data to create word-cloud graph
        singleTimeSeriesModule.generateTimeSeriesGraph(dataObject, tsSVG);
        wordCloudModule.getD3({wcSVGLeft,wcSVGRight})
    }
    return {
        initiateD3Graphs: _initiateD3Graphs
    }
})(d3)