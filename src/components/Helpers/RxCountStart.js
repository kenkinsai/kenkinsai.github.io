import React from 'react'

export function rxCountStart (index, size = false) {
  let arrRatings = [0, 0, 0, 0, 0]
  let arrRatingstemplate = []
  index = (typeof (index) === 'undefined') ? 0 : index

  for (var i = 0; i < arrRatings.length; i++) {
    if (i <= (index - 1)) {
      arrRatings[i] = 1
    } else {
      arrRatings[i] = 0
    }
  }

  if (size === true) {
    arrRatingstemplate = arrRatings.map((perdata, index) => (
      <div key={index}>
        {perdata === 0 && <div className='rx-star-off-big' /> }
        {perdata === 1 && <div className='rx-star-big' />}
      </div>
    ))
  } else {
    arrRatingstemplate = arrRatings.map((perdata, index) => (
      <div key={index}>
        {perdata === 0 && <div className='rx-star-off' /> }
        {perdata === 1 && <div className='rx-star' />}
      </div>
    ))
  }

  return arrRatingstemplate
}
