var recordingPlayer;
var button = document.createElement("Start");;
var button2;
var baseDataKey;
var sessionCount = 0;

var recording_upload_status = false;

var MAX_SLICE_SIZE = 1024 * 1024; // 1MB chunk sizes.
var MAX_ALLOWED_UPLOAD_ERRORS = 50;

var captureresolution = {
      width: 640,
      height: 480
};
var resolution = {
      width: 640,
      height: 480
};

var params = {},
    r = /([^&=]+)=?([^&]*)/g;
function d(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
}

var match, search = window.location.search;
while (match = r.exec(search.substring(1))) {
    params[d(match[1])] = d(match[2]);
    if(d(match[2]) === 'true' || d(match[2]) === 'false') {
        params[d(match[1])] = d(match[2]) === 'true' ? true : false;
    }
}

window.params = params;

var commonConfig = {
    onMediaCaptured: function(stream) {
        button.stream = stream;
        if(button.mediaCapturedCallback) {
            button.mediaCapturedCallback();
        }
    },
};

button.mediaCapturedCallback = function() {
    console.log("canvas width:", resolution.width);
    console.log("canvas height:", resolution.height);

    button.recordRTC = RecordRTC(button.stream, {
        type: 'video',
        disableLogs: params.disableLogs || false,
        canvas: {
            width: resolution.width || 320,
            height: resolution.height || 240
        },
        frameInterval: typeof params.frameInterval !== 'undefined' ? parseInt(params.frameInterval) : 20 // minimum time between pushing frames to Whammy (in milliseconds)
    });
};

function stopRecording(){
    if(button.recordRTC) {
        button.recordRTC.stopRecording(function(url) {
            console.log(button.recordRTC.blob);      
            var videoRecording = new MyRecording(url,"video",button.recordRTC.blob);
            console.log("video blob size:"+videoRecording.blob.size);

            videoRecording.startUploading();         
            console.log("it's at three");

        });
    } 
    return;
}

function startRecordingAfterActive(){
    console.log(button.recordRTC);
    button.recordRTC.startRecording();
}

function stopRecordingOnHangup(){
    baseDataKey = session_key + "_" + user_name;
    stopRecording();    
}

function stopStream() {
    if(button.stream && button.stream.stop) {
        button.stream.stop();
        button.stream = null;
        recordingPlayer.src = null;
        recordingPlayer.srcObject = null;
    }
}

function captureVideo(config) {

    captureUserMedia({video: { 
                width: {min: 320, ideal: captureresolution.width, max: 1920},
                height: {min: 240, ideal: captureresolution.height, max: 1080}}, audio: true}, function(videoStream) {
        recordingPlayer = document.getElementById('local_video');

        recordingPlayer.srcObject = videoStream;
        recordingPlayer.play();

        console.log(videoStream);

        button.stream = videoStream;
        button.recordRTC = RecordRTC(videoStream, {
        type: 'video',
        disableLogs: params.disableLogs || false,
        canvas: {
            width: resolution.width || 320,
            height: resolution.height || 240
        },
            frameInterval: typeof params.frameInterval !== 'undefined' ? parseInt(params.frameInterval) : 20 // minimum time between pushing frames to Whammy (in milliseconds)
        });
    });
	
};

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

function upload(recordRTC) {    
    uploadToServer(recordRTC, function(progress, fileURL) {
    });
}

function uploadToServer(recordRTC, callback) {
    var blob = recordRTC instanceof Blob ? recordRTC : recordRTC.blob;
    var fileType = blob.type.split('/')[0] || 'audio';
    console.log(fileType);
    var fileName = baseDataKey;
    sessionCount += 1;
    fileName += "_" + '.webm';
    console.log(fileName);
    console.log(blob);


    // create FormData
    var formData = new FormData();
    formData.append(fileType + '-filename', fileName);
    formData.append(fileType + '-blob', blob);

    //realFaces.socket.socketio.emit("uploader", formData);

    callback('Uploading ' + fileType + ' recording to server.');
    makeXMLHttpRequest('https://conference.eastus.cloudapp.azure.com/RocConf/response.php?action=upload', formData, function(progress) {
        if (progress !== 'upload-ended') {
            callback(progress);
            return;
        }
		recording_upload_status = true;
		console.log("RECORDING STATUS: " + recording_upload_status);
        var initialURL = location.href.replace(location.href.split('/').pop(), '') + 'uploads/';
        callback('ended', initialURL + fileName);
    });
}

function makeXMLHttpRequest(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback('upload-ended');			
        }
    };
    request.upload.onloadstart = function() {
        callback('Upload started...');
    };
    request.upload.onprogress = function(event) {
        callback('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
    };
    request.upload.onload = function() {
        callback('progress-about-to-end');
    };
    request.upload.onload = function() {
        callback('progress-ended');
    };
    request.upload.onerror = function(error) {
        callback('Failed to upload to server');
        console.error('XMLHttpRequest failed', error);
    };
    request.upload.onabort = function(error) {
        callback('Upload aborted.');
        console.error('XMLHttpRequest aborted', error);
    };

    console.log(url);
    request.open('POST', url);
    request.send(data);
}

//=====================================================
function MyRecording(blobURL, type, blob){
    this.blobURL = blobURL;
    this.type = type;
    this.uploadFilePartsCount = 0;
    this.lastFileSlice = 0; 
    this.fileUploadErrors = 0;
    this.blob = blob;
}

