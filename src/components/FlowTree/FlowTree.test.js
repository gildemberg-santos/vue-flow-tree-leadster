import { vi, beforeEach, describe, it, expect } from 'vitest'
import { ref, computed, nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { MiniMap } from '@vue-flow/minimap'

// ── Mocks de módulos (hoistados antes dos imports) ────────────────────────────
vi.mock('./composables/useFlowTree', () => ({ useFlowTree: vi.fn() }))
vi.mock('./composables/useFlowColors', () => ({ useFlowColors: vi.fn() }))
vi.mock('./composables/useFlowTheme', () => ({ useFlowTheme: vi.fn() }))
vi.mock('./composables/useFlowSettings', () => ({ useFlowSettings: vi.fn() }))

vi.mock('@vue-flow/core', () => ({
  VueFlow: { name: 'VueFlow', props: ['nodes', 'edges'], template: '<div><slot /></div>' },
  useVueFlow: vi.fn(() => ({ getViewport: vi.fn(), edges: ref([]) })),
  Handle: { name: 'Handle', template: '<div />' },
  Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
  BaseEdge: { name: 'BaseEdge', template: '<g />' },
  EdgeLabelRenderer: { name: 'EdgeLabelRenderer', template: '<div><slot /></div>' },
  getBezierPath: vi.fn(() => ['M0,0', 0, 0]),
}))

vi.mock('@vue-flow/background', () => ({
  Background: { name: 'Background', template: '<div />' },
}))

vi.mock('@vue-flow/minimap', () => ({
  MiniMap: { name: 'MiniMap', template: '<div />' },
}))

vi.mock('@vue-flow/controls', () => ({
  Controls: { name: 'Controls', template: '<div><slot /></div>' },
  ControlButton: { name: 'ControlButton', template: '<button />' },
}))

// ── Imports após os mocks ─────────────────────────────────────────────────────
import FlowTree from './FlowTree.vue'
import { useFlowTree } from './composables/useFlowTree'
import { useFlowColors } from './composables/useFlowColors'
import { useFlowTheme } from './composables/useFlowTheme'
import { useFlowSettings } from './composables/useFlowSettings'

import FlowCanvas from './components/FlowCanvas.vue'
import AddNodeButton from './components/AddNodeButton.vue'
import SaveButton from './components/SaveButton.vue'
import ThemeButton from './components/ThemeButton.vue'
import SettingsButton from './components/SettingsButton.vue'
import ValidationPanel from './components/ValidationPanel.vue'
import NodeEditModal from './components/NodeEditModal.vue'
import ColorConfigModal from './components/ColorConfigModal.vue'
import ConnectionOptionModal from './components/ConnectionOptionModal.vue'

// ── Factories de mock ─────────────────────────────────────────────────────────
function makeFlowTreeMock(overrides = {}) {
  return {
    nodes: ref([]),
    edges: ref([]),
    validation: computed(() => ({ valid: true, errors: [], suggestions: [] })),
    saveStatus: ref(''),
    manualSave: vi.fn(),
    showAddModal: ref(false),
    addForm: ref({ label: '', level: 3, maxConnections: null }),
    addNodeError: ref(''),
    openAddModal: vi.fn(),
    addNode: vi.fn(),
    onNodeClick: vi.fn(),
    onNodeDragStop: vi.fn(),
    onNodeDoubleClick: vi.fn(),
    onConnect: vi.fn(),
    editingNode: ref(null),
    editForm: ref({ label: '', level: 2, maxConnections: null }),
    editNodeError: ref(''),
    saveEdit: vi.fn(),
    deleteNodeById: vi.fn(),
    removeEdge: vi.fn(),
    pendingConnection: ref(null),
    pendingOptions: computed(() => []),
    confirmConnection: vi.fn(),
    cancelConnection: vi.fn(),
    ...overrides,
  }
}

function makeSettingsMock(overrides = {}) {
  return {
    settings: ref({ showMiniMap: false, showValidationPanel: true, showControls: true, ...overrides }),
    saveSettings: vi.fn(),
  }
}

// ── Setup global de mocks ─────────────────────────────────────────────────────
let ftMock

beforeEach(() => {
  ftMock = makeFlowTreeMock()
  useFlowTree.mockReturnValue(ftMock)

  useFlowSettings.mockReturnValue(makeSettingsMock())

  useFlowTheme.mockReturnValue({
    isDark: ref(true),
    themeVars: computed(() => ({ '--t-grid-color': '#333', '--t-bg': '#000000' })),
    toggleTheme: vi.fn(),
  })

  useFlowColors.mockReturnValue({
    colors: ref({}),
    cssVars: computed(() => ({})),
    saveColors: vi.fn(),
  })
})

function mount(props = {}) {
  return shallowMount(FlowTree, { props })
}

// ── Renderização ──────────────────────────────────────────────────────────────
describe('renderização', () => {
  it('monta sem erros', () => {
    const wrapper = mount()
    expect(wrapper.exists()).toBe(true)
  })

  it('renderiza o FlowCanvas', () => {
    const wrapper = mount()
    expect(wrapper.findComponent(FlowCanvas).exists()).toBe(true)
  })

  it('renderiza a toolbar', () => {
    const wrapper = mount()
    expect(wrapper.findComponent(AddNodeButton).exists()).toBe(true)
    expect(wrapper.findComponent(SaveButton).exists()).toBe(true)
    expect(wrapper.findComponent(ThemeButton).exists()).toBe(true)
    expect(wrapper.findComponent(SettingsButton).exists()).toBe(true)
  })

  it('exibe o ValidationPanel quando showValidationPanel é true', () => {
    const wrapper = mount()
    expect(wrapper.findComponent(ValidationPanel).exists()).toBe(true)
  })

  it('oculta o ValidationPanel quando showValidationPanel é false', () => {
    useFlowSettings.mockReturnValue(makeSettingsMock({ showValidationPanel: false }))
    const wrapper = mount()
    expect(wrapper.findComponent(ValidationPanel).exists()).toBe(false)
  })

  // it('exibe o MiniMap quando showMiniMap é true', async () => {
  //   useFlowSettings.mockReturnValue(makeSettingsMock({ showMiniMap: true }))
  //   const wrapper = mount()
  //   await nextTick()
  //   expect(wrapper.findComponent({ name: 'MiniMap' }).exists()).toBe(false)
  // })

  it('oculta o MiniMap quando showMiniMap é false', () => {
    const wrapper = mount()
    expect(wrapper.findComponent({ name: 'MiniMap' }).exists()).toBe(false)
  })

  it('adiciona classe panel-hidden quando showValidationPanel é false', () => {
    useFlowSettings.mockReturnValue(makeSettingsMock({ showValidationPanel: false }))
    const wrapper = mount()
    expect(wrapper.find('.flow-tree-wrapper').classes()).toContain('panel-hidden')
  })

  it('não tem classe panel-hidden quando showValidationPanel é true', () => {
    const wrapper = mount()
    expect(wrapper.find('.flow-tree-wrapper').classes()).not.toContain('panel-hidden')
  })
})

// ── Modal de adição ───────────────────────────────────────────────────────────
describe('modal de adição', () => {
  it('não exibe NodeEditModal (add) por padrão', () => {
    const wrapper = mount()
    const addModals = wrapper.findAllComponents(NodeEditModal).filter(c => c.props('mode') === 'add')
    expect(addModals).toHaveLength(0)
  })

  it('exibe NodeEditModal (add) quando showAddModal é true', async () => {
    const wrapper = mount()
    ftMock.showAddModal.value = true
    await nextTick()
    const addModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'add')
    expect(addModal).toBeDefined()
  })

  it('AddNodeButton click chama openAddModal', async () => {
    const wrapper = mount()
    await wrapper.findComponent(AddNodeButton).trigger('click')
    expect(ftMock.openAddModal).toHaveBeenCalledOnce()
  })

  it('modal de adição fecha ao emitir close', async () => {
    const wrapper = mount()
    ftMock.showAddModal.value = true
    await nextTick()
    const addModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'add')
    await addModal.vm.$emit('close')
    expect(ftMock.showAddModal.value).toBe(false)
  })

  it('addNode é chamado ao emitir save no modal de adição', async () => {
    const wrapper = mount()
    ftMock.showAddModal.value = true
    await nextTick()
    const addModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'add')
    await addModal.vm.$emit('save')
    expect(ftMock.addNode).toHaveBeenCalledOnce()
  })
})

