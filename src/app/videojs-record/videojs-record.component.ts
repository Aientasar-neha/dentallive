import { ContactService } from './../contact.service';
import { PatientService } from './../patient.service';
import { Component, OnDestroy } from '@angular/core';
import videojs from 'video.js';
import * as Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
import * as MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
Wavesurfer.microphone = MicrophonePlugin;
import * as Record from 'videojs-record/dist/videojs.record.js';
import { EmailService } from '../email.service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-videojs-record',
  templateUrl: './videojs-record.component.html',
  styleUrls: ['./videojs-record.component.css']
})
export class VideojsRecordComponent implements OnDestroy {

  private VideoConfig: any;
  VideoPlayer: any;

  private audioConfig: any;
  audioPlayer: any;

  private screenConfig: any;
  screenPlayer: any;

  private popupVideoConfig: any;
  private popupVideoPlayer: any;

  private plugin: any;

  latestVideoRecord = null;
  latestAudioRecord = null;
  latestScreenRecord = null;

  recordings = [];
  private attachmentNames = [];

  StepVideo = 1;
  StepAudio = 1;
  StepScreen = 1;

  sending = false;
  invalidForm = false;

  patientList = [];
  contactList = [];
  contactFilterdList = [];
  addressList = [];

  fileURL = "http://mail.dentallive.s3-website-us-west-2.amazonaws.com/file/";

  //supply headers
  private profile: any;
  private inReplyTo: string;
  private references: string;
  private subUserId: number;
  private fromAddress: string;
  private username: string;
  private form: any;

  // constructor initializes our declared vars
  constructor(private router: Router, private Service: EmailService, private PatientService: PatientService, private contactService: ContactService) {
    this.initPlayers();
    this.username = "Dental-Live Admin";
    this.profile = "https://www.atpplanner.com/users/17.jpg?timestamp=1619256767817";
    this.subUserId = 123;
    this.fromAddress = sessionStorage.getItem("dentalId");
    this.fetchData();
  }

  ngAfterViewInit() {
    this.VideoPlayer = videojs(document.getElementById('videoPlayer'), this.VideoConfig);
    this.VideoPlayer.on('finishRecord', () => {
      this.latestVideoRecord = this.VideoPlayer.recordedData;
      this.VideoPlayer.record().stopDevice();
    });
    this.VideoPlayer.on('deviceError', (e) => console.log(e));
    this.VideoPlayer.on('error', (e) => console.log(e));
    this.VideoPlayer.on('deviceReady', () => this.StepVideo = 2);
    this.VideoPlayer.on('startRecord', () => this.StepVideo = 3);
    this.VideoPlayer.on('stopRecord', () => {
      if (this.StepVideo != 5)
        this.StepVideo = 5;
    });

    this.audioPlayer = videojs(document.getElementById('audioPlayer'), this.audioConfig);
    this.audioPlayer.on('finishRecord', () => {
      this.latestAudioRecord = this.audioPlayer.recordedData;
      this.audioPlayer.record().stopDevice();
    });

    this.audioPlayer.on('deviceReady', () => this.StepAudio = 2);
    this.audioPlayer.on('startRecord', () => this.StepAudio = 3);
    this.audioPlayer.on('stopRecord', () => {
      if (this.StepAudio != 5)
        this.StepAudio = 5
    });

    this.screenPlayer = videojs(document.getElementById('screenPlayer'), this.screenConfig);
    this.screenPlayer.on('finishRecord', () => {
      this.latestScreenRecord = this.screenPlayer.recordedData;
      this.screenPlayer.record().stopDevice();
    });

    this.screenPlayer.on('deviceReady', () => this.StepScreen = 2);
    this.screenPlayer.on('startRecord', () => this.StepScreen = 3);
    this.screenPlayer.on('stopRecord', () => {
      if (this.StepScreen != 5)
        this.StepScreen = 5
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

  initPlayers() {
    this.VideoPlayer = false;
    this.audioPlayer = false;
    this.screenPlayer = false;
    this.popupVideoPlayer = false;
    this.plugin = Record;

    this.VideoConfig = {
      controls: true,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: true,
          maxLength: 1800,
          video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 }
          },
          // dimensions of captured video frames
          frameWidth: 1920,
          frameHeight: 1080
        }
      }
    };

    this.audioConfig = {
      controls: true,
      width: 320,
      height: 240,
      plugins: {
        wavesurfer: {
          backend: 'WebAudio',
          waveColor: '#D32F2F',
          progressColor: 'black',
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
          maxLength: 1800,
        }
      }
    }

