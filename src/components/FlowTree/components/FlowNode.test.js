import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FlowNode from './FlowNode.vue'

const mockEdges = [
  { source: 'node-1', target: 'node-2' },
  { source: 'node-1', target: 'node-3' },
  { source: 'node-2', target: 'node-4' },
]

vi.mock('@vue-flow/core', () => ({
  Handle: {
    name: 'Handle',
    props: ['type', 'position'],
    template: '<div class="handle" :type="type" :position="position" />',
  },
  Position: { Top: 'top', Bottom: 'bottom' },
  useVueFlow: vi.fn(() => ({ edges: { value: mockEdges } })),
}))

vi.mock('../composables/useTouchDoubleTap', () => ({
  useTouchDoubleTap: vi.fn(() => ({
    onTouchEnd: vi.fn(),
  })),
}))

function mountComponent(props = {}, provide = {}) {
  return mount(FlowNode, {
    props: {
      id: 'node-1',
      data: { level: 1, label: 'Node 1', maxConnections: 3, templateId: 1 },
      selected: false,
      ...props,
    },
    global: {
      provide: { deleteNodeById: vi.fn(), ...provide },
    },
  })
}

describe('FlowNode', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent()
  })

  it('monta sem erros', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o container do nó', () => {
    expect(wrapper.find('.flow-node').exists()).toBe(true)
  })

  it('renderiza Handles para target e source', () => {
    const handles = wrapper.findAll('.handle')
    expect(handles).toHaveLength(2)
  })

  it('renderiza badge com nível correto', () => {
    expect(wrapper.find('.node-badge').text()).toBe('N1')
  })

  it('renderiza label correto', () => {
    expect(wrapper.find('.node-label').text()).toBe('Node 1')
  })

  it('não exibe warning quando templateId não é null', () => {
    expect(wrapper.find('.node-warn').exists()).toBe(false)
  })

  it('exibe warning quando templateId é null', () => {
    const wrapper = mountComponent({ data: { level: 1, label: 'Test', templateId: null } })
    expect(wrapper.find('.node-warn').exists()).toBe(true)
  })

  it('exibe warning com símbolo !', () => {
    const wrapper = mountComponent({ data: { level: 1, label: 'Test', templateId: null } })
    expect(wrapper.find('.node-warn').text()).toBe('!')
  })

  it('não exibe contador de conexões quando maxConnections é null', () => {
    const wrapper = mountComponent({ data: { level: 1, label: 'Test', maxConnections: null } })
    expect(wrapper.find('.node-connections').exists()).toBe(false)
  })

  it('exibe contador de conexões quando maxConnections é definido', () => {
    expect(wrapper.find('.node-connections').exists()).toBe(true)
  })

  it('contador mostra número correto de conexões', () => {
    expect(wrapper.find('.node-connections').text()).toContain('2/3')
  })

  it('contador não tem classe full quando abaixo do máximo', () => {
    expect(wrapper.find('.node-connections').classes()).not.toContain('full')
  })

  it('contador tem classe full quando no máximo', () => {
    const wrapper = mountComponent({
      id: 'node-2',
      data: { level: 1, label: 'Node 2', maxConnections: 1 },
    })
    expect(wrapper.find('.node-connections').classes()).toContain('full')
  })

  it('não exibe botão delete quando não selecionado', () => {
    expect(wrapper.find('.node-delete').exists()).toBe(false)
  })

  it('exibe botão delete quando selecionado', () => {
    const wrapper = mountComponent({ selected: true })
    expect(wrapper.find('.node-delete').exists()).toBe(true)
  })

  it('botão delete tem símbolo ×', () => {
    const wrapper = mountComponent({ selected: true })
    expect(wrapper.find('.node-delete').text()).toBe('×')
  })

  it('chama deleteNodeById com id ao clicar no botão delete', async () => {
    const deleteNodeById = vi.fn()
    const wrapper = mountComponent({ selected: true }, { deleteNodeById })
    await wrapper.find('.node-delete').trigger('click')
    expect(deleteNodeById).toHaveBeenCalledWith('node-1')
  })

  it('chama deleteNodeById uma única vez', async () => {
    const deleteNodeById = vi.fn()
    const wrapper = mountComponent({ selected: true }, { deleteNodeById })
    await wrapper.find('.node-delete').trigger('click')
    expect(deleteNodeById).toHaveBeenCalledTimes(1)
  })

  it('botão delete emite stop propagation no click', async () => {
    const deleteNodeById = vi.fn()
    const wrapper = mountComponent({ selected: true }, { deleteNodeById })
    await wrapper.find('.node-delete').trigger('click.stop')
  })

  it('aplica estilos CSS com variáveis para cores', () => {
    const node = wrapper.find('.flow-node')
    expect(node.attributes('style')).toContain('var(--level-1-bg)')
    expect(node.attributes('style')).toContain('var(--level-1-border)')
    expect(node.attributes('style')).toContain('var(--level-1-text)')
  })

  it('renderiza badge no canto superior direito', () => {
    const badge = wrapper.find('.node-badge')
    expect(badge.exists()).toBe(true)
  })

  it('Handles são renderizados com tipo target e source', () => {
    const handles = wrapper.findAll('.handle')
    const types = handles.map(h => h.attributes('type'))
    const positions = handles.map(h => h.attributes('position'))
    expect(types).toContain('target')
    expect(types).toContain('source')
    expect(positions).toContain('top')
    expect(positions).toContain('bottom')
  })

  it('dispara onTouchEnd ao trigger touchend', async () => {
    const { useTouchDoubleTap } = await import('../composables/useTouchDoubleTap')
    const onTouchEnd = vi.fn()
    useTouchDoubleTap.mockReturnValue({ onTouchEnd })
    const wrapper = mountComponent()
    await wrapper.find('.flow-node').trigger('touchend')
    expect(onTouchEnd).toHaveBeenCalled()
  })
})
