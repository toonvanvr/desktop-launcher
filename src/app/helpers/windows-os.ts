export namespace Windows {
  export async function setBottomMost(hwnd: Buffer): Promise<void> {
    const swp = await import('win-setwindowpos')

    swp.SetWindowPos(
      hwnd,
      swp.HWND_BOTTOM,
      0,
      0,
      0,
      0,
      swp.SWP_NOSIZE | swp.SWP_NOMOVE | swp.SWP_NOACTIVATE,
    )
  }
}
