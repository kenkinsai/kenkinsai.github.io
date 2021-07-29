import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { apipost } from './../../classes/request'
const { setComp } = global.rootRequire('redux')
class registerComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editingData: {},
      msg: ''
    }
  }

  onBlurData (e, name) {
    let editingData = this.state.editingData
    editingData[name] = e.target.value
    this.setState({ editingData: editingData })
  }

  onClickRegisterSubmit (e) {
    let editingData = this.state.editingData

    this.setState({ editingData: editingData }, () => {
      apipost(global.rxu.config.api_user, this.state.editingData, {
        '1': (json) => {
          this.setState({ msg: '' })
          // this.props.history.push('login')
          this.props.setComp('login')
        },
        '-2': (json) => {
          var strmsg = ''
          if (json.msg === 'Dupplicate data') {
            strmsg = 'Email đã được đăng ký'
          } else if (json.msg === 'Email invalid format') {
            strmsg = 'Định dạng Email không đúng'
          } else {
            strmsg = 'Các trường * không được để trống'
          }
          this.setState({ msg: strmsg })
        }
      })
    })
  }

  render () {
    return (
      <div className='authloginpage'>
        <div className='authform'>
          <div className='register-form'>
            <div className='authform__head'>Đăng ký</div>
            <p className='authform_msgerror'>{this.state.msg}</p>
            <input tabIndex='1' type='text' placeholder='Tài khoản' className='authform__input' onChange={(e) => this.onBlurData(e, 'username')} />
            <input tabIndex='2' type='text' placeholder='Tên đầy đủ' className='authform__input' onChange={(e) => this.onBlurData(e, 'fullname')} />
            <input tabIndex='3' type='text' placeholder='Email' className='authform__input' onChange={(e) => this.onBlurData(e, 'email')} />
            <input tabIndex='4' type='text' placeholder='Số điện thoại' className='authform__input' onChange={(e) => this.onBlurData(e, 'phone')} />
            <input tabIndex='5' type='text' placeholder='Địa chỉ' className='authform__input' onChange={(e) => this.onBlurData(e, 'address')} />
            <input tabIndex='6' type='password' placeholder='Mật khẩu' className='authform__input' autoComplete='new-password' onChange={(e) => this.onBlurData(e, 'password')} />
            <input tabIndex='7' type='password' placeholder='Xác nhận mật khẩu' className='authform__input' onChange={(e) => this.onBlurData(e, 'repassword')} />
            <div tabIndex='10' className='authform__btnsubmit' onClick={(e) => this.onClickRegisterSubmit(e)} onKeyPress={(e) => this.onClickRegisterSubmit(e)} >Tạo tài khoản</div>
            <p className='authform__msg'>Bạn đã có tài khoản? <Link to='/login'>Đăng nhập</Link></p>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
})
const mapDispatchToProps = { setComp }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(registerComponent)

