import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConnectionOptionModal from './ConnectionOptionModal.vue'

const options = [
  { id: 1, label: 'Opção A' },
  { id: 2, label: 'Opção B' },
  { id: 3, label: 'Opção C' },
]

function mountComponent(props = {}) {
  return mount(ConnectionOptionModal, {
    props: { options, ...props },
  })
}

describe('ConnectionOptionModal', () => {
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
    expect(wrapper.find('.modal-title').text()).toBe('Selecione uma opção')
  })

  it('renderiza o subtítulo correto', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.modal-subtitle').text()).toBe('Escolha qual opção esta conexão representa.')
  })

  it('renderiza todos os botões de opção', () => {
    const wrapper = mountComponent()
    expect(wrapper.findAll('.option-btn')).toHaveLength(3)
  })

  it('renderiza label correto para cada opção', () => {
    const wrapper = mountComponent()
    const buttons = wrapper.findAll('.option-btn')
    expect(buttons[0].text()).toBe('Opção A')
    expect(buttons[1].text()).toBe('Opção B')
    expect(buttons[2].text()).toBe('Opção C')
  })

  it('renderiza botão cancelar', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.cancel-btn').exists()).toBe(true)
  })

  it('label do botão cancelar', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.cancel-btn').text()).toBe('Cancelar')
  })

  it('emite confirm com id da opção ao clicar', async () => {
    const wrapper = mountComponent()
    await wrapper.findAll('.option-btn')[1].trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')[0][0]).toBe(2)
  })

  it('emite confirm com id correto para primeira opção', async () => {
    const wrapper = mountComponent()
    await wrapper.findAll('.option-btn')[0].trigger('click')
    expect(wrapper.emitted('confirm')[0][0]).toBe(1)
  })

  it('emite confirm com id correto para última opção', async () => {
    const wrapper = mountComponent()
    await wrapper.findAll('.option-btn')[2].trigger('click')
    expect(wrapper.emitted('confirm')[0][0]).toBe(3)
  })

  it('emite cancel ao clicar no overlay', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('não emite cancel ao clicar no modal', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.modal').trigger('click')
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('emite cancel ao clicar no botão cancelar', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.cancel-btn').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('renderiza lista vazia quando não há opções', () => {
    const wrapper = mountComponent({ options: [] })
    expect(wrapper.findAll('.option-btn')).toHaveLength(0)
  })

  it('renderiza uma única opção', () => {
    const wrapper = mountComponent({ options: [{ id: 99, label: 'Única' }] })
    expect(wrapper.findAll('.option-btn')).toHaveLength(1)
    expect(wrapper.find('.option-btn').text()).toBe('Única')
  })

  it('não emite eventos sem interação', () => {
    const wrapper = mountComponent()
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })
})
