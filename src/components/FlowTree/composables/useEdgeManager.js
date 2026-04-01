import { calculateFlowLevels } from '../utils/flowValidator'

/**
 * Gerencia operações de criação e remoção de edges,
 * recalculando os níveis dos nós após cada mudança.
 */
export function useEdgeManager({ nodes, edges, maxLevels, templates }) {
  function addEdgeFromConnection(connection, optionId) {
    const sourceNode = nodes.value.find((n) => n.id === connection.source)
    const templateConfig = templates.find((t) => t.id === sourceNode?.data?.templateId)
    const optionLabel = templateConfig?.options?.find((o) => o.id === optionId)?.label
    edges.value = [
      ...edges.value,
      {
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        animated: true,
        label: optionLabel ?? undefined,
        data: { optionId: optionId ?? null },
      },
    ]
    nodes.value = calculateFlowLevels(nodes.value, edges.value, maxLevels)
  }

  function removeEdge(edgeId) {
    edges.value = edges.value.filter((e) => e.id !== edgeId)
    nodes.value = calculateFlowLevels(nodes.value, edges.value, maxLevels)
  }

  return { addEdgeFromConnection, removeEdge }
}
