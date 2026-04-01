import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SaveButton from './SaveButton.vue'

function mountComponent(props = {}) {
  return mount(SaveButton, {
    props: {
      disabled: false,
      ...props,
    },
  })
}

describe('SaveButton', () => {
  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o botão com a classe correta', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.save-btn').exists()).toBe(true)
  })

  it('renderiza o SVG do ícone de salvar', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('path')).toHaveLength(1)
    expect(wrapper.findAll('polyline')).toHaveLength(2)
  })

  it('tem o atributo title correto', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.save-btn').attributes('title')).toBe('Salvar')
  })

  it('não está desabilitado por padrão', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.save-btn').attributes('disabled')).toBeUndefined()
  })

  it('está desabilitado quando disabled=true', () => {
    const wrapper = mountComponent({ disabled: true })
    expect(wrapper.find('.save-btn').attributes('disabled')).toBeDefined()
  })

  it('não está desabilitado quando disabled=false', () => {
    const wrapper = mountComponent({ disabled: false })
    expect(wrapper.find('.save-btn').attributes('disabled')).toBeUndefined()
  })

  it('emite evento click ao clicar no botão', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emite evento click uma única vez por clique', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('não emite evento sem interação', () => {
    const wrapper = mountComponent()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('pode ser clicado múltiplas vezes', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.save-btn').trigger('click')
    await wrapper.find('.save-btn').trigger('click')
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(3)
  })

  it('não emite click quando está desabilitado', async () => {
    const wrapper = mountComponent({ disabled: true })
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
