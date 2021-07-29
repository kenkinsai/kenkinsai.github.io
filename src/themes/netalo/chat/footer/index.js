/*eslint-disable no-undef*/
import { connect } from 'react-redux'

import * as Jsx from './index.jsx'

/*global translate*/

// const stickerData = global.rootRequire('classes/stickerData.json');
const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { rxgetLocal } = global.rootRequire('classes/request')
const { secondToTime, rxaget, formatBytes,rxChangeSlug,subString} = global.rootRequire('classes/ulti')
const {chooseGroupAction, netaMessAdd,updateRecentContactGroups,netaMediaOneAdd } = global.rootRequire('redux')
const rxio = global.rootRequire('classes/socket').default
const { checkBlock, checkIsOwner, checkNameUser } = global.rootRequire('classes/chat')
let zget = global.rxu.get

class Component_ extends RxComponent {
  constructor(props, context) {
    super(props, context, Jsx)
    this.state = global.rootContext(this.props.staticContext) || {
       stickerFolderName: [],
       arrTabsChar:[':',':)',':(',':P',':D',':O',';)','B-)','B|','>:(',':/',":'(",'O:)',':*','3:)','^_^','-_-','o.O','>:O','(y)'],
       displayTagNameBox:false,
       //displayEmojiBox:false,
       group: rxaget(this.props, 'rxgroup.group', {}),
       group_id: rxaget(this.props, 'rxgroup.groupid', ''),
       groupsTemp:[],
       groupsTagName:[],
       typing:false,
       sender_typing:'',
       tagNameDisplay:{},
       tagNameSelect:'',
       tagNameSelectNum:0,
       tagNameSelect_isFirstTime:true,
       canceRecoreStatus:false,
       status:true,
       isBlocked: false
    }
    // let tmp_stickerFolderName = rxgetLocal('netaStickerFolder')
    // if(tmp_stickerFolderName){      
    //   tmp_stickerFolderName = JSON.parse(tmp_stickerFolderName)
    //   this.state.stickerFolderName = tmp_stickerFolderName  
    // }
    this.users = rxaget(this.props, 'user.users', {})
    this.keyClickFunction = this.keyClickFunction.bind(this);
    this.mouseClickFunction = this.mouseClickFunction.bind(this);
    this.state.tabmore = rxaget(this.props, 'tabmore', false)
    this.state.groups = rxaget(this.props, 'groups', []) || {}
    this.state.uids = rxaget(this.props, 'user.ids', []) || []
    this.state.users = rxaget(this.props, 'user.users', {}) || {}
    this.state.mess = ''

    this.state.imageTmp = {}

    this.state.mess_selected = {}

    this.blockEnter = false

    this.state.me_typing = false
    this.state.type_option = 0 
    this.token = rxaget(this.props, 'netaauth.user.token', '')
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.onClickBlockContact = this.onClickBlockContact.bind(this)
    // window.onbeforeunload = function() {        
    //   this.clearMessBox()
    //   return undefined;
    // }.bind(this);        
  }

