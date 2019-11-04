var dataModule = (function () {

    var dataObject = [
        {
            id: 0,
            video_name: 'TB Video',
            timeline: [
                {
                    name: 'week_1',
                    start_date: "",
                    end_date: "",
                    progress_report: 10,
                },
                {
                    name: 'week_2',
                    start_date: "",
                    end_date: "",
                    progress_report: 3,
                },
                {
                    name: 'week_3',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                },
                {
                    name: 'week_4',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                },
                {
                    name: 'week_5',
                    start_date: "",
                    end_date: "",
                    progress_report: 3,
                },
                {
                    name: 'week_6',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                },
                {
                    name: 'week_7',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                },
                {
                    name: 'week_8',
                    start_date: "",
                    end_date: "",
                    progress_report: 7,
                }
            ]
        },
        {
            id: 1,
            video_name: 'Cancer Video',
            timeline: [
                {
                    name: 'week_1',
                    start_date: "",
                    end_date: "",
                    progress_report: 5,
                },
                {
                    name: 'week_2',
                    start_date: "",
                    end_date: "",
                    progress_report: 1,
                },
                {
                    name: 'week_3',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                },
                {
                    name: 'week_4',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                },
                {
                    name: 'week_5',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                },
                {
                    name: 'week_6',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                },
                {
                    name: 'week_7',
                    start_date: "",
                    end_date: "",
                    progress_report: 3,
                },
                {
                    name: 'week_8',
                    start_date: "",
                    end_date: "",
                    progress_report: 1,
                }
            ]
        }
    ]

    function _getDataObject(objectName) {
        if (!!objectName) {} else {
            // send all the data
            return dataObject;
        }
    }
    return {
        getDataObject: _getDataObject
    }
})()