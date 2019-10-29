const BEARER_TOKEN = 'Bearer ya29.c.Kl6pB7nwL1pLdHPmpcYvfhruTyTAG7cqVOkM95QkT9lEWPChwmNMIUcnuyIEZ9RwVkOlOycdkGgn3X1--C75A1gHnjBHSMsqG21m4QArJGSDqhSIfWedoLO26yPicV8n';
var iterator = 0;
var parentElements = ['encoding', 'audio_url', 'diarizationSpeakerCount'];



function submitForm(formEvent,formID) {
    var formEl = document.getElementById(formID);
    formEvent.preventDefault();
    var formData = extractForm(formEl);
    console.log('form data is ', formData);
    var requestBody = getRequestBody(formData);
    var validatedReqBody = validateReqBodyForEncoding(requestBody);
    if(typeof validatedReqBody !== 'boolean') {
        console.log('request body is ', requestBody);

        if (!!formData && formData.constructor === Object) {
            console.log('ready to make a request');
            axios.post('/diarization-beta/speaker/longrunningrecogize', requestBody)
              .then(function (response) {
                  if (response.status == 200) {
                    showSuccessMessage(response.data.response.message);      
                  }
                console.log(response);
                window.setTimeout(function(){
                    hideSuccessMessage();
                    startProgressStatus(response.data.response.data.process_id);
                }, 4000);
    
              })
              .catch(function (error) {
                  if (error.response.status == 401) {
                    alert('Token Expired, retry with a new token');      
                  } else {
                alert('An error occured while sending data to the server, try again later !!');
                  }
                console.error('An error occured while sending data to the server', error.response);
              });
        }
    }
    else {
        console.log('data did not validate');
        // nothing
    }
}

function validateReqBodyForEncoding(dataToValidate) {
    let encodingFormats = {
        wav : 'LINEAR16',
        mp3: 'mp3'
    }

    // let audioUrl = dataToValidate.fileUri;
    let selectedEncoding = dataToValidate.encoding;
    // let last5CharsOfAudioUrl = audioUrl.substr(audioUrl.length - 15);
    // let audioFormat = last5CharsOfAudioUrl.split('.')[1];
    /* if (audioFormat === encodingFormats[selectedEncoding]) {
        // format is okay
        console.log('encoding matches the audio format');
        return true;
    } else {
        // format is not okay
        alert('Encoding must match the format of audio file provided');
        return false;
    } */
    if (Object.keys(encodingFormats).indexOf(selectedEncoding) > -1) {
        dataToValidate.encoding = encodingFormats[selectedEncoding];
        return dataToValidate;
    }
    else {
        alert('Audio File extension must be one of these : \n1) wav\n2)mp3');
        return false;
    }
}

function extractForm(formElement) {
    var finalObject = {};
    Object.keys(formElement.elements).forEach(function(elIndex){
        if ( formElement.elements[elIndex].name !== '' && formElement.elements[elIndex].localname !== 'button') {
            finalObject[formElement.elements[elIndex].name] = formElement.elements[elIndex].value
        }
    });
    return finalObject;
}

function hideSuccessMessage() {
    // hide success message
    document.getElementById('successContainer').style.display = 'none';
}

function showSuccessMessage(messageToDisplay = '') {
    // show success message
    document.getElementById('successContainer').style.display = 'block';
    if (messageToDisplay) {
        document.getElementById('successTextMessage').innerText = messageToDisplay;
    }
}

function startProgressStatus(diarizationID) {
    console.log('process id recieved is ', diarizationID);
    document.getElementById('progressContainer').style.display = 'block';

    var progressStatusEl = document.getElementById('progressStatusBar');
    var progressTextEl = document.getElementById('progressText');
    var redirectEl = document.getElementById('redirectMessage');
    // poll the request, read the status and update accordingly
    progressStatusEl.style.width = '0%';
    progressTextEl.innerText = '0% completed...';

    let config = {
        headers: {
            'Authorization': BEARER_TOKEN,
            'Content-Type': 'application/json'
        }
    }
    if (!isNaN(iterator)) {
        console.log('there is already an iterator working, clearing it');
        window.clearInterval(iterator);
    }
    iterator = window.setInterval(function(){
        axios.get(`https://speech.googleapis.com/v1/operations/${diarizationID}`, config)
        .then(function(response){
            console.log('recieved response as ', response);
            progressTextEl.style.right = '-120px';
            let progress = response.data.metadata.hasOwnProperty('progressPercent') ? response.data.metadata.progressPercent : 0;
            progressStatusEl.style.width = `${progress}%`;
            progressTextEl.innerText = `${progress}% completed...`;
            if (progress == 100) {
                progressTextEl.style.right = '-45px';
                progressTextEl.innerText = 'done';
                // display the redirect url for access
                redirectEl.style.display = 'block';
                window.clearInterval(iterator);
                console.log('progress completed');
                openNewTab('localhost:3000/index.html');
            }
        })
        .catch(function(error){
            window.clearInterval(iterator);
            console.log('An error occured while reading status');
            console.log(error.response);
        })
    },5000);
    

}

function openNewTab(url) {
    console.log('opening new tab at', url);
    window.open(url, '_blank');
}

function getRequestBody(formDataToUse) {
    let finalObject = {
        fileUri: '',
        bearer: BEARER_TOKEN,
        fileDetails: {},
        encoding: '',
        diarizationSpeakerCount: formDataToUse.diarizationSpeakerCount
    }
    // set the fileUri seperately
    finalObject.fileUri = formDataToUse.audio_url;
    // set encoding seperately
    finalObject.encoding = getEncodingFromAudio(finalObject.fileUri);
    // set diarizationSpeakerCount seperately
    finalObject.diarizationSpeakerCount = parseInt(formDataToUse.diarizationSpeakerCount);
    // add the corresponding keys to the fileDetails
    Object.keys(formDataToUse).forEach(function(key){
        if (parentElements.indexOf(key) < 0) {
            finalObject.fileDetails[key] = formDataToUse[key]
        }
    });
    return finalObject;
}

function getEncodingFromAudio(url) {
    return url.substr(url.lastIndexOf('.')+1, url.length+1 - url.lastIndexOf('.'));
}