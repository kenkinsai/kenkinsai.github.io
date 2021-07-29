
/*global translate*/
import React, { useState } from 'react';
import { uploadFileImages } from '../rxUtils'
import './create_group_chat.css'

const rxio = global.rootRequire('classes/socket').default
const { rxaget, stringToColour, rxChangeSlug, subString } = global.rootRequire('classes/ulti')
const { checkNameGroup, checkAvatarGroup, checkNameContact, checkNameUser, getGroupById, checkBlock } = global.rootRequire('classes/chat')
const { chooseGroupAction, netaGroupsUpdate } = global.rootRequire('redux')

const CreateGroupChat = (props) => {
    let { 
        createGroupChatText,
        themeBackgroudValue,
        users,
        currentUser,
        netaauth,
        userChecked,
        onShow,
        onHide
    } = props

    const [isDisplayPopup, setIsDisplayPopup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [searchText, setSearchText] = useState('');
    const [checkedUsers, setCheckedUsers] = useState([userChecked]); 
    const [groupImages, setGroupImages] = useState([]);
    const [isChooseFileImage, setIsChooseFileImage] = useState(false);
    const [groupImageURL, setGroupImageURL] = useState('');


    const onClickCreateTitle = () => {
        setIsDisplayPopup(true)
        onShow && onShow()
    }

    const onClickDauX = () => {
        setIsDisplayPopup(false)
        onHide && onHide() 
    }

    const onCheckUser = (e, user) => {
        if (e.target?.checked) setCheckedUsers([...new Set([...checkedUsers, { ...user }])])
        else setCheckedUsers(checkedUsers.filter(u => u.id != user.id))
    }

    const chooseFileImages = (fileList) => {
        setGroupImages([...fileList])
        setIsChooseFileImage(true)
        setGroupImageURL(URL.createObjectURL(fileList[0]))
    }

    const onClickCreateGroup = (callback) => {
        let emptyValue = ''
        if (newGroupName) {
          emptyValue = newGroupName.replace(/[\s]/g, '') 
        }
        // const checkedUserIds = checkedUsers.map(u => u.id);
        if (emptyValue.length > 0) { 
          if (checkedUsers.length === 0) { 
            alert(translate('You have not selected a member')) 
          } else { 
            const params = { 
              type: 2,
              owner_uin: currentUser.id,
              name: newGroupName,
              avatar_url: '',
              occupants_uins: checkedUsers.map(u => u.id),
              sender_name: currentUser.full_name
            }
            try {
                rxio.createNewGroup(
                    params, 
                    data => { 
                        if (data && data.group) {
                            if (isChooseFileImage) { 
                                // this.uploadFileImages(groupImage, data.group)
                            } else { 
                                chooseGroupAction(data.group)
                                netaGroupsUpdate(Number(data.group.group_id), data.group)
                            }
                        }
                        setTimeout(() => {
                            // callback()
                            setGroupImages('')
                            setIsChooseFileImage(false)
                            setGroupImageURL('')
                            setIsDisplayPopup(false)
                        }, 1000) 
                    }
                )
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          const mess = translate('The group name can not be blank')
          alert(mess)
        }
      }

    return <div className='create_group_wrapper'>
        {isDisplayPopup
            ?  <div className='create_group_popup'>
                    <div className='create_group_title_area'>
                        <div className='create_group_title'>
                            {translate("Create a group")}
                        </div>
                        <div className='create_group_btn_close'>
                            <img className='create_group_icon_close'
                                src={'./images/default/icons/icon-basic-up.svg'} 
                                onClick={onClickDauX}
                            />
                        </div>
                    </div>
                    <div className="create_group_info">
                        <div className="newgroup_camera_icon_place">
                            <input type='file' id='data_image_camera' multiple={false} 
                            // key={theInputFileKey + '_data_image_camera'} 
                            style={{ display: 'none' }}
                            onChange={(e) => chooseFileImages(e.target.files)} 
                            accept="image/jpg,image/png,video/mp4"
                            />
                            {groupImageURL.length === 0 
                                && <div className="newgroup_icon_area icon_camera" >
                                    <img className="newgroup_icon_search filter_img_class" src={"./images/default/icons/camera.svg"} alt="" />
                                </div>}
                            {groupImageURL.length > 0 && <img className="newgroup_chooseAvatar" src={groupImageURL} alt="" />}
                        </div>
                        <input placeholder={translate("Enter a group name")} maxLength="30" className="create_group_name" onChange={e => setNewGroupName(e.target.value)} value={newGroupName} />
                    </div>

                    <div className='create_group_leader_search_area'>
                        <div className='create_group_leader_icon_search_area'>
                            <img className='create_group_leader_icon_search filter_img_class' src={"./images/default/icons/search-active.svg"} alt='' />
                        </div>
                        <input type='search' maxLength='30' id='newgroup_search_input' placeholder={translate("Search")} 
                            value={searchText}
                            onChange={e => setSearchText(e.target.value) } 
                            autoComplete='off'
                            className={themeBackgroudValue === "darkTheme"
                            ? "create_group_leader_search_input darkThemeInput"
                            : "create_group_leader_search_input lightThemeInput"
                            }
                        >
                        </input>
                        
                        {/* <div className='create_group_group_manage_close_area'></div> */}
                    </div>

                    <div className='newgroup_popup_list'>
                    {
                        checkedUsers.length > 0 
                        && <div className='new_list_contacts_selected'>
                        {
                            checkedUsers.map(user => (
                            <div key={user.id} className='item-row-selected-user'>
                                {subString(checkNameUser(user), 20)}
                                <img className='item-row-selected-close' src={'./images/default/icons/icon-close.png'} alt='' 
                                /> 
                            </div>
                            ))
                        }
                        </div>
                    }

                    <div className='create_group_contact_list'>
                        {users.map((user, index) => {
                            // return <div>{user.id}</div>
                            let fullnameFirstLetter = rxChangeSlug(checkNameUser(user, currentUser, netaauth)).slice(0, 1)
                            let contactTitle = ''

                            if (contactTitle !== fullnameFirstLetter) {
                                user.contactTitle = true
                                contactTitle = fullnameFirstLetter
                            } else {
                                user.contactTitle = false
                            }

                            return (
                                user.id !== currentUser 
                                && (
                                    <div key={index}>
                                        {user.contactTitle 
                                            && <div className='zcontact_title'>{fullnameFirstLetter}</div>
                                        }
                                        <div 
                                            //   onClick={e => { this.createNewChat(user) }} 
                                            className='group_contacts_item clearfix' >
                                            <div className='zgroup_avatar'>
                                                {user.profile_url && (
                                                    <img src={global.rxu.config.cdn_endpoint + user.profile_url} alt=''
                                                    data-id={'userava' + user.id} className='ava-useravatar images-static'
                                                    onError={e => { e.target.onerror = null; e.target.src = global.rxu.config.get_static + user.profile_url }}
                                                    />
                                                )}
                                                {!user.profile_url && <span className='ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameContact(user).slice(0, 2).toUpperCase())}, #FFFFFF)` }} >
                                                    {rxChangeSlug(checkNameUser(user)).slice(0, 2).toUpperCase()}
                                                </span>}
                                            </div>
                                            <div className='zgroup_maininfo-contact'>
                                                <div className='newgroup_userinfo_place'> {subString(checkNameUser(user), 20)} </div>
                                                <div className='newgroup_checked'>
                                                    <label className='container100'>
                                                        <input className='checkmark1' type='checkbox' checked={checkedUsers.find(u => u.id == user.id)} 
                                                    onChange={e => onCheckUser(e, user)} />
                                                        <span className='checkmark'></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='newgroup_divider'></div>
                                        </div>
                                    </div>
                                )
                            )
                        })}
                    </div>
                </div>

                <div className='create-newgroup-row'>
                    <div className='create-newgroup-btn' onClick={e => onClickCreateGroup()}>
                        {translate("Create a group")}
                    </div>
                </div>
            </div>

            : <span className='create_group_title-manage-group' onClick={onClickCreateTitle}>
                {createGroupChatText}
            </span>}
    </div>
}

export default CreateGroupChat




