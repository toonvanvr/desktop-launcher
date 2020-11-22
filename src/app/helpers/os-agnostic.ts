import { BrowserWindow } from 'electron'
import * as Windows from './os-windows'
import * as AppError from './errors'

export async function glueToDesktop(window: BrowserWindow) {
  switch (process.platform) {
    case 'win32':
      await Windows.glueToDesktop(window, { lock: true })
    default:
      throw new AppError.UnsupportedOperatingSystem(glueToDesktop.name)
  }
}
