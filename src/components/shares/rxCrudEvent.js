/*global translate*/
import { Component } from 'react'
const { apiget, apipost } = global.rootRequire('classes/request')

const WAIT_INTERVAL = 500
class RxCrudEvent extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      flagUpdate: false,
      paging: { st_col: 'created_at', st_type: -1, pg_page: 1, pg_size: 10 },
      editingData: {},
      extra: {},
      data: {},
      flags: {}
    }
  }

  componentWillUnmount () {
    this._isUnmounted = true
  }

  setState (obj, callback = () => {}) { if (!this._isUnmounted) { super.setState(obj, callback) } }

  fetchAlldata () { this.fetchData() }
  fetchData (runCallback = false) {
    apiget(global.rxu.get(global.rxu.config, this.props.api), this.state.paging, {
      '1': (json) => { this.setState({ data: json.data, extra: json.extra }) }
    })
    runCallback ? this.run('dataCallback', {}) : console.log()
  }

  run (name, params) {
    if (params) { params.inthis = this } else { params = this }
    if (typeof this.props[name] !== 'undefined' && typeof this.props[name] === 'function') {
      return this.props[name](params)
    } else if (typeof this[name] !== 'undefined' && typeof this[name] === 'function') {
      return this[name]()
    }
  }

  toggle (flagname) {
    let flags = this.state.flags
    flags[flagname] = flags[flagname] ? 0 : 1
    this.setState({ flags: flags })
  }

  onClickData (e, perdata) {}
  onClickSort (e, stcol) {
    let paging = this.state.paging
    paging.st_type = (paging.st_col !== stcol) ? -1 : (-1 * (paging.st_type))
    paging.st_col = stcol
    this.setState({ paging: paging }, () => { this.fetchData() })
  }

  onClickDataImport (e) {

  }

  onClickDataExport (e) {    
    apiget(global.rxu.get(global.rxu.config, this.props.api), { ...this.state.paging, pg_size: 10000 }, {
      '1': (json) => { global.JSONToCSVConvertor(json.data, '') }
    })
  }

  onClickDataNew (e) {
    global.scrolltop()
    let timeStr = Date.now().toString()
    let clone = { name: this.props.name + '_' + timeStr.substr(timeStr.length - 5), desc: '', created_at: 1, is_deleted: 0, is_active: 1, is_hot: 0, price: 100000, app: '', appdist: '' }
    this.setState({ editingData: clone })
  }

  onClickDataEdit (e, perdata) {
    global.scrolltop()
    if (typeof perdata['inthis'] !== 'undefined') { delete perdata['inthis'] }
    let clone = JSON.parse(JSON.stringify(perdata))
    this.setState({ editingData: clone, flags: {} })
  }

  onClickDataDelete (e, perdata) {
    let r = window.confirm(translate('You want to delete this data!'))
    if (r === true) {
      apiget(global.rxu.get(global.rxu.config, this.props.api) + '/delete', perdata, {
        '1': (json) => { this.fetchData(true) }
      })
    } else {}
  }

  onClickDataRestore (e, perdata) {
    apiget(global.rxu.get(global.rxu.config, this.props.api) + '/restore', perdata, {
      '1': (json) => { this.fetchData(true) }
    })
  }

  onClickDataUpdateSubmit (e, perdata) {
    global.scrolltop()
    apipost(global.rxu.get(global.rxu.config, this.props.api) + '/edit', this.state.editingData, {
      '1': (json) => { this.fetchData(true) }
    })
    this.onClickDataEdit({}, {})
  }

  onClickDataUpdateSubmitRaw (e, perdata) {
    global.scrolltop()
    apipost(global.rxu.get(global.rxu.config, this.props.api) + '/edit', { ...this.jsoneditor.get(), _id: this.state.editingData._id, rxraw: 1 }, {
      '1': (json) => { this.fetchData(true) },
      'default': () => {}
    })
    this.onClickDataEdit({}, {})
  }

  onClickDataCreateSubmit (e, perdata) {
    global.scrolltop()
    apipost(global.rxu.get(global.rxu.config, this.props.api), this.state.editingData, {
      '1': (json) => { this.fetchData(true) }
    })
    this.onClickDataEdit({}, {})
  }

  onClickDataTrash (e, isdeleted) {
    let paging = this.state.paging
    paging['search_is_deleted'] = isdeleted
    this.setState({ paging: paging }, () => {
      this.fetchData()
    })
  }

  onClickGenPermission () {
    apiget(global.rxu.config.api_permission_genpermission, {}, { '1': (json) => {
      this.fetchData()
    } })
  }

  onBlurData (e, name, options) {
    options = options || {}
    let editingData = this.state.editingData
    if (options.strim) {
      editingData[name] = e.target.value.toString().replace(/(,)/g, '')
    } else {
      editingData[name] = e.target.value
    }
    this.setState({ editingData: editingData })
  }

  onBlurDataValue (value, name) {
    let editingData = this.state.editingData
    editingData[name] = value
    this.setState({ editingData: editingData })
  }

  onBlurDatafilter (e, name) {
    clearTimeout(this.timerDatafilter)
    let paging = this.state.paging
    paging['search_' + name] = e.target.value
    this.setState({ paging: paging })

    this.timerDatafilter = setTimeout((e, name) => {
      this.fetchData()
    }, WAIT_INTERVAL)
  }

  onChangeContentCKE (evt) {
    let editingData = this.state.editingData
    let newContent = evt.editor.getData()
    editingData.content = newContent
    this.setState({ editingData: editingData })
  }

  onClickPaging (page) {
    let paging = this.state.paging
    let count = global.rxu.get(this.state.extra, 'count', paging.pg_size)
    let maxpage = Math.ceil(count / paging.pg_size)

    if (page < 1) { page = 1 }
    if (page > maxpage) { page = maxpage }

    paging.pg_page = page
    this.setState({ paging: paging }, () => { this.fetchData() })
  }

  onChangePageSize (evt) {
    clearTimeout(this.timerPageSize)
    let pagesize = parseInt(evt.target.value, 10)
    let paging = this.state.paging
    paging.pg_size = pagesize
    paging.pg_page = 1
    if (pagesize >= 1 && pagesize <= 1000) {
      this.setState({ paging: paging }, () => { this.timerPageSize = setTimeout((e, name) => { this.fetchData() }, WAIT_INTERVAL) })
    }
  }

  callbackUpload (e) {
    this.onBlurData({ target: { value: e.images } }, 'img_landscape')
  }

  callbackUploadDetail (e) {
    this.onBlurData({ target: { value: e.images } }, 'img_detail')
  }
}

export default RxCrudEvent
