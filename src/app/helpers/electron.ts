import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

export async function installVueDevTools(): Promise<void> {
  try {
    await installExtension(VUEJS_DEVTOOLS)
  } catch (e) {
    console.error('Vue Devtools failed to install:', e.toString())
  }
}
