/*global translate*/
import React from 'react'
export const MainTable = (props) => { return <div className='betable__main'><table className='betable__inner'>{props.children}</table></div> }
export const AdminBlock = (props) => {
  return <div className='adblock'>
    <div className='adblock__head'>
      <div className='adblock__title'>{props.name} {translate('Review')}</div>
      <div className='adblock__desc'>{props.desc} {translate('Manage reviews')}</div>
    </div>
    <div className='adblock__body'>
      <div className='row adblock__inner'>
        {props.children}
      </div>
      <div className='clearfix-martop' />
    </div>
  </div>
}
