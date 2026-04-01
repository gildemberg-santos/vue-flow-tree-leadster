/**
 * Emula o evento `dblclick` em dispositivos touch via detecção de double-tap.
 * Dois toques em menos de 300ms disparam um MouseEvent dblclick no elemento.
 */
export function useTouchDoubleTap() {
  let lastTap = 0

  function onTouchEnd(e) {
    const now = Date.now()
    if (now - lastTap < 300) {
      e.preventDefault()
      e.currentTarget.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    }
    lastTap = now
  }

  return { onTouchEnd }
}
