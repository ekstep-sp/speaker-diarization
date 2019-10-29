var toolbarModule = (function(jQuery){

    function _renderNodeDetailsTemplate(elementToUse, data) {
        let el = elementToUse;

        let imageUrl = `./data/profile/images/${data.name.split(' ').join('_')}.jpg`;
        let fallbakUrl = './data/profile/images/fallback_image.jpg';
        let elemTemplate = `
        <div class="row">
            <p class="name">Name</p>
            <p class="value">${data.name}</p>
        </div>
        <div class="row">
            <p class="name">Type</p>
            <p class="value">${data.type}</p>
        </div>
        <div class="row">
            <p class="name">Gender</p>
            <p class="value">${data.gender}</p>
        </div>
        <div class="row">
            <p class="name">Tone</p>
            <p class="value ${data.tone}">${data.tone}</p>
      </div>
      `;

      // insert the template into the element
        el.empty();
        el.html(elemTemplate);
    }


    function getHubTemplate(hubs) {
        // to create a template using the hub array

        if (hubs.length) {
            let template = '';
            hubs.forEach((hub,index) => {
                template += `
                <div class="row">
                    <p class="name">Hub ${index+1}</p>
                    <p class="value">${hub}</p>
                </div>
                `;
            });
            return template;
        }
        else {
            return `
            <div class="row">
                <p class="name">Hubs</p>
                <p class="value">Not Present</p>
          </div>
          `;
        }
    }

    function _renderVideoDetailsTemplate(elementToUse, data) {
        console.log('video details to render are ', data);
        let el = elementToUse;

        let nameTemplate = `<p class="title">${data.name}</p>`;
        let bodyTemplate = `
        <div class="body">
            <div class="row">
                <p class="name">Held On</p>
                <p class="value">${data.heldOn}</p>
            </div>
            <div class="row">
                <p class="name">Duration</p>
                <p class="value">${data.duration}</p>
            </div>
      </div>
        `;
// ${getHubTemplate(data.hubs)}
        // let hubTemplate = getHubTemplate(data.hubs);

        // join all the templates and render it
        let finalTemplate = nameTemplate + bodyTemplate;
        el.html(finalTemplate);
    }

    function applyBorder(selection, type) {
        if (!!type && typeof type === 'string') {
            let colorCode = type && type.toLowerCase().includes('hub') ? '#1f77b4' : '#ff7f0e';
        selection.children().css({"border": `5px solid ${colorCode}`});
        }
    }

    var _updateNodeDetails = function(dataToUse) {

        let coreEl = jQuery('.node-details');

        applyBorder(coreEl,dataToUse.ptype);
        coreEl.css('opacity', 1);

        let el = jQuery('div.node-details > div.container > div.body');
        if (dataToUse === -1) {
        // sequence completed
        } else {
            let name = dataToUse.pname || 'NA';
            let type = dataToUse.ptype || 'NA';
            let gender = dataToUse.gender || 'Not Specified';
            let tone = dataToUse.tone || 'NA';

        _renderNodeDetailsTemplate(el,{name, type, gender, tone});
        }

    }

    function _bodyTemplate2(data) {
        return `
        <div class="body">
            <div class="row">
                <p class="name">Held On</p>
                <p class="value">${data.heldOn}</p>
            </div>
            <div class="row">
                <p class="name">Duration</p>
                <p class="value">${data.duration}</p>
            </div>
      </div>
        `;
    };

    function _updateVideoDetails2(currentvideoData) {
        let coreEl = jQuery('div.video-details2 > div.container')
        let el = jQuery('div.video-details2 > div.container > div.dropdown');
        // set the dropdown details
        dropdownModule.populateList(dataModule.getVideoInfo(), selectedEl = el, selectedID = currentvideoData.id);
        // set remaining video details
        coreEl.append(_bodyTemplate2({heldOn: currentvideoData.heldOn, duration: currentvideoData.duration}));
    }

    // this function is used to set video details without dropdown
    var _updateVideoDetails = function(dataToUse) {
        if (!urlHandler.getPathName().split('.')[0].includes('index1')) {
            _updateVideoDetails2(dataToUse);
        } else {
            // on index1.html, old videodetails is available
            console.log('index1 is hit');
            let coreEl = jQuery('.video-details');

            let el = jQuery('div.video-details > div.container');
            el.empty();
            let name = dataToUse.name || 'Name Not Available';
            let duration = dataToUse.duration || 'NA';
            let heldOn = dataToUse.heldOn || 'NA';
            let hubs = dataToUse.hubs || [];

            _renderVideoDetailsTemplate(el, {name, duration, heldOn, hubs});
            coreEl.css('opacity', 1);
        }
    }
    
    return {
        updateNodeDetails : _updateNodeDetails,
        updateVideDetails: _updateVideoDetails
    }
})($)