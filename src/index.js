import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import {} from './global'
import AppContainer from './app'
import { store } from './redux'

global.rootRequiretheme('styles/style')

render(
  <Provider store={store}>
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  </Provider>
  , document.getElementById('chat-root'))