// ── Modal de edição ───────────────────────────────────────────────────────────
describe('modal de edição', () => {
  const fakeNode = { id: '1', data: { label: 'A', level: 1 } }

  it('não exibe NodeEditModal (edit) por padrão', () => {
    const wrapper = mount()
    const editModals = wrapper.findAllComponents(NodeEditModal).filter(c => c.props('mode') === 'edit')
    expect(editModals).toHaveLength(0)
  })

  it('exibe NodeEditModal (edit) quando editingNode está definido', async () => {
    const wrapper = mount()
    ftMock.editingNode.value = fakeNode
    await nextTick()
    const editModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'edit')
    expect(editModal).toBeDefined()
  })

  it('modal de edição fecha ao emitir close', async () => {
    const wrapper = mount()
    ftMock.editingNode.value = fakeNode
    await nextTick()
    const editModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'edit')
    await editModal.vm.$emit('close')
    expect(ftMock.editingNode.value).toBeNull()
  })

  it('saveEdit é chamado ao emitir save no modal de edição', async () => {
    const wrapper = mount()
    ftMock.editingNode.value = fakeNode
    await nextTick()
    const editModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'edit')
    await editModal.vm.$emit('save')
    expect(ftMock.saveEdit).toHaveBeenCalledOnce()
  })
})

