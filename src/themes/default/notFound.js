import React from 'react'
import { Route } from 'react-router-dom'

const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext) { staticContext.status = code }
    return children
  }} />
)

const NotFound = () => (
  <Status code={404}>
    <div>
      <div className='rx-cat-title'>Không tìm thấy nội dung</div>
    </div>
  </Status>
)

export default NotFound