  componentDidMount() {
    this.loadDidMount()
    let isBlocked = checkBlock(this.state.group, this.userid)
    if (isBlocked !== this.state.isBlocked) {
      this.setState({ isBlocked })
    }
    let stickerFolderName = []
    let stickerData = global.rxu.json(rxgetLocal('rxsticker'), {})
    if (stickerData && stickerData.stickerData) {
      stickerData.stickerData.forEach(o => {
        if (o.type && o.type !== 'history' && o.type !== 'EmojiIcon') {
          stickerFolderName.push(o.type)
        }
      })  
    }
    this.setState({stickerFolderName: stickerFolderName})
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyClickFunction, false);
    document.removeEventListener("click", this.mouseClickFunction, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { 
    
    if (nextProps.group_id && nextProps.group_id !== this.state.group_id) {
      const chatDiv = document.getElementById('zmess-box')
      let objState = {}
      if (chatDiv) {
        chatDiv.innerHTML = ''
        objState = { 
          mess: chatDiv.innerHTML,
          displayTagNameBox:false,
          group: nextProps.rxgroup.group,
          tagNameDisplay : {}
        }
      }

      objState['group_id'] = nextProps.group_id
      objState['typing'] = false
      objState['canceRecoreStatus'] = true

      this.setState(objState)
    }

    if (nextProps.rxgroup && nextProps.rxgroup.group) {
      let isBlocked = checkBlock(nextProps.rxgroup.group, this.userid)
      if (isBlocked !== this.state.isBlocked) {
        this.setState({ isBlocked })
      }
    }
    let group = this.state.group
    if(typeof group !== 'undefined'){
      if(nextProps.group_id !== this.state.group.group_id){
        /*let myDiv = document.getElementById("tagName_List_id");
        myDiv.scrollTop = 0;
        this.setState({tagNameSelect:'',tagNameSelectNum:0,tagNameSelect_isFirstTime:true})*/
        this.resetTagname()
      } 
    }

    if(this.props.mess_selected.message_id){
      if (this.props.mess_selected.message_id !== nextProps.mess_selected.message_id && this.state.type_option !== 0) {
        this.closeReplyMessage()
      }      
    }
    if (( nextProps.rxgroup && nextProps.rxgroup.group && nextProps.rxgroup.group.occupants_uins) || (nextProps.user.users && this.state.users && (Object.keys(nextProps.user.users).length !== Object.keys(this.state.users).length))) {
      let groupId = (nextProps.rxgroup && nextProps.rxgroup.group && nextProps.rxgroup.group.occupants_uins)
      let users = JSON.parse(JSON.stringify((nextProps.user && nextProps.user.users) || this.state.users))

      this.setState({  users })
      this.getGroupTagName(groupId, users, [])
    }
    if( this.state.tabmore !== nextProps.tabmore){
      let tabmore = nextProps.tabmore
      this.setState({tabmore :tabmore})
    }
    if (nextProps && nextProps.mess_selected && nextProps.mess_selected.message_id) {
      this.setState({ mess_selected: nextProps.mess_selected, type_option: nextProps.type_option }, () => {
        try {
          const chatDivFoward = document.getElementById('zmess-box')
          chatDivFoward.focus()
          chatDivFowardd.select()
        } catch(e5) {}
      })
    }
    if (nextProps.type_option === 0) {
      this.setState({ mess_selected: {}, type_option: 0 })
    }
    if (this.state.group) {  
      let groupObj = this.state.group || {}
      if (typeof(groupObj.group_id) === 'undefined') {
        groupObj = rxaget(this.props, 'rxgroup.group', {})
      }    
      if (groupObj.group_id !== nextProps.group_id) {
        const chatDiv = document.getElementById('zmess-box')
        if (chatDiv) {
          chatDiv.innerHTML = ''
          this.setState({ 
            mess: chatDiv.innerHTML,
            displayTagNameBox:false,
            group: nextProps.rxgroup.group,
            tagNameDisplay : {}
          })
        }   
      }
    }
  }

  onClickBlockContact() {
    const group = JSON.parse(JSON.stringify(this.state.group))
    let that = this
    let isBlocked = this.state.isBlocked
    if([1,3].indexOf(isBlocked) !== -1){      
      rxio.unblockUser({ group_id: group.group_id, uni: group.partner_id}, () => {
        let blocked_uins = group.blocked_uins

        for(let i = 0; i < blocked_uins.length; i++){
          if(blocked_uins[i] === group.partner_id){
            blocked_uins.splice(i,1)
          }else{
            console.log(blocked_uins[i] , group.partner_id,'cai gi day')
          }
        }
        group.blocked_uins = blocked_uins
        that.props.chooseGroupAction(group)
      })
    }
    if([0,2].indexOf(isBlocked) !== -1 ){
      rxio.blockUser({ group_id: group.group_id, uni: group.partner_id}, () => {        
        let blocked_uins = group.blocked_uins

        blocked_uins.push(group.partner_id)
        group.blocked_uins = blocked_uins
        that.props.chooseGroupAction(group)
      })
    }

    this.setState({ displayAskBlock: false })
  }
  // onClickBlockContact() {
  //   const group = JSON.parse(JSON.stringify(this.state.group))
  //   let that = this, type = (this.state.isBlocked ? "unblock_user" : "block_user")
  //   rxio.blockUser({ group_id: group.group_id, uni: group.partner_id, type: type }, () => {
  //     group.blocked_uins = type === "unblock_user" ? [] : [group.partner_id]
  //     that.props.chooseGroupAction(group)
  //   })
  //   this.setState({ displayAskBlock: false })
  // }
  clearMessBox(){
    const chatDiv = document.getElementById('zmess-box')
    chatDiv.innerHTML=''
  }

  removeTags(str) { 
    if ((str===null) || (str==='')) {
      return false
    } else {
      str = str.toString()
    }
        
    if(str.indexOf('\\')){
      str = str.replace(/\\/g, '')
    }
    return str.replace( /(<([^>]+)>)/ig, '')
  } 

  loadHandleSocket() {
    rxio.getWaitConnect((data) => {
      if (data) {
        rxio.getWaitEvent((data) => {
          this.handleEvent(data)
          this.props.handleMessage(data)
        })
        rxio.getWaitMessage((data) => {
          this.props.handleMessage(data, true)
        })
        rxio.getWaitMessDel((data) => {
          this.props.handleMessage(data, false)
        })
      } else {
        setTimeout(() => {
          this.loadHandleSocket()  
        }, 300)
      }
    }) 
  }

  loadDidMount() {
    document.addEventListener("keydown", this.keyClickFunction, false);   
    document.addEventListener("click", this.mouseClickFunction, false); 

    let groupId = rxaget(this.state, 'group.occupants_uins', [])
    let groups = this.users
    let groupsTemp = []
    this.getGroupTagName(groupId , groups , groupsTemp)

    if (this.token && this.userid) {
      if (!rxio.connected && !rxio.init_connected) {
        rxio.login(this.token, this.userid, (data) => {
          rxio.getWaitEvent((data) => {
            this.handleEvent(data)
          })
          rxio.getWaitMessage((data) => {
            this.props.handleMessage(data, true)
          })
          rxio.getWaitMessDel((data) => {
            this.props.handleMessage(data, false)
          })
        })
      } else {
        this.loadHandleSocket()
        /*  rxio.getWaitEvent((data) => {
          this.props.handleMessage(data)
        })
        rxio.getWaitMessage((data) => {
          this.props.handleMessage(data, true)
        })
        rxio.getWaitMessDel((data) => {
          this.props.handleMessage(data, false)
        })*/
      }
    }
    this.setState.messReply = this.props.messReply
  }

  getGroupTagName(groupId = [], groups, groupsTemp) {
        
    for (const useridkey of Object.keys(groups)) {
      for (let i = 0; i < groupId.length; i++){
        if(groupId[i] === String(groups[(useridkey)].id)){
          if(groupId[i] !== String(this.userid)){
            groupsTemp.push(groups[(useridkey)])    
          } 
      
        }              
      }
    }
    this.setState({
      groupsTemp:groupsTemp,
      groupsTagName:groupsTemp,
    }) 
  }

  pasteEventFunction= (e) =>{    
    let paste = (e.clipboardData || window.clipboardData).getData('text');

    const chatDiv = document.getElementById('zmess-box')    
    if (chatDiv) {
      chatDiv.innerHTML += paste 

      this.setState({ 
        mess: chatDiv.innerHTML,
       })
    }
    e.preventDefault();    
    this.setCursor(e.currentTarget.textContent.length)
  }

  keyClickFunction(event){
    if(event.keyCode === 27) {
      this.closeReplyMessage()
    }
   
    if(event.keyCode === 38) {
      if(this.state.displayTagNameBox===true){  
        event.preventDefault()
        let groupsTemp = this.state.groupsTemp
        let num = this.state.tagNameSelectNum 
        let tagNameSelect 
        let myDiv = document.getElementById("tagName_List_id");

        if(num > 0){
          num --         
          myDiv.scrollTop = num*40 - (7*40 - 38)  
        }else{
          num = groupsTemp.length-1
          myDiv.scrollTop = myDiv.scrollHeight
        }        
        tagNameSelect = groupsTemp[num]
        this.setState({tagNameSelect:tagNameSelect,tagNameSelectNum:num, tagNameSelect_isFirstTime:false})
      }      
    } 

    if(event.keyCode === 40) {
      //key down press
      if(this.state.displayTagNameBox===true){   
        event.preventDefault()
        let groupsTemp = this.state.groupsTemp
        let num = this.state.tagNameSelectNum 
        let tagNameSelect           
        let myDiv = document.getElementById("tagName_List_id");

        if(this.state.tagNameSelect_isFirstTime)
        {
          
          tagNameSelect = groupsTemp[0] 
        }else{
          if(num < groupsTemp.length-1){   
            num ++ 
            if(num >= 7 ){              
              myDiv.scrollTop = num*40 - (7*40 - 38 );   
            }else{
              myDiv.scrollTop = 0;  
            }    

          }else{
            num = 0
            myDiv.scrollTop = 0;//myDiv.scrollHeight;
          }
          tagNameSelect = groupsTemp[num]     
        } 
        this.setState({tagNameSelect:tagNameSelect,tagNameSelectNum:num, tagNameSelect_isFirstTime:false})
      }       
    } 
  }

  mouseClickFunction(event){
    const menuDiv = document.getElementById('menu-message')
    // const groupPopup = document.getElementById('popup-group')
    if (menuDiv && event.target !== menuDiv && menuDiv.style.display === 'block') {
      menuDiv.style.display = 'none'
    }
  
    if(this.state.displayTagNameBox){
      this.setState({displayTagNameBox:false})  
    }

    if (event.srcElement.className !== 'menu-option-footer') {
      const menuDiv = document.getElementById('menu-footer')
      if (menuDiv) {
        menuDiv.style.display = 'none'
      }
    }    
  }

  closeReplyMessage() {
    this.setState({ mess_selected: {}, type_option: 0 })
    this.props.resetSelectedMess()
  }

  closeImageFooterLoader() {
    this.setState({ imageTmp: {}, mess: '' })
  }

  closePopupGroup() {
    this.setState({ popupGroup: false })
  }

  chooseGroupForward(group) {
    this.setState({ popupGroup: false, type_option: 2 }, () => {
      this.chooseGroup(group)
    })
  }

  chooseOption(e, type) {
    let option = 0
    let popupGroup = false
    if (type === 'reply') {
      option = 1
    } else if (type === 'delete_all') {
      this.deleteMessage(true)
    } else if (type === 'delete_one') {
      this.deleteMessage(false)
    } else if (type === 'copy') {
      this.copyTextToClipboard(rxaget(this.state, 'mess_selected.message', ''))
    } else if (type === 'forward') {
      popupGroup = true
    }
    this.setState({ type_option: option, popupGroup: popupGroup })
  }

  copyTextToClipboard(text) {
    let textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2px'
    textArea.style.height = '2px'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text.replace(/[\t\r\n]/g, '')
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
    } catch (err) {
      console.log('Oops, unable to copy')
    }

    document.body.removeChild(textArea)
  }

