import { describe, it, expect } from 'vitest'

describe('FlowTree/index.js', () => {
  it('exporta o componente FlowTree', async () => {
    const { FlowTree } = await import('./index.js')
    expect(FlowTree).toBeDefined()
    expect(FlowTree).not.toBeNull()
  })

  it('exporta useFlowTree composable', async () => {
    const { useFlowTree } = await import('./index.js')
    expect(useFlowTree).toBeDefined()
    expect(typeof useFlowTree).toBe('function')
  })

  it('exporta useFlowColors composable', async () => {
    const { useFlowColors } = await import('./index.js')
    expect(useFlowColors).toBeDefined()
    expect(typeof useFlowColors).toBe('function')
  })

  it('exporta useFlowTheme composable', async () => {
    const { useFlowTheme } = await import('./index.js')
    expect(useFlowTheme).toBeDefined()
    expect(typeof useFlowTheme).toBe('function')
  })

  it('exporta useFlowSettings composable', async () => {
    const { useFlowSettings } = await import('./index.js')
    expect(useFlowSettings).toBeDefined()
    expect(typeof useFlowSettings).toBe('function')
  })
})
