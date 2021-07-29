import React from 'react'
import { Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

const Product = ({ route }) => (
  <Switch>
    {renderRoutes(route.routes)}
  </Switch>
)

export default Product