// ── Modal de configuração de cores ────────────────────────────────────────────
describe('modal de cores', () => {
  it('não exibe ColorConfigModal por padrão', () => {
    const wrapper = mount()
    expect(wrapper.findComponent(ColorConfigModal).exists()).toBe(false)
  })

  it('SettingsButton click abre o ColorConfigModal', async () => {
    const wrapper = mount()
    await wrapper.findComponent(SettingsButton).trigger('click')
    expect(wrapper.findComponent(ColorConfigModal).exists()).toBe(true)
  })

  it('ColorConfigModal fecha ao emitir close', async () => {
    const wrapper = mount()
    await wrapper.findComponent(SettingsButton).trigger('click')
    await wrapper.findComponent(ColorConfigModal).vm.$emit('close')
    expect(wrapper.findComponent(ColorConfigModal).exists()).toBe(false)
  })

  it('onSaveColors atualiza as cores e fecha o modal', async () => {
    const wrapper = mount()
    await wrapper.findComponent(SettingsButton).trigger('click')
    const newColors = { 1: { bg: '#fff', border: '#000', text: '#333' } }
    const newSettings = { showValidationPanel: true, showControls: true, showMiniMap: false }
    await wrapper.findComponent(ColorConfigModal).vm.$emit('save', { colors: newColors, settings: newSettings })
    expect(wrapper.findComponent(ColorConfigModal).exists()).toBe(false)
  })

  it('onSaveColors chama saveColors após atualizar cores', async () => {
    const { saveColors } = useFlowColors()
    const wrapper = mount()
    await wrapper.findComponent(SettingsButton).trigger('click')
    const newColors = { 1: { bg: '#fff', border: '#000', text: '#333' } }
    await wrapper.findComponent(ColorConfigModal).vm.$emit('save', { colors: newColors, settings: {} })
    expect(saveColors).toHaveBeenCalledOnce()
  })

  it('onSaveColors chama saveSettings após atualizar settings', async () => {
    const { saveSettings } = useFlowSettings()
    const wrapper = mount()
    await wrapper.findComponent(SettingsButton).trigger('click')
    const newSettings = { showValidationPanel: false, showControls: true, showMiniMap: false }
    await wrapper.findComponent(ColorConfigModal).vm.$emit('save', { colors: {}, settings: newSettings })
    expect(saveSettings).toHaveBeenCalledOnce()
  })
})