MyRecording.prototype.toURL = function() {
    return this.blobURL;
}

MyRecording.prototype.startUploading = function() {
    sessionCount += 1;

    if (this.blob.size > MAX_SLICE_SIZE) {
      this.uploadFileToServer(this.blob.slice(0,MAX_SLICE_SIZE,this.blob.type));
    } else {
      this.uploadFileToServer(this.blob.slice(0,this.blob.size,this.blob.type));
    }
}

MyRecording.prototype.uploadFileToServer = function(blob_slice) {
  console.log("lastFileSlice: "+this.lastFileSlice);

  var fileName = baseDataKey;
  fileName += "_" + sessionCount + '.webm';
  
  var formData = new FormData();
  formData.append('blob', blob_slice, fileName);
    
  var request = new XMLHttpRequest();
  var recorder = this;
  
  request.upload.addEventListener("progress", function(evt) {
    if (evt.lengthComputable) {
      //progressBar.value = evt.loaded+recorder.lastFileSlice;
      percentageCalc = Math.min(Math.round(100*(evt.loaded+recorder.lastFileSlice) / recorder.blob.size),100);
      console.log(percentageCalc);
	  
      if(pendingUploads <= 1)
         document.getElementById('percentageCalc').innerHTML = percentageCalc;
      //percentageCalc.title = percentageCalc.innerHTML;
    }
  }, false);

  request.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        recorder.uploadFileToServerCallback(this.responseText);
      } else {
        console.log("Error message: "+this.responseText);
        recorder.uploadFileToServerErrorCallback();
      }
    } else {
      console.log("uploadFileToServer()","readyState",this.readyState,"status",this.status);
    }
  };

  request.open('POST', "https://conference.eastus.cloudapp.azure.com/RocConf/response.php?action=upload");
  request.send(formData);
  
  console.log("this.uploadFilePartsCount",this.uploadFilePartsCount);

  this.uploadFilePartsCount += 1;
  this.lastFileSlice += blob_slice.size;
}

MyRecording.prototype.uploadFileToServerCallback = function(message) {
  this.fileUploadErrors = 0;

  console.log(this.uploadFilePartsCount+" upload result: "+message);

  if (this.blob.size - this.lastFileSlice > MAX_SLICE_SIZE) {
    this.uploadFileToServer(this.blob.slice(this.lastFileSlice,this.lastFileSlice+MAX_SLICE_SIZE,"video/webm"));
  } else if (this.blob.size - this.lastFileSlice <= MAX_SLICE_SIZE && this.blob.size - this.lastFileSlice > 0) {
    this.uploadFileToServer(this.blob.slice(this.lastFileSlice,this.blob.size));
  } else {
	recording_upload_status = true;
    pendingUploads -= 1;
    console.log("number of uploads: ", pendingUploads);
    if(pendingUploads == 0){
        if(sessionCount > 7){
            $("#post").html("<h2>Session ID: " + baseDataKey + "</h2>");
        }else{
            $("#post").html("<a href='demo_session2.php?dataKey="+baseDataKey+"'>Continue to next session</a>");
        }
    }
  }
}

MyRecording.prototype.uploadFileToServerErrorCallback = function() {
  console.log(this.type+" upload error! number: "+this.fileUploadErrors);

  if (this.lastFileSlice > 0 && this.fileUploadErrors < MAX_ALLOWED_UPLOAD_ERRORS) {
    console.log("try to upload again");
    this.uploadFilePartsCount -= 1;
    if (this.lastFileSlice%MAX_SLICE_SIZE > 0) {
      this.lastFileSlice -= this.lastFileSlice%MAX_SLICE_SIZE;
      this.uploadFileToServer(this.blob.slice(this.lastFileSlice,this.blob.size));
    } else {
      this.lastFileSlice -= MAX_SLICE_SIZE;
      this.uploadFileToServer(this.blob.slice(this.lastFileSlice,this.lastFileSlice+MAX_SLICE_SIZE));
    }
    this.fileUploadErrors += 1;
  } else {
    console.log("Too many errors or invalid "+this.type+" slice number: "+this.lastFileSlice);
  }
}

function setcaptureResolution(param){
  console.log(param);
  if(param == 240)
  {
    captureresolution = {
      width: 320,
      height: 240
    };
  }else if(param == 320){
    captureresolution = {
      width: 480,
      height: 360
    };
  }else if(param == 480){
    captureresolution = {
      width: 640,
      height: 480
    };
  }else if(param == 720){
    captureresolution = {
      width: 1280,
      height: 720
    };
  }else if(param == 1080){
    captureresolution = {
      width: 1920,
      height: 1080
    };
  }
  captureVideo(commonConfig);
}

function setResolution(param){
  if(param == 240)
  {
    resolution = {
      width: 320,
      height: 240
    };
  }else if(param == 320)
  {
    resolution = {
      width: 480,
      height: 320
    };
  }else if(param == 480){
    resolution = {
      width: 640,
      height: 480
    };

  }else if(param == 720){
    resolution = {
      width: 1280,
      height: 720
    };

  }else if(param == 1080){
    resolution = {
      width: 1920,
      height: 1080
    };
  }
  captureVideo(commonConfig);
}
