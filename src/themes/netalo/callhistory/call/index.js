import { connect } from 'react-redux'

import * as Jsx from './index.jsx'

const RxComponent = global.rootRequire('components/shares/rxComponent').default

const { rxnavToggle, rxnavClose, netaCallHistoryUpdate } = global.rootRequire('redux')

class Component_ extends RxComponent {
    constructor(props, context) {
        super(props, context, Jsx)

    }
 

    onClickAnswerCall() {
        this.props.onClickAnswerCall()
    }
    onClickStopCall() {
        this.props.stopCall()
    }
    render() {
        return this.renderComponent();
    }

}

const mapStateToProps = (state, ownProps) => ({
    langValue:state.langValue,
    auth: state.auth,
    favorite: state.favorite,
    netaauth: state.netaauth,
    netaCallHistory: state.netaCallHistory,
    user: state.user
})

const mapDispatchToProps = {
    rxnavClose,
    rxnavToggle,
    netaCallHistoryUpdate
}

const ComponentWrapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Component_)

export default ComponentWrapped
