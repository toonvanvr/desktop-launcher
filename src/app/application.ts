import { app, BrowserWindow } from 'electron'
import { join as joinPath } from 'path'

const desktopUrl = joinPath(__dirname + '../../../static/index.html')

export class Application {
  window = {
    desktop: null as BrowserWindow | null
  }

  async launch(): Promise<void> {
    await app.whenReady()
    this.openDesktopWindow()
  }

  openDesktopWindow(): void {
    if (!this.window.desktop) {
      this.window.desktop = new BrowserWindow({
        show: false
      })
      this.window.desktop.loadFile(desktopUrl)
      this.window.desktop.on('ready-to-show', () => this.window.desktop?.show())
    }
  }
}
