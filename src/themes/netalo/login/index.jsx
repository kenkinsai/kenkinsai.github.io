import React from 'react'
import Parser from 'html-react-parser'
global.isclient && require('./index.css')
const {rxconfig} = global.rootRequire('classes/ulti')

const SelectCustom = global.rootRequire('components/shares/rxSelectCustom').default

let adminCSS = '<style>.main-container{ width: 100% !important; padding: 0px !important; } .homenav, .footer{ display: none !important; }</style>'
let logo
if(rxconfig.theme==='galo'){
  logo = 'GAlo'
}else{
  logo = 'NetAlo'
}
export const renderHead = (vm) => 

<div>
  <div className='zlogin_logo'>{logo}</div>
  <div className='zlogin_title'>Đăng nhập bằng tài khoản {logo}</div>
</div>

export const renderBody = (vm) => <div>
  <div className='zlogin_form'>
    <div className='zlogin_head'>
      <div className='zlogin_tab zlogin_tab-active'>Với số điện thoại</div>
    </div>
    <div className='zlogin_body'>
      <div>{{
        0: <div>
          <div className='zlogin_avatar' />

          <div className='zlogin_phone zformline'>
            <div>    
              <SelectCustom
                defaultValue={vm.state.countryCode || '84'}
                data={vm.state.listCountryCode || []}
                placeholder='Please select the sport'
                changeCountryCode={(value) => vm.changeCountryCode(value)}
              />             
            </div>
          </div> 

          <div className='zlogin_phone zformline'>
            <div className='zinput_icon zinput_icon-phone' />
            <div className='zinput_input zinput_input-lessleft'>  
              <span className='zinput_countrycode'>{'+'+vm.state.countryCode}</span>  
              <input maxLength='12' placeholder='Nhập số điện thoại' autoComplete='off' value={vm.state.inputPhone} onChange={(e) => vm.updateInput('inputPhone', e)} />
            </div>
          </div> 

          <div className='zlogin_errMess'>{vm.state.errMess}</div>
          <button className='zlogin_btnlogin' tabIndex='0' onClick={vm.onClickLoginViaOTP.bind(vm)}>Đăng nhập với số điện thoại</button>
        </div>,
        1: <div>
          <div className='zlogin_avatar' />
          <div className='zlogin_phone zformline'>
            <div className='zinput_icon zinput_icon-phone' />
            <div className='zinput_input zinput_input-lessleft'><input className ='zinput_phoneOTP' maxLength='6' placeholder='Nhập OTP' autoComplete='off' value={vm.state.inputPhoneOTP} onChange={(e) => vm.updateInput('inputPhoneOTP', e)} /></div>
          </div>
          <div className='zlogin_errMess'>{vm.state.errMess}</div>
          <button className='zlogin_btnlogin' tabIndex='0' onClick={vm.onClickLoginViaOTPConfirm.bind(vm)}>Xác nhận OTP</button>
        </div>
      }[vm.state.flagStep]}</div>
    </div>
  </div>
</div>