  checkTypeDelMess() {
    let result = 0
    if (rxaget(this.state, 'mess_selected.sender_uin', '').toString() === this.userid.toString()) {
      result = 1
    }
    if (rxaget(this.state, 'mess_selected.status', 0) === 4) {
      result = 2
    }
    if (rxaget(this.state, 'mess_selected.deleted_uins', []).indexOf(this.userid.toString()) !== -1) {
      result = 2
    }
    if (rxaget(this.state, 'mess_selected.message', '') !== '') {
      result = 3
    }

    return result
  }

  handleEvent(data) {
    if (data && data.type === 9) {
      const sender = this.state.users[data.sender_uin]
      if ((data.group_id === this.state.group_id) && sender) {
        let sender_name = checkNameUser(sender)
        this.setState({ typing: true, sender_typing: sender_name })
      }else{
        this.setState({ typing: false })
      }
    }
    if (data && data.type === 10) {
      this.setState({ typing: false })
      /* if ((data.group_id === this.state.group_id)) {
        this.setState({ typing: false })
      }*/
    }
  }

  clickRecord(isClick){    
    if(isClick && this.state.canceRecoreStatus === true){
      this.setState({
         canceRecoreStatus: false
      })
    }
  }

  uploadFile(arrImg, type) {
    const arrUsers = this.state.users
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
            this.blockEnter = false
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

  parseMessage(objmsg, type) {
    let message = ''
    let attachments = {}
    const userid = rxaget(this.props, 'netaauth.user.id', '').toString()
    const blobs = rxaget(this.props, 'netaBlobs.data', {})
    const created_at = Math.floor(Date.now() / 1000)
    if (objmsg) {
      if (!isNaN(objmsg.type)) {
        try {
          attachments = JSON.parse(rxaget(objmsg, 'attachments', '').replace(/[\t\r\n]/g, ''))
        } catch (e) {
          if (typeof (rxaget(objmsg, 'attachments', '')) === 'object') {
            attachments = rxaget(objmsg, 'attachments', '')
          }
        }
        if (objmsg.status !== 4) {
          if (objmsg.deleted_uins && objmsg.deleted_uins.constructor === Array && objmsg.deleted_uins.length > 0 && objmsg.deleted_uins.indexOf(userid) !== -1) {
            message = ''
          } else {
            let mess =''
            switch (objmsg.type) {
              case 1:
                let call_name = ''
                let icon_call_name = ''
                if (attachments.media_type === 1) {
                  call_name = translate('Voice call')
                  icon_call_name = 'icon-phone'
                } else if (attachments.media_type === 2) {
                  call_name = translate('Video call')
                  icon_call_name = 'icon-camrecorder'
                }

                let iconcall = ''
                let stylecall = ''
                if (rxaget(attachments, 'caller_uin', '') === this.userid.toString()) {
                  iconcall = 'icon-call-out'
                  if (zget(this.props, 'themeValue')==='blueColor'){
                    stylecall = '#ebf8ff'  
                  }else{
                    stylecall = '#fde4d8'  
                  }
                  
                } else {
                  iconcall = 'icon-call-in'
                  if (zget(this.props, 'themeValue')==='blueColor'){
                    stylecall = '#ebf8ff'  
                  }else{
                    stylecall = '#fdf2ea'
                  }
                  
                }

                message = `<div class='zchat-callmess' style='background: ${stylecall};'>
                  <div class='zchat-callname'>${call_name}</div>`

                if (attachments.accepted_at === '0') {
                  message += `<div class='zchat-calltime' style="color:#d5192d;"><i class='${iconcall}'></i>${translate('Canceled')}</div>`
                } else {
                  const time = Number(rxaget(attachments, 'stopped_at', 0)) - Number(rxaget(attachments, 'accepted_at', 0))
                  message += `<div class='zchat-calltime'><i class='${iconcall}' style="color:#2fb13e;"></i>${secondToTime(time)}</div>`
                }

                message += `<span class='zchat-callicon'><i class='${icon_call_name}'></i></span></div>`

                if (type === 'desc') {
                  mess =  translate(' finished')
                  message = call_name + mess
                }

                break
              case 2:
                try {
                  if (attachments && attachments.images && attachments.images.constructor === Array && attachments.images.length > 0) {
                    let arrurlimgs = rxaget(attachments, 'images', []).map(o => o.url)
                    let strurlimgs = (arrurlimgs && arrurlimgs.constructor === Array && arrurlimgs.length > 0) ? arrurlimgs.join(',') : ''
                    message = '<div class="img-message-row ">'
                    let indeximg = 0
                    for (const img of attachments.images) {
                      message += `<img src='${global.rxu.config.get_static + img.url}' alt='' class='img-message' onclick=window.showGallery('${strurlimgs}','${indeximg}') />`
                      indeximg += 1
                    }
                    message += '</div>'
                    if (type === 'desc') {
                      message = translate('Image')
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                /* try {
                  if (attachments && attachments.images && attachments.images.constructor === Array && attachments.images.length > 0) {
                    let arrurlimgs = rxaget(attachments, 'images', []).map(o => o.url)
                    let strurlimgs = (arrurlimgs && arrurlimgs.constructor === Array && arrurlimgs.length > 0) ? arrurlimgs.join(',') : ''

                    message = '<div class="img-message-row">'
                    let indeximg = 0
                    for (const img of attachments.images) {
                      if (img && img.url) {
                        const src = global.rxu.config.get_blobs + '/' + img.url
                        const url_img = img.url || ''
                        if (blobs && blobs[url_img] && blobs[url_img]['created_at'] && (created_at - blobs[url_img]['created_at']) <= 43200) {
                          message += `<img src='${blobs[url_img]['link']}' alt='sticker' class='img-message' onclick=window.showGallery("${strurlimgs}","${indeximg}") />`
                        } else {
                          this.fetchImage(src, (data) => {
                            if (data) {
                              const images = document.getElementsByClassName('img-message')
                              if (images && images.length > 0) {
                                for (let i = 0; i < images.length; i++) {
                                  const valueAttr = images[i].getAttribute('data-id')
                                  const eleid = 'message' + img.url
                                  if (eleid === valueAttr) {
                                    images[i].src = data
                                  }
                                }
                              }
                            }
                          })
                          message += `<img src='./images/default/static/no-image.jpg' data-id='${'message' + img.url}' alt='sticker' class='img-message' onclick=window.showGallery("${strurlimgs}","${indeximg}") />`

                        }
                      }
                      indeximg += 1
                    }
                    message += '</div>'

                    if (type === 'desc') {
                      message = translate('Image')
                    }
                  }
                } catch (e) {
                  console.log(e)
                }*/
                break
              case 3:
                const url = rxaget(attachments, 'audio.url', '')
                const src = global.rxu.config.get_blobs + '/' + url
                message = `<div class='zchat-audiomess'>`

                  message += `
                  <div class='zchat-audioicon' onclick=window.playAudio('icon-audio-${rxaget(objmsg, 'message_id', '').toString()}')>
                    <img class='filter_img_class' id='icon-audio-${rxaget(objmsg, 'message_id', '').toString()}'  src='./images/default/static/icon-media-play.svg'/>
                  </div>
                  `
                message += `

                  <div class='zchat-audiobar'>
                    <div class='zchat-audioprocess' id='process-audio-${rxaget(objmsg, 'message_id', '').toString()}'>
                    </div>
                  </div>
                  <div class='zchat-audiotime'>
                    ${secondToTime(rxaget(attachments, 'audio.duration', 0))}
                  </div>
                `

                if (blobs && blobs[url] && blobs[url]['created_at'] && (created_at - blobs[url]['created_at']) <= 43200) {
                  message += `
                    <audio id='${'audio-' + objmsg.message_id}'>
                      <source id='${'audio' + url}' src='${blobs[url]['link']}' />
                    </audio>
                  `
                } else {
                  this.fetchImage(src, (data) => {
                    if (data) {
                      const eleaudio = document.getElementById('audio' + url)
                      const eleLoadAudio = document.getElementById('audio' + objmsg.message_id)
                      if (eleaudio && eleLoadAudio) {
                        eleaudio.src = data
                        eleLoadAudio.load()
                      }
                    }
                  })
                  message += `
                    <audio id='${'audio' + objmsg.message_id}' >
                      <source id='${'audio' + url}' src='' />
                    </audio>
                  `
                }


                message += `</div>`

                if (type === 'desc') {
                  message = 'Audio'
                }
                break
              case 4:
                try {
                  if (attachments && attachments.video && attachments.video.url) {
                    const url = attachments.video.url
                    const src = global.rxu.config.get_blobs + '/' + url
                    message = '<div class="img-message-row">'
                    if (blobs && blobs[url] && blobs[url]['created_at'] && (created_at - blobs[url]['created_at']) <= 43200) {
                      message += `
                        <video id='${'video' + objmsg.message_id}' width='320' controls='controls' preload='metadata'>
                          <source id='${'video' + url}' src='${blobs[url]['link']}' />
                          Your browser does not support HTML5 video.
                        </video>
                      `
                    } else {
                      this.fetchImage(src, (data) => {
                        if (data) {
                          const elevideo = document.getElementById('video' + url)
                          const eleLoadVideo = document.getElementById('video' + objmsg.message_id)
                          if (elevideo) {
                            elevideo.src = data
                            eleLoadVideo.load()
                          }
                        }
                      })
                      message += `
                        <video id='${'video' + objmsg.message_id}' width='320' controls='controls' preload='metadata'>
                          <source id='${'video' + url}' src="./images/default/static/no-image.jpg" />
                          Your browser does not support HTML5 video.
                        </video>
                      `
                    }

                    message += '</div>'

                    if (type === 'desc') {
                      message = 'Video'
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                break
              case 5:
                mess = translate(' created a group')
                message = checkNameUser(rxaget(this.users, objmsg.sender_uin, {})) + mess
                break
              case 6:
                const userins = []
                try {
                  if (attachments && attachments.type === 'update_group' && attachments.added_uins && attachments.added_uins.constructor === Array && attachments.added_uins.length > 0) {
                    for (const uid of attachments.added_uins) {
                      const uname = checkNameUser(rxaget(this.users, uid, {}))
                      if (uname) {
                        userins.push(uname)
                      }
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                if (userins.length > 0) {
                  mess = translate(' added ')
                  message = checkNameUser(rxaget(this.users, objmsg.sender_uin, {})) + mess + userins.join(', ')
                }
                break
              case 7:
                mess = translate(' has left the group')
                message = checkNameUser(rxaget(this.users,objmsg.sender_uin, {})) + mess
                break
              case 8:               
                message = '<div class=\'row-reply\'>'
                message += `<div class='sender-reply'> <img class='filter_img_class' alt='icon-reply' src='./images/default/icons/reply-icon.svg'> ${translate('Answer for')} ${checkNameUser(rxaget(this.users, attachments.sender_uin, {})) || ''} </div>`
                
                if (attachments.type === 8 || attachments.type === 9) {
                  attachments.type = 0
                }
                const attachments_tmp = this.parseMessage(attachments)
                if (attachments_tmp !== '') {
                  if (attachments.type === 0) {
                    if(checkIsOwner(objmsg, this.userid)){
                      message += `
                        <div class='message-reply'>
                          <div></div>
                          <div class='message-reply_content_right overflowText'>
                            ${attachments_tmp}
                          </div>
                        </div>`                     
                      }  else{
                           message += `
                            <div class='message-reply'>
                              <div></div>
                              <div class='message-reply_content overflowText'>
                                ${attachments_tmp}
                              </div>
                            </div>`
                    }

                  } else {      
                    let message_reply_content_class = ''
                    let file_reply_content_class = ''
                    if(attachments_tmp.indexOf('img-message-row')!== -1 || attachments_tmp.indexOf('zchat-filemess')!== -1 || attachments_tmp.indexOf('zchat-audiomess')!== -1){                      
                      file_reply_content_class = ' file-reply_content'

                    }
                    if (checkIsOwner(objmsg, this.userid)) {
                      message_reply_content_class = 'message-reply_content_right overflowText' + file_reply_content_class
                    } else {
                      message_reply_content_class = 'message-reply_content overflowText' + file_reply_content_class
                    }

                    message += `
                        <div class='message-reply'>
                          <div></div>
                          <div class='${message_reply_content_class}'>
                            ${attachments_tmp}
                          </div>
                        </div>`

                  }
                }else{
                  if(checkIsOwner(objmsg, this.userid)){
                  message += `
                    <div class='message-reply'>
                      <div></div>
                      <div class='message-reply_content_right' >
                        &nbsp;
                      </div>
                    </div>`
                  }
                  else{
                  message += `
                    <div class='message-reply'>
                      <div></div>
                      <div class='message-reply_content'>
                        &nbsp;
                      </div>
                    </div>`
                  }
                }
                message += '</div>'
                if (this.userid.toString() === objmsg.sender_uin.toString()) {
                  message += '<div class=\'zmessage-reply-anwser my_message overflowText\'>' + this.props.convertTagName(objmsg.message)+ '</div>' || ''
                } else {
                  if (objmsg.message.length === 0){
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box\'>&#160</div></div>' || ''
                  }
                  else{
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box overflowText\'>' +this.props.convertTagName(objmsg.message) + '</div></div>' || ''  
                  }
                  
                }
                if (type === 'desc') {
                  message = objmsg.message
                }
                break
              case 9:
                let sender_name 
                let sender_name_mess =translate('You')

                sender_name = checkIsOwner(attachments, this.userid) ? sender_name_mess : checkNameUser(rxaget(this.users,objmsg.sender_uin, {}))
                                
                message = '<div class=\'row-reply\'>'
                message += `<div class='sender-reply'> <img class = 'filter_img_class' alt='icon-reply' src="./images/default/icons/forward-icon.svg"/> ${sender_name || ''} ${translate('forwarded a message')} </div>`  
                if (attachments.type === 8 || attachments.type === 9) {
                  attachments.type = 0
                }
                const attachments_forward = this.parseMessage(attachments)
                if (attachments_forward !== '') {
                    let message_reply_content_class = ''
                    let file_reply_content_class = ''
                    if(attachments_forward.indexOf('img-message-row')!== -1 || attachments_forward.indexOf('zchat-filemess')!== -1 || attachments_forward.indexOf('zchat-audiomess')!== -1){                      
                      file_reply_content_class = ' file-reply_content'

                    }
                    if (checkIsOwner(objmsg, this.userid)) {
                      message_reply_content_class = 'message-reply_content_right overflowText' + file_reply_content_class
                    } else {
                      message_reply_content_class = 'message-reply_content overflowText' + file_reply_content_class
                    }

                    message += `
                        <div class='message-reply'>
                          <div></div>
                          <div class='${message_reply_content_class}''>
                            ${attachments_forward}
                          </div>
                        </div>`
                }else{
                  if(checkIsOwner(objmsg, this.userid)){
                  message += `
                    <div class='message-reply'>
                      <div></div>
                      <div class='message-reply_content_right' >
                        &nbsp;
                      </div>
                    </div>`
                  }
                  else{
                  message += `
                    <div class='message-reply'>
                      <div></div>
                      <div class='message-reply_content'>
                        &nbsp;
                      </div>
                    </div>`
                  }
                }

                message += '</div>'
                if (this.userid.toString() === objmsg.sender_uin.toString()) {
                  if (objmsg.message) {
                    message += '<div class=\'zmessage-reply-anwser my_message overflowText\'>'+this.props.convertTagName(objmsg.message)+ '</div>' || ''  
                  } else {
                    message += '<div class=\'zmessage-reply-anwser overflowText\'></div>' || ''
                  }
                } else {                 
                  if (objmsg.message.length === 0){
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box\'>&#160</div></div>' || ''
                  }
                  else{
                    message += '<div class=\'zmessage-reply-anwser another_message\'><div class=\'another_message_box overflowText\'>' + this.props.convertTagName(objmsg.message) + '</div></div>' || ''  
                  }
                }

                if (type === 'desc') {
                  message = objmsg.message
                }
                break
              case 10:
                try {
                  if (attachments && attachments.sticker) {
                    const namesticker = attachments.sticker || ''
                    const arrsticker = this.state.stickerFolderName
                    for (const sticker of arrsticker) {
                      if (namesticker && namesticker.indexOf(sticker) !== -1) {
                        const imgsticker = namesticker.replace(sticker + '_', '')
                        message = `<img src='./images/default/sticker/${sticker}/${imgsticker}' alt='sticker' class='img-sticker' />`
                        break
                      }
                    }
                  }
                } catch (e) {
                  console.log(e)
                }
                if (type === 'desc') {
                  message = 'Sticker'
                }
                break
              case 12:
                let file = (attachments && attachments.file) || objmsg.file
                if (file) {
                  message = `<div class='zchat-filemess'>
                  <div class='zchat-callname'>${rxaget(file, 'file_name', '')}</div>`
                  message += `<div class='zchat-calltime' style="color:#a6a6a7;">${formatBytes(rxaget(file, 'size', 0))}</div>`
                  message += `<span class='zchat-docicon' onclick=window.downloadFile('${rxaget(file, 'url', '').toString()}','${rxaget(file, 'file_name', '').toString()}')><i class='icon-doc'></i></span></div>`
                  if (type === 'desc') {
                    message = translate('File')
                  }
                }
                break
              default:
                message = objmsg.message || ''
                if (message && message.length < 50) {
                  let resMess = message.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)
                  if (resMess && resMess.constructor === Array && resMess.length > 0) {
                    let uniemoji = [...new Set(resMess)]
                    for (let emoji of uniemoji) {
                      let regEmoji = new RegExp(emoji, 'g')
                      message = message.replace(regEmoji, '<span>' + emoji + '</span>')
                    }
                  }
                }

                break
            }
          }
        } else {
          message = ''
        }
      } else {
        if (objmsg.status !== 4) {
          if (objmsg.deleted_uins && objmsg.deleted_uins.constructor === Array && objmsg.deleted_uins.length > 0 && objmsg.deleted_uins.indexOf(userid) !== -1) {
            message = ''
          } else {
            message = objmsg.message || ''
          }
        } else {
          message = ''
        }
      }

      if (message.indexOf('@') !== -1) {
        let userstag = message.match(/(@\d+\b)/ig)
        if (userstag && userstag.constructor === Array && userstag.length > 0) {       
          userstag.forEach(o => {
            let useridtmp = o.replace('@', '') || ''           
            if (this.users[useridtmp]) {
              message = message.replace(o, checkNameUser(rxaget(this.users, useridtmp, {})))
            }
          })
        }
      }
      return message
    } else {
      return ''
    }
  }

  pasteAsPlainText = e => {
    e.preventDefault()

    if (e.clipboardData.files.length > 0) {
      let contentTarget = document.getElementById('zmess-box')

      this.retrieveImageFromClipboardAsBase64(e, (imageObj) => {
        if(imageObj){
          // let messtmp = `<img src='${imageObj['base64']}' alt='image' class='load-image-footer' />`

          contentTarget.innerHTML = `<img src='${imageObj['base64']}'>`
          this.setState({
            imageTmp: imageObj
          })
        }
      })
    } else {
      const text = e.clipboardData.getData('text/plain')

      document.execCommand('insertHTML', false, text)
    }
  }

  retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat){
    if(pasteEvent.clipboardData === false){
      if(typeof(callback) === "function"){
        callback(undefined);
      }
    };

    let items = pasteEvent.clipboardData.items;

    if(items === undefined){
      if(typeof(callback) === "function"){
        callback(undefined);
      }
    };

    for (let i = 0; i < items.length; i++) {
      // Skip content if not image
      if (items[i].type.indexOf("image") === -1) continue;
      // Retrieve image on clipboard as blob
      let blob = items[i].getAsFile();

      // Create an abstract canvas and get context
      let mycanvas = document.createElement("canvas");
      let ctx = mycanvas.getContext('2d');
      
      // Create an image
      let img = new Image();

      let dataURLtoFile = function (dataurl, filename) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }

      // Once the image loads, render the img on the canvas
      img.onload = function(){
        // Update dimensions of the canvas with the dimensions of the image
        mycanvas.width = this.width;
        mycanvas.height = this.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Execute callback with the base64 URI of the image
        if(typeof(callback) === "function"){
          const base64 = mycanvas.toDataURL((imageFormat || "image/png"))
          const filename = 'image_' + Math.floor(Date.now())
          const arrimg = base64.split(',')[1]

          callback({
            base64: base64,
            width: mycanvas.width,
            height: mycanvas.height,
            type: 'image/png',
            size: Math.floor((new Buffer(arrimg, 'base64').length)),
            filename: filename,
            file: dataURLtoFile(base64, `${filename}.jpg`)
          });
        }
      };

      // Crossbrowser support for URL
      let URLObj = window.URL || window.webkitURL;

      // Creates a DOMString containing a URL representing the object given in the parameter
      // namely the original Blob
      img.src = URLObj.createObjectURL(blob);
    }
  }

  onKeyDown = event => {
    const keyCode = event.keyCode 
    if ( !(keyCode === 8 ||keyCode === 13 || (keyCode >= 37 && keyCode <= 40)) ) {
      let tagNameDisplay = this.state.tagNameDisplay
      tagNameDisplay.tagNameLast = ''
      this.setState({ tagNameDisplay })
    }
  }

  handleContentEditable = event => {
    try {
      const group_id = this.props.group_id
      let {
        target: { value },
      } = event
      let displayTagflag = false, tagNameDisplay = this.state.tagNameDisplay,
        tagNameLast = '', isEdit = false
      if (value && value.match(/<span(.*?)<\/span>/g) && value.match(/<span(.*?)<\/span>/g).length > 0) {
        value.match(/<span(.*?)<\/span>/g).map((val) => {
          let arrid = val.match(/"(.*?)"/g)
          if (arrid && arrid[0]) {
            let uid = arrid[0].replace(/"/g, '')
            let cont = />([^;]+)<\/span>/.exec(val) && />([^;]+)<\/span>/.exec(val)[1]
            if (tagNameDisplay[uid] && cont !== tagNameDisplay[uid].name) {
              value = value.replace(val, '@' + cont)
              tagNameLast = cont
              isEdit = true
            }
          }
        })
      }
      if(value.indexOf('"') !== -1){
        // console.log(value,'??')  
      }
      
      if (value.indexOf('@') !== -1) {
        displayTagflag = true
      }
      let valuetmp = this.removeTags(value)
      let strvalue = ''
      if (valuetmp === '' && value !== '') {
        strvalue = ''
      } else {
        strvalue = value
      }
      strvalue = strvalue.replace(/<br>/g, '')
      strvalue = strvalue.replace(/<\/p><p>/g, '')
      // let messArr = strvalue.split(' ')
      // let lastMessArr = messArr[messArr.length-1]
      // let foundEmoji = this.state.arrTabsChar.indexOf(lastMessArr)
      // let displayEmojiBox = this.state.displayEmojiBox

      // if(displayEmojiBox === true && foundEmoji === -1){
      //   this.setState({displayEmojiBox:false})
      // }


      if (this.userid && group_id) {
        const me_typing = this.state.me_typing
        if (strvalue) {
          if (me_typing === false) {
            rxio.sendGroupEvent(group_id, this.userid, 9)
          }
          let arrGroups = []
          if (strvalue.indexOf('@') !== -1) {
            if (!tagNameLast) {
              let el = document.getElementById("zmess-box").firstChild
              let textContent = el.textContent
              const caretOffset = this.getCaret(el)
              tagNameLast = textContent.substring(textContent.lastIndexOf("@") + 1, caretOffset + 1).trim()
            }
            arrGroups = this.state.groupsTagName.filter(o => rxChangeSlug(checkNameUser(o)).indexOf(rxChangeSlug(tagNameLast)) !== -1)
          }
          if (arrGroups.length)
            tagNameDisplay.tagNameLast = tagNameLast

          this.setState({
            mess: strvalue, me_typing: true,
            displayTagNameBox: displayTagflag,
            groupsTemp: arrGroups,
            tagNameDisplay,
          }, () => {
            if (tagNameLast && isEdit) {
              var el = document.getElementById("zmess-box").firstChild
              if (el) {
                var range = document.createRange()
                var sel = window.getSelection()
                if (range) {
                  try {
                    el.childNodes.forEach(n => {
                      const regex = new RegExp("@" + tagNameLast, 'g');
                      const result = regex.test(n.textContent)
                      if (result) {
                        // console.log(`${result}-${n.textContent}-${regex.lastIndex}-${n.textContent.charAt(regex.lastIndex)}`)
                        range.setStart(n, regex.lastIndex)
                        range.collapse(true)
                        sel.removeAllRanges()
                        sel.addRange(range)
                      }
                    })
                  } catch (error) { }
                }
              }
            }
            setTimeout(() => {
              if ((strvalue === this.state.mess) && me_typing) {
                rxio.sendGroupEvent(group_id, this.userid, 10)
                this.setState({ me_typing: false })
              }
            }, 2000)
          })
        } else {
          this.setState({
            mess: strvalue, me_typing: true,
            displayTagNameBox: displayTagflag
          })
        }
      }
    } catch (error) { console.log(error) }
  }

  getCaret(element) {
    if (element) {
      var caretOffset = 0;
      var doc = element.ownerDocument || element.document;
      var win = doc.defaultView || doc.parentWindow;
      var sel;
      if (typeof win.getSelection !== "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
          var range = win.getSelection().getRangeAt(0);
          var preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type !== "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      caretOffset-=1
      return caretOffset;
    }
  }

  tagName_SelectUser=(ele)=> {
    let mess = this.state.mess,tagNameLast=this.state.tagNameDisplay.tagNameLast
    mess = mess.replace("<p>","").replace("</p>","").trim()
    let tempTag = '<span uid="' + ele.id + '" style="font-weight:bold">' +  (checkNameUser(ele) || "") + '</span> '
    if (tagNameLast) {
    
      mess = mess.replace(`@${tagNameLast}`, tempTag)
    }
    else {
      const regex = new RegExp('@(?!.)', 'g');
      regex.test(mess)
      // console.log("mess",mess,regex.lastIndex)
      mess = mess.slice(0, regex.lastIndex-1) + mess.slice(regex.lastIndex);
      mess = [mess.slice(0, regex.lastIndex), tempTag, mess.slice(regex.lastIndex)].join('');
    }
    if (!mess.startsWith('<p>')) mess = '<p> ' + mess + '</p>'
    const chatDiv = document.getElementById('zmess-box')
    chatDiv.focus()
    let tagNameDisplay = this.state.tagNameDisplay
    tagNameDisplay[ele.id] = { name: checkNameUser(ele) }
    this.setState({ mess: mess, displayTagNameBox: false, tagNameDisplay })
  }

  converEmojiTag(message){
    message = message.replace(/"/g,'\\"')
    const objEmoji = {':)':'🙂',':(':'🙁',':P':'😛',':D':'😃',':O':'😮',';)':'😉','B-)':'🤓','B|':'😎','>:(':'😠',":'(":'😢','O:)':'😇',':*':'😘','3:)':'😈','^_^':'😊','o.O':'😳','>:O':'😫','(y)':'👍',':poop:':'💩'}
    const resMess = message.match(/(:\)|:\(|:P|:D|:O|;\)|B-\)|B\||>:\(|:\/|:'\(|O:\)|:\*|3:\)|\^_\^|o.O|>:O|\(y\)|:poop:)/g)
    if (resMess && resMess.constructor === Array && resMess.length > 0) {
      const uniemoji = [...new Set(resMess)]
      for (let emoji of uniemoji) {
        try {
          let stremoji = emoji.replace(/\)/g,'\\)').replace(/\(/g,'\\(').replace(/\|/g,'\\|').replace(/\//g,'\\/').replace(/'/g,'\\\'').replace(/\*/g,'\\*').replace(/\^/g,'\\^')
          let regEmoji = new RegExp(stremoji, 'g')
          let replaceEmoji = objEmoji[emoji]
          if (replaceEmoji) {
            message = message.replace(regEmoji, replaceEmoji)   
          }
        } catch(e) {}
      }
    }

    return message
  }

  resetTagname(){
    let tagNameDisplay = this.state.tagNameDisplay
    let myDiv = document.getElementById("tagName_List_id");

    myDiv.scrollTop = 0;
    tagNameDisplay.tagNameLast = ''

    this.setState({tagNameSelect: '', tagNameSelectNum: 0, tagNameSelect_isFirstTime: true, tagNameDisplay })
  }

  disableDrop = event => {
    event.preventDefault();
  }

  disableNewlines = event => {
    const imageTmp = this.state.imageTmp || {}
    const group_id = this.props.group_id
    const keyCode = event.keyCode || event.which
    let displayTagNameBox = this.state.displayTagNameBox
    let groupsTemp = this.state.groupsTemp
    // let displayEmojiBox = this.state.displayEmojiBox
    
    // if (keyCode === 58){
    //   this.setState({displayEmojiBox:true})
    // }
    if (keyCode === 13) {

      if (imageTmp && imageTmp.base64) {  
        if (!this.blockEnter) {
          this.uploadThumnail(imageTmp, (data) => {
            if (data) {
              this.uploadFile([data], 'image')  
            } else {
              alert('Upload Image Unsuccess')
            }

            this.setState({imageTmp: {}})
          })  
        }
      } else {
        if (displayTagNameBox === true && groupsTemp && groupsTemp.length > 0 && this.state.tagNameSelect ){          
          this.tagName_SelectUser(this.state.tagNameSelect)
          this.resetTagname()
          /*let tagNameDisplay = this.state.tagNameDisplay
          let myDiv = document.getElementById("tagName_List_id");
          myDiv.scrollTop = 0;
          tagNameDisplay.tagNameLast = ''

          this.setState({ tagNameSelect: '', tagNameSelectNum: 0, tagNameSelect_isFirstTime: true, tagNameDisplay })*/
        } else {             
          event.returnValue = false
          if (event.preventDefault) {
            event.preventDefault()
            let mess = this.state.mess      
            let emptyMess = mess.replace(/[\s]/g, '')
            if(this.state.type_option === 2 || emptyMess.length > 0 ){

              mess = this.converEmojiTag(mess)
              if (mess && mess.match(/<span(.*?)<\/span>/g) && mess.match(/<span(.*?)<\/span>/g).length > 0) {
                mess.match(/<span(.*?)<\/span>/g).map((val) => {
                  if (val.indexOf('uid') !== -1) {
                    let arrid = val.match(/"(.*?)"/g)
                    if (arrid && arrid[0]) {
                      let uid = arrid[0].replace(/\\"/g,'').replace(/"/g,'')
                      mess = mess.replace(val, '@'+uid+' ')
                    }
                  }
                })
              }
              mess = this.removeTags(mess)
              if (group_id && (this.state.type_option === 2 || typeof mess !== 'boolean')) {
                let msg_message =  ''
                if(typeof mess !== 'boolean'){
                  msg_message = mess.replace(/\\/g, '').replace(/"/g, '\\"')
                }
                let msg = {
                  group_id: group_id,
                  type: 0,
                  nonce: Math.floor(Date.now()).toString(),
                  sender_name: rxaget(this.props, 'netaauth.user.name', ''),
                  message: msg_message
                }
                if ([1, 2].indexOf(this.props.type_option) !== -1 && this.props.mess_selected && this.props.mess_selected.message_id) {
                  let attachments = {
                    created_at: rxaget(this.props.mess_selected, 'created_at', '').toString(),
                    group_id: rxaget(this.props.mess_selected, 'group_id', '').toString(),
                    group_type: Number(rxaget(this.props.mess_selected, 'group_type', 0)),
                    message: rxaget(this.props.mess_selected, 'message', ''),
                    message_id: rxaget(this.props.mess_selected, 'message_id', '').toString(),
                    sender_uin: rxaget(this.props.mess_selected, 'sender_uin', '').toString(),
                    status: Number(rxaget(this.props.mess_selected, 'status', 0)),
                    // type: Number(rxaget(this.props.mess_selected, 'type', 0)),
                    version: Number(rxaget(this.props.mess_selected, 'version', 0))
                  }              
                  let sub_attachments_tmp = ''
                  try {
                    let s_attachments = this.props.mess_selected.attachments && JSON.parse(this.props.mess_selected.attachments)
                    if (this.props.mess_selected.type === 3) attachments.audio = s_attachments.audio
                    else if (this.props.mess_selected.type === 12) attachments.file = s_attachments.file
                    else if (this.props.mess_selected.type === 4) attachments.video = s_attachments.video
                  } catch (error) { }
                  if (rxaget(this.props.mess_selected, 'attachments', '') !== '') {
                    let messType = rxaget(this.props.mess_selected, 'type', '')
                    if([2, 3, 4, 10, 12].indexOf(messType) !== -1){                      
                      try {
                        let attachments_tmp = rxaget(this.props.mess_selected, 'attachments', '')
                        attachments.attachments = '[attachments_conditional]'
                        attachments.type = Number(rxaget(this.props.mess_selected, 'type', 0))
                        sub_attachments_tmp =JSON.stringify(JSON.parse(attachments_tmp)).replace(/"/g, '\\\\\\"')
                      } catch (e) {
                        console.log(e)
                      }
                    } 

                    if([8].indexOf(messType) !== -1){                      
                      try {
                        
                        let attachments_tmp = {}
                        attachments_tmp.type = 'text'
                        attachments_tmp.text = rxaget(this.props.mess_selected, 'message', '')
                        attachments.attachments = '[attachments_conditional]'
                        attachments.type = 0
                        sub_attachments_tmp =JSON.stringify(attachments_tmp).replace(/"/g, '\\\\\\"')
                      } catch (e) {
                        console.log(e)
                      }
                    } 
                  }
                  try {
                    let messattach = attachments.message || ''
                    attachments.message = messattach.replace(/"/g, '\'\'')
                  } catch(e2) {}    
                  attachments = JSON.stringify(attachments).replace(/"/g, '\\"')
                  msg = {
                    group_id: Number(group_id),
                    type: (this.props.type_option === 1) ? 8 : 9,
                    version: 1,
                    sender_name: rxaget(this.props, 'netaauth.user.name', ''),
                    nonce: Math.floor(Date.now()).toString(),
                    message: msg_message,
                    attachments: attachments.replace('[attachments_conditional]',sub_attachments_tmp)
                  }

                }

                if (rxio.connected) {
                  rxio.socket.emit('create_message', msg, (data) => {
                    if (data && data.message) {
                      this.setState({ type_option: 0, mess_selected: {}/*, mess: ''*/,displayTagNameBox: false,tagNameDisplay: {}, me_typing: false}, () => {
                        this.props.netaMessAdd(group_id, data.message)
                        this.props.handleMessage(data.message, true, 'footer')
                        rxio.sendGroupEvent(group_id, this.userid, 10)
                      })
                      // this.props.reloadStateWhenRepMess(data)
                    }
                  })  
                }           
                // this.props.updateRecentContactGroups(this.state.group.partner_id,Date.now())  
                this.setState({mess:''})
              }
            
            }

          }
        }
      }
    }
  }

  uploadThumnail(image, callback) {
    if (image.base64 && image.width > 0) {
      let dataParams = {
        content_type: image.type,
        name: image.filename,
        public: true,
        size: image.size
      }
      let header = { 'TC-Token': this.token, 'Content-Type': 'application/json; charset=UTF-8', 'Accept-Encoding': 'gzip', 'Connection': 'keep-alive' }
      let requestOptions = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(dataParams),
        redirect: 'follow'
      };

      fetch(global.rxu.config.create_blob, requestOptions).then(res => res.json()).then((json) => {
        this.blockEnter = true
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
                            width: image.width || 960,
                            height: image.height || 720,
                            url: key
                          }
                          
                          callback(objSize)
                        } catch (e) {
                          callback(undefined)
                        }
                      } else {
                        callback(undefined)
                      }
                    })
                    .catch(errorPut => console.log('error', errorPut));
                } else {
                  callback(undefined)
                }
              } else {
                callback(undefined)
              }
            } else {
              callback(undefined)
            }
          })
        } else {
          callback(undefined)
        }
      }).catch(error => console.log('error', error))
    } else {
      callback(undefined)
    }
  }

  setCursor(pos) {
     var chatDiv = document.getElementById('zmess-box')
     var range = document.createRange();
     var sel = window.getSelection();
     range.setStart(chatDiv.childNodes[0], pos);
     range.collapse(true);
     sel.removeAllRanges();
     sel.addRange(range);
     chatDiv.focus();
  }

  sendLike() {
    const arrUsers = this.state.users
    const group_id = this.props.group_id
    const user = rxaget(this.props, 'netaauth.user', {})
    const msg = {
      group_id: group_id,
      type: 0,
      version: 1,
      nonce: Math.floor(Date.now()).toString(),
      sender_name: '',
      message: '👍'
    }

    const objUser = arrUsers[user.id.toString()]
    if (objUser && objUser.profile_url) {
      msg.sender_avatar = objUser.profile_url
    }
    if (rxio.connected) {
      rxio.socket.emit('create_message', msg, (data) => {
        if (data && data.message) {
          this.props.netaMessAdd(group_id, data.message)
          this.props.handleMessage(data.message, true)
        }
      })  
    }
  }

  sendSticker(value) {
    const arrUsers = this.state.users
    const group_id = this.props.group_id
    const user = rxaget(this.props, 'netaauth.user', {})
    const objUser = arrUsers[user.id.toString()]

    const msg = {
      group_id: Number(group_id),
      type: 10,
      version: 1,
      nonce: (Math.floor(Date.now()) * 1000).toString(),
      sender_name: (objUser && objUser.full_name) ? objUser.full_name : '',
      attachments: '{\\"sticker\\":\\"' + value + '\\"}'
    }
    if (rxio.connected) {
      rxio.socket.emit('create_message', msg, (data) => {
        if (data && data.message) {
          this.props.netaMessAdd(group_id, data.message)
          this.props.handleMessage(data.message, true)
        }
      })  
    }
  }

  addEmoji(value, type) {
    if (type === 'EmojiIcon') {
      const chatDiv = document.getElementById('zmess-box')
      if (chatDiv) {
        chatDiv.innerHTML += value
        this.setState({ mess: chatDiv.innerHTML })
      }
    } else if (type === 'Sticker') {
      this.sendSticker(value)
    }
  }

  fetchImage(src, callback) {
    try {
      if (!this.checkImage[src]) {
        this.checkImage[src] = true

        fetch(src, { headers: { 'TC-Token': this.token }, redirect: 'follow' })
          .then(res => {
            if (res && res.redirected && res.url && src) {
              try {
                this.props.netaBlobsUpdate(src, res.url)
              } catch (e) {
                console.log(e)
              }
            }
            return res.blob()
          })
          .then(blob => {
            var reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
              if (reader.result) {
                callback(reader.result)
              }
            }
          })
      }
    } catch (e) {
      // console.log(e)
    }
  }

  onClickMouseRight(e) {
    const menuDiv = document.getElementById('menu-footer')
    // const menuDivGroup = document.getElementById('context_menu-group')
    if (menuDiv && e.button === 2) {
      
      document.oncontextmenu = function () {
        return false;
      }
      menuDiv.style.top = (Number(e.clientY) - 70) + 'px'
      menuDiv.style.left = (Number(e.clientX)) + 'px'
      menuDiv.style.display = 'block'
    }
  }

  async chooseOptionFooter(e, type) {
    if (type === 'copy') {
    } else if (type === 'cut') {
    } else if (type === 'paste') {
      try {
        const text = await navigator.clipboard.readText();
        document.getElementById('zmess-box').innerText = text;
        this.setCursor(text.length)
        // this.setState({mess: text})
      } catch(e) {}
    }

    const menuDiv = document.getElementById('menu-footer')
    if (menuDiv) {
      menuDiv.style.display = 'none' 
    }
  }

  render() {
    // console.log('Render Footer')
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  langValue: state.langValue,
  user: state.user,
  auth: state.auth,
  favorite: state.favorite,
  netaauth: state.netaauth,
  netaGroups: state.netaGroups,  
  rxgroup: state.rxgroup,
  themeValue: state.themeValue,
  tabmore: state.tabmore
})

const mapDispatchToProps = {
  netaMessAdd,
  updateRecentContactGroups,
  chooseGroupAction,
  netaMediaOneAdd

}

const FooterChatWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default FooterChatWrapped