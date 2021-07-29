/*eslint-disable no-undef*/
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import * as Jsx from './index.jsx'
const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { rxnavToggle, rxnavClose, netaRegisteredUsersUpdate, setComp, contactAdd,chooseGroupAction } = global.rootRequire('redux')
const dHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8' }
const { rxgetLocal } = global.rootRequire('classes/request')
const { changeTheme, rxaget, rxChangeSlug } = global.rootRequire('classes/ulti')
const { fetchContact, addContact, checkNameUser } = global.rootRequire('classes/chat')
const themeData = global.rootRequire('classes/themeData.json')
const rxio = global.rootRequire('classes/socket').default

class Component_ extends RxComponent {

  constructor (props, context) {
    super(props, context, Jsx)
    this.state = {
      inputSearchContact: '',
      usersStatus:{},
      flagEdit: false,
      contactRightMouse: {},
      contactInfo: {}
    }
    if(global.rootContext(this.props.staticContext)){
      this.state = {        
        ...this.state,
        ...global.rootContext(this.props.staticContext) 
      }
    }
    this.netaContact = rxaget(this.props, 'netaContact', {})
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.token = global.rxu.get(this.props, 'netaauth.user.token') 
    this.onSubmitContact = this.onSubmitContact.bind(this)
    this.compareContact = this.compareContact.bind(this);
    this.state.registeredUsers = global.rxu.get(this.props, 'netaRegisteredUsers.data', []).sort(this.compareContact)
    // this.state.registeredUsers = registeredUsersTmp.sort(this.compareContact);
    this.state.groupsSearchBoxClickStatus = false
    this.state.searchValue = ''
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside);

