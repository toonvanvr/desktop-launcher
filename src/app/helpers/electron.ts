import { BrowserWindow } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { OS } from '.'
import { nothing } from './typescript'

export async function installVueDevTools(): Promise<void> {
  try {
    await installExtension(VUEJS_DEVTOOLS)
  } catch (e) {
    console.error('Vue Devtools failed to install:', e.toString())
  }
}

export async function toggleShow(
  window: BrowserWindow | nothing,
  {
    bottom = false,
    show = null,
  }: { bottom?: boolean; show?: boolean | null } = {},
): Promise<boolean> {
  if (!window) return false

  if (show === null) {
    show = !window.isVisible()
  }

  if (show) {
    window.show()
    if (bottom) {
      await OS.glueToDesktop(window)
    }
    return true
  } else {
    window.hide()
    return true
  }
}
