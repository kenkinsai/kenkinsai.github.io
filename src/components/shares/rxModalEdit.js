/*global translate*/
import React, { Component } from 'react'
global.isclient && require('./rxModalEdit.css')

let zget = global.rxu.get

class RxModalEdit extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            addContactValue: {
                phone: zget(props, 'contactInfo.phone', ''),
                name: zget(props, 'contactInfo.name', ''),
            },
            flagEdit: props.flagEdit || false,
            errorValidate:''
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onChangeValueContact(key, value) {
        this.setState({ errorValidate: '', addContactValue: { ...this.state.addContactValue, [key]: value } })
    }

    onSubmit(e) {
        const regex = new RegExp(/^(\+84|01[2689]|09|08|03|07|05)[0-9]{8,10}$/i);
        let errorValidate = ''
        if (this.state.addContactValue.name.length < 1) errorValidate = translate('Name is too short')
        else if (!regex.test(this.state.addContactValue.phone)) errorValidate = translate('Phone is invalid')
        this.setState({ errorValidate })
        if (!errorValidate) this.props.onSubmitContact(this.state.addContactValue)
    }

    render() {
        return (
            <div className='zmodal-addfriend'>
                <div className='zmodal-addfriend-content'>
                    <div className='zmodal-header'>
                        <span className='zmodal-title'>{translate('Add a contact')}</span>
                        <img className="icon24 zmodal-close filter_img_class" onClick={() => this.props.onClickModalEdit()} src={'./images/default/icons/close-color.svg'} alt='' />
                    </div>
                    <div className='zmodal-fill'>
                        <span className='zmodal-txt' type='text'>{translate('Full name')}</span>
                        <input maxLength="30" className='zmodal-input' placeholder={translate('Enter your full name')}
                            value={this.state.addContactValue.name}
                            onChange={(event) => this.onChangeValueContact('name', event.target.value)} />
                        <span className='zmodal-txt' >{translate('Phone number')}</span>
                        <input maxLength="10" className='zmodal-input zmodal-input-phone' placeholder='0000 000 000' disabled={this.state.flagEdit}
                            value={this.state.addContactValue.phone}
                            onChange={(e) => this.onChangeValueContact('phone', e.target.value)} 
                        />

                        <div className='chatConfig_note' style={{color:'#d5192d'}}>{this.state.errorValidate}</div>
                    </div>
                    <div className='zmodal-btn' onClick={() => this.onSubmit()}   >
                        <span className='zmodal-btn-txt'  >{translate('Done')} </span>
                    </div>
                </div>
            </div>
        )
    }
}
export default RxModalEdit
