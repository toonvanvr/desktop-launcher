import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { MODE } from './helpers'

export class DesktopLauncherApplication {
  mainWindow: BrowserWindow | null = null

  async launch(): Promise<void> {
    await this.createMainWindow()
  }

  async createMainWindow(): Promise<void> {
    // Allow only one instance
    if (this.mainWindow) return

    const env = process.env

    // Create a window
    this.mainWindow = new BrowserWindow({
      width: 500,
      height: 500,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: env.ELECTRON_NODE_INTEGRATION
      }
    })

    // Load the main page
    if (env.WEBPACK_DEV_SERVER_URL) {
      // development
      await this.mainWindow.loadURL(env.WEBPACK_DEV_SERVER_URL)
      if (!MODE.testing) {
        this.mainWindow.webContents.openDevTools({ mode: 'detach' })
      }
    } else {
      // production
      createProtocol('app')
      this.mainWindow.loadURL('app://./index.html')
    }
  }
}
