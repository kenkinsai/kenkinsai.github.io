/*global translate*/
import React, { Component } from 'react'
import Loading from './rxLoading'
global.isclient && require('./rxAudioRecord.css')
const { secondToTime } = global.rootRequire('classes/ulti')
const Recorder = global.rootRequire('classes/recorder')

class RxAudioRecord extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {   
      currentCount: 0,
      pause: false,
      showPopup: false,
      success: false,
      group_id:this.props.group_id
    }

    this.recorder = null
    this.localStream = null
    this.onSuccessRecording = this.onSuccessRecording.bind(this)
    this.onFailRecording = this.onFailRecording.bind(this)
  }

  componentDidMount() {
    window.URL = window.URL || window.webkitURL
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.state.group_id !== nextProps.group_id){
      this.cancelRecord()
      this.setState({group_id:nextProps.group_id})
    }
  }
  componentWillUnmount() {
    clearInterval(this.intervalId)
    this.recorder = null
  }

  timer() {
    this.setState({
      currentCount: this.state.currentCount + 1
    })
    if (this.state.currentCount > 59) {
      clearInterval(this.intervalId)
      if (this.recorder) {
        // this.recorder.stop()
        // this.recorder = null
        // try {
        //   let track = this.localStream.getTracks()[0]
        //   track.stop()
        // } catch (e) { }
        this.pauseRecord()
      }
    }
  }

  pauseRecord(e) {
    e && e.preventDefault()
    this.setState({ pause: true }, () => {
      clearInterval(this.intervalId)
    })
    console.log(this.recorder)
    if (this.recorder) {
      this.recorder.exportMonoWAV((blob) => {
        let filename = 'netalo_audio_' + Math.floor(Date.now()) + '.wav'
        let file = this.blobToFile(blob, filename)
        var urlCreator = window.URL || window.webkitURL
        var audioUrl = urlCreator.createObjectURL(file)
        let audio = document.getElementById('id-audio-record')
        audio.src = audioUrl
        this.file = file
      })
    }
  }

  cancelRecord() {
    this.setState({ pause: false, currentCount: 0, showPopup: false }, () => {
      if (this.recorder) {
        this.recorder.stop()
        this.recorder = null
        this.file = null
        try {
          let track = this.localStream.getTracks()[0]
          track.stop()
        } catch (e) { }
      }
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
    })
  }

  sendingRecord(e) {
    this.setState({success:true})
    // this.uploadFile()
    this.stopRecording()
  }

  onFailRecording(e) {
    console.log('Rejected!', e)
  }

  onSuccessRecording(s) {
    this.localStream = s
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    let context = new (window.AudioContext)()
    let mediaStreamSource = context.createMediaStreamSource(this.localStream)
    this.recorder = new window.Recorder(mediaStreamSource)
    this.recorder.record()
  }

  startRecording() {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, this.onSuccessRecording, this.onFailRecording)
    } else {
      console.log('navigator.getUserMedia not present')
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.exportMonoWAV((blob) => {
        let filename = 'netalo_audio_' + Math.floor(Date.now()) + '.wav'
        let file = this.blobToFile(blob, filename)
        this.uploadFile(file)
      })
    }
  }

  uploadFile(file = this.file) {
    let checkExtFile = true
    let ext = this.getExtension(file['name'])
    if (['wav'].indexOf(ext) === -1) { checkExtFile = false }

    if (checkExtFile) {
      if (typeof (file) !== 'undefined') {
        let fileSize = file.size

        let dataParams = {
          content_type: 'audio/m4a',
          name: 'netalo_file_' + Math.floor(Date.now()),
          public: true,
          size: fileSize
        }
        let header = { 'TC-Token': this.props.token, 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Encoding': 'gzip', 'Connection': 'keep-alive' }
        let requestOptions = {
          method: 'POST',
          headers: header,
          body: JSON.stringify(dataParams),
          redirect: 'follow'
        };
        fetch(global.rxu.config.create_blob, requestOptions).then(res => res.json()).then((json) => {
          if (json && json.blod_object && json.blod_object.form_data) {
            let dataUpload = new FormData()
            let arrKeys = ['Content-Type', 'key', 'policy', 'x-amz-algorithm', 'x-amz-credential', 'x-amz-date', 'x-amz-meta-netachat', 'x-amz-signature']
            for (let key of arrKeys) {
              if (json.blod_object.form_data[key]) {
                dataUpload.append(key, json.blod_object.form_data[key])
              }
            }
            dataUpload.append('file', file, file.name)
            dataUpload.append('success_action_status', 201)

            fetch(json.blod_object.params, { method: 'POST', body: dataUpload }).then(resBlob => resBlob.text()).then(result => {
              if (result.indexOf('Key') !== -1) {
                let patt = '<Key.*?>(.*?)<\\/Key>';
                let strresult = result.match(patt);
                if (strresult && strresult.constructor === Array && strresult.length > 1) {
                  let key = strresult[1]
                  if (key) {
                    let optComplete = {
                      method: 'PUT',
                      headers: header,
                      body: JSON.stringify({
                        content_type: json.content_type,
                        id: json.id,
                        name: json.name,
                        size: json.size,
                        uid: json.uid
                      })
                    };

                    fetch(global.rxu.config.get_blobs + '/' + json.id + '/complete.json', optComplete)
                      .then(response => {
                        if (response.status === 200) {
                          try {
                            let objSize = {
                              duration: this.state.currentCount,
                              url: key
                            }
                            this.props.callback([objSize], 'audio')
                            this.cancelRecord()
                          } catch (e) {
                            this.cancelRecord()
                          }
                        }
                      })
                      .catch(errorPut => {
                        console.log('error', errorPut)
                        this.cancelRecord()
                      });
                  }
                }
              }
            }).catch(error => {
              console.log('error', error)
              this.cancelRecord()
            })
          }
        }).catch(error => {
          console.log('error', error)
          this.cancelRecord()
        })
      }
    } else {
      alert(translate('The file format is not suitable. Please select the file as .wav'))
    }
  }

  getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
  }

  blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  togglePopup() {
    let clickRecordStatus = true
    this.props.onClick(clickRecordStatus)

    this.setState({ showPopup: !this.state.showPopup }, () => {
      if (this.state.showPopup) {
        this.startRecording()
        this.intervalId = setInterval(this.timer.bind(this), 1000)
      } else {
        if (this.recorder) {
          this.recorder.stop()
          this.recorder = null
        }
        try {
          let track = this.localStream.getTracks()[0]
          track.stop()
        } catch (e) { }
        if (this.intervalId) { clearInterval(this.intervalId) }
        this.setState({ currentCount: 0, pause: false })
      }
    })
    this.setState({success:false})
  }

  render() {

    return (
      <div className='box-audio-record-wrap'>
        <img src={'./images/default/static/icon-camera.svg'} alt='icon-like' className='icons-btn filter_img_class' onClick={e => this.togglePopup()} />
        {this.state.showPopup && <div className='box-audio-record'>
          {/*<audio id='id-audio-record' controls autoPlay style={{ display: 'none' }}></audio>*/}
          <div className='box-audio-record-body'>
            {(this.state.success) ? <Loading /> : null
            }
            {this.state.pause ? <div className="audio-prevew">
              <audio id='id-audio-record' controls >                
              </audio>
              <div className='audio-record-desc'>
              {secondToTime(this.state.currentCount)}
            </div>
            </div>:
            <div className='audio-record-timer'>
              {secondToTime(this.state.currentCount)}
            </div>}
            <div className='audio-record-desc'>
              {translate('The recording upto 1 minute')}
            </div>
            {!this.state.pause && <div className='audio-record-button' onClick={(e) => this.pauseRecord(e)}>
              {translate('Stop recording')}</div>}
            {this.state.pause && <div className='audio-record-btn'>
              <div className='audio-record-cancel' onClick={(e) => this.cancelRecord(e)}>
                {translate('Cancel')} 
              </div>
              <div className='audio-record-continue' onClick={(e) => this.sendingRecord(e)}>
                {translate('Send')} 
              </div>
            </div>}

          </div>
          <div className='audio-record-box-tail'><i className='icon-audio-record_box-tail'></i></div>
        </div>}

      </div>
    )
  }
}

RxAudioRecord.defaultProps = { onChange: () => { }, onClick: () => { } }
export default RxAudioRecord
