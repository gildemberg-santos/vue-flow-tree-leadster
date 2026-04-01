import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, ref } from 'vue'
import { useFlowTreeNodes } from './useFlowTreeNodes'

vi.mock('@vue-flow/core', () => ({
  useVueFlow: () => ({
    getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
  }),
}))

function withSetup(fn) {
  let result
  const app = createApp({
    setup() {
      result = fn()
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  return [result, app]
}

function node(id, level, extra = {}) {
  return {
    id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: id, level, templateId: null, maxConnections: null, ...extra },
  }
}

const TEMPLATES = [
  { id: 1, label: 'Raiz', options: [{ id: 101, label: 'Opção A' }, { id: 102, label: 'Opção B' }] },
  { id: 2, label: 'Filho', options: [{ id: 201, label: 'Opção C' }] },
]

let currentApp
describe('useFlowTreeNodes', () => {
  afterEach(() => {
    currentApp?.unmount()
    vi.clearAllTimers()
  })

  function setup(fn) {
    const [ctx, app] = withSetup(fn)
    currentApp = app
    return ctx
  }

  describe('showAddModal', () => {
    it('inicia como false', () => {
      const { showAddModal } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
        onGenerateId: () => 'test-id',
      }))
      expect(showAddModal.value).toBe(false)
    })
  })

  describe('addForm', () => {
    it('inicia com valores padrão', () => {
      const { addForm } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(addForm.value.label).toBe('')
      expect(addForm.value.level).toBe(3)
      expect(addForm.value.maxConnections).toBeNull()
    })

    it('reseta level para maxLevels ao abrir modal', () => {
      const { addForm, openAddModal } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 2,
        templates: [],
      }))
      addForm.value.level = 1
      openAddModal()
      expect(addForm.value.level).toBe(2)
    })
  })

  describe('openAddModal', () => {
    it('abre o modal e reseta o form', () => {
      const { showAddModal, addForm, addNodeError, openAddModal } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addForm.value.label = 'prev'
      addNodeError.value = 'erro'
      openAddModal()
      expect(showAddModal.value).toBe(true)
      expect(addForm.value.label).toBe('')
      expect(addNodeError.value).toBe('')
    })
  })

  describe('addNode', () => {
    it('não adiciona nó quando label está vazio', () => {
      const { nodes, addForm, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addForm.value.label = '   '
      addNode()
      expect(nodes.value).toHaveLength(0)
    })

    it('adiciona nó com os dados do form', () => {
      const { nodes, addForm, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
        onGenerateId: () => 'id-fixo',
      }))
      addForm.value = { label: 'Novo', level: 3, maxConnections: null }
      addNode()
      expect(nodes.value).toHaveLength(1)
      expect(nodes.value[0].id).toBe('id-fixo')
      expect(nodes.value[0].data.label).toBe('Novo')
      expect(nodes.value[0].data.level).toBe(3)
    })

    it('fecha o modal após adicionar', () => {
      const { showAddModal, addForm, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addForm.value.label = 'Nó'
      addNode()
      expect(showAddModal.value).toBe(false)
    })

    it('exibe erro quando nível atingiu o limite', () => {
      const { nodes, addForm, addNodeError, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      nodes.value = [node('A', 1)]
      addForm.value = { label: 'Extra', level: 1, maxConnections: null }
      addNode()
      expect(addNodeError.value).toMatch(/limite/)
      expect(nodes.value).toHaveLength(1)
    })

    it('associa templateId e maxConnections ao template correspondente', () => {
      const { nodes, addForm, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      addForm.value.label = 'Raiz'
      addNode()
      expect(nodes.value[0].data.templateId).toBe(1)
      expect(nodes.value[0].data.maxConnections).toBe(2)
    })

    it('usa posição relativa ao anchor quando existe nó selecionado', () => {
      const { nodes, addForm, addNode, onNodeClick } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const anchor = node('A', 1)
      anchor.position = { x: 100, y: 100 }
      nodes.value = [anchor]
      onNodeClick({ node: anchor })
      addForm.value.label = 'Filho'
      addNode()
      const filho = nodes.value.find((n) => n.data.label === 'Filho')
      expect(filho.position.x).toBe(280)
      expect(filho.position.y).toBe(270)
    })

    it('usa posição central quando não há anchor', () => {
      const { nodes, addForm, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addForm.value.label = 'Novo'
      addNode()
      expect(nodes.value[0].position.x).toBeDefined()
      expect(nodes.value[0].position.y).toBeDefined()
    })

    it('gera ID aleatório quando onGenerateId não é fornecido', () => {
      const { nodes, addForm, addNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addForm.value.label = 'Novo'
      addNode()
      expect(nodes.value[0].id).toBeDefined()
      expect(nodes.value[0].id.length).toBeGreaterThan(0)
    })
  })

  describe('onNodeClick', () => {
    it('atualiza lastSelectedNode', () => {
      const { lastSelectedNode, onNodeClick } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const n = node('A', 1)
      onNodeClick({ node: n })
      expect(lastSelectedNode.value).toEqual(n)
    })
  })

  describe('onNodeDragStop', () => {
    it('atualiza a posição do nó arrastado', () => {
      const { nodes, onNodeDragStop } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      nodes.value = [node('A', 1)]
      onNodeDragStop({ node: { id: 'A', position: { x: 100, y: 200 } } })
      expect(nodes.value[0].position).toEqual({ x: 100, y: 200 })
    })

    it('não lança erro quando nó não existe', () => {
      const { onNodeDragStop } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(() =>
        onNodeDragStop({ node: { id: 'INEXISTENTE', position: { x: 0, y: 0 } } }),
      ).not.toThrow()
    })
  })

  describe('onNodeDoubleClick', () => {
    it('preenche editForm com os dados do nó', () => {
      const { editForm, editingNode, onNodeDoubleClick } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const n = node('A', 2, { maxConnections: 3 })
      onNodeDoubleClick({ node: n })
      expect(editingNode.value).toEqual(n)
      expect(editForm.value.label).toBe('A')
      expect(editForm.value.level).toBe(2)
      expect(editForm.value.maxConnections).toBe(3)
    })

    it('limpa erro anterior', () => {
      const { editNodeError, onNodeDoubleClick } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      editNodeError.value = 'erro anterior'
      onNodeDoubleClick({ node: node('A', 1) })
      expect(editNodeError.value).toBe('')
    })
  })

  describe('saveEdit', () => {
    it('não salva quando label está vazio', () => {
      const { nodes, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const n = node('A', 1)
      nodes.value = [n]
      editingNode.value = n
      editForm.value = { label: '', level: 1, maxConnections: null }
      saveEdit()
      expect(nodes.value[0].data.label).toBe('A')
    })

    it('atualiza label e fecha o modal de edição', () => {
      const { nodes, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const n = node('A', 1)
      nodes.value = [n]
      editingNode.value = n
      editForm.value = { label: 'Novo Nome', level: 1, maxConnections: null }
      saveEdit()
      expect(nodes.value[0].data.label).toBe('Novo Nome')
      expect(editingNode.value).toBeNull()
    })

    it('atualiza dados do nó incluindo label', () => {
      const { nodes, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const n = node('A', 1)
      nodes.value = [n]
      editingNode.value = n
      editForm.value = { label: 'Novo Nome', level: 1, maxConnections: null }
      saveEdit()
      expect(nodes.value[0].data.label).toBe('Novo Nome')
      expect(nodes.value[0].data.level).toBe(1)
    })

    it('associa novo template quando label corresponde', () => {
      const { nodes, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      const n = node('A', 1)
      nodes.value = [n]
      editingNode.value = n
      editForm.value = { label: 'Raiz', level: 1, maxConnections: null }
      saveEdit()
      expect(nodes.value[0].data.templateId).toBe(1)
      expect(nodes.value[0].data.maxConnections).toBe(2)
    })

    it('exibe erro quando nível já atingiu o limite', () => {
      const { nodes, edges, editingNode, editForm, editNodeError, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const n1 = node('edit-me', 2)
      nodes.value = [node('ROOT', 1), n1, node('B', 2)]
      editingNode.value = n1
      editForm.value = { label: 'edit-me', level: 1, maxConnections: null }
      saveEdit()
      expect(editNodeError.value).toMatch(/limite/)
    })

    it('remove edges de saída quando nó vai para o nível final', () => {
      const { nodes, edges, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const nA = node('A', 2)
      nodes.value = [nA, node('B', 3)]
      edges.value = [{ id: 'e-A-B', source: 'A', target: 'B', animated: true, data: {} }]
      editingNode.value = nA
      editForm.value = { label: 'A', level: 3, maxConnections: null }
      saveEdit()
      expect(edges.value.find((e) => e.source === 'A')).toBeUndefined()
    })

    it('remove edges inválidas ao mudar de template com opções', () => {
      const { nodes, edges, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      const n = node('A', 1, { templateId: 1 })
      nodes.value = [n, node('B', 2)]
      edges.value = [{ id: 'e-A-B', source: 'A', target: 'B', animated: true, data: { optionId: 101 } }]
      editingNode.value = n
      editForm.value = { label: 'Filho', level: 1, maxConnections: null }
      saveEdit()
      expect(edges.value).toHaveLength(0)
    })

    it('remove conexões inválidas quando nó vai para nível final', () => {
      const { nodes, edges, editingNode, editForm, saveEdit } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      const nA = node('A', 2)
      const nB = node('B', 3)
      nodes.value = [nA, nB]
      edges.value = [{ id: 'e-A-B', source: 'A', target: 'B', animated: true, data: {} }]
      editingNode.value = nA
      editForm.value = { label: 'A', level: 3, maxConnections: null }
      saveEdit()
      expect(edges.value).toHaveLength(0)
    })
  })

  describe('deleteNodeById', () => {
    it('remove o nó pelo id', () => {
      const { nodes, deleteNodeById } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      nodes.value = [node('A', 1), node('B', 2)]
      deleteNodeById('A')
      expect(nodes.value.find((n) => n.id === 'A')).toBeUndefined()
      expect(nodes.value.find((n) => n.id === 'B')).toBeDefined()
    })

    it('remove todas as edges associadas ao nó', () => {
      const { nodes, edges, deleteNodeById } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      nodes.value = [node('A', 1), node('B', 2), node('C', 2)]
      edges.value = [
        { id: 'e-A-B', source: 'A', target: 'B', animated: true, data: {} },
        { id: 'e-A-C', source: 'A', target: 'C', animated: true, data: {} },
        { id: 'e-B-C', source: 'B', target: 'C', animated: true, data: {} },
      ]
      deleteNodeById('A')
      expect(edges.value.find((e) => e.source === 'A' || e.target === 'A')).toBeUndefined()
      expect(edges.value.find((e) => e.source === 'B')).toBeDefined()
    })

    it('recalcula os níveis após remoção', () => {
      const { nodes, edges, deleteNodeById } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      nodes.value = [node('A', 1), node('B', 2)]
      edges.value = [{ id: 'e-A-B', source: 'A', target: 'B', animated: true, data: {} }]
      deleteNodeById('A')
      expect(nodes.value.find((n) => n.id === 'B').data.level).toBe(1)
    })
  })

  describe('editingNode', () => {
    it('inicia como null', () => {
      const { editingNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(editingNode.value).toBeNull()
    })
  })

  describe('editForm', () => {
    it('inicia com valores padrão', () => {
      const { editForm } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(editForm.value.label).toBe('')
      expect(editForm.value.level).toBe(2)
      expect(editForm.value.maxConnections).toBeNull()
    })
  })

  describe('addNodeError', () => {
    it('inicia como string vazia', () => {
      const { addNodeError } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(addNodeError.value).toBe('')
    })
  })

  describe('editNodeError', () => {
    it('inicia como string vazia', () => {
      const { editNodeError } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(editNodeError.value).toBe('')
    })
  })

  describe('lastSelectedNode', () => {
    it('inicia como null', () => {
      const { lastSelectedNode } = setup(() => useFlowTreeNodes({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(lastSelectedNode.value).toBeNull()
    })
  })
})
