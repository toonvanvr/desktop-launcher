import { app, BrowserWindow, Menu, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { join } from 'path'
import { publicFile, installVueDevTools, MODE, toggleShow } from './helpers'
import { realpath } from 'fs'

export class DesktopLauncherApplication {
  tray: Tray | null = null
  desktop: BrowserWindow | null = null

  async launch(): Promise<void> {
    await app.whenReady()
    await Promise.all([this.createTray(), this.createDesktopWindow()])
  }

  async createDesktopWindow(): Promise<BrowserWindow> {
    // Allow only one instance
    if (!this.desktop) {
      this.desktop = new BrowserWindow({
        icon: publicFile('tray.png'),
        closable: false, // required -- UX
        movable: false, // required -- UX
        resizable: false, // required -- UX
        focusable: true, // required -- correct <input> rendering
        skipTaskbar: true, // required -- no ALT-tab for desktop widgets
        webPreferences: {
          backgroundThrottling: false, // optional
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, // vue.config
          enableRemoteModule: true, // wrong -- use a preload script
        },

        // Transparency
        backgroundColor: '#01010100', // #00000000 used to cause bugs
        frame: false, // required
        hasShadow: false, // optional
        transparent: true, // required

        // Trigger on 'ready-to-show' to avoid flickering
        paintWhenInitiallyHidden: true, // required -- but is default value
        show: false, // required

        // Undecided
        fullscreen: true, // {width, height} may work better for macOs
        // simpleFullscreen // affects macOs
        // - type -- macos/linux?
        // - thickFrame
        // - titleBarStyle
        // - visualEffectState
      })

      // Glue the window to the desktop
      this.desktop.on('ready-to-show', async () => {
        await toggleShow(this.desktop, { show: true, bottom: true })
      })

      // Load the main page: dev=webpack live reload; prod=static files
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        await this.desktop.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        // this.desktop.webContents.openDevTools({ mode: 'detach' })
      } else {
        createProtocol('app')
        await this.desktop.loadURL('app://./index.html')
      }

      if (MODE.development) {
        await installVueDevTools() // bugged?
      }
    }
    return this.desktop
  }

  async createTray(): Promise<Tray> {
    // TODO: referring to `src` is not allowed, but let's do it like this for now
    // this.tray = new Tray(join(__dirname, '../src/assets/tray.png'))
    this.tray = new Tray(publicFile('tray.png'))
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
