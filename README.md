# **Architectural Flow**

![](https://drive.google.com/uc?export=view&id=1_LyYaa2_MH7RCd-W1EZNSlSki0P8WOpT)
You can view the image [**here**](https://drive.google.com/file/d/1_LyYaa2_MH7RCd-W1EZNSlSki0P8WOpT/view?usp=sharing)

# **Steps for Installation ( Quick Review )**

1. **Enable Zoom account with permissions**
  a. **Business, Education, or Enterprise** license with **account owner** or **admin privileges** and **Cloud Recording and Audio Transcript settings enabled**. To know more about zoom permissions visit [here](https://support.zoom.us/hc/en-us/articles/115001078646-Role-Based-Access-Control) and enabling the audio transcript option from [here](https://support.zoom.us/hc/en-us/articles/115004794983-Automatically-Transcribe-Cloud-Recordings).

1. **Install Speaker Diarization Project**
  a. Make sure you have nodeJS ( v10 or higher ), git / Github installed (git CLI is recommended)
  b. Clone the project repository from [https://github.com/societalplatform-ekstep/speaker-diarization.git](https://github.com/societalplatform-ekstep/speaker-diarization.git) ( **use git clone <repo-url>** to clone)
  c. Checkout to branch **zoom-parser**
  d. Go to project root and type **npm install**
  e. Once packages are installed, install nest-CLI using **npm install -g @nestjs/cli** separately.
  f. Once nestJS is installed, install the gulp cli using **npm install -g gulp-cli**
  g. Now type **gulp** and the project should start building.
  h. Once done, go to **dist/** and type **node main.js.** If everything went fine, you should be able to see a message.

1. **Create JWT app**
  a. Login to [https://marketplace.zoom.us/](https://marketplace.zoom.us/) with your account (the same account where you enabled the audio transcript feature).
  b. Go to **create an app** and select the **jwt application**.
  c. Follow the steps of creating an app, and after it is created you will see your **API-key** and **API-secret**. Also in your JWT app, you will see a **features section** , go and enable event subscription in it. For this project, you have to specifically enable the **transcript-completed (**details about this event can be referenced from[here](https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-transcript-completed)**)** event and add the webhook URL. More details about webhooks in zoom can be found [here](https://marketplace.zoom.us/docs/api-reference/webhook-reference). Record client id and the secret of this jwt app for future reference.

1. **Upload and update Google Cloud Functions**
  a. Now login to google-cloud and upload the below-mentioned cloud functions (code provided [here](https://drive.google.com/file/d/1JpgXQWgd6yKJnT3s2epA_-5pcO7w-4Kg/view?usp=sharing)). Please make sure that the name of the cloud function is the same as the name of the zip file.
    1. webhookFunc.zip
    2. get\_jwt\_auth\_token.zip
    3. get\_zoom\_videos.zip
    4. merge\_meeting\_files.zip
    5. parse-vtt-to-json.zip

   b. Now you will have to update all the reference URLs of these cloud functions. One such example is your merge-meeting-files cloud function, edit that function, and change the URL for parse-vtt-to-json cloud function to your cloud function.
1. **Connect Google Cloud Functions with JWT app**
  a. Update the Client ID and ClientSecret in **get\_jwt\_auth\_token.zip** → index.js and redeploy it.
  b. Once you have deployed all your cloud functions, you have to update the invocation URL of webhookFunc cloud function in your zoom's transcript-completed event subscription (one that you enabled in jwt app)

1. **Connect Google Cloud Functions with Backend API (speaker-diarization-project)**
  a. Once all this is done, you have to update the outgoing url in the merge-meeting-files cloud function to point it to your deployed webhook of speaker-diarization-project. The endpoint for saving the visualization is **/<domain>/zoom-to-vis/visualize**.

If you have followed the above steps, everything is set up, now schedule a meeting ( make sure to mark "record to the cloud" option) and complete it. Once the meeting has ended and transcription completed for your meeting, the diarization process will initiate automatically. After 5 minutes you can visit the URL(for example <your-deployed-domain>/index.html ) to see if your meeting is visible. If not, refer to the google cloud function logs if any error has occurred and resolve accordingly.

# **Understanding the speaker diarization flow using zoom APIs.**

- Zoom APIs provide a lot of features to access the meetings and any past recordings in the zoom account. One critical API that is used here is **get-recordings API** which can be seen here: [https://docs.google.com/document/d/1nQfJ-j4bAZaKJgsJZYu7OgYDT3PD9oyV0eGD-5HifyE/edit#bookmark=id.3015qb7s6ljg](https://docs.google.com/document/d/1nQfJ-j4bAZaKJgsJZYu7OgYDT3PD9oyV0eGD-5HifyE/edit#bookmark=id.3015qb7s6ljg) and official zoom documentation for the API can be seen [here](https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingget).
- This API will return two important file types: **TIMELINE and TRANSCRIPT**
- The **TIMELINE** file type is basically a json output that contains the timestamp and information of the user who spoke starting at a particular timestamp. The **TRANSCRIPT** file type is basically a vtt file output that contains information on what was spoken between two time-stamps. It does not contain any information about who spoke between those timestamps. Samples of these files can be seen [here](https://drive.google.com/drive/folders/1K8tzjwcrYDsUWChDF7AroTbnjpSnS_W8?usp=sharing).
- There are a set of cloud functions deployed (link has been mentioned above which are responsible to look for the output of get-recordingsI API, get these files from their respective download URLs, parse them accordingly and merge them to create one json output which contains both the text of what was spoken between two timestamps and by whom.
- This final json output is then sent to a deployed network-interaction-diagram server to be further parsed and saved in the database so that it can be visualized using our network-interaction-diagram. Again, this whole flow is managed by cloud functions themselves.
