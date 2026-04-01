import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, nextTick, ref } from 'vue'
import { useFlowTreePersistence } from './useFlowTreePersistence'

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

function edge(source, target, optionId = null) {
  return { id: `e-${source}-${target}`, source, target, animated: true, data: { optionId } }
}

let currentApp
describe('useFlowTreePersistence', () => {
  afterEach(() => {
    currentApp?.unmount()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  function setup(fn) {
    const [ctx, app] = withSetup(fn)
    currentApp = app
    return ctx
  }

  describe('saveStatus', () => {
    it('inicia vazio quando onLoad não é fornecido', () => {
      const { saveStatus } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: undefined,
      }))
      expect(saveStatus.value).toBe('')
    })

    it('inicia como "loading" quando onLoad é uma Promise', () => {
      const { saveStatus } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: () => new Promise(() => {}),
      }))
      expect(saveStatus.value).toBe('loading')
    })
  })

  describe('carregamento síncrono', () => {
    it('carrega nodes e edges fornecidos por onLoad', () => {
      const { nodes, edges } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: () => ({ nodes: [node('A', 1)], edges: [] }),
      }))
      expect(nodes.value).toHaveLength(1)
      expect(nodes.value[0].id).toBe('A')
    })

    it('sanitiza edges ao carregar', () => {
      const { edges } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: () => ({ nodes: [node('A', 1)], edges: [edge('A', 'INEXISTENTE')] }),
      }))
      expect(edges.value).toHaveLength(0)
    })
  })

  describe('carregamento assíncrono', () => {
    it('inicia com nodes vazios enquanto carrega', () => {
      const { nodes, saveStatus } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: () => new Promise(() => {}),
      }))
      expect(nodes.value).toEqual([])
      expect(saveStatus.value).toBe('loading')
    })

    it('popula nodes e edges após resolução da Promise', async () => {
      const { nodes, saveStatus } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: () => Promise.resolve({ nodes: [node('A', 1)], edges: [] }),
      }))
      await nextTick()
      await nextTick()
      expect(nodes.value[0].id).toBe('A')
      expect(saveStatus.value).toBe('')
    })

    it('define saveStatus "error" quando a Promise rejeita', async () => {
      const { saveStatus } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
        onLoad: () => Promise.reject(new Error('falha')),
      }))
      await nextTick()
      await nextTick()
      expect(saveStatus.value).toBe('error')
    })
  })

  describe('hasChanges', () => {
    it('retorna false inicialmente após initSnapshot', () => {
      const { nodes, edges, hasChanges, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
      }))
      initSnapshot()
      expect(hasChanges()).toBe(false)
    })

    it('retorna true quando nodes mudam', () => {
      const { nodes, edges, hasChanges, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
      }))
      initSnapshot()
      nodes.value = [node('A', 1)]
      expect(hasChanges()).toBe(true)
    })

    it('retorna true quando edges mudam', () => {
      const { nodes, edges, hasChanges, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
      }))
      initSnapshot()
      edges.value = [edge('A', 'B')]
      expect(hasChanges()).toBe(true)
    })
  })

  describe('manualSave', () => {
    it('chama onSave com nodes e edges', async () => {
      const onSave = vi.fn().mockReturnValue(undefined)
      const { nodes, edges, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      nodes.value = [node('A', 1)]
      edges.value = []
      initSnapshot()
      await manualSave()
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          nodes: expect.any(Array),
          edges: expect.any(Array),
        }),
      )
    })

    it('define saveStatus "error" quando fluxo é inválido', async () => {
      const { nodes, edges, saveStatus, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
      }))
      nodes.value = [node('A', 2)]
      edges.value = []
      initSnapshot()
      await manualSave()
      expect(saveStatus.value).toBe('error')
    })

    it('define saveStatus "saved" após salvar com sucesso síncrono', async () => {
      vi.useFakeTimers()
      const { nodes, edges, saveStatus, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
      }))
      nodes.value = [node('A', 1), node('B', 2)]
      edges.value = [edge('A', 'B')]
      initSnapshot()
      await manualSave()
      expect(saveStatus.value).toBe('saved')
    })

    it('define saveStatus "saved" após Promise resolvida', async () => {
      vi.useFakeTimers()
      const { nodes, edges, saveStatus, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: () => Promise.resolve(),
      }))
      nodes.value = [node('A', 1), node('B', 2)]
      edges.value = [edge('A', 'B')]
      initSnapshot()
      await manualSave()
      expect(saveStatus.value).toBe('saved')
    })

    it('define saveStatus "error" quando onSave rejeita', async () => {
      const { nodes, edges, saveStatus, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: () => Promise.reject(new Error('falha')),
      }))
      nodes.value = [node('A', 1), node('B', 2)]
      edges.value = [edge('A', 'B')]
      initSnapshot()
      await manualSave()
      expect(saveStatus.value).toBe('error')
    })

    it('sanitiza edges antes de chamar onSave', async () => {
      const onSave = vi.fn().mockReturnValue(undefined)
      const { nodes, edges, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      nodes.value = [node('A', 1)]
      edges.value = [edge('A', 'INEXISTENTE')]
      initSnapshot()
      await manualSave()
      expect(onSave).toHaveBeenCalled()
    })
  })

  describe('autoSave', () => {
    it('não salva se não foi inicializado', async () => {
      const onSave = vi.fn()
      const { nodes, edges, autoSave } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      nodes.value = [node('A', 1)]
      edges.value = [edge('A', 'B')]
      await autoSave()
      expect(onSave).not.toHaveBeenCalled()
    })

    it('não salva se não há mudanças', async () => {
      const onSave = vi.fn()
      const { nodes, edges, autoSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      nodes.value = [node('A', 1)]
      edges.value = []
      initSnapshot()
      await autoSave()
      expect(onSave).not.toHaveBeenCalled()
    })

    it('salva automaticamente quando há mudanças', async () => {
      const onSave = vi.fn().mockReturnValue(undefined)
      const { nodes, edges, autoSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      nodes.value = [node('A', 1)]
      edges.value = []
      initSnapshot()
      nodes.value = [node('A', 1), node('B', 2)]
      edges.value = [edge('A', 'B')]
      await autoSave()
      expect(onSave).toHaveBeenCalled()
    })
  })

  describe('initSnapshot', () => {
    it('inicializa o snapshot com estado atual', () => {
      const { nodes, edges, initSnapshot, hasChanges } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave: vi.fn(),
      }))
      nodes.value = [node('A', 1)]
      edges.value = [edge('A', 'B')]
      initSnapshot()
      expect(hasChanges()).toBe(false)
    })

    it('habilita autoSave após inicialização', async () => {
      const onSave = vi.fn().mockReturnValue(undefined)
      const { nodes, edges, autoSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      initSnapshot()
      nodes.value = [node('A', 1)]
      edges.value = []
      await autoSave()
      expect(onSave).toHaveBeenCalled()
    })
  })

  describe('persistState', () => {
    it('sanitiza edges antes de salvar', async () => {
      const onSave = vi.fn().mockReturnValue(undefined)
      const { edges, manualSave, initSnapshot } = setup(() => useFlowTreePersistence({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        onSave,
      }))
      edges.value = [edge('A', 'INEXISTENTE')]
      initSnapshot()
      await manualSave()
      const savedEdges = onSave.mock.calls[0][0].edges
      expect(savedEdges).toHaveLength(0)
    })
  })
})
