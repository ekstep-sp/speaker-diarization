var dataModule = (function (d3) {

    var videoInfo;
    var graphHubID;
    var graphHub;
    var varConfig = variablesConfig;

    function _getVideoInfoInDB() {
        return videoInfo;
    }
    function _storeVideoInfo(dataToStore) {
        videoInfo = dataToStore;
    }


    function _getDataFromId(videIdToFetch, dataToUse) {
        // the function will return the data object or -1
        console.log('video to fetch is', videIdToFetch);
        console.log('data to use is ', dataToUse);
        // extract videos (for request coming from nestJS)
        dataToUse = dataToUse.data;

        let fetchedVideo = dataToUse.videos.filter(function (filter) {
            return filter.id == videIdToFetch;
        });

        if (fetchedVideo.length !== 0) {
            return fetchedVideo;
        } else {
            // alert('invalid or non existent video id provided');
            return -1;
        }
    }
    var reduceSumCiGraph = function (data) {

        var cum_grphno;
        var cum_cdoi;
        data.forEach((element, i) => {

            if (i == 0) {
                cum_grphno = parseInt(element.ci_graph);
                cum_cdoi = parseInt(element.cdoi);
            } else if (element.ptype.toLowerCase() == varConfig.HUB) {
                cum_grphno = cum_grphno + 1;
                cum_cdoi = cum_cdoi + parseInt(element.cdoi);
                element.ci_graph = cum_grphno / 2
                element.cdoi = cum_cdoi;
            }
        });
        return data;

    }
    var filterdata = function (data) {
        var flags = [],
            output = [],
            l = data.length,
            i;
        for (i = 0; i < l; i++) {
            if (flags[data[i].pid]) continue;
            flags[data[i].pid] = true;
            output.push(data[i]);
        }
        return output
    }

    var _getGraphHubID = function () {
        return graphHubID;
    }

    var _getGraphHub = function () {
        return graphHub;
    }
    // update the hub id for the complete data
    var _updateHubsForGraph = function (graphData) {
        // find the first hub and store its id

        graphHub = graphData.find(function (node) {
            return node.ptype.toLowerCase() == varConfig.HUB
        });
        if (graphHub) {
            console.log(graphHub);

            graphHubID = graphHub.pid;
        } else {
            // alert('Error : There is no hub present in the graph, please load a correct dataset');
            console.log("it appears there is no hub in the database, application won't run properly");
        }
    }


    var _filterUniqueNodes = function (dataToFilter) {
        return filterdata(dataToFilter)
    }

    function merge(a, b, prop) {
        var reduced = a.filter(function (aitem) {
            return !b.find(function (bitem) {

                if (aitem[prop] === bitem[prop]) {

                    aitem['x'] = bitem['x'];
                    aitem['y'] = bitem['y'];
                };

                return aitem[prop] === bitem[prop];
            });
        });
        return a;
    }



    var createAxis = function (numNodes, radius, networkdata, contwidth, contheight) {
        var centerX = contwidth / 2;
        var centerY = contheight / 2;
        var width = contwidth,
            height = contheight,
            angle,
            x,
            y,
            i;
        var flags = {};

        // to find out exactly how many nodes needed to place and set their coordinates
        let uniqueNodes = _filterUniqueNodes(networkdata)
        // set coordinates
        numNodes = uniqueNodes.length;

        for (i = 0; i < numNodes; i++) {

            angle = (i / (numNodes / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
            // For a semicircle, we would use (i / numNodes) * Math.PI.
            if (flags[uniqueNodes[i].pid]) {
                uniqueNodes[i]["x"] = flags[uniqueNodes[i].pid]["x"]
                uniqueNodes[i]["y"] = flags[uniqueNodes[i].pid]["y"]
                continue;
            }
            if (i == 0) {
                // assuming that the first node is ALWAYS 'hub'
                flags[uniqueNodes[i]["pid"]] = {
                    "status": true,
                    "x": centerX - varConfig.NODE_SIZE.HUB.X_OFFSET,
                    "y": centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
                }
                flags[uniqueNodes[i]["ptype"].toLowerCase()] = {
                    "x": centerX - varConfig.NODE_SIZE.HUB.X_OFFSET,
                    "y": centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
                }
                uniqueNodes[i]["x"] = centerX - varConfig.NODE_SIZE.HUB.X_OFFSET;
                uniqueNodes[i]["y"] = centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
            } else {
                // no new coordinates to another node of type 'hub' is allowed to sit in graph
                if (uniqueNodes[i].ptype.toLowerCase() == varConfig.HUB && !!flags[uniqueNodes[i]["ptype"].toLowerCase()]) {
                    // set coordinates of original hub
                    x = flags[uniqueNodes[i]["ptype"].toLowerCase()].x
                    y = flags[uniqueNodes[i]["ptype"].toLowerCase()].y
                }else{
                    x = Math.round(width / 2 + radius * Math.cos(angle) - varConfig.NODE_SIZE.NON_HUB.X_OFFSET);
                    y = Math.round(height / 2 + radius * Math.sin(angle) - varConfig.NODE_SIZE.NON_HUB.Y_OFFSET);
                }

                flags[uniqueNodes[i].pid] = {
                    "status": true,
                    "x": x,
                    "y": y
                }
                uniqueNodes[i]["x"] = x;
                uniqueNodes[i]["y"] = y;
            }
        }
        // set the defined nodes to all the duplicates
        var mergedData = merge(networkdata, uniqueNodes, 'pid');
        return mergedData;
    }

    function _fetchVideoDetails(videoData) {
        if (Array.isArray(videoData) && videoData.length) {
            let videoObj = [];
            videoData.forEach(function(video){
                let id = video.id;
                let name = video.vname;

                videoObj.push({id,name});
            });
            _storeVideoInfo(videoObj);
        }
        return [];
    }


    function _prepareGroupsObject(dataToUse, mainHub) {
        // this function will look for all the unique hubs and assign them their respective groups
        let newGroup = {}
        // assign a group to the main hub
        newGroup[`group_${mainHub.pid}`] = {};
        newGroup[`group_${mainHub.pid}`]['type'] =  varConfig.HUB;
        newGroup[`group_${mainHub.pid}`]['spokes'] = [];
        newGroup[`group_${mainHub.pid}`]['node'] = mainHub;
        dataToUse.forEach(function(node){
            if (node.ptype.toLowerCase() !== varConfig.SPOKE && node.ptype.toLowerCase() !== varConfig.SUBSPOKE && !newGroup.hasOwnProperty(`group_${node.pid}`)) {
                newGroup[`group_${node.pid}`] = {type: varConfig.SUBHUB, spokes: [], node};
            }
        });
        return newGroup;
    }

    function _findNode(data, node) {
        let previousID = node.ia;
        return data.find(function(Node){
            return Node.pid == previousID;
        });
    }


    function _findHub(spokeToUse, dataToUse, mainHub) {
        // the function will find the immediated hub of this spoke / subspoke
        let previousNode = _findNode(dataToUse, spokeToUse);
        if (previousNode == null) {
            return mainHub;
        } else if (previousNode.ptype.toLowerCase() == varConfig.HUB || previousNode.ptype.toLowerCase() == varConfig.SUBHUB) {
            return previousNode;
        } else if (!previousNode) {
            // the current node is the first node,
            return spokeToUse;
        }
        else {
            return _findHub(previousNode, dataToUse)
        }
    }


    function _convertIntoGroups(mainHub, totalDataToConvert) {
        let data = totalDataToConvert;
        let firstHub = mainHub;
        // the function will work in the following manner
        // 1. Fetch a node from the data
        // 2. apply the recursive funtion which will look for its hub / subhub and assign it in the group assigned to a hub
        // 3. if no hub / subhub is found (example for node which did not interact), assign them to the group of main hub
        // 4. return the new dataset

        let newData = {};

        newData = _prepareGroupsObject(data, firstHub);

        data.forEach(function(node){
            // pick a node which is not a hub
            if (node.ptype.toLowerCase() !== varConfig.HUB && node.ptype.toLowerCase() !== varConfig.SUBHUB) {
                // find the hub of this spoke
                let designatedHub = _findHub(node, data, firstHub);
                if (designatedHub) {
                    let designatedGroup = `group_${designatedHub.pid}`;
                    newData[designatedGroup].spokes.push(node);
                }
            }
        });
        return newData;
    }

    function _initiateCoordinateSystemForHubs(groupData, graphWidth, graphHeight) {
        console.log('group data is ', groupData);
        // first create the data object like the createAxis function wants it
        var currentHubGroup;
        for (var index = 0; index < Object.keys(groupData).length; index++) {
            let currentGroup = groupData[Object.keys(groupData)[index]];
            if (currentGroup.type == varConfig.HUB) {
                currentHubGroup = currentGroup;
                break;
            }
        }
        console.log('current picked hub is ', currentHubGroup);


        // first prepare a array which has a main hub, its spokes and then all the sub hubs (not the spokes of subhubs)
        // asiign the initial coordinates to all of these




        let centerX = graphWidth / 2;
        let centerY = graphHeight / 2;
        let width = graphWidth,
            height = graphHeight,
            angle,
            x,
            y,
            i;
        let flags = {};

        // to find out exactly how many nodes needed to place and set their coordinates
        let hubsData = [];
        // extract all the nodes from the groups and send it to set coordinates
        Object.keys(groupData).forEach(function (groupName) {
            // if the current node id  is mainhub, then put the spokes of this hub also
            if (groupData[groupName].node.ptype.toLowerCase() == varConfig.HUB) {
                hubsData.push(groupData[groupName].node);
                hubsData.push(...groupData[groupName].spokes);
            } else {
                // if it is a subhub, just push it in the existing array
                hubsData.push(groupData[groupName].node);
            }
        });
        let uniqueNodes = hubsData
        // set coordinates
        numNodes = uniqueNodes.length;

        for (let i = 0; i < numNodes; i++) {

            angle = (i / (numNodes / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
            // For a semicircle, we would use (i / numNodes) * Math.PI.
            if (flags[uniqueNodes[i].pid]) {
                uniqueNodes[i]["x"] = flags[uniqueNodes[i].pid]["x"]
                uniqueNodes[i]["y"] = flags[uniqueNodes[i].pid]["y"]
                continue;
            }
            if (i == 0) {
                // assuming that the first node is ALWAYS 'hub'
                flags[uniqueNodes[i]["pid"]] = {
                    "status": true,
                    "x": centerX - varConfig.NODE_SIZE.HUB.X_OFFSET,
                    "y": centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
                }
                flags[uniqueNodes[i]["ptype"].toLowerCase()] = {
                    "x": centerX - varConfig.NODE_SIZE.HUB.X_OFFSET,
                    "y": centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
                }
                uniqueNodes[i]["x"] = centerX - varConfig.NODE_SIZE.HUB.X_OFFSET;
                uniqueNodes[i]["y"] = centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
            } else {
                // no new coordinates to another node of type 'hub' is allowed to sit in graph
                if (uniqueNodes[i].ptype.toLowerCase() == varConfig.HUB && !!flags[uniqueNodes[i]["ptype"].toLowerCase()]) {
                    // set coordinates of original hub
                    x = flags[uniqueNodes[i]["ptype"].toLowerCase()].x
                    y = flags[uniqueNodes[i]["ptype"].toLowerCase()].y
                } else {
                    x = Math.round(width / 2 + currentHubGroup.radius * Math.cos(angle) - varConfig.NODE_SIZE.NON_HUB.X_OFFSET);
                    y = Math.round(height / 2 + currentHubGroup.radius * Math.sin(angle) - varConfig.NODE_SIZE.NON_HUB.Y_OFFSET);
                    console.log(`${Math.cos(angle)} ${x}  ${Math.sin(angle)} ${y}`); 
                }

                flags[uniqueNodes[i].pid] = {
                    "status": true,
                    "x": x,
                    "y": y
                }
                uniqueNodes[i]["x"] = x;
                uniqueNodes[i]["y"] = y;
            }
        }
        console.log(flags, uniqueNodes);

        // assign the coordinates to the original main hub's spokes
        currentHubGroup.spokes = merge(currentHubGroup.spokes, uniqueNodes, 'pid');
        // set the defined nodes to all the duplicates
        // now merge the coordinates for unique nodes and groupData
        uniqueNodes.forEach(function (hubNode) {
            Object.keys(groupData).forEach(function (groupName) {
                if (groupData[groupName].type.toLowerCase() === varConfig.HUB) {
                    // assign the new coordinates of hub's spokes to the origin object
                    groupData[groupName].spokes = currentHubGroup.spokes;
                }
                if (groupData[groupName].node.pid == hubNode.pid) {
                    groupData[groupName].node['x'] = hubNode.x;
                    groupData[groupName].node['y'] = hubNode.y;
                }
            });
        });
        debugger;
        return groupData;
    }


    function _initiateCoordinateSystemForGroups(groupGraphData, graphWidth, graphHeight) {
        let width = graphWidth;
        let height = graphHeight;
        let compiledGroupData = [];
        // iterate on each group, fetch the group's radius to be used, the center coordinates to be the group hub itself
        Object.keys(groupGraphData).forEach(function(groupName){
            let hub = groupGraphData[groupName].node;
            let centerX = hub.x;
            let centerY = hub.y;

            let radius = groupGraphData[groupName].radius,
            angle,
            x,
            y;
            let flags = {};

            // to find out exactly how many nodes needed to place and set their coordinates
            let completeData = [];
            completeData.push(hub);
            completeData.push(...groupGraphData[groupName].spokes)
        let uniqueNodes = completeData;
        // set coordinates
        numNodes = uniqueNodes.length;

        for (let i = 0; i < numNodes; i++) {

            angle = (i / (numNodes / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
            // For a semicircle, we would use (i / numNodes) * Math.PI.
            if (flags[uniqueNodes[i].pid]) {
                uniqueNodes[i]["x"] = flags[uniqueNodes[i].pid]["x"]
                uniqueNodes[i]["y"] = flags[uniqueNodes[i].pid]["y"]
                continue;
            }
            if (i == 0) {
                // assuming that the first node is ALWAYS 'hub'
                flags[uniqueNodes[i]["pid"]] = {
                    "status": true,
                    "x": centerX - varConfig.NODE_SIZE.HUB.X_OFFSET,
                    "y": centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
                }
                flags[uniqueNodes[i]["ptype"].toLowerCase()] = {
                    "x": centerX - varConfig.NODE_SIZE.HUB.X_OFFSET,
                    "y": centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
                }
                uniqueNodes[i]["x"] = centerX - varConfig.NODE_SIZE.HUB.X_OFFSET;
                uniqueNodes[i]["y"] = centerY - varConfig.NODE_SIZE.HUB.Y_OFFSET
            } else {
                // no new coordinates to another node of type 'hub' is allowed to sit in graph
                if (uniqueNodes[i].ptype.toLowerCase() == varConfig.HUB && !!flags[uniqueNodes[i]["ptype"].toLowerCase()]) {
                    // set coordinates of original hub
                    x = flags[uniqueNodes[i]["ptype"].toLowerCase()].x
                    y = flags[uniqueNodes[i]["ptype"].toLowerCase()].y
                }else{
                    x = Math.round(width / 2 + radius * Math.cos(angle) - varConfig.NODE_SIZE.NON_HUB.X_OFFSET);
                    y = Math.round(height / 2 + radius * Math.sin(angle) - varConfig.NODE_SIZE.NON_HUB.Y_OFFSET);
                }

                flags[uniqueNodes[i].pid] = {
                    "status": true,
                    "x": x,
                    "y": y
                }
                uniqueNodes[i]["x"] = x;
                uniqueNodes[i]["y"] = y;
            }
        }
        compiledGroupData.push(...uniqueNodes);
        });
        return compiledGroupData;
    }


    function _assignDynamicCoordinates(dataToUse, mainRadius, graphWidth, graphHeight, mainHub) {
        // the grouped graph variable will store the data as a collection of groups on the basis of hubs
        let groupedGraph = _convertIntoGroups(mainHub, dataToUse);
        // once groups are formed, follow the coordinate system in below format
        // 1. The main hub will be the center of the graph
        // 2. Any hub which is connected with the main hub will come under the main hub's coordinate system
        // 3. As soon as a new hub is found, assign a new raidus to this new hub
        // 4. once all the hubs / sub hubs have recieved their coordinates, assign the coordinate systems to their corresponding spokes
debugger;
        Object.keys(groupedGraph).forEach(function(group){
            if (groupedGraph[group].type == varConfig.HUB) {
                groupedGraph[group].radius = mainRadius;
            }
            else {
                groupedGraph[group].radius = Math.floor(Math.random() * ( (mainRadius+ varConfig.DEAFULT_SUBGRAPH_RADIUS.OFFSET_MIN) - mainRadius + 1)) + mainRadius;
            }
        });
        
        // _initiateCoordinateSyatemForHubs will assign coordinates to the main Hub, its unique spokes and all the subhubs (in the same order as written here)
        debugger;
        let groupedGraphCopy = _.cloneDeep(groupedGraph)
        groupedGraph = _initiateCoordinateSystemForHubs(groupedGraphCopy, graphWidth, graphHeight);
        
        
        groupedGraph = _initiateCoordinateSystemForGroups(_.cloneDeep(groupedGraph), graphWidth, graphHeight);
        
        console.log(groupedGraph);
        // merge the coordinates of all the unique nodes with the original database
        let mergedData = merge(dataToUse, groupedGraph, 'pid');
        debugger;
        return mergedData;
    }

    function createAxisDynamic( mainRadius, originaldata, gcWidth, gcHeight) {
        // the purpose of the function is to assign a new set of radius to a new hub and 
        // its connected spokes should have coordinates corresponding to the new hub radius

        /**
         * STEPS
         * 1. Find the node of type hub and set it in the center
         *      All the spokes of this hub will be set around this hub only (including subhubs connected to this hub)
         * 2. As soon as a new subhub is detected, recreate the first step with this subhub in a point of the screen
         */
        var numNodes;
         if (Array.isArray(originaldata) && originaldata.length) {
            numNodes = originaldata.length;
            console.log('numnodes ', numNodes);
            // center point for the first hub
            // finding the first hub
            let firstHub = originaldata.find(function(node){
                return node.ptype.toLowerCase() == varConfig.HUB;
            });
            if (firstHub) {
                // main hub is present, initiate the coordinate assignment process
                let newCoordinates = _assignDynamicCoordinates(originaldata, mainRadius, gcWidth, gcHeight, mainHub = firstHub);
                console.log('new coordinate system is ', newCoordinates);
                return newCoordinates;
            }
            else {
                console.warn('There is no main hub in the database, cannot proceed');
            }
         }
         else {
             console.error('Cannot assign coordinates to an empty set of nodes');
         }


    }

    var getData = function (video_id, graphContainerHeight, graphContainerWidth, cb) {
        console.log('video id recieved is ', video_id);
        if (d3) {
            // './../../data/multiple_videos.json'
            d3.json('/read-vis-db/json', (err, data) => {
                if (data && data.fileType == 'json') {
                    // store the video details in the variable to be used by dropdown
                    _fetchVideoDetails(data.data.videos)
                    // check for the video id needed and its relevant data

                    let fetchedData = _getDataFromId(video_id, data);

                    if (fetchedData !== -1) {
                        var originaldata = fetchedData[0].data;

                        originaldata = reduceSumCiGraph(originaldata)
                        console.log("whole data: ", originaldata)

                        // set appropriate variables
                        let gcHeight = graphContainerHeight;
                        let gcWidth = graphContainerWidth;
                        let mainRadius = (gcHeight/2.5);

                        originaldata = createAxis(originaldata.length, mainRadius, originaldata, gcWidth, gcHeight)
                        console.log('data fetched');
                        // set the video details
                        let dataForCurrentVideo = {
                            name: fetchedData[0].vname,
                            duration: fetchedData[0].vduration,
                            // hubs: fetchedData[0].vhubs,
                            heldOn: fetchedData[0].vheldOn,
                            id: fetchedData[0].id
                        };
                        
                        toolbarModule.updateVideDetails(dataForCurrentVideo)
                        
                        cb(originaldata)
                    } else {
                        console.log('will not proceed unless correct video id is passed in the query string');
                        // hide the start button
                        $('#startBtn').css('display', 'none');
                        // display relevant error message in the video details container
                        $('.video-details2 > .container > .dropdown > .title').text('Video ID Invalid or missing')
                        $('#initialText > h3').text('No Information available to analyze');
                    }
                } else {
                    console.log('no data fetched');
                    cb(undefined);
                    throw Error('Unable to fetch data, an unexpected error occured', err);
                }
            });
        } else {
            console.log('d3 error');
            throw Error('D3 is not defined, cannot fetch the data');
        }
    }

    return {
        getGraphData: getData,
        updateHubs: _updateHubsForGraph,
        getGraphHubID: _getGraphHubID,
        getGraphHub: _getGraphHub,
        getVideoInfo: _getVideoInfoInDB,
        createAxisDynamic
    }
}(d3));