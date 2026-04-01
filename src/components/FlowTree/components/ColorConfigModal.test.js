import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorConfigModal from './ColorConfigModal.vue'

const defaultColors = {
  1: { bg: '#ffffff', border: '#e5e7eb', text: '#111827' },
  2: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  3: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
}

const defaultSettings = {
  showValidationPanel: true,
  showControls: true,
}

function mountComponent(props = {}) {
  return mount(ColorConfigModal, {
    props: {
      colors: defaultColors,
      maxLevels: 3,
      settings: defaultSettings,
      ...props,
    },
  })
}

describe('ColorConfigModal', () => {
  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o modal-overlay', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
  })

  it('renderiza o título correto', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.modal-title').text()).toBe('Configurar Cores')
  })

  it('renderiza seção de níveis para cada nível configurado', () => {
    const wrapper = mountComponent({ maxLevels: 3 })
    expect(wrapper.findAll('.level-section')).toHaveLength(3)
  })

  it('renderiza seção de níveis com maxLevels=5', () => {
    const colors5 = {
      1: { bg: '#fff', border: '#000', text: '#000' },
      2: { bg: '#fff', border: '#000', text: '#000' },
      3: { bg: '#fff', border: '#000', text: '#000' },
      4: { bg: '#fff', border: '#000', text: '#000' },
      5: { bg: '#fff', border: '#000', text: '#000' },
    }
    const wrapper = mountComponent({ maxLevels: 5, colors: colors5 })
    expect(wrapper.findAll('.level-section')).toHaveLength(5)
  })

  it('renderiza preview do nível com cor de fundo correta', () => {
    const wrapper = mountComponent()
    const preview = wrapper.find('.level-preview')
    expect(preview.attributes('style')).toContain('rgb(255, 255, 255)')
  })

  it('renderiza level-name para nível 1 com "Raiz"', () => {
    const wrapper = mountComponent()
    expect(wrapper.findAll('.level-name')[0].text()).toContain('Raiz')
  })

  it('renderiza level-name para nível final com "Final"', () => {
    const wrapper = mountComponent()
    const names = wrapper.findAll('.level-name')
    expect(names.at(-1).text()).toContain('Final')
  })

  it('renderiza level-name para nível intermediário', () => {
    const wrapper = mountComponent({ maxLevels: 5 })
    const names = wrapper.findAll('.level-name')
    expect(names[2].text()).toContain('Intermediário')
  })

  it('renderiza inputs de cor para cada campo', () => {
    const wrapper = mountComponent()
    const colorInputs = wrapper.findAll('input[type="color"]')
    expect(colorInputs).toHaveLength(9)
  })

  it('exibe valores hexadecimais', () => {
    const wrapper = mountComponent()
    const hexValues = wrapper.findAll('.hex-value')
    expect(hexValues[0].text()).toBe('#ffffff')
  })

  it('renderiza seção de visualização', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.view-section').exists()).toBe(true)
  })

  it('renderiza toggles para validação e controles', () => {
    const wrapper = mountComponent()
    const toggles = wrapper.findAll('.toggle-btn')
    expect(toggles).toHaveLength(2)
  })

  it('toggle de validação reflete showValidationPanel inicial', () => {
    const wrapper = mountComponent({ settings: { ...defaultSettings, showValidationPanel: false } })
    const validationToggle = wrapper.findAll('.toggle-btn')[0]
    expect(validationToggle.classes()).not.toContain('active')
  })

  it('toggle de controles reflete showControls inicial', () => {
    const wrapper = mountComponent({ settings: { ...defaultSettings, showControls: false } })
    const controlsToggle = wrapper.findAll('.toggle-btn')[1]
    expect(controlsToggle.classes()).not.toContain('active')
  })

  it('alterna toggle ao clicar', async () => {
    const wrapper = mountComponent({ settings: { showValidationPanel: false, showControls: true } })
    const toggle = wrapper.findAll('.toggle-btn')[0]
    await toggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(toggle.classes()).toContain('active')
  })

  it('emite close ao clicar no overlay', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('não emite close ao clicar no modal', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.modal').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('emite close ao clicar no botão cancelar', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.cancel-btn').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emite save com cores e settings ao clicar em salvar', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.save-btn').trigger('click')
    const emitted = wrapper.emitted('save')
    expect(emitted).toBeTruthy()
    const [payload] = emitted[0]
    expect(payload.colors).toBeDefined()
    expect(payload.settings).toBeDefined()
  })

  it('payload de save contém todas as cores', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.save-btn').trigger('click')
    const [payload] = wrapper.emitted('save')[0]
    expect(Object.keys(payload.colors)).toHaveLength(3)
  })

  it('payload de save contém settings', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.save-btn').trigger('click')
    const [payload] = wrapper.emitted('save')[0]
    expect(payload.settings.showValidationPanel).toBe(true)
    expect(payload.settings.showControls).toBe(true)
  })

  it('botão reset existe', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.reset-btn').exists()).toBe(true)
  })

  it('botão reset não emite save', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.reset-btn').trigger('click')
    expect(wrapper.emitted('save')).toBeUndefined()
  })

  it('reset não fecha o modal', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.reset-btn').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('renderiza divider entre cores e visualização', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.divider').exists()).toBe(true)
  })

  it('label "Restaurar padrão" está presente', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.reset-btn').text()).toBe('Restaurar padrão')
  })

  it('label "Cancelar" está presente', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.cancel-btn').text()).toBe('Cancelar')
  })

  it('label "Salvar" está presente', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.save-btn').text()).toBe('Salvar')
  })

  it('section-label "Visualização" está presente', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.section-label').text()).toBe('Visualização')
  })

  it('toggle-labels corretos', () => {
    const wrapper = mountComponent()
    const labels = wrapper.findAll('.toggle-label')
    expect(labels[0].text()).toBe('Painel de validação')
    expect(labels[1].text()).toBe('Controles')
  })
})
