import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationToast from './NotificationToast.vue'

function mountComponent(props = {}) {
  return mount(NotificationToast, {
    props: {
      saveStatus: '',
      ...props,
    },
  })
}

describe('NotificationToast', () => {
  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('não exibe toast quando saveStatus está vazio', () => {
    const wrapper = mountComponent({ saveStatus: '' })
    expect(wrapper.find('.toast').exists()).toBe(false)
  })

  it('não exibe toast quando saveStatus é undefined', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.toast').exists()).toBe(false)
  })

  describe('estado loading', () => {
    it('exibe toast quando saveStatus é "loading"', () => {
      const wrapper = mountComponent({ saveStatus: 'loading' })
      expect(wrapper.find('.toast').exists()).toBe(true)
    })

    it('exibe classe loading', () => {
      const wrapper = mountComponent({ saveStatus: 'loading' })
      expect(wrapper.find('.toast').classes()).toContain('loading')
    })

    it('exibe spinner', () => {
      const wrapper = mountComponent({ saveStatus: 'loading' })
      expect(wrapper.find('.toast-spinner').exists()).toBe(true)
    })

    it('não exibe ícone quando loading', () => {
      const wrapper = mountComponent({ saveStatus: 'loading' })
      expect(wrapper.find('.toast-icon').exists()).toBe(false)
    })

    it('exibe texto correto', () => {
      const wrapper = mountComponent({ saveStatus: 'loading' })
      expect(wrapper.find('.toast-text').text()).toBe('Carregando dados...')
    })
  })

  describe('estado saving', () => {
    it('exibe toast quando saveStatus é "saving"', () => {
      const wrapper = mountComponent({ saveStatus: 'saving' })
      expect(wrapper.find('.toast').exists()).toBe(true)
    })

    it('exibe classe saving', () => {
      const wrapper = mountComponent({ saveStatus: 'saving' })
      expect(wrapper.find('.toast').classes()).toContain('saving')
    })

    it('exibe spinner', () => {
      const wrapper = mountComponent({ saveStatus: 'saving' })
      expect(wrapper.find('.toast-spinner').exists()).toBe(true)
    })

    it('exibe texto correto', () => {
      const wrapper = mountComponent({ saveStatus: 'saving' })
      expect(wrapper.find('.toast-text').text()).toBe('Salvando...')
    })
  })

  describe('estado saved', () => {
    it('exibe toast quando saveStatus é "saved"', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      expect(wrapper.find('.toast').exists()).toBe(true)
    })

    it('exibe classe saved', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      expect(wrapper.find('.toast').classes()).toContain('saved')
    })

    it('exibe ícone de check', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      expect(wrapper.find('.toast-icon').exists()).toBe(true)
      expect(wrapper.find('.toast-icon').text()).toBe('✓')
    })

    it('não exibe spinner', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      expect(wrapper.find('.toast-spinner').exists()).toBe(false)
    })

    it('exibe texto correto', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      expect(wrapper.find('.toast-text').text()).toBe('Salvo automaticamente')
    })
  })

  describe('estado error', () => {
    it('exibe toast quando saveStatus é "error"', () => {
      const wrapper = mountComponent({ saveStatus: 'error' })
      expect(wrapper.find('.toast').exists()).toBe(true)
    })

    it('exibe classe error', () => {
      const wrapper = mountComponent({ saveStatus: 'error' })
      expect(wrapper.find('.toast').classes()).toContain('error')
    })

    it('exibe ícone de X', () => {
      const wrapper = mountComponent({ saveStatus: 'error' })
      expect(wrapper.find('.toast-icon').exists()).toBe(true)
      expect(wrapper.find('.toast-icon').text()).toBe('✕')
    })

    it('não exibe spinner', () => {
      const wrapper = mountComponent({ saveStatus: 'error' })
      expect(wrapper.find('.toast-spinner').exists()).toBe(false)
    })

    it('exibe texto correto', () => {
      const wrapper = mountComponent({ saveStatus: 'error' })
      expect(wrapper.find('.toast-text').text()).toBe('Não salvo — fluxo inválido')
    })
  })

  describe('transições', () => {
    it('usa Transition com name toast', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      const html = wrapper.html()
      expect(html).toContain('name="toast"')
    })
  })

  describe('posicionamento', () => {
    it('toast tem classe toast', () => {
      const wrapper = mountComponent({ saveStatus: 'saved' })
      expect(wrapper.find('.toast').exists()).toBe(true)
    })
  })
})
