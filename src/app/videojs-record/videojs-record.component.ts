import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';
// Required imports when recording audio-only using the videojs-wavesurfer plugin
import * as Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
import * as MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
Wavesurfer.microphone = MicrophonePlugin;
// Register videojs-wavesurfer plugin

// register videojs-record plugin with this import
import * as Record from 'videojs-record/dist/videojs.record.js';

@Component({
  selector: 'app-videojs-record',
  templateUrl: './videojs-record.component.html',
  styleUrls: ['./videojs-record.component.css']
})
export class VideojsRecordComponent implements OnInit, OnDestroy {

  // reference to the element itself: used to access events and methods
  private _elementRef: ElementRef

  // index to create unique ID for component
  idx = 'clip1';

  private config: any;
  private player: any;

  private audioConfig: any;
  private audioPlayer: any;

  private screenConfig: any;
  private screenPlayer: any;

  private plugin: any;

  // constructor initializes our declared vars
  constructor(elementRef: ElementRef) {
    this.player = false;
    this.audioPlayer = false;
    this.screenPlayer = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: true,
      bigPlayButton: false,
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
        }
      }
    };
  }

  ngOnInit() { }

  // use ngAfterViewInit to make sure we initialize the videojs element
  // after the component template itself has been rendered
  ngAfterViewInit() {
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;
    let el1 = 'audio_' + this.idx;
    let el2 = 'screen_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });

    // setup the player via the unique element ID
    this.audioPlayer = videojs(document.getElementById(el1), this.audioConfig, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.audioPlayer.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.audioPlayer.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.audioPlayer.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.audioPlayer.recordedData);
    });

    // error handling
    this.audioPlayer.on('error', (element, error) => {
      console.warn(error);
    });

    this.audioPlayer.on('deviceError', () => {
      console.error('device error:', this.audioPlayer.deviceErrorCode);
    });

    // setup the player via the unique element ID
    this.screenPlayer = videojs(document.getElementById(el2), this.screenConfig, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.screenPlayer.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.screenPlayer.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.screenPlayer.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.audioPlayer.recordedData);
    });

    // error handling
    this.screenPlayer.on('error', (element, error) => {
      console.warn(error);
    });

    this.screenPlayer.on('deviceError', () => {
      console.error('device error:', this.audioPlayer.deviceErrorCode);
    });
  }

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
    if (this.audioPlayer) {
      this.audioPlayer.dispose();
      this.audioPlayer = false;
    }
    if (this.screenPlayer) {
      this.screenPlayer.dispose();
      this.screenPlayer.
        this.screenPlayer = false;
    }
  }

}