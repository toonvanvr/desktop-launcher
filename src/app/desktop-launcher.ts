import { BrowserWindow, Menu, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { join } from 'path'
import { toggleShow } from './helpers'

export class DesktopLauncherApplication {
  tray: Tray | null = null
  desktop: BrowserWindow | null = null

  async launch(): Promise<void> {
    await Promise.all([this.createTray(), this.createDesktopWindow()])
  }

  async createDesktopWindow(): Promise<BrowserWindow> {
    // Allow only one instance
    if (!this.desktop) {
      this.desktop = new BrowserWindow({
        // To check
        // - skipTaskbar
        // - simpleFullscreen
        // - type
        // - thickFrame
        // - titleBarStyle
        // - visualEffectState

        // Window options
        acceptFirstMouse: true,
        movable: false,
        focusable: true,
        closable: false,
        resizable: false,

        // Transparency related options
        frame: false,
        transparent: true,
        // fullscreen: true,
        hasShadow: false,
        // > some envs see RGB=0 + A=0 as black instead of transparent
        backgroundColor: '#01010100',

        // Trigger on 'ready-to-show' to avoid flickering
        // show: false,
        paintWhenInitiallyHidden: true,

        // Security settings
        webPreferences: {
          backgroundThrottling: false,
          // > vue.config.js
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        },
      })

      this.desktop.on('ready-to-show', async () => {
        await toggleShow(this.desktop, { show: true, bottom: true })
      })
      // Load the main page
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Development: with live reload
        await this.desktop.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      } else {
        // production: static local file access
        createProtocol('app')
        await this.desktop.loadURL('app://./index.html')
      }
    }
    return this.desktop
  }

  async createTray(): Promise<Tray> {
    // TODO: referring to `src` is not allowed, but let's do it like this for now
    this.tray = new Tray(join(__dirname, '../src/assets/tray.png'))
    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        { type: 'separator' },
        {
          label: 'Layers',
          submenu: [
            {
              label: 'Desktop',
              submenu: [
                {
                  role: 'unhide',
                  click: () => toggleShow(this.desktop),
                },
                {
                  role: 'toggleDevTools',
                  click: () =>
                    this.desktop?.webContents.openDevTools({ mode: 'detach' }),
                },
              ],
            },
          ],
        },
        { role: 'quit' },
      ]),
    )
    return this.tray
  }
}
