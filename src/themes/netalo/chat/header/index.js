import { connect } from 'react-redux'
import * as Jsx from './index.jsx'

const RxComponent = global.rootRequire('components/shares/rxComponent').default
const { rxaget, changeTheme } = global.rootRequire('classes/ulti')
const { netaCallHistoryUpdate, changeStatusTabmore, clickCall, updateRecentContactGroups } = global.rootRequire('redux')
const { checkBlock, updateUsersOnline } = global.rootRequire('classes/chat')
const themeData = global.rootRequire('classes/themeData.json')
const { rxgetLocal } = global.rootRequire('classes/request')

class Component_ extends RxComponent {
  constructor(props, context) {
    super(props, context, Jsx)
    this.state = {
      tabmore: rxaget(this.props, 'tabmore.data'),
      group_id: rxaget(this.props, 'rxgroup.groupid', ''),
      group: rxaget(this.props, 'rxgroup.group', {}),

      listCallLog: [],
      flagCalling: 0,
      objsCalling: {},
      objsGroupTmp: {},
      showChatCall: false,
      callType: 0, 
      flagTurnOffSoundCall: false,
      typeCall: 1, 
      usersStatus:{},
      countMemberOnl: 0,
      isBlocked: false
    }
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.users = rxaget(this.props, 'user.users', {}) || {}

    this.config = {
      iceServers: [{
        urls: ['turn:dev.turn1.netalo.vn:3478'],
        username: 'developer',
        credential: 'password'
      }, {
        urls: ['stun:dev.stun1.netalo.vn:3478'],
        username: 'developer',
        credential: 'password'
      }]
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!Object.is(this.users, nextProps.user.users)){
      this.users = nextProps.user.users
    }
    let tabmore = (nextProps.tabmore === true || nextProps.tabmore.data === true) ? true : false
    if (tabmore !== this.state.tabmore) {
      this.setState({
        tabmore: tabmore
      })
    }
    if (nextProps.rxgroup && nextProps.rxgroup.group) {
      let isBlocked = checkBlock(nextProps.rxgroup.group)
      if (isBlocked !== this.state.isBlocked) {
        this.setState({ isBlocked })
      }
    }
    if (nextProps.usersStatus) {
      try {
        let groupTemp = nextProps.rxgroup.group || this.state.group
        const { isChange, usersStatus, countMemberOnl } =
          updateUsersOnline(groupTemp.occupants_uins, this.state.countMemberOnl, nextProps.usersStatus, this.state.usersStatus)
        if (isChange) this.setState({ isChange: isChange, usersStatus: usersStatus, countMemberOnl: countMemberOnl })   
      } catch (error) { }
    }
    if (this.state.group_id && nextProps.netaGroups && nextProps.netaGroups.group_id_change === this.state.group_id) {
      try {
        let groupTemp = nextProps.netaGroups.groups[Number(this.state.group_id)]
        this.setState({
          group: groupTemp
        })
        if (groupTemp) {
          const { isChange, usersStatus, countMemberOnl } = updateUsersOnline(groupTemp.occupants_uins, this.state.countMemberOnl, this.state.usersStatus)
          if (isChange) this.setState({ isChange: isChange, usersStatus: usersStatus, countMemberOnl: countMemberOnl })
        }
      } catch (error) { }
    }
  }

  componentDidMount() {
    const themeBackGround = global.rxu.json(rxgetLocal('netaThemeBackGround'), '')
    let isBlocked = checkBlock(this.state.group)
    if (isBlocked !== this.state.isBlocked) {
      this.setState({ isBlocked })
    }
    if (themeBackGround==='darkTheme'){
      changeTheme(themeData.nightTheme)
    }else {
      changeTheme(themeData.defaultTheme) 
    } 
    const { isChange, usersStatus, countMemberOnl } =
      updateUsersOnline(this.state.group.occupants_uins, this.state.countMemberOnl, this.state.usersStatus)
    if (isChange) this.setState({ isChange: isChange, usersStatus: usersStatus, countMemberOnl: countMemberOnl })
  }

  componentDidUpdate(nextprop) {
    const new_group = rxaget(nextprop, 'rxgroup.group', {})
    if (new_group.group_id !== '' && new_group.group_id !== this.state.group_id) {
      this.setState({ group: new_group, group_id: new_group.group_id })
    }
  }

  onClickTabMore() {
    const tabmore = this.state.tabmore
    this.props.changeStatusTabmore(!tabmore)
  }

  onClickStartCall(typeCall) {
    
    // this.props.updateRecentContactGroups(this.state.group.partner_id,Date.now())
    this.props.clickCall(typeCall, {
      group_id: rxaget(this.state, 'group.group_id', '' ),
      type: rxaget(this.state, 'group.type', 0 ),
      occupants_uins: rxaget(this.state, 'group.occupants_uins', [] )
    })
  }

  helpTimeText(timestamp) {
    const a = new Date(timestamp * 1000)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const month = months[a.getMonth()]; const date = a.getDate(); const hour = a.getHours(); const min = a.getMinutes()
    const time = `${date}/${month} ${hour}:${min}`
    return time
  }

  loadImgStatic(obj, name, url=global.rxu.config.cdn_endpoint) {
    if (obj.sender_avatar) {
      return global.rxu.config.get_static + obj.sender_avatar
    } else if (obj.avatar_url) {
      return global.rxu.config.get_static + obj.avatar_url
    } else if (obj.type === 3 && !obj.avatar_url) {
      const users = this.users
      if (obj && obj.occupants_uins && obj.occupants_uins.constructor === Array && obj.occupants_uins.length === 2 && obj.occupants_uins.indexOf(this.userid.toString()) !== -1) {
        const arruserid = obj.occupants_uins.filter(o => o !== this.userid.toString())
        if (arruserid && arruserid.constructor === Array && arruserid[0] && users[arruserid[0]] && users[arruserid[0]].profile_url) {
          return url + users[arruserid[0]].profile_url
        }
      } else {
        return './images/default/static/avadefault.svg'
      }
    } else {
      return './images/default/static/avadefault.svg'
    }
  }

  uniqArray(a) {
   return Array.from(new Set(a));
  }

  render() {
    return this.renderComponent()
  }
}

const mapStateToProps = (state, ownProps) => ({
  themeValue: state.themeValue,
  langValue: state.langValue,
  rxgroup: state.rxgroup,
  user: state.user,
  netaauth: state.netaauth,
  netaCallHistory: state.netaCallHistory,
  netaGroups: state.netaGroups,
  tabmore: state.tabmore,
  usersStatus: state.usersStatus
})

const mapDispatchToProps = {
  netaCallHistoryUpdate,
  changeStatusTabmore,
  updateRecentContactGroups,
  clickCall
}

const ComponentWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component_)

export default ComponentWrapped
