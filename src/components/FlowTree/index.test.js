import { describe, it, expect, vi } from 'vitest'

vi.mock('./FlowTree.vue', () => ({
  default: { name: 'FlowTree' }
}))

describe('FlowTree/index.js', () => {
  it('exporta o componente padrão FlowTree', async () => {
    const mod = await import('./index.js')
    expect(mod.default).toBeDefined()
    expect(mod.default.name).toBe('FlowTree')
  })

  it('exporta useFlowTree composable', async () => {
    const { useFlowTree } = await import('./composables/useFlowTree.js')
    expect(useFlowTree).toBeDefined()
    expect(typeof useFlowTree).toBe('function')
  })

  it('exporta useFlowColors composable', async () => {
    const { useFlowColors } = await import('./composables/useFlowColors.js')
    expect(useFlowColors).toBeDefined()
    expect(typeof useFlowColors).toBe('function')
  })

  it('exporta useFlowTheme composable', async () => {
    const { useFlowTheme } = await import('./composables/useFlowTheme.js')
    expect(useFlowTheme).toBeDefined()
    expect(typeof useFlowTheme).toBe('function')
  })

  it('exporta useFlowSettings composable', async () => {
    const { useFlowSettings } = await import('./composables/useFlowSettings.js')
    expect(useFlowSettings).toBeDefined()
    expect(typeof useFlowSettings).toBe('function')
  })
})
