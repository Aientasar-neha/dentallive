import { Component, OnDestroy } from '@angular/core';
import videojs from 'video.js';
import * as Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
import * as MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
Wavesurfer.microphone = MicrophonePlugin;
import * as Record from 'videojs-record/dist/videojs.record.js';
import { EmailService } from '../email.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-videojs-record',
  templateUrl: './videojs-record.component.html',
  styleUrls: ['./videojs-record.component.css']
})
export class VideojsRecordComponent implements OnDestroy {

  private VideoConfig: any;
  VideoPlayer: any;

  private audioConfig: any;
  private audioPlayer: any;

  private screenConfig: any;
  private screenPlayer: any;

  private popupVideoConfig: any;
  private popupVideoPlayer: any;

  private plugin: any;

  latestVideoRecord = null;
  latestAudioRecord = null;
  latestScreenRecord = null;

  recordings = [];
  private attachmentNames = [];

  //supply headers
  private profile: any;
  private inReplyTo: string;
  private references: string;
  private subUserId: number;
  private fromAddress: string;
  private username: string;
  private form: any;

  initPlayers() {
    this.VideoPlayer = false;
    this.audioPlayer = false;
    this.screenPlayer = false;
    this.popupVideoPlayer = false;
    this.plugin = Record;

    this.VideoConfig = {
      controls: true,
      bigPlayButton: true,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: true,
          video: true,
          maxLength: 20,
        }
      }
    };

    this.audioConfig = {
      controls: true,
      bigPlayButton: false,
      width: 320,
      height: 240,
      plugins: {
        wavesurfer: {
          backend: 'WebAudio',
          waveColor: '#fff',
          progressColor: 'black',
          displayMilliseconds: true,
          debug: true,
          cursorWidth: 1,
          hideScrollbar: true,
          plugins: [
            // enable microphone plugin
            Wavesurfer.microphone.create({
              bufferSize: 4096,
              numberOfInputChannels: 1,
              numberOfOutputChannels: 1,
              constraints: {
                video: false,
                audio: true
              }
            })
          ]
        },
        record: {
          audio: true,
          video: false,
          maxLength: 20,
        }
      }
    }

    this.screenConfig = {
      controls: true,
      bigPlayButton: false,
      width: 320,
      height: 240,
      fluid: false,
      controlBar: {
        fullscreenToggle: false
      },
      plugins: {
        record: {
          audio: true,
          screen: true,
          maxLength: 60,
          pip: true
        }
      }
    };

    this.popupVideoConfig = {
      controls: false,
      bigPlayButton: false,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: false,
          video: true,
          pip: true,
        }
      }
    };
  }

  // constructor initializes our declared vars
  constructor(private Service: EmailService) {
    this.initPlayers();

    this.username = "Mohd Nihar";
    this.profile = "https://images.theconversation.com/files/304957/original/file-20191203-66986-im7o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip";
    this.subUserId = 123;
    this.fromAddress = "niharTest@dentallive.tk"

  }

  ngAfterViewInit() {

    this.VideoPlayer = videojs(document.getElementById('videoPlayer'), this.VideoConfig);

    this.VideoPlayer.on('finishRecord', () => {
      this.latestVideoRecord = this.VideoPlayer.recordedData;
      this.VideoPlayer.record().stopDevice();
    });

    this.audioPlayer = videojs(document.getElementById('audioPlayer'), this.audioConfig);
    this.audioPlayer.on('finishRecord', () => {
      this.latestAudioRecord = this.audioPlayer.recordedData;
      this.audioPlayer.record().stopDevice();
    });

    this.screenPlayer = videojs(document.getElementById('screenPlayer'), this.screenConfig);
    this.screenPlayer.on('finishRecord', () => {
      this.latestScreenRecord = this.screenPlayer.recordedData;
      this.screenPlayer.record().stopDevice();
    });

    this.popupVideoPlayer = videojs(document.getElementById('popupVideoPlayer'), this.popupVideoConfig);
    this.popupVideoPlayer.on('deviceReady', () => {
      console.log('device reday');
      this.popupVideoPlayer.requestPictureInPicture();
    });
    this.popupVideoPlayer.on('leavePIP', () => {
      console.log('leavePIP');
      this.popupVideoPlayer.record().stopDevice();
      this.pipEnabled = false;
    });
  }

  // use ngOnDestroy to detach event handlers and remove the VideoPlayer
  ngOnDestroy() {
    if (this.VideoPlayer) {
      this.VideoPlayer.dispose();
      this.VideoPlayer = false;
    }
    if (this.audioPlayer) {
      this.audioPlayer.dispose();
      this.audioPlayer = false;
    }
    if (this.screenPlayer) {
      this.screenPlayer.dispose();
      this.screenPlayer = false;
    }
    if (this.popupVideoPlayer) {
      this.popupVideoPlayer.dispose();
      this.popupVideoPlayer = false;
    }
  }

  addVideo(name) {
    name = name + ".MP4"
    if (this.latestVideoRecord) {
      this.recordings.push({ 'name': name, 'data': this.latestVideoRecord });
      this.latestVideoRecord = null;
      this.VideoPlayer.record().reset();
    }
  }

  addAudio(name) {
    name = name + ".MP3"
    if (this.latestAudioRecord) {
      this.recordings.push({ 'name': name, 'data': this.latestAudioRecord });
      this.latestAudioRecord = null;
      this.audioPlayer.record().reset();
    }
  }

  addScreen(name) {
    name = name + ".MP4"
    if (this.latestScreenRecord) {
      this.recordings.push({ 'name': name, 'data': this.latestScreenRecord });
      this.latestScreenRecord = null;
      this.screenPlayer.record().reset();
    }
  }

  pipEnabled = false;
  togglePictureInPicture() {
    if (!('pictureInPictureEnabled' in document)) {
      swal("Your Browser dosent support this feature,please use Goole Chrome or Safari for this Feature");
    } else {
      if (!this.pipEnabled) {
        this.popupVideoPlayer.record().getDevice();
      }
      this.pipEnabled = !this.pipEnabled;
    }
  }

  saveFile(elem) {
    this.Service.getPreSignedUrl(elem.name)
      .subscribe(Response => {
        if (!Response || !Response['url'])
          return swal("Error sending email,please try again");
        this.Service.saveDataS3(elem.data, Response['url'])
          .subscribe(Response_nested => {
            this.attachmentNames.push({ 'name': elem.name, 'url': Response['url'] })
            this.recordings.splice(this.recordings.indexOf(elem), 1);
            console.log(Response_nested);
            if (this.recordings.length == 0) {
              this.savetoDB();
            }
          }, error => {
            console.log(error);
            swal("Error sending email,please try again");
          })
      }, error => {
        console.log(error);
        swal("Error sending email,please try again");
      })
  }

  savetoDB() {
    //create html div and text using links
    let htmlText = this.form.value.message;
    let plainText = this.form.value.message + "\n";
    this.attachmentNames.forEach(element => {
      htmlText = htmlText + '<br><br><br><a style="margin-top:10px;display: inline-block;width: 200px;margin-right: 20px;" href="' + element.url + '" target="_blank"><img src="' + this.profile + '" alt="' + element.name + '" width="200"><strong style="display:block;width:100%;text-align:center;margin-top:15px;">' + element.name + '</strong></a>'
      plainText = plainText + '\n\n' + element.url + '\n' + element.name;
    });

    let json: JSON = this.form.value;
    json['name'] = this.username;
    json['fromAddress'] = this.fromAddress;
    json['inReplyTo'] = this.inReplyTo;
    json['references'] = this.references;
    json['subUserId'] = this.subUserId;
    json['htmlText'] = htmlText;
    json['plainText'] = plainText;

    this.Service.sendMail(json)
      .subscribe(Response => {
        swal("Email sent succesfully");
      }, error => {
        console.log(error);
        swal("Error sending email,please try again");
      })
  }

  loadFiles = function (event) {
    console.log(event);
    if (event.target.files.length > 0) {
      Array.from(event.target.files).forEach(element => {
        this.recordings.push({ 'name': element["name"], 'data': element });
      });
    }
  }

  removeFiles(index, attachment) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          attachment.classList.add('animate__fadeOutRightBig');
          setTimeout(() => {
            attachment.classList.add('animate__slideOutUp');
          }, 500);
          setTimeout(() => {
            this.recordings.splice(index, 1);
          }, 1000);
        }
      });
  }

  onSubmit = function (form) {
    this.form = form;

    if (this.recordings.length == 0) {
      this.savetoDB();
      return;
    }

    //get all s3 links
    this.recordings.forEach(elem => {
      console.log(elem);
      this.saveFile(elem);
    });
  }

}