export const renderFoot = (vm) => <div className='zlogin_foot'>
  <div className='zlogin_foottext' />{{
    'default':<svg className='bg-svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 810' preserveAspectRatio='xMinYMin slice'>
      <path id="svg_1" d="m592.66,0c-15,64.092 -30.7,125.285 -46.598,183.777c87.994,141.783 202.286,367.155 273.58,625.723l419.672,0c-54.796,-215.773 -156.19,-519.436 -336.677,-809.5l-309.977,0z" fill="#fde4d9"/>
      <path id="svg_2" d="m545.962,183.777c-53.796,196.576 -111.592,361.156 -163.49,490.74c11.7,44.494 22.8,89.49 33.1,134.883l404.07,0c-71.294,-258.468 -185.586,-483.84 -273.68,-625.623z" fill="#fff6f2"/>
      <path id="svg_3" d="m153.89,-1c74.094,180.678 161.088,417.448 228.483,674.517c67.297,-168.18 144.69,-395.052 210.187,-674.517l-438.67,0z" fill="#f9ede5"/>
      <path id="svg_4" d="m153.89,0l-153.89,0l0,809.5l415.57,0c-70.093,-308.562 -174.686,-597.626 -261.68,-809.5z" fill="#fff6f2"/>
      <path id="svg_5" d="m1144.22,501.538c52.596,-134.583 101.492,-290.964 134.09,-463.343c1.2,-6.1 2.3,-12.298 3.4,-18.497c0,-0.2 0.1,-0.4 0.1,-0.6c1.1,-6.3 2.3,-12.7 3.4,-19.098l-382.674,0c105.293,169.28 183.688,343.158 241.684,501.638l0,-0.1z" fill="#f9ede5"/>
      <path id="svg_6" d="m1285.31,0c-2.2,12.798 -4.5,25.597 -6.9,38.195c43.097,48.195 101.193,120.785 161.59,218.973l0,-257.168l-154.69,0z" fill="#fdf2ea"/>
      <path id="svg_7" d="m1278.31,38.196c-32.5,171.678 -81.09,327.36 -133.49,461.642l0,3.8c41,112.286 71.59,216.573 94.29,305.962l200.59,0.4l0,-553.232c-60.3,-97.988 -118.29,-170.48 -161.39,-218.573l0,0.001z" fill="#fff6f2"/>
    </svg>,
    'galo':<svg className="bg-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="xMinYMin slice">
      <path id="svg_1" d="m592.66,0c-15,64.092 -30.7,125.285 -46.598,183.777c87.994,141.783 202.286,367.155 273.58,625.723l419.672,0c-54.796,-215.773 -156.19,-519.436 -336.677,-809.5l-309.977,0z" fill="#5bccc0"></path>
      <path id="svg_2" d="m545.962,183.777c-53.796,196.576 -111.592,361.156 -163.49,490.74c11.7,44.494 22.8,89.49 33.1,134.883l404.07,0c-71.294,-258.468 -185.586,-483.84 -273.68,-625.623z" fill="#aef9f1"></path>
      <path id="svg_3" d="m153.89,-1c74.094,180.678 161.088,417.448 228.483,674.517c67.297,-168.18 144.69,-395.052 210.187,-674.517l-438.67,0z" fill="#7cdcd2"></path>
      <path id="svg_4" d="m153.89,0l-153.89,0l0,809.5l415.57,0c-70.093,-308.562 -174.686,-597.626 -261.68,-809.5z" fill="#aef9f1"></path>
      <path id="svg_5" d="m1144.22,501.538c52.596,-134.583 101.492,-290.964 134.09,-463.343c1.2,-6.1 2.3,-12.298 3.4,-18.497c0,-0.2 0.1,-0.4 0.1,-0.6c1.1,-6.3 2.3,-12.7 3.4,-19.098l-382.674,0c105.293,169.28 183.688,343.158 241.684,501.638l0,-0.1z" fill="#7cdcd2"></path>
      <path id="svg_6" d="m1285.31,0c-2.2,12.798 -4.5,25.597 -6.9,38.195c43.097,48.195 101.193,120.785 161.59,218.973l0,-257.168l-154.69,0z" fill="#fdf2ea"></path>
      <path id="svg_7" d="m1278.31,38.196c-32.5,171.678 -81.09,327.36 -133.49,461.642l0,3.8c41,112.286 71.59,216.573 94.29,305.962l200.59,0.4l0,-553.232c-60.3,-97.988 -118.29,-170.48 -161.39,-218.573l0,0.001z" fill="#aef9f1"></path>
    </svg>  
  }[rxconfig.theme]}  
</div>

export const renderComponent = (vm) => 
vm.state.loading ?
<div id ="loading"><div></div><div></div></div>
:
<div className='zlogin'>
  {Parser(adminCSS)}
  {vm.renderHead()}
  {vm.renderBody()}
  {vm.renderFoot()}
</div>
