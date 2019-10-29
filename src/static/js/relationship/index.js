var relationshipModule = (function () {
    // retrieve color codes
    var colorCodes = colorConfig.colorCodes;
    var varConfig = variablesConfig;

    this.arrowstatus = false
    
    this.arrowHead = function (svg) {
        arrowstatus = true;
        svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle")
            .attr("refX", varConfig.RELATION.ARROWHEAD.REF_X)
            .attr("refY", varConfig.RELATION.ARROWHEAD.REF_Y)
            .attr("markerWidth", varConfig.RELATION.ARROWHEAD.MARKER.WIDTH)
            .attr("markerHeight", varConfig.RELATION.ARROWHEAD.MARKER.HEIGHT)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", colorCodes.arrowColor);
    }
    this.lineCreation = function (svg, data) {
        var weight = data.weight || varConfig.RELATION.DEFAULT_WEIGHT;
        var x1 = data.x1;
        var x2 = data.x2;
        var y1 = data.y1;
        var y2 = data.y2;

        svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width", weight)
            .attr("stroke", colorCodes.lineColor)
            .attr("marker-end", "url(#triangle)");
    }
    this.createRelation = function (data) {
        this.data = data;
        var source = this.data.source;
        var target = this.data.target
        var svg = this.data.svgelem;
        if (!source && !target && !this.data.x1 && !this.data.y1 && !this.data.x2 && !this.data.y2) {
            var err = new Error("please proved source and target and coordinates");
            throw err;
        }

        arrowHead(svg);
        lineCreation(svg, this.data);
    }
    return this
});