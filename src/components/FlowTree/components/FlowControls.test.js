import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import FlowControls from './FlowControls.vue'

vi.mock('@vue-flow/controls', () => ({
  Controls: { name: 'Controls', template: '<div class="controls-stub"><slot /></div>' },
  ControlButton: { name: 'ControlButton', template: '<button class="control-btn-stub"><slot /></button>' },
}))

vi.mock('../composables/useFullscreen', () => {
  const state = reactive({ fullscreen: false })
  return {
    useFullscreen: vi.fn(() => ({
      get isFullscreen() { return state.fullscreen },
      set isFullscreen(value) { state.fullscreen = value },
      toggleFullscreen: vi.fn(),
    })),
    _setFullscreen: (value) => { state.fullscreen = value }
  }
})

describe('FlowControls', () => {
  let wrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../composables/useFullscreen')
    mod._setFullscreen(false)
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('monta sem erros', () => {
    wrapper = mount(FlowControls)
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza Controls', () => {
    wrapper = mount(FlowControls)
    expect(wrapper.findComponent({ name: 'Controls' }).exists()).toBe(true)
  })

  it('renderiza ControlButton para fullscreen', () => {
    wrapper = mount(FlowControls)
    expect(wrapper.findComponent({ name: 'ControlButton' }).exists()).toBe(true)
  })

  it('renderiza SVG para entrar em tela cheia por padrão', () => {
    wrapper = mount(FlowControls)
    const polylines = wrapper.findAll('polyline')
    expect(polylines.length).toBeGreaterThan(0)
  })

  it('tem atributo title correto quando não está em fullscreen', () => {
    wrapper = mount(FlowControls)
    const btn = wrapper.find('.control-btn-stub')
    expect(btn.attributes('title')).toBe('Tela cheia')
  })

  it('tem atributo title correto quando está em fullscreen', async () => {
    const mod = await import('../composables/useFullscreen')
    mod._setFullscreen(true)
    wrapper = mount(FlowControls)
    await nextTick()
    const btn = wrapper.find('.control-btn-stub')
    expect(btn.attributes('title')).toBe('Sair da tela cheia')
  })
})
