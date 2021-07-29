// For mobile
function applyViewport () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    let ww = window.screen.width
    let mw = 680
    let ratio = ww / mw
    let viewportMeta = document.getElementById('viewport')
    if (ww < mw) { // smaller than minimum size
      viewportMeta.setAttribute('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=no, width=' + mw)
    } else { // regular size
      viewportMeta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1, minimum-scale=1.0, user-scalable=yes, width=' + ww)
    }
  }
}

window.addEventListener('resize', function () {
  applyViewport()
})

applyViewport()

// React Redux Fire
// let storeResetInterval = setInterval(function () {
//   if (typeof window.storeReset !== 'undefined') {
//     clearInterval(storeResetInterval)
//     window.storeReset()
//   }
// }, 10)
