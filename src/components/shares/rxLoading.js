import React from 'react'
global.isclient && require('./rxLoading.css')

function Loading() {
    return (
        <div className='background'>
            <div className="loader"></div>
        </div>
    )
}
export default Loading
