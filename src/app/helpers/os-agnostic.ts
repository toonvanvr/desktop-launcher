import { BrowserWindow } from 'electron'
import { Win32 } from './os-windows'
import * as AppError from './errors'

export async function glueToDesktop(window: BrowserWindow) {
  const Windows = await Win32

  switch (process.platform) {
    case 'win32':
      Windows?.glueToDesktop(window, { lock: true })
      break
    default:
      throw new AppError.UnsupportedOperatingSystem(glueToDesktop.name)
  }
}
