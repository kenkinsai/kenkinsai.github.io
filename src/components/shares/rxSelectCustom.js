import React, { Component } from 'react';
import { FixedSizeList as List } from 'react-window';
import './rxSelectCustom.css';

const {rxChangeSlug} = global.rootRequire('classes/ulti')

let zget = global.rxu.get

class SelectCustom extends Component {

  constructor(props) {
    super(props);

    this.state = {
      defaultTitle: '',
      idCountry: '',
      valueSearch: '',
      isOpen: false
    }

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleSelect = (sportTitle) => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      defaultTitle: sportTitle.CountryCode,
      valueSearch: '',
      idCountry: sportTitle.Id
    }))
    this.props.changeCountryCode(sportTitle.CountryCode)
  }

  handleOpen = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }))
  }


  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      // this.handleSelect();
      this.setState({isOpen: false})
    }
  }

  searchCountryCode(e) {
    this.setState({valueSearch: e.target.value})
  }

  Row = ({ index, style }) => {
    let dataArr = this.filterSearch(this.props.data)
    
    const countryObj = dataArr[index] || {}
    
    return (<div style={style}>
      <div key={index} onClick={() => this.handleSelect(countryObj)} className='select-item'>
        <span className='select-icon'><img className='select-logo-country' alt='' src={zget(countryObj, 'Country.Logo', '')} /></span>
        <span className='select-title'>{zget(countryObj, 'Country.Name', '')}</span>
        <span className='select-country-code'>+{zget(countryObj, 'CountryCode', '')}</span>
      </div>
    </div>)
  }

  filterSearch(data) {
    let dataTmp = []
    try {
      dataTmp = data.filter(o => (rxChangeSlug(zget(o, 'Country.Name', '')).indexOf(rxChangeSlug(this.state.valueSearch)) !== -1 || zget(o, 'CountryCode', '').toString().indexOf(this.state.valueSearch) !== -1))  
    } catch(e) {}
    
    return dataTmp
  }

  render() {
    let { data, placeholder, defaultValue } = this.props
    const { defaultTitle, idCountry } = this.state

    data = this.filterSearch(data)

    const valueDefault = defaultTitle || defaultValue
    const defaultObj = (idCountry) ? data.find(o => (o.Id === idCountry)) : data.find(o => (o.CountryCode === valueDefault))
    const itemCount = data.length
    
    return (
      <div className='option-custom' ref={this.wrapperRef}>
        <div className='select-input' onClick={this.handleOpen}>
          
          <span className='select-icon'><img className='select-logo-country' alt='' src={zget(defaultObj, 'Country.Logo', '')} /></span>
          <span className='select-title'>{zget(defaultObj, 'Country.Name', '')}</span>
        </div>

        {(this.state.isOpen) && <div className='select-list'> 
          <div className='search-list-country'>
            <input placeholder='Tìm kiếm' onChange={(e) => this.searchCountryCode(e)} />
          </div>
          <List
            height={280}
            itemCount={itemCount}
            itemSize={50}
            width={310}
          >
            {this.Row}
          </List>          
        </div>}
      </div>
    );
  }
}

export default SelectCustom;