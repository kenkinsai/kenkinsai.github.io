const Chat = require('./chat').default

let Themeroutes = [
  { path: '*',
    component: Chat,
    routes: [{
      path: '*',
      exact: true,
      component: Chat
    }]
  }]

export default Themeroutes
