import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeButton from './ThemeButton.vue'

function mountComponent(props = {}) {
  return mount(ThemeButton, {
    props: {
      isDark: true,
      ...props,
    },
  })
}

describe('ThemeButton', () => {
  it('monta sem erros', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o botão com a classe correta', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.theme-btn').exists()).toBe(true)
  })

  it('renderiza SVG quando isDark=true', () => {
    const wrapper = mountComponent({ isDark: true })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renderiza SVG quando isDark=false', () => {
    const wrapper = mountComponent({ isDark: false })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('exibe SVG de sol quando isDark=true', () => {
    const wrapper = mountComponent({ isDark: true })
    expect(wrapper.findAll('circle')).toHaveLength(1)
    expect(wrapper.findAll('line')).toHaveLength(8)
  })

  it('exibe SVG de lua quando isDark=false', () => {
    const wrapper = mountComponent({ isDark: false })
    expect(wrapper.findAll('path')).toHaveLength(1)
  })

  it('tem title "Tema claro" quando isDark=true', () => {
    const wrapper = mountComponent({ isDark: true })
    expect(wrapper.find('.theme-btn').attributes('title')).toBe('Tema claro')
  })

  it('tem title "Tema escuro" quando isDark=false', () => {
    const wrapper = mountComponent({ isDark: false })
    expect(wrapper.find('.theme-btn').attributes('title')).toBe('Tema escuro')
  })

  it('emite evento click ao clicar no botão', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.theme-btn').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emite evento click uma única vez por clique', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.theme-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('não emite evento sem interação', () => {
    const wrapper = mountComponent()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('pode ser clicado múltiplas vezes', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.theme-btn').trigger('click')
    await wrapper.find('.theme-btn').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })
})
