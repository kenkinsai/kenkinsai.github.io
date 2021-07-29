import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { loginAction, logoutAction } from './../../redux'
import { apipost, rxsetCookie, rxsetLocal } from './../../classes/request'

class loginComponent_ extends Component {
  constructor (props) {
    super(props)

    this.mounted = true
    this.state = {
      editingData: {},
      msg: ''
    }
  }

  componentDidMount () { this._ismounted = true }
  componentWillUnmount () { this._ismounted = false }

  onBlurData (e, name) {
    let editingData = this.state.editingData
    editingData[name] = e.target.value
    this.setState({ editingData: editingData })
  }

  onClickLoginSubmit (e) {
    let editingData = this.state.editingData

    this.setState({ editingData: editingData }, () => {
      apipost(global.rxu.config.api_authorize, this.state.editingData, {
        '1': (json) => {
          if (this._ismounted) {
            (json.data && json.data.user) ? rxsetCookie('authorize', json.data.user.authorization, 120) : rxsetCookie('authorize', json.data.authorization, 120)
            rxsetLocal('arrper', json.data.arrper)
            this.setState({ msg: '' })

            json.data.user = { ...json.data.user, arrper: json.data.arrper, arrperdetail: json.data.arrperdetail }
            this.props.loginAction(json.data.user)
            this.props.history.push('/admin/dashboard')
          }
        },
        '-2': (json) => {
          if (this._ismounted) {
            var strmsg = ''
            if (json.msg === 'Sai định dạng' || json.msg === 'Không thể đăng nhập!') {
              strmsg = json.msg
            }
            this.props.logoutAction()
            this.setState({ msg: strmsg })
          }
        }
      })
    })
  }

  render () {
    return (
      <div className='authloginpage'>
        <form>
          <div className='authform' onKeyPress={(e) => { let charCode = e.which || e.charCode || e.keyCode || 0; if (charCode === 13) this.onClickLoginSubmit(e) }}>
            <div className='authform__head'>Đăng nhập</div>
            <p className='authform_msgerror'>{this.state.msg}</p>
            <input tabIndex='1' type='text' placeholder='Tài khoản' className='authform__input' autoComplete='username' onChange={(e) => this.onBlurData(e, 'username')} />
            <input tabIndex='2' type='password' placeholder='Mật khẩu' className='authform__input' autoComplete='password' onChange={(e) => this.onBlurData(e, 'password')} />
            <div tabIndex='3' className='authform__btnsubmit' onClick={(e) => { this.onClickLoginSubmit(e) }} onKeyPress={(e) => { this.onClickLoginSubmit(e) }}>Đăng Nhập</div>
            <p className='authform__msg'>Bạn chưa có tài khoản? <Link to='/register'>Đăng ký tài khoản</Link></p>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

const mapDispatchToProps = {
  logoutAction,
  loginAction
}

const loginComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(loginComponent_)

export default loginComponent
