(function (d3) {
    
    var w = $("#graphContainer").width();
    var h = $("#graphContainer").height();
    
    var svg = d3.select("#graphContainer")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var videoID = urlHandler.videoIdToLoad;
    
    // retrieve commonly used string
    var varConfig = variablesConfig;

    function _setClickListenerOnStart(data) {
        // set the click event on the button
        document.getElementById('startBtn').addEventListener('click', function ($event) {
            // remove the node details initially
            let coreEl = $('.node-details');
            coreEl.css('opacity', 0);
            // activate the svg and remove the text message display...
            d3.select('.initialText')
                .style('display', 'none');
            // start the sequence
            d3.selectAll("svg > *").remove();
            sliderModule.moveSlider(0);
            StartLoop(data);
        });
    }

    dataModule.getGraphData(videoID, h,w, function (data) {
        if (data) {
            sliderModule.setSlider(data);
            // update the data sequence for hubs
            dataModule.updateHubs(data);

            // set click event on the start / analyze button
            _setClickListenerOnStart(data)

        } else if (data === undefined) {
            console.log('An error occured while readingdata in the index.js')
        }
    })

    function _scrollToBottom(container) {
        $(`.${container}`).css('display', 'block');
        let pos = $(`.${container}`).offset().top;
        
        $('body, html').animate({
            scrollTop: pos
        }, 'slow');
    }

    function StartLoop(dataToLoop, intervalTimeout = varConfig.DEFAULT_INTERVAL_TIMEOUT) {
        let index = -1;
        let totalIterations = dataToLoop.length;

        let interval = window.setInterval(function () {
            index += 1;

            if (index >= totalIterations) {
                // stop iterations
                console.log('sequence complete');
                toolbarModule.updateNodeDetails(-1);
                window.clearInterval(interval);
                interval = undefined;
                // scroll to images
                let imageContainerSectionID = +urlHandler.videoIdToLoad + 1;

                $(`#imageContainer_${imageContainerSectionID}`).css('display', 'block');
                
                _scrollToBottom('imageSection');
                return;
            }

            // below will run as long as thesequence is not completed
            nodeModule.createNode(dataToLoop[index], svg);

            sliderModule.moveSlider(index);

            toolbarModule.updateNodeDetails(dataToLoop[index])
            // will enter only if the node has spoken after some other node
            if (dataToLoop[index].ia !== null && dataToLoop[index].ia !== -1) {
                let currentNode;
                let previousData;
                // if both the previous and current nodes are hub
                if (dataToLoop[index - 1].ptype.toLowerCase() == varConfig.HUB && dataToLoop[index].ptype.toLowerCase() == varConfig.HUB) {
                    // do nothing
                    return;
                }
                // else if previous node is hub but current node is not a hub (can be spoke / subhub / subspoke etc)
                else if (dataToLoop[index - 1].ptype.toLowerCase() == varConfig.HUB && dataToLoop[index].ptype.toLowerCase() !== varConfig.HUB) {
                    // set current node as the current and previous node as the mainHub of the graph
                    currentNode = dataToLoop[index];
                    previousData = dataModule.getGraphHub();
                    
                    // relation will be created from current to previous node (here previous is MainHub)
                    relationshipModule().createRelation({
                        svgelem: svg,
                        weight: dataToLoop[index].ci_no,
                        x1: currentNode.x,
                        y1: currentNode.y,
                        x2: previousData.x,
                        y2: previousData.y
                    });

                } 
                // else if current node is hub but the previous is not a hub
                else if (dataToLoop[index].ptype.toLowerCase() == varConfig.HUB && dataToLoop[index - 1].ptype.toLowerCase() !== varConfig.HUB) {

                    // previous will remain the previous but current will become the mainHub
                    previousData = dataToLoop[index - 1];
                    currentNode = dataModule.getGraphHub();

                    // relation will be created from mainHub to previous node (non hub)
                    relationshipModule().createRelation({
                        svgelem: svg,
                        weight: dataToLoop[index].ci_no,
                        x1: currentNode.x,
                        y1: currentNode.y,
                        x2: previousData.x,
                        y2: previousData.y
                    });
                }
                // if the current is not a hub (spoke / subhub / subspoke etc) and the previous is also not a hub (spoke / subhub / subspoke etc) 
                else {
                    // current will remain the current non hub and previous will remain the previous non hub
                    currentNode = dataToLoop[index];
                    previousData = dataToLoop[index - 1];
                    // relation will be created from current non-hub to previous non-hub
                    relationshipModule().createRelation({
                        svgelem: svg,
                        weight: dataToLoop[index].ci_no,
                        x1: currentNode.x,
                        y1: currentNode.y,
                        x2: previousData.x,
                        y2: previousData.y
                    });

                }

                currentNode = dataToLoop[index];
                previousData = dataToLoop[index - 1];

                relationshipModule().createRelation({
                    svgelem: svg,
                    weight: dataToLoop[index].ci_no,
                    x1: currentNode.x,
                    y1: currentNode.y,
                    x2: previousData.x,
                    y2: previousData.y
                });

            }
        }, intervalTimeout)
    }
})(d3);