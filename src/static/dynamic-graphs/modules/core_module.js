// create svg for time-series and word-cloud
var coreModule = (function(d3Object){

    var maxScreenWidth = window.innerWidth;     // width will be numeric
    var maxScreenHeight = window.innerHeight;   // height will be numeric

    console.log('inner width and height ', maxScreenWidth + '  ' + maxScreenHeight);


    function _initiateD3Graphs() {

        let default_width = document.getElementsByClassName('wordcloudcont')[0].innerWidth;
        let default_height = document.getElementsByClassName('wordcloudcont')[0].innerHeight;
    // var default_ratio = default_width / default_height;
    


        var tsSVG = d3Object.select('.time-series-container')
                            .append('svg')
                            .attr('id','timeSeriesSVG')
                            .attr('class', 'time-series-svg');


        var wcSVGLeft = d3Object.select('#cancercloud')
                            .append('svg')
                            .attr('id','wordCloudSVGLeft')
                            .style('margin', '2%')
                            .style('margin-left', '2.5%')
                            .style('margin-right', '1.5%')                            
                            .style('height', '55vh')
                            .style('padding','2%')
                            .attr("width", '92%')
                            .attr('class', 'word-series-svg');
                            // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                                    // .append('div')
        // .attr('class','wordCloudSVGLeftContainer')

        var wcSVGRight = d3Object.select('#tbcloud')
                            .append('svg')                   
                            .attr('id','wordCloudSVGRight')
                            .style('margin', '2%')
                            .style('margin-left', '1.5%')
                            .style('margin-right', '2.5%')  
                            .style('height', '55vh')
                            .style('padding','2%')
                            .attr("width", '92%')
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