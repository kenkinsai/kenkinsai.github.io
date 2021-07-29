/* global translate */ 
import React from 'react'
import Parser from 'html-react-parser'
global.isclient && require('./index.css')
const { rxChangeSlug,rxconfig,stringToColour,subString } = global.rootRequire('classes/ulti')
const {checkNameContact, checkNameUser }= global.rootRequire('classes/chat')
let zget = global.rxu.get
let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'
let appName = 'GAlo'
let appSupportUrl = 'https://hotro.galo.vn'
if (rxconfig.theme === 'default') {
  appName = 'NetAlo'
  appSupportUrl = 'https://hotro.netalo.vn'
}
export const renderBody = (vm) => <div>
  <div className='zchat_left'>
    <div className='zleft_menu'>
      <div className='zmenu_message' onClick={e => {vm.props.setComp('chat'); vm.zmenu_logoutConfigpage()}}>
        <img src={'./images/default/icons/chat.svg'} className='zmenu_icon icon' alt='' />
      </div>
      <div className='zmenu_call' onClick={e => { vm.props.setComp('call');vm.zmenu_logoutConfigpage()}}>
        <img src={'./images/default/icons/call.svg'} className='zmenu_icon icon' alt='' />
      </div>
      <div className='zmenu_contact' onClick={e => {vm.props.setComp('contact'); vm.zmenu_logoutConfigpage()}}>
        <img src={'./images/default/icons/contact.svg'} className='zmenu_icon icon' alt='' />
      </div>
      <div className='zmenu_config' onClick={e => { vm.zmenu_logoutConfigpage()}}>
        <img src={'./images/default/icons/config-active.svg' }className='zmenu_icon icon filter_img_class' alt='' />
      </div>
    </div>
    <div className='zleft_contain'>
      <div className='zuinfo_base'>
        <div className='zuinfo_header'>
          <span className='zuinfo_header-title'>
            {translate('Account')}
          </span>
          <div className='zuinfo_header-btn_edit' onClick={e=>vm.editBtnClick()}>
            <span className='zuinfo_header-txt_edit'>
              {translate('Edit')}
            </span>
          </div>
        </div>
        <div className='zuinfo_avatar'>
          {(zget(vm.userinfo, 'profile_url', '') || vm.state.netaauth_profile_url) && <img className='zuinfo_avatar_img images-static'
            src={`${global.rxu.config.cdn_endpoint}${(vm.state.netaauth_profile_url || zget(vm.userinfo, 'profile_url', ''))}`} alt=''
            onError={(e) => { e.target.onerror = null; e.target.src = `${global.rxu.config.get_static}${(vm.state.netaauth_profile_url || zget(vm.userinfo, 'profile_url', ''))}` }} />
          }
          <span className='zspan_nameuser_default'>
            {rxChangeSlug(vm.state.netaauth_user_name).slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className='zuinfo_info'>
          <div className='zuinfo_name'>{vm.state.netaauth_user_name}</div>
          <div className='zuinfo_desc'>{zget(vm.props, 'netaauth.user.phone')}</div>
        </div>
        <div className='zuitems'>
          <div className='zuitem zuitem_general '>
            <img className='icon24' src={'./images/default/icons/notify.svg'} alt='' />
            <span className='zuinfo_txt'>
              {translate('General settings')}
            </span>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>  
          <div className= 'zuitem zuitem_notify'
            onClick={e => {  vm.setState({ displayListBlock: true }) }}>
            <img className='icon24 filter_img_class' src={'./images/default/icons/ic_block_list.svg'} alt='' />
            <span className='zuinfo_txt'>
              {translate('Block list')}
            </span>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>

          <div className={zget(vm.props, 'pageValue')==='cdtb'?'zuitem-active zuitem_notify ':'zuitem zuitem_notify'} onClick={e => { vm.choose_cdtb('cdtb')}}>
            <img className='icon24 filter_img_class' src={'./images/default/icons/notify.svg'} alt='' />
            <span className='zuinfo_txt'>
              {translate('Notification settings')}
            </span>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>    
          <div className={(zget(vm.props, 'pageValue') === 'cdcd') || (vm.state.page === 'cdcd')?'zuitem-active zuitem_notify ':'zuitem zuitem_notify '} onClick={e => { vm.choose_cdcd('cdcd')}}>
            <img className='icon24 filter_img_class' src={'./images/default/icons/theme.svg'} alt='' />
            <span className='zuinfo_txt'>
              {translate('Theme')}
            </span>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>
          <div className={zget(vm.props, 'pageValue')==='cdnn'?'zuitem-active zuitem_lang ':'zuitem zuitem_lang'} onClick={e => { vm.choose_cdnn('cdnn')}}>
            <img className='icon24 filter_img_class' src={'./images/default/icons/language.svg'} alt='' />
            <span className='zuinfo_txt'>
              {translate('Language')}
            </span>
            <div className='zuitem-right'>
              <span className='zuinfo-txtmore'>
                {zget(vm.props, 'langValue')==='en'?'English':'Tiếng Việt'}
              </span>
              <img className='icon24 ' src={'./images/default/icons/right-arrow.svg'} alt='' />
            </div>
          </div>
          <div className={zget(vm.props, 'pageValue')==='chtg'?'zuitem-active zuitem_lang ':'zuitem zuitem_lang'} onClick={e => { vm.choose_chtg('chtg')}}>
            <img className='icon24 filter_img_class' alt='' src={'./images/default/icons/question.svg'} />
            <span className='zuinfo_txt'>
              {translate('Frequently asked questions')}
            </span>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>
          <div className={zget(vm.props, 'pageValue')==='dksd'?'zuitem-active zuitem_lang ':'zuitem zuitem_lang'} onClick={e => { vm.choose_dksd('dksd')}}>
            <img className='icon24 filter_img_class' alt='' src={'./images/default/icons/rule.svg'} />
            <span className='zuinfo_txt'>
              {translate('Terms of use')}
            </span>
            <img className='icon24 zuitem-right' src={'./images/default/icons/right-arrow.svg'} alt='' />
          </div>
          <div className='zuitem zuitem_lang' onClick={vm.onClickLogout.bind(vm)}>
            <div className='icon-logout zicon-logout' />
            <span className='zuinfo_txt'>
            {translate('Logout')}
            </span>
          </div>
        </div>
        <div className='zuversion'>Version: 1.0.9</div>
      </div>
    </div>

    {vm.state.displayListBlock === true && <div className="newgroup_rectangle config">
      <div className="newgroup_rectangle_1"></div>
      {/* <div className="newgroup_rectangle_2_1"> */}
      <div className="create_new_group_chat">
        <div className="newgroup_rectangle_title">
          <div className="them_lien_he">{translate("Block list")}</div>
          <div className="close_icon" onClick={e => { vm.setState({ displayListBlock: false,unblockList:{} }) }}>
            <img
              className="icon-basic-up filter_img_class"
              src={"./images/default/icons/icon-basic-up.svg"}
              alt=""
            />
          </div>
        </div>
        <div className="newgroup_body">
          <div className="newgroup_contactlist_default" id="zgroup_list">
            {vm.state.blockedList ?
              (vm.state.blockedList.length ? vm.state.blockedList.map((ele, index) => {
                return (
                  <div key={index}
                    className="zgroupitem-contact clearfix"  >
                    <div className="zgroup_avatar">
                      {ele.profile_url && (
                        <img src={global.rxu.config.cdn_endpoint + ele.profile_url}
                          alt="" data-id={"userava" + ele.id} className="ava-useravatar images-static"
                          onError={e => {
                            e.target.onerror = null; e.target.src = global.rxu.config.get_static + ele.profile_url
                          }}
                        />
                      )}
                      {!ele.profile_url && <span className="ava-span"
                        style={{
                          background: `linear-gradient(120deg, ${stringToColour("FFF" + checkNameContact(ele).slice(0, 2).toUpperCase())}, #FFFFFF)`
                        }}
                      >
                        {rxChangeSlug(checkNameUser(ele)).slice(0, 2).toUpperCase()}
                      </span>}
                      
                    </div>
                    <div className="zgroup_maininfo-contact" >
                      <div className="newgroup_userinfo_place" onClick={e => vm.onChooseContactUnblock(ele, index)}> {subString(checkNameUser(ele), 20)} </div>
                      <div className="newgroup_checked">
                        <label className="container100">
                          <input
                            className="checkmark1"
                            type="checkbox"
                            checked={vm.state.unblockList[ele.group_id] ? true : false}
                            onChange={e => vm.onChooseContactUnblock(ele, index)}
                          />
                          <span className="checkmark" ></span>
                        </label>
                      </div>
                    </div>
                    <div className="newgroup_divider"></div>
                  </div>
                );
              }) : <div className='mess-unblock'>{translate('You haven\'t blocked any contact')}</div>) :
              <div className="loading"><div className="dot-flashing"></div></div>}

          </div>
        </div>
        {(vm.state.blockedList && vm.state.blockedList.length)?<div className="newgroup-buntton">
          <span className="newgroup-create-btn" onClick={e => vm.onClickUnBlockContact()}>
            {translate("Unblock contact")}
          </span>
        </div>:null}
      </div>
    </div>}
    <div className={(vm.state.displayEditScreen === true) ? 'chatConfig_rectangle' : 'chatConfig_rectangle_hiden'}>          
      <div className='chatConfig_rectangle_1'></div>        
      <div className='chatConfig_rectangle_2'>        
        <div className='chatConfig_rectangle_2_1'>
          <div className='chatConfig_title_place'>
            <div className='chatConfig_cancel_btn' onClick={e=>vm.cancelBtnClick()}>{translate('Cancel')}</div>
            <div className='chatConfig_title'>{translate('Profile')}</div>
          </div>
          <div className='chatConfig_avatar_place'>
            <div className='zuinfo_edit_avatar' onClick={(e) => vm.uploadInputImage.click() }>
              <input type='file' id='data_image' ref={(ref) => { vm.uploadInputImage = ref}} multiple={false} key={'data_image'}
                style={{ display: 'none' }} accept="image/jpg,image/png,video/mp4"
                onChange={(e) => vm.uploadFileImages(e.target.files)} />
              <div className="icon-camera"></div>
              {(zget(vm.userinfo, 'profile_url', '') || vm.state.netaauth_profile_url)
                && <img className='zuinfo_avatar_img images-static'
                  alt=''
                  src={`${global.rxu.config.cdn_endpoint}${vm.state.netaauth_profile_url || zget(vm.userinfo, 'profile_url', '')}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${global.rxu.config.get_static}${vm.state.netaauth_profile_url || zget(vm.userinfo, 'profile_url', '')}`
                  }} />}
               <span className='chatConfig_zspan_nameuser_default'>
                  {rxChangeSlug(vm.state.netaauth_user_name).slice(0, 2).toUpperCase()}
                </span>
            </div>
          </div>
          <div className='chatConfig_edit_body'>
            <div className='chatConfig_edit_tile'>{translate('Full name')}</div>
            <div className='chatConfig_group_input_place'>
              <input maxLength="30" className='chatConfig_input' placeholder={vm.state.netaauth_user_name}
              value={vm.state.usernameValue} 
              onChange={(event) =>vm.setState({ usernameValue: event.target.value })} ></input>   
              <div className='chatConfig_border_bot'></div>
            </div>
            <div className='chatConfig_edit_tile'>{translate('Phone number')}</div>
            <div className='chatConfig_group_input_place'>
              <div className='chatConfig_phone_input_place'>
                <span className='chatConfig_phone' >{zget(vm.props, 'netaauth.user.phone')}</span> 
              </div>
              <div className='chatConfig_phone_lock_icon'>
                {/*<img src={zget(vm.props,'themeValue') ==='blueColor'?'./images/icons/Mask Group 109_bl.png':'./images/icons/Mask Group 109.png'} alt=''/>*/}
              </div> 
              <div className='chatConfig_border_bot'></div>               
            </div>             
            <div className='chatConfig_note'>{translate('Registered phone number cannot be changed')}</div>
            <div className='chatConfig_doneBtn' onClick={()=>vm.updateProfile()}>{translate('Done')}</div>
          </div>          
        </div>      
      </div>        
    </div> 
  </div>
  <div className='zchat_right'>
    <div className={zget(vm.props, 'pageValue')==='cdtb' ? 'zchat_right_cdtb' : 'zchat_right_cdtb_hiden'}>
      <div className='cdcd_main_title_place'>
        <div className ='cdcd_main_title'>
          {translate('Notification settings')}
        </div>
      </div>
      <div className='cdtb_rowplace' >
        <div className ='cdtb_title'>
          {translate('Allows notifications')}
        </div>
        <div className='cdtb_pt_place'>
          <label className='switch'>
            <input className = 'pushToggles' type = 'checkbox' checked = {vm.state.notificationStatusValue} onChange={e=>vm.usePushNotifications(e)}/>
            <span className = 'slider round'></span>
          </label>
        </div>  
      </div>
    </div>
    <div className={(zget(vm.props, 'pageValue') === 'cdcd') || (vm.state.page === 'cdcd')? 'zchat_right_cdcd' : 'zchat_right_cdcd_hiden'}>
      <div className='cdcd_main_title_place'>
        <div className ='cdcd_main_title'>
          {translate('Theme settings')}
        </div>
      </div>   
      <div className='cdcd_body'>
        <div className = 'cdcd_title'>{translate('Theme')}</div>
        <div className='cdcd_hh'>
          <div className='cdcd_hh_left'>
            <div className='cdcd_hh_place'>    
              <div className={(zget(vm.props,'themeBackgroudValue') !== 'darkTheme') ? 'cdmd cdcd_border_active' : 'cdmd cdcd_border'} onClick={e=>vm.themeSelect('defaultTheme')}>
                <div className='cdmd_row1_place'>
                  <div className='cdmd_row1_img'></div>
                </div>
                <div className='cdmd_row2_place'>
                  <div className='cdmd_row2_img'></div>
                </div>
              </div>        
            </div>
            <div className='cdcd_background_place'>
              {translate('Default')}
            </div>
          </div>
          <div className='cdcd_hh_right'>
            <div className='cdcd_hh_place'>   
              <div className={(zget(vm.props,'themeBackgroudValue') === 'darkTheme') ? 'cdbd cdcd_border_active' : 'cdbd cdcd_border'}onClick={e=>vm.themeSelect('darkTheme')}>
                <div className='cdbd_row1_place'>
                  <div className='cdbd_row1_img'></div>
                </div>
                <div className='cdbd_row2_place'>
                  <div className='cdbd_row2_img'></div>
                </div>
              </div>           
            </div>
            <div className='cdcd_background_place'>
              {translate('Night')}
            </div>
          </div>        
        </div>
        <div className='cdcd_rowplace_border_top'></div>
        <div className={rxconfig.theme === 'galo' ?'cdcd_rowplace_hiden':'cdcd_rowplace'}>
          <div className='cdcd_rowplace_title'> 
            {translate('Color')}
          </div>
          <div className='cdcd_rdbtn_place'>
            <div className='cdcd_border2' >
              <label className='cdcd_container'>
                <input type='radio' name='radio' defaultChecked={zget(vm.props,'themeValue') !=='blueColor'?'checked':''} />
                <span className='cdcd_checkmark2' onClick={e=>vm.submitThemeColor('orangeColor')}></span>
              </label>
            </div>  
          </div>
          <div className='cdcd_rdbtn_place'>
            <div className='cdcd_border1' >
              <label className='cdcd_container'>
                <input type='radio' name='radio' defaultChecked={(zget(vm.props,'themeValue')==='blueColor')} />
                <span className='cdcd_checkmark1' onClick={e=>vm.submitThemeColor('blueColor')}></span>
              </label>
            </div>
          </div>
        </div>
      </div> 
    </div>
    <div className={zget(vm.props, 'pageValue')==='cdnn' ? 'zchat_right_cdnn' : 'zchat_right_cdnn_hiden'}>
      <div className='cdnn_main_title_place'>
        <div className ='cdnn_main_title'>
          {translate('Language settings')}
        </div>
      </div>
      <div className='cdnn_rowplace'>
        <div className='cdnn_title'>
          {translate('Language')}
        </div>
        <div className='cdnn_selectBox'>
          <select className='cdnn_language_place' id='cdnn_language' onChange={e=>{vm.changeLang(e.target.value)}}>
            {zget(vm.props,'langValue')==='vi'?<option value='vi' selected>Tiếng Việt</option>:<option value='vi' >Tiếng Việt</option>}
            {zget(vm.props,'langValue')==='en'?<option value='en' selected>Enghlish</option>:<option value='en' >Enghlish</option>}
          </select>    
        </div>
        
      </div>
      <div className='cdnn_divider_area'>
        <div className='cdnn_divider'></div>
      </div>  
    </div>
    <div className={zget(vm.props, 'pageValue')==='chtg' ? 'zchat_right_chtg' : 'zchat_right_chtg_hiden'}>
      <div className='chtg_config_title'>
        <div className='chtg_config_title_border_bot'>{translate('Have Questions? Look Here')}</div>
      </div>
      <div className='chtg_body'>   
      {vm.state.arrQuestion.map((ele, index) =>{
        return <div key={index}>
          <div className='chtg_quest'>     
            <div className='chtg_quest_place' onClick={e=>{vm.chtg_clickTitle(ele.name)}}>
              <div className='chtg_quest_title'>{translate(ele.question)}</div>
              <div className='chtg_quest_img'>
                {<i className={ele.status_click === true ? 'arrow up' : 'arrow down'}></i> }
              </div>
            </div>
            <div className='chtg_quest_border_bot'></div>
            <div className={ele.status_click === true ? 'chtg_answer' : 'chtg_answer_hiden'}>
              <div className='chtg_answer_info'>{translate(ele.answer)}</div>
            </div>
          </div>
        </div>
        }
      )}

      </div>
      <div className = 'chtg_footer'></div>
    </div>
    <div className={zget(vm.props, 'pageValue')==='dksd' ? 'zchat_right_dksd' : 'zchat_right_dksd_hiden'}>
      <div className='dksd_config_title'>
        <div> {translate(appName+' Terms Of Service')}</div>
        <div className='dksd_divider'></div>
      </div>

      <div className={zget(vm.props, 'langValue')==='en'?'dksd_body_hiden':'dksd_body'}>
        <div className='dksd_title'>
          {'ĐIỀU 1. NGUYÊN TẮC CHUNG'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Trước khi đăng ký tài khoản để sử dụng dịch vụ trên Mạng xã hội '+appName+' (“Dịch vụ”), bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các quy định trong Thỏa Thuận Cung Cấp Và Sử Dụng Dịch Vụ Mạng Xã Hội GAlo này (sau đây gọi tắt là “Thỏa thuận”) thông qua việc hoàn thành việc đăng ký tài khoản Mạng xã hội '+appName+'. Bạn chấp nhận không có bất kỳ giới hạn nào về và/hoặc liên quan tới tất cả các điều khoản và điều kiện dưới đây, kể từ thời điểm bạn sử dụng Dịch vụ lần đầu tiên.'}
          </li>
          <li className='dksd_item'>
            {'Khi xem xét việc sử dụng Dịch vụ cung cấp bởi Công ty Cổ phần Technology Convergence Corporation (sau đây gọi tắt là “chúng tôi” hoặc “'+appName+'”), bạn cam kết rằng bạn có đủ tuổi theo luật định để xác lập thỏa thuận có tính ràng buộc, và không phải là người bị ngăn cấm tiếp nhận Dịch vụ theo pháp luật Việt Nam, hoặc bạn đã có sự chấp thuận trước của cha mẹ hoặc người giám hộ hợp pháp của bạn để sử dụng Dịch vụ theo quy định và phù hợp với Thỏa thuận này.'}
          </li>
          <li className='dksd_item'>
            {'Đồng thời, khi đăng ký tài khoản và sử dụng Dịch vụ, bạn cũng cam kết và chấp nhận rằng:'}
          </li>
          <li className='dksd_item2'>
            {'Nếu bạn muốn định danh tài khoản, bạn sẽ cung cấp đầy đủ, chính xác thông tin về họ tên; ngày, tháng, năm sinh; số chứng minh nhân dân/hộ chiếu/căn cước công dân (“Giấy tờ tùy thân”), ngày cấp, nơi cấp của Giấy tờ tùy thân, và chịu trách nhiệm về các thông tin mà bạn cung cấp khi thực hiện việc đăng ký cũng như sửa đổi, bổ sung các thông tin này;'}
          </li>
          <li className='dksd_item2'>
            {'Tất cả các giao tiếp, dữ liệu, văn bản, phần mềm, âm nhạc, âm thanh, hình chụp, hình họa, video, thư hoặc các tài liệu khác (sau đây gọi chung là "Thông tin"), cho dù được đăng công khai hoặc được truyền đưa riêng, trước tiên thuộc về trách nhiệm của người tạo ra Thông tin đó. Chúng tôi có hệ thống kiểm duyệt nội dung Thông tin được chia sẻ cũng như có cơ chể phát hiện và xử lý vi phạm đối với những Thông tin do những người sử dụng khác nhau cung cấp trên Mạng xã hội '+appName+' theo quy định của pháp luật Việt Nam;'}
          </li>
          <li className='dksd_item2'>
            {'Bạn có thể chia sẻ Thông tin hợp lệ và hợp pháp dưới các định dạng chúng tôi mặc định tại các khu vực cho phép. Là người sử dụng, bạn cần có trách nhiệm với các giao tiếp của riêng bạn và phải tự chịu trách nhiệm với kết quả của việc chia sẻ. Chúng tôi không đại diện, xác nhận hay cam đoan tính trung thực, chính xác của các Thông tin được chia sẻ.'}
          </li>
          <li className='dksd_item'>
            {'Đối với Thông tin được bảo vệ theo quyền sở hữu trí tuệ như ảnh và video (“Thông tin SHTT”), bạn cấp riêng cho chúng tôi quyền sau: bạn cấp cho chúng tôi một giấy phép toàn cầu, không độc quyền, có thể chuyển nhượng, có thể cấp phép lại và miễn phí để sử dụng mọi Thông tin SHTT mà bạn đăng lên (“Giấy phép SHTT”). Giấy phép SHTT này hết hiệu lực khi bạn xóa Thông tin SHTT hoặc tài khoản, trừ khi Thông tin của bạn đã được chính bạn chia sẻ với người khác và những người này chưa xóa Thông tin đó trên Mạng xã hội '+appName+'.'}
          </li>
          <li className='dksd_item'>
            {'Khi chia sẻ Thông tin lên Mạng xã hội '+appName+', bạn đồng ý cấp cho chúng tôi quyền sử dụng và chia sẻ Thông tin đó lên các nền tảng khác của hệ sinh thái '+appName+' thuộc quyền quản lý của chúng tôi hoặc các phương tiện thông tin đại chúng.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 2. QUY ĐỊNH VỀ ĐẶT TÊN TÀI KHOẢN'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Không được đặt tên tài khoản, nhân vật theo tên của danh nhân, tên của các vị lãnh đạo, tên của trùm khủng bố, phát xít, tội phạm, và tên của những cá nhân, tổ chức chống lại Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam, mà gây phương hại đến an ninh quốc gia, trật tự an toàn xã hội.'}
          </li>
          <li className='dksd_item'>
            {'Không được đặt tên tài khoản, nhân vật trùng hoặc tương tự gây nhầm lẫn với tên viết tắt, tên đầy đủ của cơ quan nhà nước, tổ chức chính trị, tổ chức chính trị - xã hội, tổ chức chính trị xã hội - nghề nghiệp, tổ chức xã hội, tổ chức xã hội - nghề nghiệp của Việt Nam và tổ chức quốc tế, nếu không được cơ quan, tổ chức đó cho phép.'}
          </li>
          <li className='dksd_item'>
            {'Không được đặt tên tài khoản, nhân vật trùng hoặc gây nhầm lẫn để giả mạo các cá nhân, tổ chức khác nhằm mục đích đưa thông tin sai sự thật, xuyên tạc, vu khống, xúc phạm uy tín của tổ chức, danh dự và nhân phẩm của cá nhân khác.'}
          </li>
          <li className='dksd_item'>
            {'Không được đặt tên tài khoản, nhân vật vi phạm các quyền sở hữu trí tuệ.'}
          </li>
          <li className='dksd_item'>
            {'Không được đặt tên có chứa các từ/cụm từ gây nhầm lẫn với các nền tảng trong hệ sinh thái của '+appName+' thuộc quyền quản lý của '+appName+' khi chưa có sự đồng ý bằng văn bản của '+appName+'.'}
          </li>
          <li className='dksd_item'>
            {'Tài khoản vi phạm quy định về đặt tên sẽ bị khoá và/hoặc xóa vĩnh viễn mà không cần thông báo.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 3. QUY ĐỊNH VỀ HÌNH ĐẠI DIỆN'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Không sử dụng hình ảnh có hàm ý kích động bạo lực, dâm ô, đồi trụy, tội ác, tệ nạn xã hội, mê tín dị đoan, phá hoại thuần phong, mỹ tục của dân tộc.'}
          </li>
          <li className='dksd_item'>
            {'Không sử dụng hình ảnh hoặc hình ảnh mô tả có tính xúc phạm các danh nhân, anh hùng dân tộc, lãnh đạo Đảng và Nhà nước của Việt Nam và lãnh đạo của các cơ quan tổ chức quốc tế.'}
          </li>
          <li className='dksd_item'>
            {'Không sử dụng hình ảnh có chứa dấu hiệu trùng hoặc tương tự đến mức gây nhầm lẫn với biểu tượng, cờ, huy hiệu, tên viết tắt, tên đầy đủ của cơ quan nhà nước, tổ chức chính trị, tổ chức chính trị - xã hội, tổ chức chính trị xã hội - nghề nghiệp, tổ chức xã hội, tổ chức xã hội - nghề nghiệp của Việt Nam và tổ chức quốc tế mà xúc phạm đến uy tín của các tổ chức này.'}
          </li>
          <li className='dksd_item'>
            {'Không sử dụng các hình ảnh liên quan tới tôn giáo mà gây kích động, chia rẽ khối đại đoàn kết dân tộc, đi ngược lại chính sách tôn giáo của Việt Nam.'}
          </li>
          <li className='dksd_item'>
            {'Không sử dụng ảnh của tội phạm, khủng bố, phát xít, và ảnh hoặc hình ảnh mô tả các cá nhân, tổ chức chống lại Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam, gây phương hại đến an ninh quốc gia, trật tự an toàn xã hội.'}
          </li>
          <li className='dksd_item'>
            {'Không sử dụng ảnh xúc phạm uy tín của tổ chức, danh dự và nhân phẩm của cá nhân khác.'}
          </li>
          <li className='dksd_item'>
            {'Không sử dụng hình ảnh có chứa các từ/cụm từ, logo, dấu hiệu trùng hoặc tương tự gây nhầm lẫn với các nền tảng trong hệ sinh thái '+appName+' thuộc quyền quản lý của '+appName+' khi chưa có sự đồng ý bằng văn bản của '+appName+'.'}
            </li>
          <li className='dksd_item'>
            {'Không sử dụng hình ảnh vi phạm các quyền sở hữu trí tuệ.'}
          </li>
          <li className='dksd_item'>
            {'Tài khoản vi phạm quy định về hình đại diện sẽ bị khoá và/hoặc xóa vĩnh viễn mà không cần thông báo.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 4. CÁC THÔNG TIN CẤM CHIA SẺ, TRAO ĐỔI, CHIA SẺ TRÊN MẠNG XÃ HỘI '+appName+''}
        </div>
        <div >
          <li className='dksd_item'>
            {'Thông tin chống lại Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam; gây phương hại đến an ninh quốc gia, trật tự an toàn xã hội; tổ chức, hoạt động, câu kết, xúi giục, mua chuộc, lừa gạt, lôi kéo, đào tạo, huấn luyện người chống Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam.'}
          </li>
          <li className='dksd_item'>
            {'Tuyên truyền chiến tranh, khủng bố.'}
          </li>
          <li className='dksd_item'>
            {'Xúi giục, lôi kéo, kích động người khác phạm tội.'}
          </li>
          <li className='dksd_item'>
            {'Xuyên tạc lịch sử, phủ nhận thành tựu cách mạng, phá hoại khối đại đoàn kết toàn dân tộc, xúc phạm tôn giáo, phân biệt đối xử về giới, phân biệt chủng tộc, tôn giáo; gây hận thù, mâu thuẫn giữa các dân tộc, sắc tộc, tôn giáo.'}
          </li>
          <li className='dksd_item'>
            {'Thông tin kích động bạo lực, dâm ô, đồi trụy, tội ác, tệ nạn xã hội, mê tín dị đoan, phá hoại thuần phong, mỹ tục của dân tộc.'}
          </li>
          <li className='dksd_item'>
            {'Tiết lộ bí mật nhà nước, bí mật quân sự, an ninh, kinh tế, đối ngoại và những bí mật khác do pháp luật Việt Nam quy định.'}
          </li>
          <li className='dksd_item'>
            {'Thông tin xuyên tạc, vu khống, xúc phạm uy tín của tổ chức, danh dự và nhân phẩm của cá nhân.'}
          </li>
          <li className='dksd_item'>
            {'Quảng cáo, tuyên truyền, mua bán hàng hóa, dịch vụ bị cấm; truyền bá tác phẩm báo chí, văn học, nghệ thuật, xuất bản phẩm bị cấm.'}
          </li>
          <li className='dksd_item'>
            {'Giả mạo tổ chức, cá nhân và phát tán thông tin giả mạo, thông tin sai sự thật xâm hại đến quyền và lợi ích hợp pháp của tổ chức, cá nhân.'}
          </li>
          <li className='dksd_item'>
            {'Thông tin vi phạm quyền sở hữu trí tuệ.'}
          </li>
          <li className='dksd_item'>
            {'Các Thông tin khác vi phạm tới quyền và lợi ích hợp pháp của cá nhân, tổ chức.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 5. CÁC HÀNH VI BỊ CẤM KHÁC'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Cản trở trái phép hoạt động của hệ thống máy chủ tên miền quốc gia Việt Nam ".vn", hoạt động hợp pháp của hệ thống thiết bị cung cấp dịch vụ Internet và thông tin trên mạng.'}
          </li>
          <li className='dksd_item'>
            {'Cản trở trái phép việc cung cấp và truy cập thông tin hợp pháp, việc cung cấp và sử dụng các dịch vụ hợp pháp trên Internet của tổ chức, cá nhân.'}
          </li>
          <li className='dksd_item'>
            {'Sử dụng trái phép mật khẩu, khoá mật mã của các tổ chức, cá nhân; thông tin riêng, thông tin cá nhân và tài nguyên Internet.'}
          </li>
          <li className='dksd_item'>
            {'Tạo đường dẫn trái phép đối với tên miền hợp pháp của tổ chức, cá nhân. Tạo, cài đặt, phát tán các phần mềm độc hại, vi rút máy tính; xâm nhập trái phép, chiếm quyền điều khiển hệ thống thông tin, tạo lập công cụ tấn công trên Internet.'}
          </li>
          <li className='dksd_item'>
            {'Sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào dịch vụ của '+appName+'.'}
          </li>
          <li className='dksd_item'>
            {'Phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của dịch vụ cung cấp hoặc hệ thống máy chủ.'}
          </li>
          <li className='dksd_item'>
            {'Đăng nhập trái phép hoặc tìm cách đăng nhập trái phép hoặc gây thiệt hại cho hệ thống máy chủ.'}
          </li>
          <li className='dksd_item'>
            {'Quấy rối, chửi bới, làm phiền hay có bất kỳ hành vi thiếu văn hoá nào đối với người sử dụng khác.'}
          </li>
          <li className='dksd_item'>
            {'Hành vi, thái độ làm tổn hại đến uy tín của '+appName+' và/hoặc các dịch vụ của '+appName+' dưới bất kỳ hình thức hoặc phương thức nào.'}
          </li>
          <li className='dksd_item'>
            {'Quảng bá bất kỳ sản phẩm/dịch vụ dưới bất kỳ hình thức nào mà không tuân thủ theo thỏa thuận cung cấp và sử dụng dịch vụ và chính sách quảng cáo của '+appName+'.'}
          </li>
          <li className='dksd_item'>
            {'Đánh bạc và tổ chức đánh bạc trên Mạng xã hội '+appName+'.'}
          </li>
          <li className='dksd_item'>
            {'Các hành vi cấm khác theo quy định của pháp luật Việt Nam trong từng lĩnh vực.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 6. QUYỀN CỦA NGƯỜI SỬ DỤNG MẠNG XÃ HỘI '+appName+''}
        </div>
        <div >
          <li className='dksd_item'>
            {'Bạn được quyền thay đổi, bổ sung thông tin cá nhân, mật khẩu đã đăng ký.'}
          </li>
          <li className='dksd_item'>
            {'Bạn được hướng dẫn cách đặt mật khẩu an toàn; nhập các thông tin quan trọng để bảo vệ tài khoản; sử dụng tài khoản liên kết để đăng nhập tài khoản.'}
          </li>
          <li className='dksd_item'>
            {'Bạn được quyền tặng cho tài khoản Mạng xã hội '+appName+' của mình cho người khác. Quyền được tặng cho tài khoản chỉ được áp dụng đối với tài khoản đã đăng ký đầy đủ và chính xác các thông tin tài khoản theo quy định Thỏa thuận này.'}
          </li>
          <li className='dksd_item'>
            {'Được bảo đảm bí mật thông tin cá nhân theo quy định của Thỏa thuận này và Chính sách Bảo mật Thông tin cá nhân trên Mạng xã hội '+appName+'. Theo đó, những thông tin cá nhân mà bạn cung cấp sẽ chỉ được '+appName+' sử dụng để kiểm soát các hoạt động trên Mạng xã hội '+appName+' và sẽ không được cung cấp cho bất kỳ bên thứ ba nào khác khi chưa có sự đồng ý của bạn, trừ trường hợp có sự yêu cầu từ cơ quan Nhà nước có thẩm quyền theo đúng quy định của pháp luật Việt Nam.'}
          </li>

          <li className='dksd_item'>
            {'Được quyền yêu cầu '+appName+' cung cấp thông tin cần thiết liên quan đến việc sử dụng Dịch vụ.'}
          </li>         
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 7. NGHĨA VỤ CỦA NGƯỜI SỬ DỤNG MẠNG XÃ HỘI '+appName+''}
        </div>
        <div >
          <li className='dksd_item'>
            {'Để nhận được sự hỗ trợ từ '+appName+', tài khoản của bạn phải đăng ký đầy đủ các thông tin trung thực, chính xác.'}
          </li>
          <li className='dksd_item'>
            {'Bạn có trách nhiệm tự bảo mật thông tin tài khoản của bạn trên Mạng xã hội '+appName+' bao gồm: Mật khẩu, số điện thoại bảo vệ tài khoản, thông tin Giấy tờ tùy thân, email bảo vệ tài khoản. Nếu những thông tin trên bị tiết lộ do sự bất cẩn hay bất kỳ lỗi bảo mật nào khác của chính cá nhân bạn, thì bạn phải chấp nhận những rủi ro phát sinh. Chúng tôi sẽ căn cứ vào những thông tin hiện có trong tài khoản để làm căn cứ quyết định chủ sở hữu tài khoản nếu có tranh chấp và chúng tôi sẽ không chịu trách nhiệm về mọi tổn thất phát sinh. Thông tin Giấy tờ tùy thân đăng ký trong tài khoản là thông tin quan trọng nhất để chứng minh chủ sở hữu tài khoản.'}
            </li>
          <li className='dksd_item'>
            {'Bạn đồng ý sẽ thông báo ngay cho '+appName+' về bất kỳ trường hợp nào sử dụng trái phép tài khoản và mật khẩu của bạn hoặc bất kỳ các hành động phá vỡ hệ thống bảo mật nào bằng cách gửi yêu cầu hỗ trợ tại địa chỉ '+appSupportUrl+'/.'}
          </li>
          <li className='dksd_item'>
            {'Chúng tôi quan tâm tới sự an toàn và riêng tư của tất cả thành viên đăng ký tài khoản và sử dụng Dịch vụ trên Mạng xã hội '+appName+', đặc biệt là người chưa thành niên và người được giám hộ. Vì vậy, nếu bạn là cha mẹ hoặc người giám hộ hợp pháp, bạn có trách nhiệm xác định xem Thông tin nào trên Mạng xã hội '+appName+' thích hợp cho con của bạn hoặc người được bạn giám hộ. Tương tự, nếu bạn là người chưa thành niên hoặc người được giám hộ thì phải hỏi ý kiến cha mẹ hoặc người giám hộ hợp pháp của bạn để xác định xem liệu rằng Thông tin mà bạn sử dụng/truy cập trên Mạng xã hội '+appName+' có phù hợp với bạn hay không.'}
          </li>
          <li className='dksd_item'>
            {'Bạn phải chịu hoàn toàn trách nhiệm trước pháp luật Việt Nam về Thông tin do bạn chia sẻ, truyền, đưa, lưu trữ trên Mạng xã hội '+appName+', mạng Internet, mạng viễn thông.'}
          </li>  
          <li className='dksd_item'>
            {'Bạn phải bồi thường toàn bộ thiệt hại cho '+appName+' trong trường hợp bạn có hành vi vi phạm bất kỳ quy định nào tại Thỏa thuận này và/hoặc hành vi vi phạm pháp luật dẫn đến tổn thất, thiệt hại về tài sản và uy tín của '+appName+'.'}
          </li>  
          <li className='dksd_item'>
            {'Tuân thủ các quy định về bảo đảm an toàn thông tin, an ninh thông tin và các quy định khác có liên quan theo quy định của pháp luật Việt Nam và Thỏa thuận này.'}
          </li>  
          <li className='dksd_item'>
            {'Tuân thủ các trách nhiệm, nghĩa vụ khác của người sử dụng mạng xã hội, Internet, mạng viễn thông theo quy định của pháp luật Việt Nam.'}
          </li>  
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 8. QUYỀN CỦA '+appName+''}
        </div>
        <div >
          <li className='dksd_item'>
            {'Nếu bạn cung cấp bất kỳ thông tin nào không trung thực, không chính xác, hoặc nếu '+appName+' có cơ sở để nghi ngờ rằng thông tin đó không chính xác hoặc nếu bạn vi phạm bất cứ điều khoản nào trong Thỏa thuận này, '+appName+' có toàn quyền chấm dứt, xóa bỏ tài khoản của bạn mà không cần sự đồng ý của bạn và không phải chịu bất cứ trách nhiệm nào đối với bạn. Đồng thời, '+appName+' có quyền từ chối hỗ trợ và giải quyết các yêu cầu đối với tài khoản của bạn.'}
          </li>
          <li className='dksd_item'>
            {'Nếu bạn có những bình luận, bài đăng vô nghĩa và/hoặc bình luận, bài đăng liên tục gây phiền toái tới người sử dụng khác thì '+appName+' có quyền tắt tính năng bình luận và/hoặc đăng tải của bạn trong 01(một) ngày, 03(ba) ngày, hoặc lâu hơn, tùy thuộc vào mức độ vi phạm. Trong trường hợp bạn vi phạm nhiều lần, '+appName+' sẽ khóa tài khoản của bạn ít nhất 30 (ba mươi) ngày, hoặc hơn tuỳ thuộc vào tính chất và mức độ vi phạm'}
          </li>
          <li className='dksd_item'>
            {'Khi '+appName+' phát hiện những vi phạm của bạn trong quá trình sử dụng Dịch vụ như truy cập trái phép, chia sẻ, truyền đưa các Thông tin bị cấm theo Thỏa thuận này và/hoặc theo quy định của pháp luật Việt Nam, hoặc những lỗi khác gây ảnh hưởng tới quyền và lợi ích hợp pháp của '+appName+' và/hoặc cá nhân, tổ chức có liên quan, '+appName+' có quyền: (i) tước bỏ mọi quyền lợi của bạn trong Thỏa thuận này, bao gồm chấm dứt, xóa bỏ tài khoản của bạn mà không cần sự đồng ý của bạn và không phải chịu bất cứ trách nhiệm nào với bạn; và/hoặc (ii) sử dụng những thông tin mà bạn cung cấp khi đăng ký tài khoản để chuyển cho Cơ quan chức năng giải quyết các vi phạm này theo quy định của pháp luật Việt Nam.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 9. TRÁCH NHIỆM CỦA '+appName+''}
        </div>
        <div >
          <li className='dksd_item'>
            {'Có trách nhiệm hỗ trợ bạn trong quá trình sử dụng Dịch vụ.'}
          </li>
          <li className='dksd_item'>
            {'Nhận và giải quyết các khiếu nại, tranh chấp của bạn phát sinh trong quá trình sử dụng Dịch vụ trong thẩm quyền của '+appName+' theo quy định của pháp luật Việt Nam. Tuy nhiên chúng tôi chỉ hỗ trợ, nhận và giải quyết các khiếu nại, tranh chấp đối với tài khoản đăng ký đầy đủ thông tin, trung thực và chính xác.'}
          </li>
          <li className='dksd_item'>
            {'Có trách nhiệm bảo mật thông tin cá nhân của bạn theo quy định của Thỏa thuận này, Chính sách Bảo mật Thông tin cá nhân trên Mạng xã hội '+appName+' và quy định của pháp luật Việt Nam. Chúng tôi không bán hoặc trao đổi những thông tin cá nhân của bạn với bên thứ ba, trừ trường hợp theo yêu cầu của cơ quan Nhà nước có thẩm quyền theo quy định của pháp luật Việt Nam và/hoặc các trường hợp theo quy định tại Thỏa thuận này.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 10. CƠ CHẾ XỬ LÝ VI PHẠM'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Nếu bạn vi phạm Thỏa thuận này, tùy thuộc vào mức độ vi phạm, chúng tôi sẽ khóa tài khoản của bạn tạm thời hoặc vĩnh viễn hoặc xóa tài khoản vĩnh viễn, tước bỏ mọi quyền lợi của bạn đối các Dịch vụ và sẽ yêu cầu cơ quan chức năng xử lý hành vi vi phạm theo quy định của pháp luật Việt Nam.'}
          </li>
          <li className='dksd_item'>
            {'Trường hợp hành vi vi phạm của bạn chưa được quy định trong Thỏa thuận này thì tùy vào tính chất, mức độ của hành vi vi phạm, '+appName+' sẽ đơn phương, toàn quyền quyết định mức xử phạt mà '+appName+' cho là hợp lý.'}
          </li>
          <li className='dksd_item'>
            {'Nếu có khiếu nại về Thông tin bị xem là vi phạm và/hoặc bất kỳ vấn đề nào khác liên quan đến cơ chế xử lý vi phạm quy định tại Thỏa thuận này, vui lòng gửi yêu cầu hỗ trợ tại địa chỉ '+appSupportUrl+'/'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 11. CẢNH BÁO VỀ RỦI RO KHI LƯU TRỮ, TRAO ĐỔI VÀ CHIA SẺ THÔNG TIN TRÊN MẠNG'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Khi bạn đăng ký, sử dụng tính năng đăng nhập liên quan đến các nền tảng và ứng dụng của bên thứ ba, điều đó đồng nghĩa với việc các thông tin của bạn sẽ được chia sẻ cho bên thứ ba, dựa trên sự chấp thuận của bạn. Bằng việc chấp nhận sự chia sẻ này, bạn cũng sẽ chấp nhận những rủi ro kèm theo. Trong trường hợp này, bạn đồng ý và chấp nhận loại trừ trách nhiệm của '+appName+' liên quan tới việc thông tin, dữ liệu của bạn bị chia sẻ cho bên thứ ba.'}
          </li>
          <li className='dksd_item'>
            {'Nếu phát sinh rủi ro, thiệt hại trong trường hợp bất khả kháng bao gồm nhưng không giới hạn như chập điện, hư hỏng phần cứng, phần mềm, sự cố đường truyền Internet hoặc do thiên tai, hỏa hoạn, đình công, sự thay đổi của luật pháp, người sử dụng phải chấp nhận những rủi ro, thiệt hại đó. '+appName+' cam kết sẽ nỗ lực giảm thiểu những rủi ro, thiệt hại phát sinh tuy nhiên chúng tôi sẽ không chịu bất cứ trách nhiệm nào phát sinh trong các trường hợp này.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 12. LUẬT ÁP DỤNG VÀ CƠ QUAN GIẢI QUYẾT TRANH CHẤP'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Thỏa thuận này được điều chỉnh bởi pháp luật Việt Nam. Bất kỳ tranh chấp nào phát sinh trong quá trình sử dụng Dịch vụ của bạn sẽ được giải quyết tại tòa án có thẩm quyền của Việt Nam, theo pháp luật hiện hành của Việt Nam.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 13. THỜI HẠN GIẢI QUYẾT KHIẾU NẠI, TRANH CHẤP'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Bất kỳ khiếu nại, tranh chấp nào phát sinh từ Thỏa thuận này, thuộc thẩm quyền giải quyết của '+appName+', phải được gửi tới '+appName+' trong vòng 01 (một) tháng kể từ ngày xảy ra hành vi dẫn đến khiếu nại, tranh chấp đó.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 14. ĐIỀU KIỆN VÀ PHƯƠNG THỨC GIẢI QUYẾT KHIẾU NẠI, TRANH CHẤP'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Chúng tôi chỉ hỗ trợ, giải quyết khiếu nại, tranh chấp của bạn trong thẩm quyền của '+appName+' theo quy định của pháp luật Việt Nam, với điều kiện bạn đã ghi đầy đủ, trung thực và chính xác thông tin khi đăng ký tài khoản.'}
          </li>
          <li className='dksd_item'>
            {'Đối với tranh chấp giữa người sử dụng với nhau hoặc giữa người sử dụng với '+appName+', chúng tôi sẽ căn cứ ghi chép của hệ thống để giải quyết. Theo đó, chúng tôi sẽ bảo vệ quyền lợi tối đa cho người sử dụng đăng ký đầy đủ thông tin theo quy định.'}
          </li>
          <li className='dksd_item'>
            {'Khi có khiếu nại, tranh chấp giữa bạn và người sử dụng khác trên Mạng xã hội '+appName+' hoặc giữa bạn với '+appName+', bạn có thể gửi yêu cầu giải quyết khiếu nại, tranh chấp tới '+appName+' tại địa chỉ '+appSupportUrl+''}
          </li>
          <li className='dksd_item'>
            {'Trừ trường hợp pháp luật Việt Nam có quy định khác, quyết định giải quyết khiếu nại, tranh chấp của '+appName+' là quyết định cuối cùng và có hiệu lực.'}'
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 15. LOẠI TRỪ NGHĨA VỤ VÀ BỒI THƯỜNG'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Bạn đồng ý loại trừ '+appName+' khỏi tất cả các trách nhiệm, nghĩa vụ pháp lý, tố tụng phát sinh từ sự vi phạm của bạn trong quá trình sử dụng Dịch vụ.'}
          </li>
          <li className='dksd_item'>
            {'Bạn phải bồi thường toàn bộ thiệt hại cho '+appName+', trong trường hợp bạn có hành vi vi phạm Thỏa thuận này và/hoặc hành vi vi phạm pháp luật dẫn đến tổn thất, thiệt hại về tài sản và uy tín của '+appName+', bao gồm cả chi phí liên quan đến việc giải quyết như án phí, phí luật sư, phí thuê chuyên gia tư vấn và các chi phí khác có liên quan đến việc giải quyết vụ việc.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 16. THU THẬP, XỬ LÝ DỮ LIỆU CÁ NHÂN'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Quy trình đăng ký tài khoản sử dụng Mạng xã hội '+appName+' yêu cầu bạn cung cấp các thông tin cá nhân và mật khẩu. Việc cung cấp những thông tin khác cho chúng tôi hay không tùy thuộc vào quyết định của bạn.'}
          </li>
          <li className='dksd_item'>
            {'Chúng tôi không sử dụng thông tin của bạn vào mục đích bất hợp pháp. Chúng tôi được quyền cung cấp thông tin của bạn cho bên thứ ba trong các trường hợp, bao gồm nhưng không giới hạn:'}
          </li>
          <li className='dksd_item2'>
            {'Chúng tôi được bạn chấp thuận;'}
          </li>
          <li className='dksd_item2'>
            {'Khi bạn đăng ký, sử dụng tính năng đăng nhập liên quan đến các nền tảng và ứng dụng của bên thứ ba và bạn đồng ý để '+appName+' cung cấp thông tin của bạn cho bên thứ ba đó;'}
          </li>
          <li className='dksd_item2'>
            {'Theo yêu cầu của cơ quan Nhà nước có thẩm quyền;'}
          </li>
          <li className='dksd_item'>
            {'Trong quá trình sử dụng Dịch vụ, bạn đồng ý nhận tất cả thông báo, quảng cáo từ '+appName+' liên quan tới Dịch vụ qua thư điện tử, thư bưu chính hoặc điện thoại của bạn. Trong trường hợp bạn đăng ký sử dụng dịch vụ do bên thứ ba cung cấp thì những thông tin của bạn sẽ được chia sẻ với bên thứ ba, dựa trên sự chấp thuận của bạn. Bạn cũng đồng ý nhận tất cả thông báo từ bên thứ ba liên quan tới dịch vụ qua thư điện tử, thư bưu chính hoặc điện thoại của bạn.'}
          </li>
          <li className='dksd_item'>
            {'Chúng tôi có thể dùng thông tin của bạn để thực hiện các hoạt động nghiên cứu của '+appName+' để phát triển các dịch vụ nhằm phục vụ bạn tốt hơn.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 17. CHÍNH SÁCH BẢO MẬT THÔNG TIN CÁ NHÂN TRÊN MẠNG XÃ HỘI '+appName+''}
        </div>
        <div >
          <li className='dksd_item'>
            {'Chúng tôi luôn cố gắng đáp ứng các yêu cầu của pháp luật Việt Nam về bảo vệ thông tin cá nhân như được quy định trong Chính sách Bảo mật thông tin cá nhân trên mạng xã hội '+appName+' nằm trong khả năng của chúng tôi. Trong trường hợp bất khả kháng và/hoặc có sự tác động từ các yếu tố nằm ngoài khả năng kiểm soát của chúng tôi, chúng tôi sẽ không chịu trách nhiệm cho việc thông tin cá nhân của bạn bị tiết lộ.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 18. QUYỀN SỞ HỮU TRÍ TUỆ'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Chúng tôi sở hữu quyền sở hữu trí tuệ, bao gồm nhưng không giới hạn các quyền tác giả, quyền liên quan, nhãn hiệu, quyền chống cạnh tranh không lành mạnh, bí mật kinh doanh, và các quyền sở hữu trí tuệ khác trong tất cả các dịch vụ của '+appName+'. Việc sử dụng bất kỳ đối tượng quyền sở hữu trí tuệ nào của '+appName+' cần phải được chúng tôi cho phép trước bằng văn bản.'}
          </li>
          <li className='dksd_item'>
            {'Ngoài việc được cấp phép bằng văn bản, chúng tôi không cấp phép dưới bất kỳ hình thức nào khác cho dù đó là hình thức công bố hay hàm ý để bạn thực hiện các quyền trên. Và do vậy, bạn không có quyền sử dụng dịch vụ của '+appName+' vào bất kỳ mục đích nào mà không có sự cho phép bằng văn bản của chúng tôi.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 19. BẢO LƯU QUYỀN XỬ LÝ THÔNG TIN'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Tại các khu vực được phép chia sẻ Thông tin, bạn có thể chia sẻ Thông tin được phép dưới các định dạng chúng tôi mặc định và bạn phải tự chịu trách nhiệm đối với các Thông tin chia sẻ, giao tiếp về tính hợp pháp, cũng như các trách nhiệm pháp lý đối với Thông tin chia sẻ của bạn với cá nhân người sử dụng hoặc nhóm người sử dụng.'}
          </li>
          <li className='dksd_item'>
            {'Chúng tôi đóng vai trò như người hướng dẫn thụ động cho sự trình bày và công khai trực tuyến của Thông tin do người sử dụng chia sẻ nên trong mọi trường hợp, chúng tôi được bảo lưu quyền xử lý các Thông tin chia sẻ cho phù hợp với Thỏa thuận này và các quy định pháp luật Việt Nam. Nếu những Thông tin do người sử dụng chia sẻ không phù hợp với những thỏa thuận và điều kiện của Thỏa thuận này, chúng tôi có thể chỉnh sửa hoặc ngay lập tức loại bỏ (xóa) những Thông tin đó đồng thời báo với cơ quan chức năng nếu cần thiết.'}
          </li>
          <li className='dksd_item'>
            {'Việc xử lý Thông tin chia sẻ của chúng tôi tuân thủ theo các quy trình, chính sách dựa trên các quy định của pháp luật Việt Nam để đảm bảo quyền và lợi ích của bạn cũng như các cá nhân, tổ chức khác. Chúng tôi có nghĩa vụ và chịu trách nhiệm xử lý Thông tin chia sẻ theo yêu cầu của cơ quan nhà nước có thẩm quyền và/hoặc theo quy định của pháp luật Việt Nam.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 20. SỬA ĐỔI, BỔ SUNG'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Các điều khoản tại Thỏa thuận này có thể được chúng tôi sửa đổi, bổ sung bất cứ lúc nào mà không cần phải thông báo trước tới bạn. Những Thông tin sửa đổi, bổ sung sẽ được chúng tôi công bố trên Mạng xã hội '+appName+'.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ĐIỀU 21. HIỆU LỰC'}
        </div>
        <div >
          <li className='dksd_item'>
            {'Thỏa thuận này có giá trị ràng buộc với bạn kể từ thời điểm hoàn thành việc đăng ký tài khoản Mạng xã hội '+appName+'.'}
          </li>
          <li className='dksd_item'>
            {'Trong trường hợp một hoặc một số điều khoản Thỏa thuận này xung đột với các quy định của luật pháp và bị tòa án có thẩm quyền của Việt Nam tuyên là vô hiệu theo quy định của pháp luật Việt Nam, điều khoản bị tuyên vô hiệu đó sẽ được chỉnh sửa cho phù hợp với quy định của pháp luật Việt Nam, và các điều khoản còn lại của Thỏa thuận này vẫn có hiệu lực.'}
          </li>
        </div>
      </div>      

      <div className={zget(vm.props, 'langValue')==='en'?'dksd_body':'dksd_body_hiden'}>
        <div className='dksd_item'>
          <span className='dksd_item_bold'>{'Last updated:'}</span>{' 09/01/2020'}
        </div>
        <div >
          <div className='dksd_item'>
            {''+appName+' (“'+appName+',” “our,” “we,” or “us”) provides messaging, Internet calling, and other services to users around the world. Please read our Terms of Service so you understand what’s up with your use of '+appName+'. You agree to our Terms of Service (“Terms”) by installing, accessing, or using our apps, services, features, software, or website (together, “Services”).'}
          </div>
          <div className='dksd_item'>
            {'NO ACCESS TO EMERGENCY SERVICES: There are important differences between '+appName+' and your mobile and fixed-line telephone and SMS services. Our Services do not provide access to emergency services or emergency services providers, including the police, fire departments, or hospitals, or otherwise connect to public safety answering points. You should ensure you can contact your relevant emergency services providers through a mobile, fixed-line telephone, or other service.'}
          </div>
        </div>
        <div className='dksd_title'>
          {'ABOUT OUR SERVICES'}
        </div>
        <div >
          <div className='dksd_item'>
            <span className='dksd_item_bold'>{'Registration.'}</span>{' You must register for our Services using accurate data, provide your current mobile phone number, and, if you change it, update this mobile phone number using our in-app change number feature. You agree to receive text messages and phone calls (from us or our third-party providers) with codes to register for our Services.'}
          </div>
          <div className='dksd_item'>
            <span className='dksd_item_bold'>{'Address Book.'}</span>{' You provide us the phone numbers of '+appName+' users and your other contacts in your mobile phone address book on a regular basis. You confirm you are authorized to provide us such numbers to allow us to provide our Services.'}
          </div>
          <div className='dksd_item'>
            <span className='dksd_item_bold'>{'Age.'}</span>{' You must be at least 13 years old to use our Services (or such greater age required in your country for you to be authorized to use our Services without parental approval). In addition to being of the minimum required age to use our Services under applicable law, if you are not old enough to have authority to agree to our Terms in your country, your parent or guardian must agree to our Terms on your behalf.'}
          </div>
          <div className='dksd_item'>
            <span className='dksd_item_bold'>{'Devices and Software.'}</span>{' You must provide certain devices, software, and data connections to use our Services, which we otherwise do not supply. For as long as you use our Services, you consent to downloading and installing updates to our Services, including automatically.'}
          </div>
          <div className='dksd_item'>
            <span className='dksd_item_bold'>{'Fees and Taxes.'}</span>{' You are responsible for all carrier data plan and other fees and taxes associated with your use of our Services. We may charge you for our Services, including applicable taxes. We may refuse or cancel orders. We do not provide refunds for our Services, except as required by law.'}
          </div>                              
        </div>
        <div className='dksd_title'>
          {'PRIVACY POLICY AND USER DATA'}
        </div>
        <div >
          <div className='dksd_item'>
            {''+appName+' cares about your privacy. '+appName+'’s Privacy Policy describes our information (including message) practices, including the types of information we receive and collect from you and how we use and share this information. You agree to our data practices, including the collection, use, processing, and sharing of your information as described in our Privacy Policy, as well as the transfer and processing of your information to the United States and other countries globally where we have or use facilities, service providers, or partners, regardless of where you use our Services. You acknowledge that the laws, regulations, and standards of the country in which your information is stored or processed may be different from those of your own country.'}
          </div>                            
        </div>
        <div className='dksd_title'>
          {'ACCEPTABLE USE OF OUR SERVICES'}
        </div>
        <div >
          <div className='dksd_item'>
            {'Our Terms and Policies. You must use our Services according to our Terms and posted policies. If we disable your account for a violation of our Terms, you will not create another account without our permission.'}
          </div>                            
          <div className='dksd_item'>
            {'Legal and Acceptable Use. You must access and use our Services only for legal, authorized, and acceptable purposes. You will not use (or assist others in using) our Services in ways that: (a) violate, misappropriate, or infringe the rights of '+appName+', our users, or others, including privacy, publicity, intellectual property, or other proprietary rights; (b) are illegal, obscene, defamatory, threatening, intimidating, harassing, hateful, racially, or ethnically offensive, or instigate or encourage conduct that would be illegal, or otherwise inappropriate, including promoting violent crimes; (c) involve publishing falsehoods, misrepresentations, or misleading statements; (d) impersonate someone; (e) involve sending illegal or impermissible communications such as bulk messaging, auto-messaging, auto-dialing, and the like; or (f) involve any non-personal use of our Services unless otherwise authorized by us.'}
          </div>                            
          <div className='dksd_item'>
            {'Harm to '+appName+' or Our Users. You must not (or assist others to) access, use, copy, adapt, modify, prepare derivative works based upon, distribute, license, sublicense, transfer, display, perform, or otherwise exploit our Services in impermissible or unauthorized manners, or in ways that burden, impair, or harm us, our Services, systems, our users, or others, including that you must not directly or through automated means: (a) reverse engineer, alter, modify, create derivative works from, decompile, or extract code from our Services; (b) send, store, or transmit viruses or other harmful computer code through or onto our Services; (c) gain or attempt to gain unauthorized access to our Services or systems; (d) interfere with or disrupt the integrity or performance of our Services; (e) create accounts for our Services through unauthorized or automated means; (f) collect the information of or about our users in any impermissible or unauthorized manner; (g) sell, resell, rent, or charge for our Services; or (h) distribute or make our Services available over a network where they could be used by multiple devices at the same time.'}
          </div>  
          <div className='dksd_item'>
            {'Keeping Your Account Secure. You are responsible for keeping your device and your '+appName+' account safe and secure, and you must notify us promptly of any unauthorized use or security breach of your account or our Services.'}
          </div>                                      
        </div>
        <div className='dksd_title'>
          {'THIRD-PARTY SERVICES'}
        </div>
        <div >
          <div className='dksd_item'>
            {'Our Services may allow you to access, use, or interact with third-party websites, apps, content, and other products and services. For example, you may choose to use third-party data backup services (such as iCloud or Google Drive) that are integrated with our Services or interact with a share button on a third party’s website that enables you to send information to your '+appName+' contacts. Please note that when you use third-party services, their own terms and privacy policies will govern your use of those services.'}
          </div>          
        </div>
        <div className='dksd_title'>
          {'LICENSES'}
        </div>
        <div >
          <div className='dksd_item'>
            {'Your Rights. '+appName+' does not claim ownership of the information that you submit for your '+appName+' account or through our Services. You must have the necessary rights to such information that you submit for your '+appName+' account or through our Services and the right to grant the rights and licenses in our Terms.'}
          </div>    
          <div className='dksd_item'>
            {''+appName+'’s Rights. We own all copyrights, trademarks, domains, logos, trade dress, trade secrets, patents, and other intellectual property rights associated with our Services. You may not use our copyrights, trademarks, domains, logos, trade dress, patents, and other intellectual property rights unless you have our express permission and except in accordance with our Brand Guidelines.'}
          </div>
          <div className='dksd_item'>
            {'Your License to '+appName+'. In order to operate and provide our Services, you grant '+appName+' a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, create derivative works of, display, and perform the information (including the content) that you upload, submit, store, send, or receive on or through our Services. The rights you grant in this license are for the limited purpose of operating and providing our Services (such as to allow us to display your profile picture and status message, transmit your messages, store your undelivered messages on our servers for up to 30 days as we try to deliver them, and otherwise as described in our Privacy Policy).'}
          </div>
          <div className='dksd_item'>
            {''+appName+'’s License to You. We grant you a limited, revocable, non-exclusive, non-sublicensable, and non-transferable license to use our Services, subject to and in accordance with our Terms. This license is for the sole purpose of enabling you to use our Services, in the manner permitted by our Terms. No licenses or rights are granted to you by implication or otherwise, except for the licenses and rights expressly granted to you.'}
          </div>
          <div className='dksd_item'>
            {'Your License to '+appName+'. In order to operate and provide our Services, you grant '+appName+' a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, create derivative works of, display, and perform the information (including the content) that you upload, submit, store, send, or receive on or through our Services. The rights you grant in this license are for the limited purpose of operating and providing our Services (such as to allow us to display your profile picture and status message, transmit your messages, store your undelivered messages on our servers for up to 30 days as we try to deliver them, and otherwise as described in our Privacy Policy).'}
          </div> 
          <div className='dksd_item'>
            {''+appName+'’s License to You. We grant you a limited, revocable, non-exclusive, non-sublicensable, and non-transferable license to use our Services, subject to and in accordance with our Terms. This license is for the sole purpose of enabling you to use our Services, in the manner permitted by our Terms. No licenses or rights are granted to you by implication or otherwise, except for the licenses and rights expressly granted to you.'}
          </div>                   
        </div> 
        <div className='dksd_title'>
          {'REPORTING THIRD-PARTY COPYRIGHT, TRADEMARK, AND OTHER INTELLECTUAL PROPERTY INFRINGEMENT'}
        </div>  
        <div >
          <div className='dksd_item'>
            {'To report claims of third-party copyright, trademark, or other intellectual property infringement, please visit our Intellectual Property Policy. We may terminate your '+appName+' account if you repeatedly infringe the intellectual property rights of others.'}
          </div>          
        </div>    
        <div className='dksd_title'>
          {'INDEMNIFICATION'}
        </div>  
        <div >
          <div className='dksd_item'>
            {'You agree to defend, indemnify, and hold harmless the '+appName+' Parties from and against all liabilities, damages, losses, and expenses of any kind (including reasonable legal fees and costs) relating to, arising out of, or in any way in connection with any of the following: (a) your access to or use of our Services, including information provided in connection therewith; (b) your breach or alleged breach of our Terms; or (c) any misrepresentation made by you. You will cooperate as fully as required by us in the defense or settlement of any Claim.'}
          </div>          
        </div>  
        <div className='dksd_title'>
          {'AVAILABILITY AND TERMINATION OF OUR SERVICES'}
        </div>  
        <div >
          <div className='dksd_item'>
            {'Availability of Our Services. Our Services may be interrupted, including for maintenance, repairs, upgrades, or network or equipment failures. We may discontinue some or all of our Services, including certain features and the support for certain devices and platforms, at any time. Events beyond our control may affect our Services, such as events in nature and other force majeure events.'}
          </div>   
          <div className='dksd_item'>
            {'Termination. We may modify, suspend, or terminate your access to or use of our Services anytime for any reason, such as if you violate the letter or spirit of our Terms or create harm, risk, or possible legal exposure for us, our users, or others. The following provisions will survive any termination of your relationship with '+appName+': “Licenses,” “Disclaimers,” “Limitation of Liability,” “Indemnification,” “Dispute Resolution,” “Availability and Termination of our Services,” “Other,”.'}
          </div>                 
        </div>                 
        <div className='dksd_config_title'>
          {''+appName+' Privacy Policy'}
        </div>  
        <div >
          <div className='dksd_item'>
            <span className='dksd_item_bold'>{'Last updated:'}</span>{' 09/01/2020 (older versions)'}
          </div>   
          <div className='dksd_item'>
            {'Respect for your privacy is coded into our DNA. Since we started '+appName+', we’ve aspired to build our Services with a set of strong privacy principles in mind.'}
          </div>     
          <div className='dksd_item'>
            {''+appName+' provides messaging, Internet calling, and other services to users around the world. Our Privacy Policy helps explain our information (including message) practices. For example, we talk about what information we collect and how this affects you. We also explain the steps we take to protect your privacy – like building '+appName+' so delivered messages aren’t stored and giving you control over who you communicate with on our Services.'}
          </div>
          <div className='dksd_item'>
            {'When we say “'+appName+',” “our,” “we,” or “us,” we’re talking about '+appName+'. This Privacy Policy (“Privacy Policy”) applies to all of our apps, services, features, software, and website (together, “Services”) unless specified otherwise.'}
          </div>           
          <div className='dksd_item'>
            {'Please also read '+appName+' Terms Of Service (“Terms”), which describes the terms under which you use our Services.'}
          </div>      
        </div>  
        <div className='dksd_title'>
          {'INFORMATION WE COLLECT'}
        </div> 
        <div >
          <div className='dksd_item'>
            {''+appName+' receives or collects information when we operate and provide our Services, including when you install, access, or use our Services.'}
          </div>          
        </div>
        <div className='dksd_title'>
          {'INFORMATION YOU PROVIDE'}
        </div> 
        <div >
          <li className='dksd_item'>
            {'Your Account Information. You provide your mobile phone number to create a '+appName+' account. You provide us the phone numbers in your mobile address book on a regular basis, including those of both the users of our Services and your other contacts. You confirm you are authorized to provide us such numbers. You may also add other information to your account, such as a profile name, profile picture, and status message.'}
          </li>
          <li className='dksd_item'>
            {'Your Messages. We do not retain your messages in the ordinary course of providing our Services to you. Once your messages (including your chats, photos, videos, voice messages, files, and share location information) are delivered, they are deleted from our servers. Your messages are stored on your own device. If a message cannot be delivered immediately (for example, if you are offline), we may keep it on our servers for up to 30 days as we try to deliver it. If a message is still undelivered after 30 days, we delete it. To improve performance and deliver media messages more efficiently, such as when many people are sharing a popular photo or video, we may retain that content on our servers for a longer period of time.'}
          </li>
          <li className='dksd_item'>
            {'Your Connections. To help you organize how you communicate with others, we may create a favorites list of your contacts for you, and you can create, join, or get added to groups and broadcast lists, and such groups and lists get associated with your account information.'}
          </li>
          <li className='dksd_item'>
            {'Customer Support. You may provide us with information related to your use of our Services, including copies of your messages, and how to contact you so we can provide you customer support. For example, you may send us an email with information relating to our app performance or other issues.'}
          </li>                    
        </div>  
        <div className='dksd_title'>
          {'AUTOMATICALLY COLLECTED INFORMATION'}
        </div>       
        <div >
          <li className='dksd_item'>
            {'Usage and Log Information. We collect service-related, diagnostic, and performance information. This includes information about your activity (such as how you use our Services, how you interact with others using our Services, and the like), log files, and diagnostic, crash, website, and performance logs and reports.'}
          </li>
          <li className='dksd_item'>
            {'Transactional Information. If you pay for our Services, we may receive information and confirmations, such as payment receipts, including from app stores or other third parties processing your payment.'}
          </li>
          <li className='dksd_item'>
            {'Device and Connection Information. We collect device-specific information when you install, access, or use our Services. This includes information such as hardware model, operating system information, browser information, IP address, mobile network information including phone number, and device identifiers. We collect device location information if you use our location features, such as when you choose to share your location with your contacts, view locations nearby or those others have shared with you, and the like, and for diagnostics and troubleshooting purposes such as if you are having trouble with our app’s location features.'}
          </li>
          <li className='dksd_item'>
            {'Cookies. We use cookies to operate and provide our Services, including to provide our Services that are web-based, improve your experiences, understand how our Services are being used, and customize our Services. For example, we use cookies to provide '+appName+' for web and desktop and other web-based services. We may also use cookies to understand which of our FAQs are most popular and to show you relevant content related to our Services. Additionally, we may use cookies to remember your choices, such as your language preferences, and otherwise to customize our Services for you. Learn more about how we use cookies to provide you our Services.'}
          </li>
          <li className='dksd_item'>
            {'Status Information. We collect information about your online and status message changes on our Services, such as whether you are online (your “online status”), when you last used our Services (your “last seen status”), and when you last updated your status message.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'THIRD-PARTY INFORMATION'}
        </div> 
        <div >
          <li className='dksd_item'>
            {'Information Others Provide About You. We receive information other people provide us, which may include information about you. For example, when other users you know use our Services, they may provide your phone number from their mobile address book (just as you may provide theirs), or they may send you a message, send messages to groups to which you belong, or call you.'}
          </li>
          <li className='dksd_item'>
            {'Third-Party Providers. We work with third-party providers to help us operate, provide, improve, understand, customize, support, and market our Services. For example, we work with companies to distribute our apps, provide our infrastructure, delivery, and other systems, supply map and places information, process payments, help us understand how people use our Services, and market our Services. These providers may provide us information about you in certain circumstances; for example, app stores may provide us reports to help us diagnose and fix service issues.'}
          </li>
          <li className='dksd_item'>
            {'Third-Party Services. We allow you to use our Services in connection with third-party services. If you use our Services with such third-party services, we may receive information about you from them; for example, if you use the '+appName+' share button on a news service to share a news article with your '+appName+' contacts, groups, or broadcast lists on our Services, or if you choose to access our Services through a mobile carrier’s or device provider’s promotion of our Services. Please note that when you use third-party services, their own terms and privacy policies will govern your use of those services.'}
          </li>
        </div>   
        <div className='dksd_title'>
          {'HOW WE USE INFORMATION'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'We use all the information we have to help us operate, provide, improve, understand, customize, support, and market our Services.'}
          </div>
          <li className='dksd_item'>
            {'Our Services. We operate and provide our Services, including providing customer support, and improving, fixing, and customizing our Services. We understand how people use our Services, and analyze and use the information we have to evaluate and improve our Services, research, develop, and test new services and features, and conduct troubleshooting activities. We also use your information to respond to you when you contact us. We use cookies to operate, provide, improve, understand, and customize our Services.'}
          </li>
          <li className='dksd_item'>
            {'Safety and Security. We verify accounts and activity, and promote safety and security on and off our Services, such as by investigating suspicious activity or violations of our Terms, and to ensure our Services are being used legally.'}
          </li>
          <li className='dksd_item'>
            {'No Third-Party Banner Ads. We do not allow third-party banner ads on '+appName+'. We have no intention to introduce them, but if we ever do, we will update this policy.'}
          </li>
          <li className='dksd_item'>
            {'Commercial Messaging. We will allow you and third parties, like businesses, to communicate with each other using '+appName+', such as through order, transaction, and appointment information, delivery and shipping notifications, product and service updates, and marketing. For example, you may receive flight status information for upcoming travel, a receipt for something you purchased, or a notification when a delivery will be made. Messages you may receive containing marketing could include an offer for something that might interest you. We do not want you to have a spammy experience; as with all of your messages, you can manage these communications, and we will honor the choices you make.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'INFORMATION YOU AND WE SHARE'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'You share your information as you use and communicate through our Services, and we share your information to help us operate, provide, improve, understand, customize, support, and market our Services.'}
          </div>
          <li className='dksd_item'>
            {'Account Information. Your phone number, profile name and photo, online status and status message, last seen status, and receipts may be available to anyone who uses our Services, although you can configure your Services settings to manage certain information available to other users.'}
          </li>
          <li className='dksd_item'>
            {'Your Contacts and Others. Users with whom you communicate may store or reshare your information (including your phone number or messages) with others on and off our Services. You can use your Services settings and the block feature in our Services to manage the users of our Services with whom you communicate and certain information you share.'}
          </li>
          <li className='dksd_item'>
            {'Third-Party Providers. We work with third-party providers to help us operate, provide, improve, understand, customize, support, and market our Services. When we share information with third-party providers, we require them to use your information in accordance with our instructions and terms or with express permission from you.'}
          </li>
          <li className='dksd_item'>
            {'Third-Party Services. When you use third-party services that are integrated with our Services, they may receive information about what you share with them. For example, if you use a data backup service integrated with our Services (such as iCloud or Google Drive), they will receive information about what you share with them. If you interact with a third-party service linked through our Services, you may be providing information directly to such third party. Please note that when you use third-party services, their own terms and privacy policies will govern your use of those services.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'ASSIGNMENT, CHANGE OF CONTROL, AND TRANSFER'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'All of our rights and obligations under our Privacy Policy are freely assignable by us to any of our affiliates, in connection with a merger, acquisition, restructuring, or sale of assets, or by operation of law or otherwise, and we may transfer your information to any of our affiliates, successor entities, or new owner.'}
          </div>
        </div>
        <div className='dksd_title'>
          {'MANAGING YOUR INFORMATION'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'If you would like to manage, change, limit, or delete your information, we allow you to do that through the following tools:'}
          </div>
          <li className='dksd_item'>
            {'Services Settings. You can change your Services settings to manage certain information available to other users. You can manage your contacts, groups, and broadcast lists, or use our block feature to manage the users with whom you communicate.'}
          </li>
          <li className='dksd_item'>
            {'Changing Your Mobile Phone Number, Profile Name and Picture, and Status Message. You must change your mobile phone number using our in-app change number feature and transfer your account to your new mobile phone number. You can also change your profile name, profile picture, and status message at any time.'}
          </li>
          <li className='dksd_item'>
            {'Deleting Your '+appName+' Account. You may delete your '+appName+' account at any time (including if you want to revoke your consent to our use of your information) using our in-app delete my account feature. When you delete your '+appName+' account, your undelivered messages are deleted from our servers as well as any of your other information we no longer need to operate and provide our Services. Be mindful that if you only delete our Services from your device without using our in-app delete my account feature, your information may be stored with us for a longer period. Please remember that when you delete your account, it does not affect the information other users have relating to you, such as their copy of the messages you sent them.'}
          </li>
        </div>
        <div className='dksd_title'>
          {'LAW AND PROTECTION'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'We may collect, use, preserve, and share your information if we have a good-faith belief that it is reasonably necessary to: (a) respond pursuant to applicable law or regulations, to legal process, or to government requests; (b) enforce our Terms and any other applicable terms and policies, including for investigations of potential violations; (c) detect, investigate, prevent, and address fraud and other illegal activity, security, or technical issues; or (d) protect the rights, property, and safety of our users, '+appName+', the Facebook family of companies, or others.'}
          </div>
        </div>
        <div className='dksd_title'>
          {'UPDATES TO OUR POLICY'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'We may amend or update our Privacy Policy. We will provide you notice of amendments to this Privacy Policy, as appropriate, and update the “Last Modified” date at the top of this Privacy Policy. Your continued use of our Services confirms your acceptance of our Privacy Policy, as amended. If you do not agree to our Privacy Policy, as amended, you must stop using our Services. Please review our Privacy Policy from time to time.'}
          </div>
        </div>
        <div className='dksd_title'>
          {'CONTACT US'}
        </div> 
        <div >
          <div className='dksd_item'>
            {'If you have questions about our Privacy Policy, please contact us.'}
          </div>
          <div className='dksd_item'>
            {''+appName+' Privacy Policy'}
          </div>
          <div className='dksd_item'>
            {'Room 712, 7th Floor, Office Building,'}
          </div>
          <div className='dksd_item'>
            {'362 Pho Hue St., Pho Hue Ward,'}
          </div>
          <div className='dksd_item'>
            {'Hai Ba Trung District, Hanoi City'}
          </div>
        </div>
      </div>  
    </div>    
  </div>
</div>
export const renderFoot = (vm) => <div />
export const renderComponent = (vm) => <div>
  {Parser(adminCSS)}
  {vm.renderBody()}
  {vm.renderFoot()}
</div>
