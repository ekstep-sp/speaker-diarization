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
                    held_on: "01-Jan-19"
                },
                {
                    name: 'week_2',
                    start_date: "",
                    end_date: "",
                    progress_report: 3,
                    held_on: "07-Jan-19"
                },
                {
                    name: 'week_3',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "14-Jan-19"
                },
                {
                    name: 'week_4',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                    held_on: "21-Jan-19"
                },
                {
                    name: 'week_5',
                    start_date: "",
                    end_date: "",
                    progress_report: 3,
                    held_on: "28-Jan-19"
                },
                {
                    name: 'week_6',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                    held_on: "05-Feb-19"
                },
                {
                    name: 'week_7',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "11-Feb-19"
                },
                {
                    name: 'week_8',
                    start_date: "",
                    end_date: "",
                    progress_report: 7,
                    held_on: "18-Feb-19"
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
                    held_on: "01-Jan-19"
                },
                {
                    name: 'week_2',
                    start_date: "",
                    end_date: "",
                    progress_report: 5,
                    held_on: "07-Jan-19"
                },
                {
                    name: 'week_3',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "14-Jan-19"
                },
                {
                    name: 'week_4',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "21-Jan-19"
                },
                {
                    name: 'week_5',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                    held_on: "28-Jan-19"
                },
                {
                    name: 'week_6',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "05-Feb-19"
                },
                {
                    name: 'week_8',
                    start_date: "",
                    end_date: "",
                    progress_report: 6,
                    held_on: "11-Feb-19"
                },
                {
                    name: 'week_9',
                    start_date: "",
                    end_date: "",
                    progress_report: 5,
                    held_on: "22-Feb-19"
                }
            ]
        },
        {
            id: 2,
            video_name: 'TB Video 1',
            timeline: [
                {
                    name: 'week_1',
                    start_date: "",
                    end_date: "",
                    progress_report: 10,
                    held_on: "01-Jan-19"
                },
                {
                    name: 'week_2',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                    held_on: "07-Jan-19"
                },
                {
                    name: 'week_3',
                    start_date: "",
                    end_date: "",
                    progress_report: 5,
                    held_on: "14-Jan-19"
                },
                {
                    name: 'week_4',
                    start_date: "",
                    end_date: "",
                    progress_report: 0,
                    held_on: "21-Jan-19"
                },
                {
                    name: 'week_5',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "28-Jan-19"
                },
                {
                    name: 'week_6',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                    held_on: "05-Feb-19"
                },
                {
                    name: 'week_7',
                    start_date: "",
                    end_date: "",
                    progress_report: 1,
                    held_on: "11-Feb-19"
                },
                {
                    name: 'week_8',
                    start_date: "",
                    end_date: "",
                    progress_report: 0,
                    held_on: "18-Feb-19"
                }
            ]
        },
        {
            id: 3,
            video_name: 'TB Video 2',
            timeline: [
                {
                    name: 'week_1',
                    start_date: "",
                    end_date: "",
                    progress_report: 9,
                    held_on: "01-Jan-19"
                },
                {
                    name: 'week_2',
                    start_date: "",
                    end_date: "",
                    progress_report: 8,
                    held_on: "07-Jan-19"
                },
                {
                    name: 'week_3',
                    start_date: "",
                    end_date: "",
                    progress_report: 7,
                    held_on: "14-Jan-19"
                },
                {
                    name: 'week_4',
                    start_date: "",
                    end_date: "",
                    progress_report: 6,
                    held_on: "21-Jan-19"
                },
                {
                    name: 'week_5',
                    start_date: "",
                    end_date: "",
                    progress_report: 5,
                    held_on: "28-Jan-19"
                },
                {
                    name: 'week_6',
                    start_date: "",
                    end_date: "",
                    progress_report: 4,
                    held_on: "05-Feb-19"
                },
                {
                    name: 'week_7',
                    start_date: "",
                    end_date: "",
                    progress_report: 3,
                    held_on: "11-Feb-19"
                },
                {
                    name: 'week_8',
                    start_date: "",
                    end_date: "",
                    progress_report: 2,
                    held_on: "18-Feb-19"
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