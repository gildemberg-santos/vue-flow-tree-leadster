import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, ref } from 'vue'
import { useFlowTreeValidation } from './useFlowTreeValidation'

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
  { id: 1, label: 'Raiz', options: [{ id: 101, label: 'Opção A' }] },
  { id: 2, label: 'Filho', options: [] },
]

let currentApp
describe('useFlowTreeValidation', () => {
  afterEach(() => {
    currentApp?.unmount()
  })

  function setup(fn) {
    const [ctx, app] = withSetup(fn)
    currentApp = app
    return ctx
  }

  describe('validation', () => {
    it('é válido para fluxo vazio', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(validation.value.valid).toBe(true)
    })

    it('retorna erros do validateFlow', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(validation.value.valid).toBe(false)
      expect(validation.value.errors.length).toBeGreaterThan(0)
    })

    it('retorna sugestões do validateFlow', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(validation.value.suggestions.length).toBeGreaterThan(0)
    })

    it('não verifica templates quando array está vazio', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1, { templateId: null })]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(validation.value.valid).toBe(true)
      expect(validation.value.errors.some(e => e.includes('template'))).toBe(false)
    })

    it('reporta erro quando templateId é null e templates estão definidos', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1, { templateId: null })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.valid).toBe(false)
      expect(validation.value.errors.some(e => e.includes('template') && e.includes('A'))).toBe(true)
    })

    it('reporta erro quando templateId não existe nos templates', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1, { templateId: 999 })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.valid).toBe(false)
      expect(validation.value.errors.some(e => e.includes('template'))).toBe(true)
    })

    it('não reporta erro quando templateId é válido', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1, { templateId: 1 })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.errors.some(e => e.includes('template'))).toBe(false)
    })

    it('reporta erro para múltiplos nós órfãos', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([
          node('A', 1, { templateId: null }),
          node('B', 1, { templateId: 999 }),
        ]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.valid).toBe(false)
      expect(validation.value.errors.filter(e => e.includes('template'))).toHaveLength(2)
    })

    it('adiciona sugestão para nós órfãos', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1, { templateId: null })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.suggestions.some(s => s.includes('template'))).toBe(true)
    })

    it('combina erros de validateFlow com erros de template', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.valid).toBe(false)
      expect(validation.value.errors.length).toBeGreaterThan(1)
    })

    it('remove sugestões duplicadas', () => {
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: ref([node('A', 1, { templateId: null })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      const templateSuggestions = validation.value.suggestions.filter(s => s.includes('template'))
      const uniqueSuggestions = [...new Set(templateSuggestions)]
      expect(templateSuggestions.length).toBe(uniqueSuggestions.length)
    })

    it('atualiza quando nodes mudam', () => {
      const nodesRef = ref([node('A', 1, { templateId: 1 })])
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: nodesRef,
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(validation.value.errors.some(e => e.includes('template'))).toBe(false)
      
      nodesRef.value = [node('B', 1, { templateId: null })]
      expect(validation.value.errors.some(e => e.includes('template'))).toBe(true)
    })

    it('atualiza quando edges mudam', () => {
      const nodesRef = ref([node('A', 1), node('B', 2)])
      const edgesRef = ref([])
      const { validation } = setup(() => useFlowTreeValidation({
        nodes: nodesRef,
        edges: edgesRef,
        maxLevels: 3,
        templates: [],
      }))
      expect(validation.value.valid).toBe(false)
      
      edgesRef.value = [{ id: 'e-A-B', source: 'A', target: 'B', animated: true, data: {} }]
      expect(validation.value.valid).toBe(true)
    })
  })
})
