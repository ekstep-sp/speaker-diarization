var dropdownModule = (function(jQuery){
    // module to handle the dropdown functionality

    _createDropdownTemplate = function(listData, currentVideoID) {
        // to create the dropdown
        var template = '';
        listData.forEach(function(listItem){
            if (listItem.id == currentVideoID) {
                template += `<li class="list-item selected" id="item_${listItem.id}">${listItem.name}</li>`;
            }
            else {
                template += `<li class="list-item" id="item_${listItem.id}">${listItem.name}</li>`;
            }
        });
        template = `<ul class="dropdownList">${template}</ul>`;
        return template;
    }

    function _setAndLoad(el,videoID, listItems = undefined) {
        if (!isNaN(videoID)) {
            if (!listItems) {
                // if list items are not supplied in the function, it will fetch itself
                listItems = jQuery('ul.dropdownList > li.list-item');
            }
            listItems.removeClass('selected');
            jQuery(el).addClass('selected');
            // load a new video based on id
            window.location.search = `id=${videoID}`
        } else {
            console.log('video id is invalid', videoID);
        }
    }

    var _createList = function(listData, selectedEl, selectedVideoID){
        // to create a list for dropdown
        if (Array.isArray(listData) && listData.length) {
            // only create template if there is at least one
            selectedEl.empty();
             // set the title first
             var currentSelectedDetails = listData.find(function(item){return item.id == selectedVideoID});
             selectedEl.append(`<p class="title">${currentSelectedDetails.name}</p>`)
             
             var template = _createDropdownTemplate(listData, selectedVideoID);
             // selectedEl.text(currentSelectedDetails.name)
             selectedEl.append(template);
             // add click event to the dropdown
             var listItemEl = jQuery('ul.dropdownList > li.list-item');
            listItemEl.click(function(){
                //extract the videoID from the dropdown list item clicked and load it
                let selectedID = jQuery(this).attr('id').split('_')[1];
                _setAndLoad(this,selectedID, listItems = listItemEl);
            });
        }
    }

    return {
        populateList: _createList
    }
})($)