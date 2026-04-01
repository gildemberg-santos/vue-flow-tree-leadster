import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ValidationPanel from './ValidationPanel.vue'

const defaultValidation = {
  valid: true,
  errors: [],
  suggestions: [],
}

function mountComponent(props = {}) {
  return mount(ValidationPanel, {
    props: {
      validation: defaultValidation,
      maxLevels: 3,
      templates: [],
      showMiniMap: false,
      ...props,
    },
  })
}

describe('ValidationPanel', () => {
  let wrapper

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
    Object.defineProperty(window, 'addEventListener', { value: vi.fn() })
    Object.defineProperty(window, 'removeEventListener', { value: vi.fn() })
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o painel com classe validation-panel', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.validation-panel').exists()).toBe(true)
  })

  describe('classes de estado', () => {
    it('tem classe valid quando validation.valid é true', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, valid: true } })
      expect(wrapper.find('.validation-panel').classes()).toContain('valid')
    })

    it('tem classe invalid quando validation.valid é false', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, valid: false } })
      expect(wrapper.find('.validation-panel').classes()).toContain('invalid')
    })

    it('tem classe panel-desktop quando largura >= 600', () => {
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
      const wrapper = mountComponent()
      expect(wrapper.find('.validation-panel').classes()).toContain('panel-desktop')
    })
  })

  describe('título e status', () => {
    it('exibe título "Fluxo Válido" quando válido', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, valid: true } })
      expect(wrapper.find('.title-text').text()).toBe('Fluxo Válido')
    })

    it('exibe título "Fluxo Inválido" quando inválido', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, valid: false } })
      expect(wrapper.find('.title-text').text()).toBe('Fluxo Inválido')
    })

    it('exibe dot-valid quando válido', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, valid: true } })
      expect(wrapper.find('.status-dot').classes()).toContain('dot-valid')
    })

    it('exibe dot-invalid quando inválido', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, valid: false } })
      expect(wrapper.find('.status-dot').classes()).toContain('dot-invalid')
    })
  })

  describe('erros', () => {
    it('não exibe seção de erros quando não há erros', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, errors: [] } })
      expect(wrapper.find('.error-item').exists()).toBe(false)
    })

    it('exibe seção de erros quando há erros', () => {
      const wrapper = mountComponent({
        validation: { ...defaultValidation, valid: false, errors: ['Erro 1', 'Erro 2'] },
      })
      expect(wrapper.findAll('.error-item')).toHaveLength(2)
    })

    it('exibe texto correto do erro', () => {
      const wrapper = mountComponent({
        validation: { ...defaultValidation, errors: ['Nó órfão encontrado'] },
      })
      expect(wrapper.find('.error-item').text()).toBe('Nó órfão encontrado')
    })
  })

  describe('sugestões', () => {
    it('não exibe seção de sugestões quando não há sugestões', () => {
      const wrapper = mountComponent({ validation: { ...defaultValidation, suggestions: [] } })
      expect(wrapper.find('.suggestion-item').exists()).toBe(false)
    })

    it('exibe seção de sugestões quando há sugestões', () => {
      const wrapper = mountComponent({
        validation: { ...defaultValidation, suggestions: ['Sugestão 1', 'Sugestão 2'] },
      })
      expect(wrapper.findAll('.suggestion-item')).toHaveLength(2)
    })

    it('exibe texto correto da sugestão', () => {
      const wrapper = mountComponent({
        validation: { ...defaultValidation, suggestions: ['Considere adicionar mais níveis'] },
      })
      expect(wrapper.find('.suggestion-item').text()).toBe('Considere adicionar mais níveis')
    })
  })

  describe('legenda de níveis', () => {
    it('exibe todos os níveis', () => {
      const wrapper = mountComponent({ maxLevels: 3 })
      expect(wrapper.findAll('.legend-item')).toHaveLength(3)
    })

    it('nível 1 exibe "Raiz"', () => {
      const wrapper = mountComponent({ maxLevels: 3 })
      expect(wrapper.findAll('.legend-item')[0].text()).toContain('Raiz')
    })

    it('nível final exibe "Final"', () => {
      const wrapper = mountComponent({ maxLevels: 3 })
      expect(wrapper.findAll('.legend-item')[2].text()).toContain('Final')
    })

    it('nível intermediário exibe "Intermediário"', () => {
      const wrapper = mountComponent({ maxLevels: 5 })
      expect(wrapper.findAll('.legend-item')[2].text()).toContain('Intermediário')
    })
  })

  describe('templates', () => {
    it('não exibe seção de templates quando array está vazio', () => {
      const wrapper = mountComponent({ templates: [] })
      expect(wrapper.find('.templates-section').exists()).toBe(false)
    })

    it('exibe seção de templates quando há templates', () => {
      const wrapper = mountComponent({
        templates: [{ id: 1, label: 'Template A', options: [] }],
      })
      expect(wrapper.find('.templates-section').exists()).toBe(true)
    })

    it('exibe nome do template', () => {
      const wrapper = mountComponent({
        templates: [{ id: 1, label: 'Template A', options: [] }],
      })
      expect(wrapper.find('.template-name').text()).toBe('Template A')
    })

    it('exibe badge com número de opções', () => {
      const wrapper = mountComponent({
        templates: [{ id: 1, label: 'A', options: [{ id: 1, label: 'Op' }] }],
      })
      expect(wrapper.find('.template-badge').text()).toBe('1 opções')
    })

    it('exibe "Sem saídas" quando não há opções', () => {
      const wrapper = mountComponent({
        templates: [{ id: 1, label: 'A', options: [] }],
      })
      expect(wrapper.find('.no-options').text()).toBe('Sem saídas')
    })

    it('exibe opções do template', () => {
      const wrapper = mountComponent({
        templates: [{
          id: 1,
          label: 'A',
          options: [{ id: 1, label: 'Opção 1' }, { id: 2, label: 'Opção 2' }],
        }],
      })
      expect(wrapper.findAll('.option-item')).toHaveLength(2)
    })
  })

  describe('responsividade mobile', () => {
    it('tem classe panel-mobile quando largura < 600', () => {
      Object.defineProperty(window, 'innerWidth', { value: 400, writable: true })
      const wrapper = mountComponent()
      expect(wrapper.find('.validation-panel').classes()).toContain('panel-mobile')
    })

    it('panel-scroll não está visível quando colapsado no mobile', () => {
      Object.defineProperty(window, 'innerWidth', { value: 400, writable: true })
      const wrapper = mountComponent()
      expect(wrapper.find('.panel-scroll').isVisible()).toBe(false)
    })
  })
})
