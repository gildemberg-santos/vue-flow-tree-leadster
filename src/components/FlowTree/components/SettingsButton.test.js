import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsButton from './SettingsButton.vue'

function mountComponent(props = {}) {
  return mount(SettingsButton, { props })
}

describe('SettingsButton', () => {
  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o botão com a classe correta', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.settings-btn').exists()).toBe(true)
  })

  it('renderiza o SVG do ícone de configurações', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('circle')).toHaveLength(1)
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('tem o atributo title correto', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.settings-btn').attributes('title')).toBe('Configurar cores')
  })

  it('emite evento click ao clicar no botão', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.settings-btn').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emite evento click uma única vez por clique', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.settings-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('não emite evento sem interação', () => {
    const wrapper = mountComponent()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('pode ser clicado múltiplas vezes', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.settings-btn').trigger('click')
    await wrapper.find('.settings-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })
})
