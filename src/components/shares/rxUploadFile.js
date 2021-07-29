/*global translate*/
import React, { Component } from 'react'
global.isclient && require('./rxUploadFile.css')

class RxUploadFile extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      type: 0,
      flagPopup: false,
      theInputFileKey:''
    }
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.uploadFileImages = this.uploadFileImages.bind(this)
    this.uploadLoadingFile= this.uploadLoadingFile.bind(this)
    this.uploadInputImage = null
    this.uploadInputDoc = null
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({flagPopup: false})
    }
  }

  onClickDataUpload(e, type) {
    if (type === 'image') {
      this.uploadInputImage.click()
    } else if (type === 'doc') {
      this.uploadInputDoc.click()
    }
  }

  onChangeDataFile(e, type) {
    e.stopPropagation()
    e.preventDefault()
    if (this.props.token) {
      let fileList = e.target.files
      if (fileList && fileList.length > 0) {
        if (type === 'image') {
          if (this.isImage(fileList[0]['name'])) {
            this.uploadFileImages(fileList)
          } else if (this.isVideo(fileList[0]['name'])) {
            this.uploadFileVideos(fileList)
          } else {
            alert(translate('Formats not supported'))
          }
        } else if (type === 'doc') {
          this.uploadFileDoc(fileList)
        }
        this.setState({
          theInputFileKey: new Date().getTime().toString()
        });
      }
    }
  }

  uploadFileDoc(fileList) {
    let checkExtFile = true

    for (let i = 0; i < fileList.length; i++) {
      let ext = this.getExtension(fileList[i]['name']);
      if (['xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'pdf', 'numbers', 'key', 'pages', 'zip', 'm4a', 'mp3'].indexOf(ext) === -1) {
        checkExtFile = false
        break;
      }
    }
    if (checkExtFile) {                                  
      let arrImg = [], arrL=[]
      for (let i = 0; i < fileList.length; i++) {
        let ext = this.getExtension(fileList[i]['name']);
        if (typeof (fileList[i]) !== 'undefined') {
          let file = fileList[i]
          let fileSize = fileList[i].size
          // let extFilename = this.getExtension(fileList[i]['name'])

          if (fileSize < (1024*1024*100)) {
            let message_id = (Math.floor(Date.now())+i * 1000).toString()
            arrL.push(message_id)
            this.uploadLoadingFile(file,message_id,'file')
            let fileTypeTmp = file.type
            if(ext === 'numbers'){
              fileTypeTmp = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'// file type of xlsx file
            }

            if(ext === 'pages'){
              fileTypeTmp = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'// file type of docx file
            }

            if (['m4a','mp3'].indexOf(ext) !== -1 ) {
              fileTypeTmp = 'audio/m4a'
            }

            let dataParams = {
              content_type: fileTypeTmp,
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
                                if (arrL.length > 0) {
                                  let ele = document.getElementById(arrL[0]);
                                  // ele && ele.closest("div.zmessage_row").remove();
                                  if(ele){
                                    ele.closest("div.zmessage_row").style.display="none";
                                  }
                                }
                                let filename  = fileList[i]['name']
                                filename = filename.replace('.' + ext ,'')
                                let objSize = {
                                  file_extension: ext,
                                  file_name: filename,
                                  size: fileSize,
                                  url: key
                                }
                                
                                if (ext.indexOf('zip') !== -1) {
                                  objSize['file_extension'] = 'zip'
                                  objSize['file_name'] = fileList[i]['name'].replace('.zip', '')
                                }

                                arrImg.push(objSize)

                                if (arrImg.length === fileList.length) {
                                  this.setState({flagPopup: false}, () => {
                                    this.uploadInputImage = null
                                    this.uploadInputDoc = null
                                    this.props.callback(arrImg, 'file')
                                  })
                                  
                                }
                              } catch (e) { }
                            }
                          })
                          .catch(errorPut => console.log('error', errorPut));
                      }
                    }
                  }
                })
              }
            }).catch(error => console.log('error', error))
          } else {
            alert('File size is too large')
          }          
        }
      }
    } else {
      alert(translate('The file format is not suitable. Please select the file as .xlsx, .xls, .doc, .docx, .ppt, .pptx, .txt, .pdf, .numbers, .key, .pages, .zip'))
    }
  }

  uploadFileImages(fileList) {
    let checkExtFile = true
    for (let i = 0; i < fileList.length; i++) {
      if (['png', 'jpg'].indexOf(this.isImage(fileList[i]['name'])) === -1) {
        checkExtFile = false
        break;
      }
    }
    if (checkExtFile) {
      let arrImg = [], arrL=[]
      for (let i = 0; i < fileList.length; i++) {
        if (typeof (fileList[i]) !== 'undefined') {
          let file = fileList[i]
          let fileSize = fileList[i].size
          if (this.isImage(file.name) && ['png', 'jpg'].indexOf(this.isImage(file.name)) !== -1) {
            let extFilename = 'png'

            let _URL = window.URL || window.webkitURL
            let img = new Image();
            let objectUrl = _URL.createObjectURL(file)

            let message_id = (Math.floor(Date.now())+i * 1000).toString()
            arrL.push(message_id)
            this.uploadLoadingFile(file,message_id,'image')

            let dataParams = {
              content_type: 'image/' + extFilename,
              name: 'netalo_' + Math.floor(Date.now()),
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
                                if (i === fileList.length - 1) {
                                  arrL.map(il => {
                                    let ele = document.getElementById(il);
                                    // ele && ele.closest("div.zmessage_row").remove();
                                    if(ele){
                                      ele.closest("div.zmessage_row").style.display="none";
                                    }
                                    return
                                  })
                                }
                                img.onload = () => {
                                  let objSize = { width: img.width || 960, height: img.height || 720, url: key }
                                  arrImg.push(objSize)
                                  if (arrImg.length === fileList.length) {
                                    this.props.callback(arrImg, 'image')
                                    _URL.revokeObjectURL(objectUrl)
                                  }
                                }
                                img.src = objectUrl

                                this.setState({flagPopup: false}, () => {
                                  this.uploadInputImage = null
                                  this.uploadInputDoc = null
                                })

                              } catch (e) { }
                            }
                          })
                          .catch(errorPut => console.log('error', errorPut));
                      }
                    }
                  }
                })
              }
            }).catch(error => console.log('error', error))
          } else {
            alert(translate('The image file format is not suitable'))
          }
        }
      }
    } else {
      alert(translate('The image file format is not suitable. Please select the image file as .jpg or .png'))
    }
  }

  uploadLoadingFile(file,message_id,type){
    try {
      let fileType 
      let attachments
      let reader = new FileReader();
      let url = URL.createObjectURL(file)
      let that = this
      let params = {
            "message_id": message_id,
            "created_at": (Math.floor(Date.now()) * 1000).toString(),
            "group_id": that.props.group_id, "message": "",
            "sender_uin": that.props.userid,
            "updated_at": "0", "pinned_at": "0", "order_id": "0", "status": 0,
            // "type": fileType,
            // "attachments": attachments,
            "group_type": 2, "nonce": "", "version": 1, "is_encrypted": false
          }

      that.props.handleDragOut() 
      if (type === 'image') {
        const img = new Image()
        img.onload = function() { 
          params.type = 2
          params.attachments = `{"loading":true,"images":[{
                            "url":"${url}"}]}`
          that.props.handleMessage(params, true)     
        }
        img.src = url
      }
      if (type === 'video') {
        const video = document.createElement("video");
        video.src = url;
        video.addEventListener("loadedmetadata", function () {
          params.type = 4
          params.attachments = `{"loading":true,"video":{
                          "url":"${url}","width":"${this.videoWidth}","height":"${this.videoHeight}"}}`
          that.props.handleMessage(params, true) 
        });
      }
      if (type === 'file') {
        params.type = 12
        params.attachments = `{"loading":true,
                        "file":{
                          "url":"${url}",
                          "file_extension":"${this.getExtension(file['name'])}",
                          "size":"${file.size}",
                          "file_name":"${file.name}"                          
                        }}`
        that.props.handleMessage(params, true)  
      }
    } catch (error) {
    }
  }

  uploadThumnail(image, videokey) {
    if (image.base64 && image.width > 0) {
      let dataParams = {
        content_type: image.type,
        name: image.filename,
        public: true,
        size: image.size
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
          dataUpload.append('file', image.file, image.file.name)
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
                            width: image.videoWidth || 960,
                            height: image.videoHeight || 720,
                            thumbnail_url: key,
                            duration: image.duration,
                            url: videokey
                          }
                          this.props.callback([objSize], 'video')
                        } catch (e) { }
                      }
                    })
                    .catch(errorPut => console.log('error', errorPut));
                }
              }
            }
          })
        }
      }).catch(error => console.log('error', error))
    }
  }

  uploadVideo(file, image) {
    let arrL=[]
    let message_id = (Math.floor(Date.now()) * 1000).toString()
    arrL.push(message_id)
    this.uploadLoadingFile(file,message_id,'video')

    let dataParams = {
      content_type: 'video/mp4',
      name: 'netalo_video_' + Math.floor(Date.now()),
      public: true,
      size: file.size
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
                        if (arrL.length > 0) {
                          let ele = document.getElementById('video'+ arrL[0]);
                          // ele && ele.closest("div.zmessage_row").remove();
                          if(ele){
                            ele.closest("div.zmessage_row").style.display="none";
                          }
                        }
                        this.uploadThumnail(image, key)

                        this.setState({flagPopup: false}, () => {
                          this.uploadInputImage = null
                          this.uploadInputDoc = null
                        })
                      } catch (e) { }
                    }
                  })
                  .catch(errorPut => console.log('error', errorPut));
              }
            }
          }
        }).catch(error => {
          alert(translate('Video size is too large'))
        })
      }
    }).catch(error => console.log('error', error))
  }

  uploadFileVideos(fileList) {
    let checkExtFile = true
    for (let i = 0; i < fileList.length; i++) {
      if (['mp4'].indexOf(this.isVideo(fileList[i]['name'])) === -1) {
        checkExtFile = false
        break;
      }
    }
    if (checkExtFile) {
      for (let i = 0; i < fileList.length; i++) {
        if (typeof (fileList[i]) !== 'undefined') {
          let file = fileList[i]
          let fileSize = fileList[i].size

          if (fileSize < 20971520) {
            this.capture(file, (image) => {
              this.uploadVideo(file, image)
            })
          } else {
            alert(translate('Video size is too large'))
          }
        }
      }
    } else {
      alert(translate('The video file format is not suitable. Please select the video file as .mp4'))
    }
  }

  getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isImage(filename) {
    let ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        return ext.toLowerCase();
      default:
        break;
    }
    return '';
  }

  isVideo(filename) {
    let ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return ext.toLowerCase();
      default:
        break;
    }
    return '';
  }

  capture(file, callback) {
    try {
      var fileReader = new FileReader()
      fileReader.onload = function () {
        var blob = new Blob([fileReader.result], { type: file.type })
        var url = URL.createObjectURL(blob)
        var video = document.createElement('video')
        var timeupdate = function () {
          if (snapImage()) {
            video.removeEventListener('timeupdate', timeupdate)
            video.pause()
          }
        }
        video.addEventListener('loadeddata', function () {
          if (snapImage()) {
            video.removeEventListener('timeupdate', timeupdate)
          }
        })
        var dataURLtoFile = function (dataurl, filename) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, { type: mime });
        }
        var snapImage = function () {
          var canvas = document.createElement('canvas')
          canvas.width = video.videoWidth * 0.25
          canvas.height = video.videoHeight * 0.5
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
          var image = canvas.toDataURL('image/jpeg')
          var success = image.length > 5000
          if (success) {
            let filename = 'netalo_thumbnail_' + Math.floor(Date.now())
            let arrimg = image.split(',')[1]

            let objImg = {
              base64: image,
              width: canvas.width,
              height: canvas.height,
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              duration: Math.ceil(video.duration),
              type: 'image/png',
              size: Math.floor((new Buffer(arrimg, 'base64').length)),
              filename: filename,
              file: dataURLtoFile(image, `${filename}.jpg`),
            }
            callback(objImg)
            URL.revokeObjectURL(url)
          }
          return success
        }
        video.addEventListener('timeupdate', timeupdate)
        video.preload = 'metadata'
        video.src = url
        video.muted = true
        video.playsInline = true
        video.play()
      }

      fileReader.readAsArrayBuffer(file)
    } catch (e) {
      console.log(e)
    }
  }

  toggleDataUpload() {
    let flagPopup = this.state.flagPopup
    this.setState({flagPopup: !flagPopup})
  }

  render() {
    return (
      <div className='box-upload-wrap' ref={this.wrapperRef}>
        <img src={'./images/default/static/plus.svg'} alt='icon-like' className='icons-sticker filter_img_class'  onClick={(e) => this.toggleDataUpload()} />
        <div className='box-upload' style={{display: this.state.flagPopup ? "block" : "none"}}>
          <div className='type-upload' onClick={(e) => this.onClickDataUpload(e, 'image')}>
            <span className='icon-picture type-upload-icon'></span>
            {translate('Photos and Videos')}
          </div>
          <div className='type-upload' onClick={(e) => this.onClickDataUpload(e, 'doc')}>
            <span className='icon-doc type-upload-icon'></span>
            {translate('Documents and Files')}
          </div>
        </div>

        <input ref={(ref) => { this.uploadInputImage = ref}} type='file' multiple={true} key={this.state.theInputFileKey + '_data_image'} style={{ display: 'none' }} onChange={(e) => this.onChangeDataFile(e, 'image')} accept="image/jpg,image/png,video/mp4" />

        <input ref={(ref) => { this.uploadInputDoc = ref}} type='file' multiple={false} key={this.state.theInputFileKey + '_data_doc'} style={{ display: 'none' }} onChange={(e) => this.onChangeDataFile(e, 'doc')} accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf,.numbers,.key,.pages,.zip,.m4a,.mp3" />      
      </div>
    )
  }
}
RxUploadFile.defaultProps = { callback: () => { } }
export default RxUploadFile
