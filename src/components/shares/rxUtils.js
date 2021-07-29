
/*global translate*/
const { netaMediaAdd, netaGroupsUpdate, netaGroupsRemove, chooseGroupAction, changeStatusLoadMess, netaAuthSettingUpdate, clickPopup } = global.rootRequire('redux')
const rxio = global.rootRequire('classes/socket').default
const { rxaget, rxChangeSlug, stringToColour, autoConvertTime, subString } = global.rootRequire('classes/ulti')



export const uploadFileImages = (fileList = [], token = '', users = [], netaauthUser = {}, group = {}) => {
    try {
      if (fileList.length && fileList[0]) {
        var file = fileList[0]
        let parts = (file.name || '').split('.');
        let ext = parts[parts.length - 1] || '';
        if (['png', 'jpg'].indexOf(ext.toLowerCase()) >= 0) {
          let fileSize = file.size
          let extFilename = 'png'

          let _URL = window.URL || window.webkitURL
          let img = new Image();
          let objectUrl = _URL.createObjectURL(file)

          let dataParams = {
            content_type: 'image/' + extFilename,
            name: 'netalo_' + Math.floor(Date.now()),
            public: true,
            size: fileSize
          }
          let header = { 'TC-Token': token, 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Encoding': 'gzip', 'Connection': 'keep-alive' }
          let requestOptions = {
            method: 'POST', headers: header, body: JSON.stringify(dataParams), redirect: 'follow'
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
                          content_type: json.content_type, id: json.id, name: json.name, size: json.size, uid: json.uid
                        })
                      };

                      fetch(global.rxu.config.get_blobs + '/' + json.id + '/complete.json', optComplete)
                        .then(response => {
                          if (response.status === 200) {
                            try {
                              img.onload = () => {
                                _URL.revokeObjectURL(objectUrl)
                                const arrUsers = users
                                const user = netaauthUser
                                const objUser = arrUsers[user.id.toString()]
                                let msg = {
                                  group_id: Number(group.group_id),
                                  avatar_url: key,
                                }
                                if (msg && msg.group_id) {
                                  if (rxio.connected) {
                                    rxio.socket.emit("update_group", msg, (data) => {
                                      if (data && data.result === 0) {
                                        let msg = {
                                          group_id: Number(group.group_id),
                                          type: 6,
                                          version: 1,
                                          nonce: (Math.floor(Date.now()) * 1000).toString(),
                                          sender_name: rxaget(objUser, 'full_name', ''),
                                          attachments: JSON.stringify({
                                            updated_group_avatar: key,
                                            mediaType: 0, type: "update_group"
                                          }).replace(/"/g, '\\"'),
                                          "is_encrypted": false, "mentioned_all": false
                                        }
                                        rxio.socket.emit('create_message', msg, (dataMess) => {
                                          if (dataMess) {
                                            let groupObj = JSON.parse(JSON.stringify(group))
                                            groupObj.avatar_url = key
                                            groupObj.last_message = dataMess.message
                                            groupObj.last_message_id = dataMess.last_message_id
                                            changeStatusLoadMess()
                                            chooseGroupAction(groupObj)
                                            netaGroupsUpdate(Number(groupObj.group_id), groupObj)
                                          }
                                        })
                                      }
                                    })
                                  }
                                }
                              }
                              img.src = objectUrl
                            } catch (e) { }
                          }
                        }).catch(errorPut => console.log('error', errorPut));
                    }
                  }
                }
              })
            }
          }).catch(error => console.log('create_blob error', error))
        } else alert(translate('The image file format is not suitable. Please select the image file as .jpg or .png'))
      }
    } catch (error) { console.log('upload error', error) }
  }