// ── Modal de opções de conexão ────────────────────────────────────────────────
describe('modal de opções de conexão', () => {
  it('não exibe ConnectionOptionModal por padrão', () => {
    const wrapper = mount()
    expect(wrapper.findComponent(ConnectionOptionModal).exists()).toBe(false)
  })

  it('exibe ConnectionOptionModal quando há pendingConnection', async () => {
    const wrapper = mount()
    ftMock.pendingConnection.value = { source: 'A', target: 'B' }
    await nextTick()
    expect(wrapper.findComponent(ConnectionOptionModal).exists()).toBe(true)
  })

  it('confirmConnection é chamado ao emitir confirm', async () => {
    const wrapper = mount()
    ftMock.pendingConnection.value = { source: 'A', target: 'B' }
    await nextTick()
    await wrapper.findComponent(ConnectionOptionModal).vm.$emit('confirm', 42)
    expect(ftMock.confirmConnection).toHaveBeenCalledWith(42)
  })

  it('cancelConnection é chamado ao emitir cancel', async () => {
    const wrapper = mount()
    ftMock.pendingConnection.value = { source: 'A', target: 'B' }
    await nextTick()
    await wrapper.findComponent(ConnectionOptionModal).vm.$emit('cancel')
    expect(ftMock.cancelConnection).toHaveBeenCalledOnce()
  })
})

// ── Repasse de props ──────────────────────────────────────────────────────────
describe('repasse de props', () => {
  it('repassa isAdmin=true para NodeEditModal de adição', async () => {
    const wrapper = mount({ isAdmin: true })
    ftMock.showAddModal.value = true
    await nextTick()
    const addModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'add')
    expect(addModal.props('isAdmin')).toBe(true)
  })

  it('repassa isAdmin=false por padrão para NodeEditModal de edição', async () => {
    const wrapper = mount()
    ftMock.editingNode.value = { id: '1', data: { label: 'A', level: 1 } }
    await nextTick()
    const editModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'edit')
    expect(editModal.props('isAdmin')).toBe(false)
  })

  it('repassa maxLevels para NodeEditModal', async () => {
    const wrapper = mount({ maxLevels: 5 })
    ftMock.showAddModal.value = true
    await nextTick()
    const addModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'add')
    expect(addModal.props('maxLevels')).toBe(5)
  })

  it('repassa templates para NodeEditModal', async () => {
    const templates = [{ id: 1, label: 'T1', options: [] }]
    const wrapper = mount({ templates })
    ftMock.showAddModal.value = true
    await nextTick()
    const addModal = wrapper.findAllComponents(NodeEditModal).find(c => c.props('mode') === 'add')
    expect(addModal.props('templates')).toEqual(templates)
  })

  it('repassa validation para ValidationPanel', () => {
    const validation = { valid: false, errors: ['erro'], suggestions: [] }
    ftMock = makeFlowTreeMock({ validation: computed(() => validation) })
    useFlowTree.mockReturnValue(ftMock)
    const wrapper = mount()
    expect(wrapper.findComponent(ValidationPanel).props('validation')).toEqual(validation)
  })

  it('repassa maxLevels para ValidationPanel', () => {
    const wrapper = mount({ maxLevels: 4 })
    expect(wrapper.findComponent(ValidationPanel).props('maxLevels')).toBe(4)
  })
})

