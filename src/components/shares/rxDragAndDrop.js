/*global translate*/
import React, { Component } from 'react'
import { connect } from 'react-redux'

global.isclient && require('./rxDragAndDrop.css')
const { rxaget} = global.rootRequire('classes/ulti')
const rxio = global.rootRequire('classes/socket').default
const {netaMediaOneAdd } = global.rootRequire('redux')
class rxDragAndDrop extends Component {
  constructor (props) {
    super(props)
    this.state = {
      drag: false,
      fileList:{},
      displayListFileScreen:false,
      fileListArr:[]
    }
    this.dragCounter = 0  
    this.dropRef = React.createRef()
  }

  componentDidMount() {
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }

  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }

  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++
    let isFile = false
    let dragtype = e.dataTransfer.types
    if(dragtype.length === 1 && dragtype[0] === 'Files'){      
      isFile = true
    }
    if (isFile && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({drag: true})
    }
  }

  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter === 0) {
      this.setState({drag: false})
      this.props.handleDragOut()
    }
  }

  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let fileList = []
    let fileListArr = []
    let alertStr = ''
    let typeNSupArr = []
    let displayListFileScreen = false
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileList = e.dataTransfer.files
      displayListFileScreen = true
      e.dataTransfer.clearData()
      this.dragCounter = 0    
      
      for (let i = 0; i < fileList.length ; i++) {
        let fileTmp = {}
        let _URL = window.URL || window.webkitURL
        let objectUrl = _URL.createObjectURL(fileList[i])
        fileTmp.name = fileList[i].name
        fileTmp.size = this.convertFileSize(fileList[i].size)
        fileTmp.url = objectUrl
        fileTmp.type = this.getFileType(fileList[i].name)
        if(['image','video','filedoc'].indexOf(fileTmp.type) !== -1){          
          fileListArr.push(fileTmp)
        }else{
          if(typeNSupArr.indexOf(fileTmp.type) === -1){
            typeNSupArr.push(fileTmp.type)
          }          
        }
      }

      if(typeNSupArr.length > 0){
        for (let i = 0; i < typeNSupArr.length; i++) {
          if(i === 0){
            alertStr += typeNSupArr[i]            
          }else{
            alertStr += ', ' + typeNSupArr[i]
          }          
        }
        fileList = []
        fileListArr = []
        displayListFileScreen = false
        let imageExtArr = [' jpg', ' gif', ' bmp', ' png']
        let videoExtArr = [' m4v', ' avi', ' mpg', ' mp4']
        let docExtArr = [' xlsx', ' xls', ' doc', ' docx', ' ppt', ' pptx', ' txt', ' pdf', ' numbers',' key',' pages',' zip']
        alert(translate('The file format is not suitable. Please select the file as'+ docExtArr+ ',' + imageExtArr + ',' + videoExtArr))
        this.dropCanceBtnClick()
      }
    }
    this.setState({
      drag: false, 
      fileList: fileList,
      displayListFileScreen: displayListFileScreen, 
      fileListArr: fileListArr
    })  
  }

  onChangeDataFile(e) {
    e.stopPropagation()
    e.preventDefault()
    if (this.props.token) {
      let fileList = this.state.fileList
      for (let i = 0; i < fileList.length; i++) {
        let fileTypeTmp = this.getFileType(fileList[i]['name'])
        if (fileTypeTmp === 'image') {          
          this.uploadFileImages(fileList[i])
        } else if (fileTypeTmp === 'video') {
          this.uploadFileVideos(fileList[i])
        } else if (fileTypeTmp === 'filedoc') {
           this.uploadFileDoc(fileList[i])
        }
      }

    }

    this.props.handleDragOut()
    this.setState({displayListFileScreen:false})
  }

  uploadFileImages(file) {
    let arrImg = [], arrL=[]
    if (typeof (file) !== 'undefined') {
      let fileSize = file.size
      let extFilename = 'png'

      let _URL = window.URL || window.webkitURL
      let img = new Image();
      let objectUrl = _URL.createObjectURL(file)
      
      let message_id = (Math.floor(Date.now()) * 1000).toString()
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
                          if (arrL.length > 0) {                            
                            let ele = document.getElementById(arrL[0]);
                            // ele && ele.closest("div.zmessage_row").remove();   
                            if(ele){
                              ele.closest("div.zmessage_row").style.display="none";
                            }                            
                          }
                          img.onload = () => {
                            let objSize = { width: img.width || 960, height: img.height || 720, url: key }
                            arrImg.push(objSize)
                            this.uploadFile(arrImg, 'image')
                            _URL.revokeObjectURL(objectUrl)
                          }
                          img.src = objectUrl
                          // this.setState({displayListFileScreen: false}, () => {
                          // })
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

  uploadFileVideos(file) {
    let fileSize = file.size
    if (fileSize < 20971520) {
      this.capture(file, (image) => {
        this.uploadVideo(file, image)
      })
    } else {
      alert(translate('Video size is too large'))
    }
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
                        // this.setState({displayListFileScreen:false}, () => {
                        // })
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
                          this.uploadFile([objSize], 'video')                          
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

  uploadFileDoc(file) {

    let arrImg = [], arrL=[]
    if (typeof (file) !== 'undefined') {
      let fileSize = file.size
      let extFilename = this.getExtension(file['name'])

      if (fileSize < (1024*1024*100)) {
        let message_id = (Math.floor(Date.now()) * 1000).toString()
        arrL.push(message_id)
        this.uploadLoadingFile(file,message_id,'file')
        let fileTypeTmp = file.type
        if(extFilename === 'numbers'){
          fileTypeTmp = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'// file type of xlsx file
        }

        if(extFilename === 'pages'){
          fileTypeTmp = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'// file type of docx file
        }

        if (['m4a','mp3'].indexOf(extFilename) !== -1 ) {
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

                            let filename  = file['name']
                            filename = filename.replace('.' + extFilename ,'')

                            let objSize = {
                              file_extension: extFilename,
                              file_name: filename,
                              size: fileSize,
                              url: key
                            }

                            if (extFilename.indexOf('zip') !== -1) {
                              objSize['file_extension'] = 'zip'
                              objSize['file_name'] = file['name'].replace('.zip', '')
                            }

                            arrImg.push(objSize)

                            this.uploadFile(arrImg, 'file')
                              // this.setState({displayListFileScreen:false}, () => {
                              //   this.uploadFile(arrImg, 'file')
                              // })
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

  uploadFile(arrImg, type) {
    const arrUsers = rxaget(this.props, 'user.users', {})
    const group_id = this.props.group_id
    const user = rxaget(this.props, 'netaauth.user', {})
    const objUser = arrUsers[user.id.toString()]
    let msg = {}
    if (type === 'image') {
      if (arrImg && arrImg.constructor === Array && arrImg.length > 0) {
        msg = {
          group_id: Number(group_id),
          type: 2,
          version: 1,
          nonce: (Math.floor(Date.now()) * 1000).toString(),
          sender_name: rxaget(objUser, 'full_name', ''),
          attachments: JSON.stringify({ images: arrImg }).replace(/"/g, '\\"')
        }
      }
    }
    if (type === 'video') {
      if (arrImg && arrImg.constructor === Array && arrImg.length > 0) {
        msg = {
          group_id: Number(group_id),
          type: 4,
          version: 1,
          nonce: (Math.floor(Date.now()) * 1000).toString(),
          sender_name: rxaget(objUser, 'full_name', ''),
          attachments: JSON.stringify({ video: arrImg[0] }).replace(/"/g, '\\"')
        }
      }
    }
    if (type === 'file') {
      if (arrImg && arrImg.constructor === Array && arrImg.length > 0) {
        msg = {
          group_id: Number(group_id),
          type: 12,
          version: 1,
          nonce: (Math.floor(Date.now()) * 1000).toString(),
          sender_name: rxaget(objUser, 'full_name', ''),
          attachments: JSON.stringify({ file: arrImg[0] }).replace(/"/g, '\\"')
        }
      }
    }
    if (type === 'audio') {
      if (arrImg && arrImg.constructor === Array && arrImg.length > 0 && this.state.canceRecoreStatus === false) {
        msg = {
          group_id: Number(group_id),
          type: 3,
          version: 1,
          nonce: (Math.floor(Date.now()) * 1000).toString(),
          sender_name: rxaget(objUser, 'full_name', ''),
          attachments: JSON.stringify({ audio: arrImg[0] }).replace(/"/g, '\\"')
        }
      }
    }
    if (msg && msg.group_id) {
      if (rxio.connected) {
        rxio.socket.emit('create_message', msg, (data) => {
          if (data && data.message) {
            try {
              let objMedia = {
                group_id: Number(group_id),
                media_type: msg.type,
                message_id: Number(data.message.message_id),
                msg_create_at: Number(data.message.created_at),
                url: rxaget(arrImg, '0.url', '')
              }
              if (type === 'file') {
                objMedia['name'] = rxaget(arrImg, '0.file_name', '')
                objMedia['ext'] = rxaget(arrImg, '0.file_extension', '')
              }
              if (type === 'video') {
                objMedia['thumbnail_url'] = ''
              }
              this.props.netaMediaOneAdd(Number(group_id), objMedia)
            } catch(e) {
              console.log(e)
            }

            this.props.handleMessage(data.message, true)
          }
        })  
      }
      
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

  getFileType(filename){
    let ext = this.getExtension(filename);
    let imageExtArr = ['jpg', 'gif', 'bmp', 'png']
    let videoExtArr = ['m4v', 'avi', 'mpg', 'mp4']
    let docExtArr = ['xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'pdf', 'numbers','key','pages','zip','m4a','mp3']
    if(imageExtArr.indexOf(ext) !== -1){
      return 'image'
    }else if(videoExtArr.indexOf(ext) !== -1){
      return 'video'
    } else if(docExtArr.indexOf(ext) !== -1){
      return 'filedoc'
    }
    return ext.toLowerCase()
  }

  getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
  }

  convertFileSize(size){
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = 0, newsize = parseInt(size, 10) || 0;

    while(newsize >= 1024 && ++index){
        newsize = newsize/1024;
    }
    //include a decimal point and a tenths-place digit if presenting 
    //less than ten of KB or greater units
    return(newsize.toFixed(newsize < 10 && index > 0 ? 1 : 0) + ' ' + units[index]);
  }

  dropCanceBtnClick(){

    this.props.handleDragOut()
    this.setState({displayListFileScreen:false})
  }

  deleteFileSelected(index){
    let fileListTmp = [];
    let fileList = this.state.fileList
    let fileListArr = this.state.fileListArr
    let displayListFileScreen = true
    
    fileListArr.splice(index,1)
    if(fileListArr.length === 0){
      displayListFileScreen = false
    }

    for (let i = 0 ; i < fileList.length ; i++) {
      if(i !== index){
        fileListTmp.push(fileList[i])  
      }
    };

    this.setState({fileListArr:fileListArr,fileList:fileListTmp,displayListFileScreen:displayListFileScreen})  
  }

  editFileSelected(index,files){
    let fileListTmp = [];
    let fileList = this.state.fileList
    let fileListArr = this.state.fileListArr
    let fileTmp = {}
    let _URL = window.URL || window.webkitURL
    let objectUrl = _URL.createObjectURL(files[0])

    fileTmp.name = files[0].name
    fileTmp.size = this.convertFileSize(files[0].size)
    fileTmp.url = objectUrl
    fileTmp.type = this.getFileType(files[0].name)    
    fileListArr[index] = fileTmp
    if(['image','video','filedoc'].indexOf(fileTmp.type) !== -1){
      for (let i = 0 ; i < fileList.length ; i++) {
        if(i !== index){
          fileListTmp.push(fileList[i])  
        }else{
          fileListTmp.push(files[0])
        }
      };
      this.setState({fileListArr:fileListArr,fileList:fileListTmp}) 
    }else{
      let imageExtArr = [' jpg', ' gif', ' bmp', ' png']
      let videoExtArr = [' m4v', ' avi', ' mpg', ' mp4']
      let docExtArr = [' xlsx', ' xls', ' doc', ' docx', ' ppt', ' pptx', ' txt', ' pdf', ' numbers',' key',' pages',' zip',' m4a',' mp3']
      alert(translate('The file format is not suitable. Please select the file as'+ docExtArr + ',' + imageExtArr + ',' + videoExtArr))
    } 
  }

  render () {
    return (
      <div className = 'zchat_body zchat-dragging-contain' ref={this.dropRef} >
        {this.state.drag &&
          <div className = 'zchat-dragging-contain_1'>
            <div className = 'zchat-dragging-body'>
              <div className = 'zchat-dragging-title'>{translate('Drop files here')}</div>
            </div>
          </div>
        }
        {this.props.children}
        {this.state.displayListFileScreen && <div className='zchat-drop_rectangle'>          
          <div className='zchat-drop_rectangle_1'></div>        
          <div className='zchat-drop_rectangle_2'>        
            <div className='zchat-drop_rectangle_2_1'>
              <div className = 'zchat-drop-title'>{this.state.fileListArr.length + translate(' file is selected')} </div>
              <div className = 'zchat-drop-fileList'>
              {this.state.fileListArr.length > 0 ?
                <div>
                  {this.state.fileListArr.map((ele,index) =>{
                    return(
                    <div key ={index}>
                      <div className ='zchat-drop-fileItem'>
                        <div className ='zchat-drop-fileImage_place'>
                          {ele.type === 'image' && 
                            <img className ='zchat-drop-fileImage' src={ele.url} alt=''/>}
                          {ele.type === 'video' && <div>
                            <video  className ='zchat-drop-fileImage'>
                              <source src={ele.url} />                              
                            </video>
                            <img className='zchat-drop-playicon' src={'./images/default/static/icon-media-play-white.svg'} alt='icon-media-play-white' />
                            </div>
                          }
                          {ele.type === 'filedoc' && 
                            <img className ='zchat-drop-filedocIcon' src='./images/default/static/ic_file.svg' alt=''/>}
                        </div>
                        <div className = 'zchat-drop-fileInfo'>
                          <div className = 'zchat-drop-fileName'>{ele.name}</div>
                          <div className = 'zchat-drop-filesize'>{ele.size}</div>
                          <div className = 'zchat-drop-divider'></div>
                        </div>                        
                        <div className = 'zchat-drop-icon file-edit-icon' onClick={(e) => { this.refs['file_edit_icon' + index].click()}}>

                          <input type='file' id={'file_edit_icon' + index} ref={'file_edit_icon' + index} multiple={false}
                            style={{ display: 'none' }}
                            accept="image/jpg,image/png,video/mp4,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf,.numbers,.key,.pages,.zip,.m4a,.mp3"
                            onChange={(e) => this.editFileSelected(index, e.target.files)}/>
                          <img className='filter_img_class' src='./images/default/icons/icon_edit.svg' alt=''/>
                        </div>
                        <div className = 'zchat-drop-icon file-delete-icon' onClick={e => this.deleteFileSelected(index)}>
                          <img className='filter_img_class' src='./images/default/icons/icon-delete-chat.svg' alt=''/>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
                :<div></div>}             
              </div>
              <div className='zchat-drop-footer'>
                <div className='zchat-drop-btn drop-submit_btn' onClick = {(e)=> this.onChangeDataFile(e)}>{translate('Send')}</div>
                <div className='zchat-drop-btn drop-cance_btn' onClick ={()=> this.dropCanceBtnClick()}>{translate('Cancel')}</div>
              </div>
            </div>      
          </div>        
        </div>} 
               
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  netaauth: state.netaauth,
})

const mapDispatchToProps = {
  netaMediaOneAdd
}

const rxDragAndDrop_ = connect(
  mapStateToProps,
  mapDispatchToProps
)(rxDragAndDrop)

export default rxDragAndDrop_