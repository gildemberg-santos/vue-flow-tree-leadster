import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, nextTick } from 'vue'
import { useFlowTree } from './useFlowTree'

// ── Mock do Vue Flow ──────────────────────────────────────────────────────────
vi.mock('@vue-flow/core', () => ({
  useVueFlow: () => ({
    getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
  }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// useFlowTree usa DEFAULT_NODES como valor inicial do ref quando onLoad não é
// fornecido. Isso significa que nodes.value e DEFAULT_NODES apontam para o
// MESMO array — mutações via push() contaminam testes posteriores.
// preserveLoaded: true mantém os dados carregados (para testes de onLoad).
function setup(fn, { preserveLoaded = false } = {}) {
  const [ctx, app] = withSetup(fn)
  currentApp = app
  if (!preserveLoaded) {
    ctx.nodes.value = []
    ctx.edges.value = []
  }
  return ctx
}

function node(id, level, extra = {}) {
  return {
    id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: id, level, templateId: null, maxConnections: null, ...extra },
  }
}

function edge(source, target, optionId = null) {
  return { id: `e-${source}-${target}`, source, target, animated: true, data: { optionId } }
}

const TEMPLATES = [
  { id: 1, label: 'Raiz', options: [{ id: 101, label: 'Opção A' }, { id: 102, label: 'Opção B' }] },
  { id: 2, label: 'Filho', options: [{ id: 201, label: 'Opção C' }] },
]

let currentApp
afterEach(() => {
  currentApp?.unmount()
  vi.clearAllTimers()
})

// ── Carregamento ──────────────────────────────────────────────────────────────
describe('carregamento síncrono', () => {
  it('inicia com nodes e edges vazios quando onLoad não é fornecido', () => {
    const { nodes, edges } = setup(() => useFlowTree(), { preserveLoaded: true })
    expect(nodes.value).toEqual([])
    expect(edges.value).toEqual([])
  })

  it('carrega nodes e edges fornecidos por onLoad', () => {
    const { nodes } = setup(
      () => useFlowTree({ onLoad: () => ({ nodes: [node('A', 1)], edges: [] }) }),
      { preserveLoaded: true },
    )
    expect(nodes.value).toHaveLength(1)
    expect(nodes.value[0].id).toBe('A')
  })

  it('sanitiza edges ao carregar', () => {
    const { edges } = setup(
      () =>
        useFlowTree({
          onLoad: () => ({ nodes: [node('A', 1)], edges: [edge('A', 'INEXISTENTE')] }),
        }),
      { preserveLoaded: true },
    )
    expect(edges.value).toHaveLength(0)
  })
})

describe('carregamento assíncrono', () => {
  it('inicia com saveStatus "loading" e nodes vazios', () => {
    const { nodes, saveStatus } = setup(
      () => useFlowTree({ onLoad: () => new Promise(() => {}) }),
      { preserveLoaded: true },
    )
    expect(saveStatus.value).toBe('loading')
    expect(nodes.value).toEqual([])
  })

  it('popula nodes e edges após resolução da Promise', async () => {
    const { nodes, saveStatus } = setup(
      () =>
        useFlowTree({ onLoad: () => Promise.resolve({ nodes: [node('A', 1)], edges: [] }) }),
      { preserveLoaded: true },
    )
    await nextTick()
    await nextTick()
    expect(nodes.value[0].id).toBe('A')
    expect(saveStatus.value).toBe('')
  })

  it('define saveStatus "error" quando a Promise rejeita', async () => {
    const { saveStatus } = setup(
      () => useFlowTree({ onLoad: () => Promise.reject(new Error('falha')) }),
      { preserveLoaded: true },
    )
    await nextTick()
    await nextTick()
    expect(saveStatus.value).toBe('error')
  })
})

// ── openAddModal ──────────────────────────────────────────────────────────────
describe('openAddModal', () => {
  it('abre o modal e reseta o form com level = maxLevels', () => {
    const { showAddModal, addForm, openAddModal } = setup(() => useFlowTree({ maxLevels: 3 }))
    openAddModal()
    expect(showAddModal.value).toBe(true)
    expect(addForm.value.label).toBe('')
    expect(addForm.value.level).toBe(3)
    expect(addForm.value.maxConnections).toBeNull()
  })

  it('limpa o erro ao abrir', () => {
    const { addNodeError, openAddModal } = setup(() => useFlowTree())
    addNodeError.value = 'erro anterior'
    openAddModal()
    expect(addNodeError.value).toBe('')
  })
})

// ── addNode ───────────────────────────────────────────────────────────────────
describe('addNode', () => {
  it('não adiciona nó quando label está vazio', () => {
    const { nodes, addForm, addNode } = setup(() => useFlowTree())
    addForm.value.label = '   '
    addNode()
    expect(nodes.value).toHaveLength(0)
  })

  it('adiciona nó com os dados do form', () => {
    const { nodes, addForm, addNode } = setup(() =>
      useFlowTree({ onGenerateId: () => 'id-fixo', maxLevels: 3 }),
    )
    addForm.value = { label: 'Novo', level: 3, maxConnections: null }
    addNode()
    expect(nodes.value).toHaveLength(1)
    expect(nodes.value[0].id).toBe('id-fixo')
    expect(nodes.value[0].data.label).toBe('Novo')
    expect(nodes.value[0].data.level).toBe(3)
  })

  it('fecha o modal após adicionar', () => {
    const { showAddModal, addForm, addNode } = setup(() => useFlowTree())
    showAddModal.value = true
    addForm.value.label = 'Nó'
    addNode()
    expect(showAddModal.value).toBe(false)
  })

  it('exibe erro quando nível atingiu o limite', () => {
    const { nodes, addForm, addNodeError, addNode } = setup(() => useFlowTree({ maxLevels: 3 }))
    nodes.value = [node('A', 1)]
    addForm.value = { label: 'Extra', level: 1, maxConnections: null }
    addNode()
    expect(addNodeError.value).toMatch(/limite/)
    expect(nodes.value).toHaveLength(1)
  })

  it('associa templateId e maxConnections ao template correspondente', () => {
    const { nodes, addForm, addNode } = setup(() => useFlowTree({ templates: TEMPLATES }))
    addForm.value.label = 'Raiz'
    addNode()
    expect(nodes.value[0].data.templateId).toBe(1)
    expect(nodes.value[0].data.maxConnections).toBe(2)
  })

  it('usa posição relativa ao anchor quando existe nó selecionado', () => {
    const { nodes, addForm, addNode, onNodeClick } = setup(() => useFlowTree())
    const anchor = node('A', 1)
    nodes.value = [anchor]
    onNodeClick({ node: anchor })
    addForm.value.label = 'Filho'
    addNode()
    const filho = nodes.value.find((n) => n.data.label === 'Filho')
    expect(filho.position.x).toBe(anchor.position.x + 180)
  })
})

// ── onNodeDragStop ────────────────────────────────────────────────────────────
describe('onNodeDragStop', () => {
  it('atualiza a posição do nó arrastado', () => {
    const { nodes, onNodeDragStop } = setup(() => useFlowTree())
    nodes.value = [node('A', 1)]
    onNodeDragStop({ node: { id: 'A', position: { x: 100, y: 200 } } })
    expect(nodes.value[0].position).toEqual({ x: 100, y: 200 })
  })

  it('não lança erro quando nó não existe', () => {
    const { onNodeDragStop } = setup(() => useFlowTree())
    expect(() =>
      onNodeDragStop({ node: { id: 'INEXISTENTE', position: { x: 0, y: 0 } } }),
    ).not.toThrow()
  })
})

// ── onNodeDoubleClick ─────────────────────────────────────────────────────────
describe('onNodeDoubleClick', () => {
  it('preenche editForm com os dados do nó', () => {
    const { nodes, editForm, editingNode, onNodeDoubleClick } = setup(() => useFlowTree())
    const n = node('A', 2, { maxConnections: 3 })
    nodes.value = [n]
    onNodeDoubleClick({ node: n })
    expect(editingNode.value).toEqual(n)
    expect(editForm.value.label).toBe('A')
    expect(editForm.value.level).toBe(2)
    expect(editForm.value.maxConnections).toBe(3)
  })
})

// ── saveEdit ──────────────────────────────────────────────────────────────────
describe('saveEdit', () => {
  it('não salva quando label está vazio', () => {
    const { nodes, editingNode, editForm, saveEdit } = setup(() => useFlowTree())
    const n = node('A', 1)
    nodes.value = [n]
    editingNode.value = n
    editForm.value = { label: '', level: 1, maxConnections: null }
    saveEdit()
    expect(nodes.value[0].data.label).toBe('A')
  })

  it('atualiza label e fecha o modal de edição', () => {
    const { nodes, editingNode, editForm, saveEdit } = setup(() => useFlowTree())
    const n = node('A', 1)
    nodes.value = [n]
    editingNode.value = n
    editForm.value = { label: 'Novo Nome', level: 1, maxConnections: null }
    saveEdit()
    expect(nodes.value[0].data.label).toBe('Novo Nome')
    expect(editingNode.value).toBeNull()
  })

  it('exibe erro quando nível já atingiu o limite', () => {
    const { nodes, editingNode, editForm, editNodeError, saveEdit } = setup(() =>
      useFlowTree({ maxLevels: 3 }),
    )
    const n1 = node('edit-me', 2)
    nodes.value = [node('ROOT', 1), n1, node('B', 2)]
    editingNode.value = n1
    editForm.value = { label: 'edit-me', level: 1, maxConnections: null }
    saveEdit()
    expect(editNodeError.value).toMatch(/limite/)
  })

  it('remove edges de saída quando nó vai para o nível final', () => {
    const { nodes, edges, editingNode, editForm, saveEdit } = setup(() =>
      useFlowTree({ maxLevels: 3 }),
    )
    const nA = node('A', 2)
    nodes.value = [nA, node('B', 3)]
    edges.value = [edge('A', 'B')]
    editingNode.value = nA
    editForm.value = { label: 'A', level: 3, maxConnections: null }
    saveEdit()
    expect(edges.value.find((e) => e.source === 'A')).toBeUndefined()
  })
})

// ── deleteNodeById ────────────────────────────────────────────────────────────
describe('deleteNodeById', () => {
  it('remove o nó pelo id', () => {
    const { nodes, deleteNodeById } = setup(() => useFlowTree())
    nodes.value = [node('A', 1), node('B', 2)]
    deleteNodeById('A')
    expect(nodes.value.find((n) => n.id === 'A')).toBeUndefined()
    expect(nodes.value.find((n) => n.id === 'B')).toBeDefined()
  })

  it('remove todas as edges associadas ao nó', () => {
    const { nodes, edges, deleteNodeById } = setup(() => useFlowTree())
    nodes.value = [node('A', 1), node('B', 2), node('C', 2)]
    edges.value = [edge('A', 'B'), edge('A', 'C'), edge('B', 'C')]
    deleteNodeById('A')
    expect(edges.value.find((e) => e.source === 'A' || e.target === 'A')).toBeUndefined()
    expect(edges.value.find((e) => e.source === 'B')).toBeDefined()
  })

  it('recalcula os níveis após remoção', () => {
    const { nodes, edges, deleteNodeById } = setup(() => useFlowTree({ maxLevels: 3 }))
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    deleteNodeById('A')
    // B torna-se o único nó sem pai → vira a nova raiz (nível 1)
    expect(nodes.value.find((n) => n.id === 'B').data.level).toBe(1)
  })
})

// ── removeEdge ────────────────────────────────────────────────────────────────
describe('removeEdge', () => {
  it('remove apenas a edge pelo id', () => {
    const { nodes, edges, removeEdge } = setup(() => useFlowTree())
    nodes.value = [node('A', 1), node('B', 2), node('C', 3)]
    edges.value = [edge('A', 'B'), edge('B', 'C')]
    removeEdge('e-A-B')
    expect(edges.value.find((e) => e.id === 'e-A-B')).toBeUndefined()
    expect(edges.value.find((e) => e.id === 'e-B-C')).toBeDefined()
  })

  it('recalcula os níveis após remoção da edge', () => {
    const { nodes, edges, removeEdge } = setup(() => useFlowTree({ maxLevels: 3 }))
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    removeEdge('e-A-B')
    expect(nodes.value.find((n) => n.id === 'B').data.level).toBe(3)
  })
})

// ── onConnect ─────────────────────────────────────────────────────────────────
describe('onConnect', () => {
  it('ignora conexão duplicada', () => {
    const { nodes, edges, onConnect } = setup(() => useFlowTree())
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    onConnect({ source: 'A', target: 'B' })
    expect(edges.value).toHaveLength(1)
  })

  it('adiciona edge quando conexão é válida sem template', () => {
    const { nodes, edges, onConnect } = setup(() => useFlowTree())
    nodes.value = [node('A', 1), node('B', 2)]
    onConnect({ source: 'A', target: 'B' })
    expect(edges.value).toHaveLength(1)
    expect(edges.value[0].source).toBe('A')
    expect(edges.value[0].target).toBe('B')
  })

  it('ajusta o nível do destino quando é igual ao da origem', () => {
    const { nodes, onConnect } = setup(() => useFlowTree({ maxLevels: 3 }))
    nodes.value = [node('A', 1), node('B', 1)]
    onConnect({ source: 'A', target: 'B' })
    expect(nodes.value.find((n) => n.id === 'B').data.level).toBe(2)
  })

  it('bloqueia conexão que ultrapassaria maxLevels', () => {
    const { nodes, edges, onConnect } = setup(() => useFlowTree({ maxLevels: 3 }))
    nodes.value = [node('A', 3), node('B', 3)]
    onConnect({ source: 'A', target: 'B' })
    expect(edges.value).toHaveLength(0)
  })

  it('define pendingConnection quando template tem opções', () => {
    const { nodes, edges, onConnect, pendingConnection } = setup(() =>
      useFlowTree({ templates: TEMPLATES }),
    )
    nodes.value = [node('A', 1, { templateId: 1 }), node('B', 2)]
    onConnect({ source: 'A', target: 'B' })
    expect(pendingConnection.value).toEqual({ source: 'A', target: 'B' })
    expect(edges.value).toHaveLength(0)
  })
})

// ── confirmConnection / cancelConnection ──────────────────────────────────────
describe('confirmConnection', () => {
  it('adiciona edge com optionId e limpa pendingConnection', () => {
    const { nodes, edges, pendingConnection, confirmConnection } = setup(() =>
      useFlowTree({ templates: TEMPLATES }),
    )
    nodes.value = [node('A', 1, { templateId: 1 }), node('B', 2)]
    pendingConnection.value = { source: 'A', target: 'B' }
    confirmConnection(101)
    expect(edges.value).toHaveLength(1)
    expect(edges.value[0].data.optionId).toBe(101)
    expect(pendingConnection.value).toBeNull()
  })

  it('não faz nada quando não há pendingConnection', () => {
    const { edges, confirmConnection } = setup(() => useFlowTree())
    confirmConnection(1)
    expect(edges.value).toHaveLength(0)
  })
})

describe('cancelConnection', () => {
  it('limpa pendingConnection', () => {
    const { pendingConnection, cancelConnection } = setup(() => useFlowTree())
    pendingConnection.value = { source: 'A', target: 'B' }
    cancelConnection()
    expect(pendingConnection.value).toBeNull()
  })
})

// ── pendingOptions ────────────────────────────────────────────────────────────
describe('pendingOptions', () => {
  it('retorna array vazio quando não há pendingConnection', () => {
    const { pendingOptions } = setup(() => useFlowTree({ templates: TEMPLATES }))
    expect(pendingOptions.value).toEqual([])
  })

  it('retorna todas as opções quando nenhuma foi usada', () => {
    const { nodes, pendingConnection, pendingOptions } = setup(() =>
      useFlowTree({ templates: TEMPLATES }),
    )
    nodes.value = [node('A', 1, { templateId: 1 })]
    pendingConnection.value = { source: 'A', target: 'B' }
    expect(pendingOptions.value).toHaveLength(2)
  })

  it('exclui opções já usadas em edges existentes', () => {
    const { nodes, edges, pendingConnection, pendingOptions } = setup(() =>
      useFlowTree({ templates: TEMPLATES }),
    )
    nodes.value = [node('A', 1, { templateId: 1 }), node('B', 2), node('C', 2)]
    edges.value = [edge('A', 'B', 101)]
    pendingConnection.value = { source: 'A', target: 'C' }
    expect(pendingOptions.value.find((o) => o.id === 101)).toBeUndefined()
    expect(pendingOptions.value.find((o) => o.id === 102)).toBeDefined()
  })
})

// ── validation ────────────────────────────────────────────────────────────────
describe('validation', () => {
  it('é válido para fluxo vazio', () => {
    const { validation } = setup(() => useFlowTree())
    expect(validation.value.valid).toBe(true)
  })

  it('é inválido quando nó de nível > 1 não tem entrada', () => {
    const { nodes, validation } = setup(() => useFlowTree())
    nodes.value = [node('A', 1), node('B', 2)]
    expect(validation.value.valid).toBe(false)
  })

  it('reporta erro de template quando templateId é null e templates estão definidos', () => {
    const { nodes, validation } = setup(() => useFlowTree({ templates: TEMPLATES }))
    nodes.value = [node('A', 1, { templateId: null })]
    expect(validation.value.valid).toBe(false)
    expect(validation.value.errors.some((e) => e.includes('template'))).toBe(true)
  })

  it('não reporta erro de template quando templateId é válido', () => {
    const { nodes, validation } = setup(() => useFlowTree({ templates: TEMPLATES }))
    nodes.value = [node('A', 1, { templateId: 1 })]
    expect(validation.value.errors.some((e) => e.includes('template'))).toBe(false)
  })
})

// ── manualSave ────────────────────────────────────────────────────────────────
describe('manualSave', () => {
  it('define saveStatus "error" quando fluxo é inválido', async () => {
    const { nodes, saveStatus, manualSave } = setup(() => useFlowTree())
    nodes.value = [node('A', 2)]
    await manualSave()
    expect(saveStatus.value).toBe('error')
  })

  it('chama onSave quando fluxo é válido', async () => {
    const onSave = vi.fn()
    const { nodes, edges, manualSave } = setup(() => useFlowTree({ onSave, maxLevels: 3 }))
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    await manualSave()
    expect(onSave).toHaveBeenCalled()
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ nodes: expect.any(Array), edges: expect.any(Array) }),
    )
  })

  it('define saveStatus "saved" após salvar com sucesso síncrono', async () => {
    vi.useFakeTimers()
    const { nodes, edges, saveStatus, manualSave } = setup(() =>
      useFlowTree({ onSave: vi.fn() }),
    )
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    await manualSave()
    expect(saveStatus.value).toBe('saved')
    vi.useRealTimers()
  })

  it('define saveStatus "saved" após Promise resolvida', async () => {
    vi.useFakeTimers()
    const { nodes, edges, saveStatus, manualSave } = setup(() =>
      useFlowTree({ onSave: () => Promise.resolve() }),
    )
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    await manualSave()
    expect(saveStatus.value).toBe('saved')
    vi.useRealTimers()
  })

  it('define saveStatus "error" quando onSave rejeita', async () => {
    const { nodes, edges, saveStatus, manualSave } = setup(() =>
      useFlowTree({ onSave: () => Promise.reject(new Error('falha')) }),
    )
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B')]
    await manualSave()
    expect(saveStatus.value).toBe('error')
  })

  it('sanitiza edges antes de chamar onSave', async () => {
    const onSave = vi.fn()
    const { nodes, edges, manualSave } = setup(() => useFlowTree({ onSave, maxLevels: 3 }))
    nodes.value = [node('A', 1), node('B', 2)]
    edges.value = [edge('A', 'B'), edge('A', 'INEXISTENTE')]
    await manualSave()
    const savedEdges = onSave.mock.calls[0][0].edges
    expect(savedEdges.find((e) => e.target === 'INEXISTENTE')).toBeUndefined()
  })
})
