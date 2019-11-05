var variablesConfig = (function(){
    return {
        DEFAULT_INTERVAL_TIMEOUT: 3000,
        DEFAULT_GRAPH_RADIUS: 200,
        DEAFULT_SUBGRAPH_RADIUS: {
            OFFSET_MIN: 50,
            OFFSET_MAX: 50
        },
        HUB: "hub",
        SPOKE: "spoke",
        SUBHUB: "subhub",
        SUBSPOKE: "subspoke",
        NODE_SIZE: {
            MIN: 15,
            MAX: 60,
            HUB: {
                X_OFFSET: 20,
                Y_OFFSET: 20
            },
            NON_HUB: {
                X_OFFSET: 20,
                Y_OFFSET: 20
            }
        },
        MINI_CIRCLE: {
            RADIUS: 5,
            X_OFFSET: 20,
            Y_OFFSET: 14
        },
        ACTIVE_CIRCLE: {
            RADIUS: 5
        },
        TOOLTIP: {
            X_OFFSET: 50,
            Y_OFFSET: 100,
            DURATION: 500
        },
        TRANSITION: {
            DURATION: 1000,
            DURATION_OFFSET: 50,
            RADIUS: {
                OFFSET: 10,
                MAX: 40
            }
        },
        RELATION: {
            DEFAULT_WEIGHT: 1,
            ARROWHEAD: {
                REF_X: 30,
                REF_Y: 6,
                MARKER: {
                    WIDTH: 30,
                    HEIGHT: 30
                }
            }
        }
    }
})()