    this.screenConfig = {
      controls: true,
      bigPlayButton: false,
      width: 320,
      height: 240,
      plugins: {
        record: {
          audio: true,
          screen: true,
          maxLength: 1800,
          pip: true
        }
      }
    };

    this.popupVideoConfig = {
      controls: false,
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
  istouched = false;

  addtoList(value, to) {
    if (value && value != '') {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(value).toLowerCase())) {
        this.addressList.push(value);
        to.value = '';
      } else {
        to.value = '';
        return false;
      }
    }
  }

  addMail(event, value, to) {
    console.log(event.key);
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(value).toLowerCase())) {
      if (event.key === "Enter" || event.key === ",") {
        this.addtoList(value, to)
        return false;
      }
    } else {
      if (event.key === "Enter" || event.key === ",")
        return false;
    }
  }
  filterContact(val) {
    if (val == "")
      return;
    let newList = this.contactList.filter(function (contact) {
      return (contact.ContactfirstName.includes(val) || contact.ContactlastName.includes(val) || contact.emailAddress.includes(val))
    });
    this.contactFilterdList = newList;
  }

  fetchData() {
    this.PatientService.readPatientdata({ "user": sessionStorage.getItem("user") })
      .subscribe(Response => {
        if (Response["users"]) {
          this.patientList = Response["users"];
        }
      }, error => {
        console.log(error);
        return null;
      })

    this.contactService.readContactdata({ "user": sessionStorage.getItem("user") })
      .subscribe(Response => {
        if (Response["users"]) {
          this.contactList = Response["users"];
          this.contactFilterdList = this.contactList;
        }
      }, error => {
        console.log(error);
        return null;
      })
  }
  addVideo(name) {
    name = name + ".mp4"
    if (this.latestVideoRecord) {
      this.recordings.push({ 'name': name, 'data': this.latestVideoRecord });
      this.latestVideoRecord = null;
      this.VideoPlayer.record().reset();
    }
  }

  addAudio(name) {
    name = name + ".mp3"
    if (this.latestAudioRecord) {
      this.recordings.push({ 'name': name, 'data': this.latestAudioRecord });
      this.latestAudioRecord = null;
      this.audioPlayer.record().reset();
    }
  }

  addScreen(name) {
    name = name + ".mp4"
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
    this.Service.getPreSignedUrl(elem.name, 'put')
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
            this.sending = false;
          })
      }, error => {
        console.log(error);
        swal("Error sending email,please try again");
        this.sending = false;
      })
  }

  savetoDB() {

    //create html div and text using links
    let htmlText = this.form.value.message;
    let plainText = this.form.value.message + "\n";
    this.attachmentNames.forEach(element => {
      htmlText = htmlText + '<br><br><br><a style="margin-top:10px;display: inline-block;width: 200px;margin-right: 20px;" href="' + this.fileURL + element.name + '" target="_blank"><img src="' + this.profile + '" alt="' + element.name + '" width="200"><strong style="display:block;width:100%;text-align:center;margin-top:15px;">' + element.name + '</strong></a>'
      plainText = plainText + '\n\n' + this.fileURL + element.name + '\n' + element.name;
    });

    let json: JSON = this.form.value;
    json['name'] = this.username;
    json['fromAddress'] = this.fromAddress;
    json['inReplyTo'] = this.inReplyTo;
    json['references'] = this.references;
    json['subUserId'] = this.subUserId;
    json['htmlText'] = htmlText;
    json['plainText'] = plainText;
    json['loggedUser'] = sessionStorage.getItem("user");
    json['toAddresses'] = this.addressList.join(',');

    console.log(json);

    // this.Service.sendMail(json)
    //   .subscribe(Response => {
    //     swal("Email sent succesfully");
    //     this.sending = false;
    //     this.router.navigate(['/mail/inbox']);
    //   }, error => {
    //     console.log(error);
    //     swal("Error sending email,please try again");
    //     this.sending = false;
    //   })
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
    console.log(this.recordings);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: ['Cancel', 'Ok'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          attachment.classList.add('animate__lightSpeedOutRight');
          setTimeout(() => {
            this.recordings.splice(index, 1);
            console.log(this.recordings);
          }, 500);
        }
      });
  }

  onSubmit = function (form: NgForm) {

    if (form.invalid || this.addressList.length == 0) {
      form.form.markAllAsTouched();
      this.istouched = true;
      this.invalidForm = true;
      return;
    }

    this.sending = true;
    this.form = form;

    if (this.recordings.length == 0) {
      this.savetoDB();
      return;
    }

    //get all s3 links
    this.recordings.forEach(elem => {
      this.saveFile(elem);
    });
  }

}