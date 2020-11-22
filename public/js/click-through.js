const win = require('electron').remote.getCurrentWindow()

function onMouse(event) {
  if (event.target === document.documentElement) {
    win.setIgnoreMouseEvents(true, { forward: true })
  } else {
    win.setIgnoreMouseEvents(false, { forward: false })
  }
}

window.addEventListener('mousemove', onMouse)
window.addEventListener('dragover', onMouse)
document.documentElement.style.pointerEvents = 'none'
