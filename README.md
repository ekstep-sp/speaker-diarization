# Speaker Diarization Utility

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Speaker diarisation (or diarization) is the process of partitioning an input audio stream into homogeneous segments according to the speaker identity. It can enhance the readability of an automatic speech transcription by structuring the audio stream into speaker turns and, when used together with speaker recognition systems, by providing the speaker’s true identity. It is used to answer the question "who spoke when?" Speaker diarisation is a combination of speaker segmentation and speaker clustering. It aims at finding speaker change points in an audio stream.

#### This Project aims to demonstrate the speaker diarization process using various services provided by organisations.

# [INSTALLATION] 
Refer the installation docs form [The Official Guide To Install Speaker Diarization Utility](https://docs.google.com/document/d/1hddjXd4cKhowrJRknv52pj9a6eiXI6qBpdUly45BKhg/edit?usp=sharing)
##### [NOTE] At the time of writing this documentation, the most updated / statble branch is zoom-parser, so it advisable to switch to zoom-parser after cloning to work with all the modules provided.

# [FUNCTIONALITY]
This project is developed to explore various services provided by different tech giants and see how speaker diarization can be performed in a seamless manner. This project has the following features :
* To perform speaker diarization using Google Speaker diarization Apis
* Display the diarized data using the Diarization Visulizer utility
* To perform speaker Diarization using Zoom Apis

 # 1. To Perform Speaker Diarization using Google Speaker Diarization Apis
* The google speaker diarization apis are useful when you want to perform speaker diarization using complete apis provided by google.
* These apis are in beta and is subject to change over the period of time as per google. However, at the time of creating the project, the apis allowed users to perform diarization by uploading a set of audio files into the public google cloud bucket. 
* Note, there is a specification to be followed while uploading files . The files that you upload to the google cloud bucket of your choice must be accessible publicly and should be audio files of type .wav. For example if you wish to perform speaker diarization on your audio file named sample_audio.wma , you will upload this file in a folder named source_files inside bucket for example sample_bucket and this file url inside the bucket is to be publicly accessible.
* Once you have uploaded the respective files in the bucket of your choice, all you need to do is remember the name of the folder in which you uploaded your files, in this case source_files
* To initiate the diarization process, use the below api
    ```
    curl -X POST \
    http://localhost:3200/diarization-beta/speaker/longrunningrecogize2 \
    -H 'Accept: */*' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "source_files"
    }'
    ```
    [NOTE] For convenience purposes, the bucket name should be "diarization-bucket". Means if you want to upload all the wav files in a folder named source_files, the folder should go in "diarization-bucket" bucket.

* After a while you can visit localhost:3200/index.html to see if your files are properly diarized and visible. The data set will be available under the name of the folder you used. For example if your folder name was source_files then in the above url, the data will be available under the name source_files only

 # 2. To Perform Speaker Diarization using Diarization Visualizer utility (cloud utility)
 * There is another, more easier way to see speaker diarization work with some additional information, however this functionality can only diarize one file at a time. The advantage is that the status of diarization can be seen here using the utility.
 * The process is almost similar except few changes, obviously the installation step has to be performed before proceeding
 * Visit the link localhost:3200/cloud-utility/index.html and you will see the module which will help you diarize the audio files.
 * You need to provide the url of the .wav file in the first parameter. The .wav file url must be the url from your google cloud bucket and this url should be publicly accessible.
 * You can provide additional details in the following boxes but make sure you provide the correct number of speakers in the speker count section. This is done because the google speaker diarization apis need exact speaker count to diarize efficiently. For example if you are uploading a url of an audio file which has 5 speakers in it, then you should mention 5 in the speaker count value.
 * Once you have mentioned all the details, simply click submit (make sure your main speaker-diarization project is active) and wait for the process to start.
 * If the process has started successfully, you will see the completion status and a new button will be shown as soon as diarization is completed.
    ##### NOTE : For production purposes, the new button will always send you to the live version of the page, however for development purposes you can replace that deomain with localhost:3200 because the new data will be visible in the local version and not the live version.


# 3. To perform speaker Diarization using Zoom Apis
* The process of diarization is a little bit trickier as compared to the above two modules. However, it is much accurate the other two methods.
* Follow [this url](https://docs.google.com/document/d/1yvUdaCtF4wa1nbc5s9l_5JeDtXglquKyDl2UISVYrL4/edit?usp=sharing) to get started with speaker diarization using zoom apis


# [WANT TO CONTRIBUTE ?]

[ **Please Note** ] Contribution to the project without the consent of the repository owner is strictly probihited. Developers and contributors are welcome to start discussions on the issues reported on github / report new issues / suggest new features or changes to existing one but sending direct PRs without informing the owner will result in direct ban from using the repository or its codebase.

If you want to contribute, feel free to ping the project owners / maintainers or reach out the contributors to get yourself started.
