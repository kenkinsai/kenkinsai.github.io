import React, { Component } from 'react'
import { connect } from 'react-redux'

global.isclient && require('./rxTagName.css')
const { subString,stringToColour ,rxChangeSlug} = global.rootRequire('classes/ulti')
const { checkNameUser,checkNameContact } = global.rootRequire('classes/chat')

class rxTagName_ extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  tagName_SelectUser(ele) {  
    ele.name_contact = subString(checkNameUser(ele), 20)
    this.props.onClick(ele)              
  }

  render () {
    let groupsTemp = this.props.groupsTemp
    let tagNameSelect = this.props.tagNameSelect ||{}
    return (
      <div className='box-tagName-wrap'>       
        <div className='box-tagName'>
          <div className = 'tagName_List_place'>
             <div className='tagName_List' id = 'tagName_List_id'>
             { groupsTemp.map((ele, index) =>(
               <div className={ (tagNameSelect.id && ele.id && tagNameSelect.id === ele.id) ? 'box-tagName_item_select': 'box-tagName_item'} key={index} onClick={ (e) => this.tagName_SelectUser(ele)} > 
                 <div className='tagName_List_avatar'>
                   {(ele.profile_url) && <img src={global.rxu.config.cdn_endpoint + ele.profile_url} alt='' className='tagName_List_ava-group images-static'
                     onError={(e) => { e.target.style.display = 'none' }} />}
                  {(!ele.profile_url) && 
                    <span className='tagName_List_ava-span' style={{ background: `linear-gradient(120deg, ${stringToColour('FFF' + checkNameContact(ele).slice(0, 2).toUpperCase())}, #FFFFFF)` }}>{rxChangeSlug(checkNameUser(ele)).slice(0, 2).toUpperCase()}</span>
                  }
                 </div>
                 <div className='tagName_List_name'>{ subString(checkNameUser(ele), 20) } </div>
               </div> 
               )
             )}
             </div> 
           </div> 
          <div className='tagName-box-tail'><i className='icon-tagName-tail'></i></div>
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state, ownProps) => ({})

// const mapDispatchToProps = {}

// const rxTagName_ = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(rxTagName)

export default rxTagName_