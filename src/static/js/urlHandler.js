var urlHandler = (function(){

    var videoIdToLoad;
    // extract the query variables from the current route
    function getQueryStringValue (key) {  
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
      }

      videoIdToLoad = getQueryStringValue('id') ? getQueryStringValue('id') : 0;

      function getPathName() {
          return window.location.pathname
      }

      return {
          videoIdToLoad,
          getQueryStringValue,
          getPathName
      }
})()