    let netaUsersStatus = global.rxu.json(rxgetLocal('netaUsersStatus'), {})
    this.setState({usersStatus:netaUsersStatus})

    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')
    if (themeBackGround==='darkTheme'){
      changeTheme(themeData.nightTheme)
    }else {
      changeTheme(themeData.defaultTheme) 
    }    
    this.fetchData()
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let registeredUsers = global.rxu.get(nextProps, 'netaRegisteredUsers.data', [])
    if(registeredUsers && registeredUsers.length !== this.state.registeredUsers.length){
      
      registeredUsers.sort(this.compareContact)

      this.setState({registeredUsers:registeredUsers})  
    }  
  }
  
  getSearchBoxvalue(clickStatus,searchValue){
    this.setState({
      groupsSearchBoxClickStatus:clickStatus,
      searchValue:searchValue,
    })
  }
  
  compareContact( a, b ) {
    let userA = rxChangeSlug(checkNameUser(a,this.userid,this.props.netaauth))
    let userB = rxChangeSlug(checkNameUser(b,this.userid,this.props.netaauth))

    if ( userA < userB ){
      return -1;
    }
    if ( userA > userB ){      
      return 1;
    }
    return 0;
  }

  onSubmitContact(addContactValue){
    let typeForce = (this.state.flagEdit) ? 1 : 0
    addContact({ arrContacts: [addContactValue], udid: this.userid, token: this.token, typeForce: typeForce },
      (json) => {
        try {
          // console.log("addContact", json)
          if (json.created || json.deleted || json.updated) {
            let that = this
            fetchContact({ netaContact: rxaget(that.props, 'netaContact.data', {}), token: that.token }, (newContacts) => {
              that.props.contactAdd(newContacts)

              this.fetchData()
            })
          }else{
            alert(translate('The user does not exist on the system'))
          }
          this.setState({
            displayAddContact: false,
            flagEdit: false,
            contactInfo: {}
          })
        } catch (error) { console.log(error) }
      })
  }
  groupsSearchBoxClick(){
    this.setState({groupsSearchBoxClickStatus:true})
  }
  async updateInput (inputName, e) {
    let state = {}
    let value = e.target.value
    
    state[inputName] = value

    let arrGroupsChat = this.state.registeredUsers || []
    let jsonUser = await this.searchPhone(value)
    if (jsonUser && rxaget(jsonUser, 'Id', '')) {
      jsonUser['id'] = rxaget(jsonUser, 'Id', '')
      let findUser = arrGroupsChat.findIndex(o => o.Id === rxaget(jsonUser, 'Id', 0))
      if (findUser === -1) {
        arrGroupsChat.push(jsonUser)  
      }
    }
    
    state['registeredUsers'] = arrGroupsChat

    this.setState(state)
  }

  async searchPhone(vPhone) {
    vPhone = vPhone.replace("+", "")
    let prefixes = ["0084", "084", "84", "0"]
    for (let iChar in prefixes) {
      let jChar = prefixes.length - iChar
      let phoneSub = vPhone.substring(0, jChar)
      if (phoneSub === prefixes[iChar]) {
        vPhone = vPhone.replace(prefixes[iChar], "0")
        break
      }
    }
    let phoneRegx = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
    if(vPhone.match(phoneRegx)) {
      const api_get_phone = global.rxu.config.get_phone
      const res = await fetch(api_get_phone + '?phone=' + vPhone, { method: 'GET', headers: { Accept: 'application/json', 'TC-Token': this.token, Connection: 'Keep-Alive', 'Accept-Encoding': 'gzip' }, body: null })
      try {
        let json = await res.json()
        if (json && json.Id) {
          return json
        } else {
          return null
        }
      } catch(e) {
        return null
      }
    } else {  
      return null
    }
  }

  disableDrop = event => {
    event.preventDefault();
  }

  chooseGroup(group){
    this.props.chooseGroupAction(group)              
    this.props.setComp('chat')
  }
  
  chooseContact(contact,isSearchBoxAction){
                  
    if(!isSearchBoxAction){
      this.createNewChat(contact.id)
    }
    // this.props.setComp('chat')    
    // this.props.updateRxContact(contact)
  }

  createNewChat(partner_id) {
    let userOwner = rxaget(this.props, 'netaauth.user', {})
    const params = {
      'type': 3,
      'owner_uin': userOwner.id,
      'name': '',
      'avatar_url': '',
      'occupants_uins': [userOwner.id,partner_id],
      'sender_name': userOwner.name
    }
    
    try {
      if (partner_id) {
        try {
          rxio.createNewGroup(params, (data) => {
            if (data && data.group) {
              if (data.group.type === 3) {
                data.group.partner_id = partner_id
              }
              this.props.chooseGroupAction(data.group)              
              this.props.setComp('chat')
            }
          })
        } catch(e1) {
        }
      }
    } catch(e) {
    }  
  }

  fetchData () {
    let headers = { 'TC-Token':this.token, ...dHeaders }
    fetch(global.rxu.config.base_api_neta + '/api/registered_users.json?udid=&compact=0&offset=0&limit=1000', {
      method: 'GET',
      headers: headers
    }).then(r => r.json()).then((json) => {
      if (json.items) {
        this.props.netaRegisteredUsersUpdate(json.items)
      }
    }).catch(er => console.log(er))
  }

  onRightClickGroup(e, group) {
    e.preventDefault();
    document.oncontextmenu = function (e) {
      return false;
    }

    try {
      const menuDiv = document.getElementById('context-menu-contact')
      menuDiv.style.top = e.clientY + 'px'
      menuDiv.style.left = Number(e.clientX) + 'px'
      menuDiv.style.display = 'block'  
    } catch(e) {
      console.log(e)
    }

    this.setState({ contactRightMouse: group })
  }

  handleClickOutside(event) {
    if (event.buttons === 1 && event.target.className !== 'group-item-info') {
      try {
        const menuDiv = document.getElementById('context-menu-contact')
        menuDiv.style.display = 'none'  
      } catch(e) {}
    }
  }

  apiRemoveContact(userid, paramsContact, callback) {
    const token = rxu.get(this.props, 'netaauth.user.token')

    addContact({ arrContacts: [paramsContact], udid: userid, token: token },
      (json) => {
        try { callback(json) } 
        catch (error) { console.log(error) }
      }
    )
  }

  removeContact() {
    try {
      const contactClick = this.state.contactRightMouse || {}

      const menuDiv = document.getElementById('context-menu-contact')
      menuDiv.style.display = 'none'  
      
      if (contactClick && contactClick.id) {
        const nameContact = (rxaget(this.props.netaContact, 'data.'+contactClick.phone, '' )) ? rxaget(this.props.netaContact, 'data.'+contactClick.phone, '' ) : contactClick.full_name || contactClick.phone 
        const paramsContact = { name: nameContact, phone: contactClick.phone, destroy: 1 }

        this.apiRemoveContact('', paramsContact, (result) => {
          if (result && result.Code) {
            this.apiRemoveContact(this.userid, paramsContact, (result1) => {
              if (result1.created || result1.deleted || result1.updated) {
                this.fetchData()
              } else {
                alert(translate('Remove Contact Not Success'))
              }
            })
          } else if (result.created || result.deleted || result.updated) {
            this.fetchData()
          }
        })
      }

    } catch(e) {}
  }

  editContact() {
    try {
      const contactClick = this.state.contactRightMouse || {}

      const menuDiv = document.getElementById('context-menu-contact')
      menuDiv.style.display = 'none'  

      const nameContact = rxaget(this.props.netaContact, 'data.'+contactClick.phone, '' )
      const contactInfo = { name: nameContact, phone: contactClick.phone}

      this.setState({displayAddContact: true, flagEdit: true, contactInfo: contactInfo})
    

    } catch(e) {}
  }
 
  render() {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  themeBackgroudValue: state.themeBackgroudValue,
  langValue: state.langValue,
  auth: state.auth,
  favorite: state.favorite,
  netaauth: state.netaauth,
  netaRegisteredUsers: state.netaRegisteredUsers,
  netaContact: state.netaContact,
  rxgroup: state.rxgroup,
})

const mapDispatchToProps = {
  rxnavClose,
  rxnavToggle,
  netaRegisteredUsersUpdate,
  setComp,
  contactAdd,
  chooseGroupAction
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
