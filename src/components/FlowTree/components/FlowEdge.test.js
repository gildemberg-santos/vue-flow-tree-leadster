import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FlowEdge from './FlowEdge.vue'
import { getBezierPath } from '@vue-flow/core'

vi.mock('@vue-flow/core', () => ({
  BaseEdge: { name: 'BaseEdge', props: ['id', 'path', 'markerEnd', 'style'], template: '<div class="base-edge" />' },
  EdgeLabelRenderer: { name: 'EdgeLabelRenderer', template: '<div class="edge-label-renderer"><slot /></div>' },
  getBezierPath: vi.fn(() => ['M0,0 C50,0 50,100 100,100', 50, 50]),
}))

function mountComponent(props = {}, provide = {}) {
  return mount(FlowEdge, {
    props: {
      id: 'edge-1',
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: 'right',
      targetPosition: 'left',
      ...props,
    },
    global: {
      provide: { removeEdge: vi.fn(), ...provide },
    },
  })
}

describe('FlowEdge', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent()
  })

  it('monta sem erros', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza BaseEdge', () => {
    expect(wrapper.findComponent({ name: 'BaseEdge' }).exists()).toBe(true)
  })

  it('renderiza EdgeLabelRenderer', () => {
    expect(wrapper.findComponent({ name: 'EdgeLabelRenderer' }).exists()).toBe(true)
  })

  it('BaseEdge recebe id correto', () => {
    expect(wrapper.findComponent({ name: 'BaseEdge' }).props('id')).toBe('edge-1')
  })

  it('BaseEdge recebe path calculado', () => {
    expect(wrapper.findComponent({ name: 'BaseEdge' }).props('path')).toBe('M0,0 C50,0 50,100 100,100')
  })

  it('BaseEdge recebe markerEnd', () => {
    const wrapper = mountComponent({ markerEnd: 'url(#arrow)' })
    expect(wrapper.findComponent({ name: 'BaseEdge' }).props('markerEnd')).toBe('url(#arrow)')
  })

  it('BaseEdge recebe style', () => {
    const style = { stroke: '#ff0000', strokeWidth: 2 }
    const wrapper = mountComponent({ style })
    expect(wrapper.findComponent({ name: 'BaseEdge' }).props('style')).toEqual(style)
  })

  it('não exibe label quando não fornecido', () => {
    expect(wrapper.find('.edge-label').exists()).toBe(false)
  })

  it('exibe label quando fornecido', () => {
    const wrapper = mountComponent({ label: 'Conexão' })
    expect(wrapper.find('.edge-label').exists()).toBe(true)
    expect(wrapper.find('.edge-label').text()).toBe('Conexão')
  })

  it('não exibe botão delete quando não selecionado', () => {
    expect(wrapper.find('.edge-delete').exists()).toBe(false)
  })

  it('exibe botão delete quando selecionado', () => {
    const wrapper = mountComponent({ selected: true })
    expect(wrapper.find('.edge-delete').exists()).toBe(true)
  })

  it('botão delete tem símbolo ×', () => {
    const wrapper = mountComponent({ selected: true })
    expect(wrapper.find('.edge-delete').text()).toBe('×')
  })

  it('botão delete emite stop propagation no click', async () => {
    const wrapper = mountComponent({ selected: true })
    const removeEdge = wrapper.vm.$attrs['data-removeEdge']
    const btn = wrapper.find('.edge-delete')
    await btn.trigger('click')
  })

  it('chama removeEdge com id ao clicar no botão delete', async () => {
    const removeEdge = vi.fn()
    const wrapper = mountComponent({ selected: true }, { removeEdge })
    await wrapper.find('.edge-delete').trigger('click')
    expect(removeEdge).toHaveBeenCalledWith('edge-1')
  })

  it('chama removeEdge uma única vez', async () => {
    const removeEdge = vi.fn()
    const wrapper = mountComponent({ selected: true }, { removeEdge })
    await wrapper.find('.edge-delete').trigger('click')
    expect(removeEdge).toHaveBeenCalledTimes(1)
  })

  it('não exibe label sem selected e sem label', () => {
    expect(wrapper.findAll('.edge-label')).toHaveLength(0)
  })

  it('não exibe delete sem selected', () => {
    expect(wrapper.findAll('.edge-delete')).toHaveLength(0)
  })

  it('getBezierPath é chamado com props corretas', () => {
    getBezierPath.mockClear()
    mountComponent({
      sourceX: 10,
      sourceY: 20,
      sourcePosition: 'top',
      targetX: 30,
      targetY: 40,
      targetPosition: 'bottom',
    })
    expect(getBezierPath).toHaveBeenCalledWith({
      sourceX: 10,
      sourceY: 20,
      sourcePosition: 'top',
      targetX: 30,
      targetY: 40,
      targetPosition: 'bottom',
    })
  })

  it('renderiza múltiplas instâncias com ids diferentes', () => {
    const wrapper1 = mountComponent({ id: 'edge-1' })
    const wrapper2 = mountComponent({ id: 'edge-2' })
    expect(wrapper1.findComponent({ name: 'BaseEdge' }).props('id')).toBe('edge-1')
    expect(wrapper2.findComponent({ name: 'BaseEdge' }).props('id')).toBe('edge-2')
  })
})
