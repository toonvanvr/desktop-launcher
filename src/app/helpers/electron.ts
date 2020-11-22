import { app, BrowserWindow } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { OS } from '.'
import { nothing } from './typescript'
import { join as pjoin } from 'path'

export function publicFile(relPath: string): string {
  return pjoin(__static, relPath)
}

export async function installVueDevTools(): Promise<void> {
  try {
    // await installExtension(VUEJS_DEVTOOLS) // this doesn't work with vue 3 yet
    // installExtension('ljjemllljcmogpfapbkkighbhhppjdbg') // vuejs beta
  } catch (e) {
    console.error('Vue Devtools failed to install:', e.toString())
  }
}

export async function toggleShow(
  nativeWindow: BrowserWindow | nothing,
  {
    bottom = false,
    show = null,
  }: { bottom?: boolean; show?: boolean | null } = {},
): Promise<void> {
  if (!nativeWindow) return

  if (show === null) {
    show = !nativeWindow.isVisible()
  }

  if (show) {
    nativeWindow.show()
    if (bottom) {
      await OS.glueToDesktop(nativeWindow)
    }
  } else {
    nativeWindow.hide()
  }
}
