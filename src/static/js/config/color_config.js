var colorConfig = (function(){


    function _getRandomColorCode() {

        // generate random colors which are not similar to already assigned colors

        return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    }

    var _colorCodes = {
        hubColor: '#1f77b4',
        spokeColor: '#ff7f0e',
        activeColor: '#00ffd0',
        videoStatusOnColor: '#4CAF50',
        videoStatusOffColor: 'red',
        arrowColor: '#797676',
        lineColor: '#797676'
    };


    return {
        colorCodes : _colorCodes,
        getRandomColor: _getRandomColorCode
    }
})()