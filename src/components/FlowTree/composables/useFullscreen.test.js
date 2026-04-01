import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useFullscreen } from './useFullscreen'

const TestComponent = defineComponent({
  setup() {
    const { isFullscreen, toggleFullscreen } = useFullscreen()
    return { isFullscreen, toggleFullscreen }
  },
  render() {
    return h('div')
  }
})

describe('useFullscreen', () => {
  let originalDocument
  let addEventListenerSpy
  let removeEventListenerSpy

  beforeEach(() => {
    originalDocument = document.fullscreenElement
    addEventListenerSpy = vi.fn()
    removeEventListenerSpy = vi.fn()
    
    Object.defineProperty(document, 'fullscreenElement', {
      get: () => null,
      set: vi.fn(),
      configurable: true,
    })
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: vi.fn(),
      configurable: true,
    })
    Object.defineProperty(document, 'exitFullscreen', {
      value: vi.fn(),
      configurable: true,
    })
    document.addEventListener = addEventListenerSpy
    document.removeEventListener = removeEventListenerSpy
  })

  afterEach(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      value: originalDocument,
      configurable: true,
    })
  })

  it('retorna isFullscreen como ref inicializado com false', () => {
    const { isFullscreen } = useFullscreen()
    expect(isFullscreen.value).toBe(false)
  })

  it('retorna toggleFullscreen como função', () => {
    const { toggleFullscreen } = useFullscreen()
    expect(typeof toggleFullscreen).toBe('function')
  })

  it('retorna objeto com propriedades esperadas', () => {
    const result = useFullscreen()
    expect(result).toHaveProperty('isFullscreen')
    expect(result).toHaveProperty('toggleFullscreen')
  })

  describe('toggleFullscreen', () => {
    it('chama requestFullscreen quando não está em fullscreen', () => {
      const { toggleFullscreen } = useFullscreen()
      toggleFullscreen()
      expect(document.documentElement.requestFullscreen).toHaveBeenCalled()
    })

    it('chama exitFullscreen quando está em fullscreen', () => {
      Object.defineProperty(document, 'fullscreenElement', {
        get: () => document.body,
        set: vi.fn(),
        configurable: true,
      })
      const { toggleFullscreen } = useFullscreen()
      toggleFullscreen()
      expect(document.exitFullscreen).toHaveBeenCalled()
    })
  })

  describe('componente mounted', () => {
    let wrapper

    afterEach(() => {
      wrapper?.unmount()
    })

    it('adiciona listener fullscreenchange ao montar', () => {
      wrapper = mount(TestComponent)
      expect(addEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))
    })

    it('remove listener fullscreenchange ao desmontar', () => {
      wrapper = mount(TestComponent)
      wrapper.unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))
    })
  })
})