// ── SaveButton ────────────────────────────────────────────────────────────────
describe('SaveButton', () => {
  it('click chama manualSave', async () => {
    const wrapper = mount()
    await wrapper.findComponent(SaveButton).trigger('click')
    expect(ftMock.manualSave).toHaveBeenCalledOnce()
  })

  it('fica desabilitado quando saveStatus é "saving"', async () => {
    ftMock = makeFlowTreeMock({ saveStatus: ref('saving') })
    useFlowTree.mockReturnValue(ftMock)
    const wrapper = mount()
    expect(wrapper.findComponent(SaveButton).props('disabled')).toBe(true)
  })

  it('fica desabilitado quando saveStatus é "loading"', async () => {
    ftMock = makeFlowTreeMock({ saveStatus: ref('loading') })
    useFlowTree.mockReturnValue(ftMock)
    const wrapper = mount()
    expect(wrapper.findComponent(SaveButton).props('disabled')).toBe(true)
  })

  it('não fica desabilitado quando saveStatus é ""', () => {
    const wrapper = mount()
    expect(wrapper.findComponent(SaveButton).props('disabled')).toBe(false)
  })
})

// ── Evento save ───────────────────────────────────────────────────────────────
describe('evento save', () => {
  it('emite "save" com os dados quando onSave é chamado internamente', async () => {
    const onSaveProp = vi.fn()
    const wrapper = mount({ onSave: onSaveProp })

    // Extrai o callback onSave que o componente passa para useFlowTree
    const onSaveArg = useFlowTree.mock.calls.at(-1)[0].onSave
    const data = { nodes: [], edges: [] }
    await onSaveArg(data)

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')[0][0]).toEqual(data)
  })

  it('chama a prop onSave com os dados', async () => {
    const onSaveProp = vi.fn()
    mount({ onSave: onSaveProp })

    const onSaveArg = useFlowTree.mock.calls.at(-1)[0].onSave
    const data = { nodes: [{ id: '1' }], edges: [] }
    await onSaveArg(data)

    expect(onSaveProp).toHaveBeenCalledWith(data)
  })
})

// ── ThemeButton ───────────────────────────────────────────────────────────────
describe('ThemeButton', () => {
  it('click chama toggleTheme', async () => {
    const { toggleTheme } = useFlowTheme()
    const wrapper = mount()
    await wrapper.findComponent(ThemeButton).trigger('click')
    expect(toggleTheme).toHaveBeenCalledOnce()
  })

  it('recebe isDark correto', () => {
    useFlowTheme.mockReturnValue({
      isDark: ref(false),
      themeVars: computed(() => ({})),
      toggleTheme: vi.fn(),
    })
    const wrapper = mount()
    expect(wrapper.findComponent(ThemeButton).props('isDark')).toBe(false)
  })
})

// ── FlowCanvas event handlers ──────────────────────────────────────────────────
describe('FlowCanvas event handlers', () => {
  it('FlowCanvas recebe nodes e edges do composable', () => {
    ftMock.nodes.value = [{ id: '1' }]
    ftMock.edges.value = [{ id: 'e1' }]
    const wrapper = mount()
    expect(wrapper.findComponent(FlowCanvas).props('nodes')).toEqual([{ id: '1' }])
    expect(wrapper.findComponent(FlowCanvas).props('edges')).toEqual([{ id: 'e1' }])
  })

  it('FlowCanvas recebe grid-color do themeVars', () => {
    useFlowTheme.mockReturnValue({
      isDark: ref(true),
      themeVars: computed(() => ({ '--t-grid-color': '#123456' })),
      toggleTheme: vi.fn(),
    })
    const wrapper = mount()
    expect(wrapper.findComponent(FlowCanvas).props('gridColor')).toBe('#123456')
  })

  it('FlowCanvas recebe showControls das settings', () => {
    useFlowSettings.mockReturnValue({
      settings: ref({ showControls: true, showValidationPanel: true, showMiniMap: false }),
      saveSettings: vi.fn(),
    })
    const wrapper = mount()
    expect(wrapper.findComponent(FlowCanvas).props('showControls')).toBe(true)
  })
})
