/**
 * Gerencia o snapshot do estado salvo para detectar mudanças não persistidas.
 */
export function useSnapshot({ nodes, edges }) {
  let snapshot = '[]'
  let initialized = false

  function hasChanges() {
    return initialized &&
      JSON.stringify({ nodes: nodes.value, edges: edges.value }) !== snapshot
  }

  function initSnapshot() {
    snapshot = JSON.stringify({ nodes: nodes.value, edges: edges.value })
    initialized = true
  }

  function updateSnapshot(savedNodes, savedEdges) {
    snapshot = JSON.stringify({ nodes: savedNodes, edges: savedEdges })
  }

  function isReady() {
    return initialized
  }

  return { hasChanges, initSnapshot, updateSnapshot, isReady }
}
