/*global translate*/

import React, { Component } from 'react'
import { connect } from 'react-redux'

global.isclient && require('./rxGroupList.css')
const { rxaget, rxChangeSlug, stringToColour } = global.rootRequire('classes/ulti')
const { chooseGroupAction } = global.rootRequire('redux')
const { checkNameGroup } = global.rootRequire('classes/chat')
const { rxgetLocal } = global.rootRequire('classes/request')
class RxGroupList extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      groups: [],
      groups_origin: [],      
    }
    this.userid = rxaget(this.props, 'netaauth.user.id', '')
    this.users = rxaget(this.props, 'user.users', {})
    // const objGroups = rxaget(this.props, 'netaGroups.groups', {})
    // if (objGroups && Object.keys(objGroups).constructor === Array) {
    //   Object.keys(objGroups).forEach(group => {
    //     this.state.groups.push(objGroups[group])
    //   })
    // }
    // this.state.groups_origin = this.state.groups
    
      try {
      const groupneta = rxaget(this.props, 'netaGroups', {})
      const arrGroups = []
      if (groupneta && groupneta.groups) {
        for (const idgroup of Object.keys(groupneta.groups)) {
          if (groupneta.groups[idgroup]) {
            let ogroup = groupneta.groups[idgroup]
            ogroup['group_fullname'] = checkNameGroup(ogroup, this.users, this.userid)
            if (ogroup && (ogroup.type === 3||ogroup.type === 5)&& !ogroup.avatar_url && rxaget(ogroup, 'occupants_uins', []).length === 2) {
              const arrUins = rxaget(ogroup, 'occupants_uins', [])
              ogroup['partner_id'] = (arrUins[0].toString() === this.userid.toString()) ? arrUins[1] : arrUins[0]
            }
            arrGroups.push(ogroup)
          }
        }
      }
      this.state.groups = arrGroups
      this.state.groups_origin = this.state.groups

    } catch (e) { console.log(e) }
    this.checkImage = {}
    const timenow = Math.floor(Date.now() / 1000)
    let checkImageObj = rxaget(this.props, 'netaBlobs.data', {}) || {}
    if (checkImageObj && typeof(checkImageObj) === "object" && Object.keys(checkImageObj).length > 0) {
      for (let keyImg of Object.keys(checkImageObj)) {
        let created_at = rxaget(checkImageObj[keyImg], 'created_at', 0)
        if ((timenow - created_at) < 43200) {
          this.checkImage[keyImg] = checkImageObj[keyImg]
        }
      }
    }
  }


  checkAvatarGroup (group) {
    const users = this.users
    let result = false
    if (group.avatar_url) {
      result = true
    } else if (group.type === 3 && !group.avatar_url) {
      if (group && group.occupants_uins && group.occupants_uins.constructor === Array && group.occupants_uins.length === 2 && group.occupants_uins.indexOf(this.userid.toString()) !== -1) {
        const arruserid = group.occupants_uins.filter(o => o !== this.userid.toString())
        if (arruserid && arruserid.constructor === Array && arruserid[0] && users[arruserid[0]] && users[arruserid[0]].profile_url) {
          result = true
        }
      }
    }
    return result
  }

  loadImgStatic (obj, name) {
    if (obj.sender_avatar) {
      return global.rxu.config.get_static + obj.sender_avatar
    } else if (obj.avatar_url) {
      return global.rxu.config.get_static + obj.avatar_url
    } else if (obj.type === 3 && !obj.avatar_url) {
      const users = this.users
      if (obj && obj.occupants_uins && obj.occupants_uins.constructor === Array && obj.occupants_uins.length === 2 && obj.occupants_uins.indexOf(this.userid.toString()) !== -1) {
        const arruserid = obj.occupants_uins.filter(o => o !== this.userid.toString())
        if (arruserid && arruserid.constructor === Array && arruserid[0] && users[arruserid[0]] && users[arruserid[0]].profile_url) {
          return global.rxu.config.cdn_endpoint + users[arruserid[0]].profile_url
        }
      } else {
        return './images/default/static/avadefault.svg'
      }
    } else {
      return './images/default/static/avadefault.svg'
    }
  }

  checkNameGroup (group) {
    const users = this.users
    let result = ''
    if (group.type === 3) {
      if (group && group.occupants_uins && group.occupants_uins.constructor === Array && group.occupants_uins.length === 2 && group.occupants_uins.indexOf(this.userid.toString()) !== -1) {
        const arruserid = group.occupants_uins.filter(o => o !== this.userid.toString())
        if (arruserid && arruserid.constructor === Array) {
          const user = users[arruserid[0]]
          result = (user && user.full_name) ? user.full_name : ''
        }
      } else if (group && group.owner_uin) {
        const user = users[group.owner_uin.toString()]
        result = (user && user.full_name) ? user.full_name : ''
      } else {
        result = users[group.owner_uin.toString()] || group.name
      }
    } else {
      if (!group.name) {
        const occupants_uins = group.occupants_uins || []
        if (occupants_uins && occupants_uins.length > 0) {
          const groupname = []
          occupants_uins.forEach(uin => {
            const fullname = (users[uin.toString()] && users[uin.toString()].full_name) ? users[uin.toString()].full_name : ''
            if (fullname) {
              groupname.push(fullname)
            }
          })
          result = groupname.join(', ')
        }
      } else {
        result = group.name || ''
      }
    }
    return result || translate('Stranger')
  }

  onChangeSearch (e) {
    const _usersinfo = rxaget(global.rxu.json(rxgetLocal('rxusers'), {}), 'users')
    let value = e.target.value
    
    if (value.startsWith('0')) {
      value = value.replace(value.charAt(0), '+84')
    }    
    let arrGroups = this.state.groups_origin.filter(o => {
      const userId = rxaget(o.occupants_uins.filter((id) => (id !== String(rxaget(this.props, 'netaauth.user.id')))), [0])
      const uname_info = rxaget(_usersinfo, [userId], translate('Stranger'))

      try {
        if (o.group_fullname && rxChangeSlug(o.group_fullname) && (rxChangeSlug(o.group_fullname).indexOf(rxChangeSlug(value)) !== -1 || (rxChangeSlug(rxaget(uname_info, 'phone', '')).indexOf(rxChangeSlug(value)) !== -1 && (o.type === 3)))) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log(e)
        return false
      }
    })
    this.setState({ groups: arrGroups })
  }

  chooseGroupForward (group) {
    this.props.chooseGroupAction(group)
    this.props.chooseGroupForward(group)
  }

  render () {
    const linkava = global.rxu.config.get_avatar  
    return (
      <div className='groups-container'>
        <div className='groups-opacity' onClick={e => { this.props.closePopupGroup() }} />

        <div className='groups-box'>
          <div className='groups-search'>
            <input placeholder='Search' className='place-holder-center' onChange={e => { this.onChangeSearch(e) }} />
          </div>
          <div className='groups-box-main'>
            {this.state.groups.length > 0 ? (
              this.state.groups.map((ele, index) =>
                <div className='zgroupitem clearfix' key={index} onClick={e => { this.chooseGroupForward(ele) }}>
                  <div className='zgroup_avatar'>
                    {ele.avatar_url 
                      ? 
                      <img src={global.rxu.config.get_static + ele.avatar_url} alt='avatar_url' className='ava-group images-static'
                      onError={(e) => { e.target.style.display = 'none' }} /> 
                      :
                      (this.users[ele.partner_id] && this.users[ele.partner_id]['profile_url'] 
                        ? <img src={`${global.rxu.config.cdn_endpoint}` + this.users[ele.partner_id]['profile_url']} alt='profile_url' data-id={'userava' + ele.partner_id} className='ava-usergroup images-static' 
                        onError={(e) => {e.target.onerror = null; e.target.src = `${global.rxu.config.get_static}` + this.users[ele.partner_id]['profile_url'] }} /> 
                         : this.checkImage[linkava + ele.partner_id] && <img src={this.checkImage[linkava + ele.partner_id]['link']} alt='linkava' className='ava-usergroup images-static' onError={(e) => { e.target.style.display = 'none' }} />
                      )
                    }
                    {
                      !(ele.avatar_url || (this.users[ele.partner_id] && this.users[ele.partner_id]['profile_url']) )
                      &&<span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + rxaget(ele, 'group_id', '').slice(7,8) + rxaget(ele, 'group_fullname', '').slice(0, 1))}, #FFFFFF)` }}>
                        {rxChangeSlug(rxaget(ele, 'group_fullname', ''), true).slice(0, 2).toUpperCase()}
                      </span>  
                    }
                  </div>
                  <div className='zgroup_maininfo'>
                    <div className='zgroup_name zgroup_name_margin '>{rxaget(ele, 'group_fullname', '')} </div>
                  </div>
                </div>
              )
            ) : (<div className='zgroup-emty'> </div> )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  langValue: state.langValue,
  user: state.user,
  auth: state.auth,
  netaauth: state.netaauth,
  netaBlobs: state.netaBlobs,
  netaMess: state.netaMess,
  netaGroups: state.netaGroups
})

const mapDispatchToProps = {
  chooseGroupAction
}

const ComponentGroupListW = connect(
  mapStateToProps,
  mapDispatchToProps
)(RxGroupList)

export default ComponentGroupListW
