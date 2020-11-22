import { app, BrowserWindow, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

import { DesktopLauncherApplication } from './app/desktop-launcher'
import { installVueDevTools, MODE } from './app/helpers'

const launcherApp = new DesktopLauncherApplication()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (MODE.development) {
    // await installVueDevTools() -- bugged?
  }

  await launcherApp.launch()
})

// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     this.createMainWindow()
//   }
// })

// Exit cleanly on request from parent process in development mode.
if (MODE.development) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
