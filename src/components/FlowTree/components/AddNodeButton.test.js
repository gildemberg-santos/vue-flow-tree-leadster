import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddNodeButton from './AddNodeButton.vue'

function mountComponent(props = {}) {
  return mount(AddNodeButton, { props })
}

describe('AddNodeButton', () => {
  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o botão com a classe correta', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.add-node-btn').exists()).toBe(true)
  })

  it('renderiza o SVG do ícone de adição', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('line')).toHaveLength(2)
  })

  it('tem o atributo title correto', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.add-node-btn').attributes('title')).toBe('Adicionar nó')
  })

  it('emite evento click ao clicar no botão', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.add-node-btn').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emite evento click uma única vez por clique', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.add-node-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('não emite evento sem interação', () => {
    const wrapper = mountComponent()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('pode ser clicado múltiplas vezes', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.add-node-btn').trigger('click')
    await wrapper.find('.add-node-btn').trigger('click')
    await wrapper.find('.add-node-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(3)
  })
})
