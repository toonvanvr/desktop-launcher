import { BrowserWindow } from 'electron'
import { Type } from 'ref-napi'
import { PromiseType } from './typescript'

// ------------------------------------------------------------------- Export --

export const Win32 = win32()

// -------------------------------------------------------------------- Types --

interface User32Api {
  SetWindowPos: (
    whnd: number,
    hndInsertAfter: number,
    x: number,
    y: number,
    cx: number,
    cy: number,
    flags: number,
  ) => void
}

interface WINDOWPOS_node {
  hwndInsertAfter: number
  hwnd: number
  x: number
  y: number
  cx: number
  cy: number
  flags: number
}

type WINDOWPOS_native = { [K in keyof WINDOWPOS_node]: Type }

// -------------------------------------------------------------------- Enums --

enum FLAGS {
  SWP_NOSIZE = 0x0001,
  SWP_NOMOVE = 0x0002,
  SWP_NOACTIVATE = 0x0010,
  HWND_BOTTOM = 1,
  WM_WINDOWPOSCHANGING = 0x0046,
  SWP_NOZORDER = 0x0004,
}

// ------------------------------------------------------------------- Import --

async function win32() {
  if (process.platform !== 'win32') return null

  // -- Windows-only imports -----------------------------------

  const ffi = (await import('ffi-napi')).default
  const ref = (await import('ref-napi')).default
  const Struct = (await import('ref-struct-napi')).default

  // -- Windows API (data types) -------------------------------

  const WINDOWPOS_template: WINDOWPOS_native = {
    hwndInsertAfter: ffi.types.int32,
    hwnd: ffi.types.int32,
    x: ffi.types.int32,
    y: ffi.types.int32,
    cx: ffi.types.int32,
    cy: ffi.types.int32,
    flags: ffi.types.uint32,
  }

  /** https://docs.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-windowpos */
  const WINDOWPOS = Struct(WINDOWPOS_template)

  // -- Windows API --------------------------------------------

  const user32: User32Api = new ffi.Library('user32', {
    SetWindowPos: [
      'bool',
      ['int32', 'int32', 'int32', 'int32', 'int32', 'int32', 'uint32'],
    ],
  })

  // -- Functions ----------------------------------------------

  /**
   * ***********************************************************
   *
   * Refactored implementation of StackOverflow answer:
   *
   *   User: Venryx
   *   Profile: https://stackoverflow.com/users/2441655/venryx
   *   Answer: https://stackoverflow.com/a/58473299/2646357
   *
   *   License: CC BY-SA 4.0
   *            https://creativecommons.org/licenses/by-sa/4.0
   *            https://stackoverflow.com/help/licensing
   *
   * ***********************************************************
   *
   * Bind a `BrowserWindow` to the desktop in Windows.
   *
   * It first moves it to the bottom and then edits any incoming
   * messages so that the window no longer moves in the z-order.
   *
   * Makes use of the `ffi-napi` and `ref-napi` modules to
   * create bindings to compiled native libraries.
   *
   * @param window
   *  The `BrowserWindow` instance to be brought to the bottom
   * @param options
   *  `lockZOrder`: Toggle the binding on or off
   *
   */
  async function glueToDesktop(
    window: BrowserWindow,
    { lock: lockZOrder = true }: { lock?: boolean } = {},
  ) {
    user32.SetWindowPos(
      ref.types.int64.get(window.getNativeWindowHandle(), 0),
      FLAGS.HWND_BOTTOM,
      0,
      0,
      0,
      0,
      FLAGS.SWP_NOMOVE | FLAGS.SWP_NOSIZE | FLAGS.SWP_NOACTIVATE,
    )

    /**
     *
     * @param wParam not used
     * @param lParam pointer to `WINDOWPOS` structure
     */
    function onMsgWindowPosChanging(wParam: Buffer, lParam: Buffer): void {
      let lParam2 = Buffer.alloc(8)
      lParam2.type = ref.refType(WINDOWPOS)
      lParam.copy(lParam2)
      let actualStructDataBuffer = lParam2.deref(lParam2)
      let windowPos: WINDOWPOS_node = actualStructDataBuffer.deref(
        actualStructDataBuffer,
      )

      if (lockZOrder) {
        let newFlags = windowPos.flags | FLAGS.SWP_NOZORDER
        actualStructDataBuffer.writeUInt32LE(newFlags, 6)
      }
    }

    window.hookWindowMessage(
      FLAGS.WM_WINDOWPOSCHANGING,
      onMsgWindowPosChanging as () => void,
    )
  }

  // -- Return API ---------------------------------------------

  return Object.freeze({ glueToDesktop })
}
