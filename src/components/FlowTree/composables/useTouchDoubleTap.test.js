import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTouchDoubleTap } from './useTouchDoubleTap'

describe('useTouchDoubleTap', () => {
  let mockEvent

  beforeEach(() => {
    mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: {
        dispatchEvent: vi.fn(),
      },
    }
    vi.useRealTimers()
  })

  it('retorna onTouchEnd como função', () => {
    const { onTouchEnd } = useTouchDoubleTap()
    expect(typeof onTouchEnd).toBe('function')
  })

  it('retorna objeto com propriedade onTouchEnd', () => {
    const result = useTouchDoubleTap()
    expect(result).toHaveProperty('onTouchEnd')
  })

  describe('onTouchEnd', () => {
    it('não dispara dblclick em primeiro toque', () => {
      const originalDateNow = Date.now
      Date.now = vi.fn().mockReturnValue(1000)
      
      const { onTouchEnd } = useTouchDoubleTap()
      onTouchEnd(mockEvent)
      
      expect(mockEvent.currentTarget.dispatchEvent).not.toHaveBeenCalled()
      Date.now = originalDateNow
    })

    it('dispara dblclick em duplo toque dentro de 300ms', () => {
      const originalDateNow = Date.now
      Date.now = vi.fn()
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1100)
      
      const { onTouchEnd } = useTouchDoubleTap()
      onTouchEnd(mockEvent)
      onTouchEnd(mockEvent)
      
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.currentTarget.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dblclick',
          bubbles: true,
        })
      )
      Date.now = originalDateNow
    })

    it('não dispara dblclick em toques com mais de 300ms de intervalo', () => {
      const originalDateNow = Date.now
      Date.now = vi.fn()
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1500)
      
      const { onTouchEnd } = useTouchDoubleTap()
      onTouchEnd(mockEvent)
      onTouchEnd(mockEvent)
      
      expect(mockEvent.currentTarget.dispatchEvent).not.toHaveBeenCalled()
      Date.now = originalDateNow
    })

    it('atualiza lastTap após cada toque', () => {
      const originalDateNow = Date.now
      Date.now = vi.fn()
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1500)
        .mockReturnValueOnce(2000)
      
      const { onTouchEnd } = useTouchDoubleTap()
      onTouchEnd(mockEvent)
      onTouchEnd(mockEvent)
      onTouchEnd(mockEvent)
      
      expect(mockEvent.currentTarget.dispatchEvent).not.toHaveBeenCalled()
      Date.now = originalDateNow
    })

    it('dispara MouseEvent com propriedades corretas', () => {
      const originalDateNow = Date.now
      Date.now = vi.fn()
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1100)
      
      const { onTouchEnd } = useTouchDoubleTap()
      onTouchEnd(mockEvent)
      onTouchEnd(mockEvent)
      
      const dispatchedEvent = mockEvent.currentTarget.dispatchEvent.mock.calls[0][0]
      expect(dispatchedEvent.type).toBe('dblclick')
      expect(dispatchedEvent.bubbles).toBe(true)
      Date.now = originalDateNow
    })
  })
})
