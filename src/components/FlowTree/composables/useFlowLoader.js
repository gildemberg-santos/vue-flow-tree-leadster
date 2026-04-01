import { sanitizeEdges } from '../utils/flowValidator'
import { DEFAULT_NODES, DEFAULT_EDGES } from './useFlowTreeState'

/**
 * Detecta se o carregamento é síncrono ou assíncrono, aplica o carregamento
 * síncrono imediatamente e retorna a Promise para resolução posterior.
 */
export function useFlowLoader({ nodes, edges, maxLevels, onLoad }) {
  const initialResult = onLoad?.()
  const isAsyncLoad = initialResult instanceof Promise

  if (!isAsyncLoad) {
    const loadedNodes = initialResult?.nodes ?? DEFAULT_NODES
    const loadedEdges = initialResult?.edges ?? DEFAULT_EDGES
    nodes.value = loadedNodes
    edges.value = sanitizeEdges(loadedNodes, loadedEdges, maxLevels)
  }

  return {
    isAsyncLoad,
    asyncPromise: isAsyncLoad ? initialResult : null,
  }
}
