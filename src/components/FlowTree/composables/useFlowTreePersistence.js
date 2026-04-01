import { ref, watch } from 'vue'
import { sanitizeEdges } from '../utils/flowValidator'
import { DEFAULT_NODES, DEFAULT_EDGES } from './useFlowTreeState'
import { useSnapshot } from './useSnapshot'
import { useFlowLoader } from './useFlowLoader'

export function useFlowTreePersistence({ nodes, edges, maxLevels, onSave, onLoad }) {
  const { isAsyncLoad, asyncPromise } = useFlowLoader({ nodes, edges, maxLevels, onLoad })
  const snapshot = useSnapshot({ nodes, edges })

  const saveStatus = ref(isAsyncLoad ? 'loading' : '')
  let isSaving = false

  if (isAsyncLoad) {
    asyncPromise
      .then((loaded) => {
        nodes.value = loaded?.nodes ?? DEFAULT_NODES
        edges.value = sanitizeEdges(nodes.value, loaded?.edges ?? DEFAULT_EDGES, maxLevels)
        snapshot.initSnapshot()
        saveStatus.value = ''
      })
      .catch((err) => {
        console.error('Failed to load:', err)
        saveStatus.value = 'error'
      })
  }

  async function persistState() {
    const cleanEdges = sanitizeEdges(nodes.value, edges.value, maxLevels)
    edges.value = cleanEdges
    const result = onSave?.({ nodes: nodes.value, edges: cleanEdges })
    if (result instanceof Promise) {
      saveStatus.value = 'saving'
      try {
        await result
        snapshot.updateSnapshot(nodes.value, cleanEdges)
        saveStatus.value = 'saved'
      } catch {
        saveStatus.value = 'error'
        return
      }
    } else {
      snapshot.updateSnapshot(nodes.value, cleanEdges)
      saveStatus.value = 'saved'
    }
    setTimeout(() => (saveStatus.value = ''), 3000)
  }

  async function manualSave() {
    if (isSaving) return
    const { validateFlow } = await import('../utils/flowValidator')
    const cleanEdges = sanitizeEdges(nodes.value, edges.value, maxLevels)
    edges.value = cleanEdges
    const result = validateFlow(nodes.value, cleanEdges, maxLevels)
    if (!result.valid) {
      saveStatus.value = 'error'
      setTimeout(() => (saveStatus.value = ''), 3000)
      return
    }
    isSaving = true
    try {
      await persistState()
    } finally {
      isSaving = false
    }
  }

  async function autoSave() {
    if (!snapshot.isReady() || !snapshot.hasChanges() || isSaving) return
    const { validateFlow } = await import('../utils/flowValidator')
    const result = validateFlow(nodes.value, edges.value, maxLevels)
    if (!result.valid) {
      saveStatus.value = 'error'
      return
    }
    isSaving = true
    try {
      await persistState()
    } finally {
      isSaving = false
    }
  }

  watch([nodes, edges], autoSave, { deep: true })

  return {
    nodes,
    edges,
    saveStatus,
    hasChanges: snapshot.hasChanges,
    manualSave,
    autoSave,
    initSnapshot: snapshot.initSnapshot,
  }
}
