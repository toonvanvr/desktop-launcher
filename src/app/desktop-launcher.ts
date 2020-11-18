import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { MODE } from './helpers'

export class DesktopLauncherApplication {
  desktop: BrowserWindow | null = null

  async launch(): Promise<void> {
    await this.createDesktopWindow()
  }

  async createDesktopWindow(): Promise<void> {
    // Allow only one instance
    if (this.desktop) return

    // Create a window
    this.desktop = new BrowserWindow({
      width: 500,
      height: 500,
      transparent: true,
      frame: false,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      }
    })

    // Load the main page
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // development
      await this.desktop.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      if (!MODE.testing) {
        // this.mainWindow.webContents.openDevTools({ mode: 'detach' })
      }
    } else {
      // production
      createProtocol('app')
      this.desktop.loadURL('app://./index.html')
    }
  }
}
