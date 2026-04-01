import { validateConnection } from '../utils/flowValidator'
import { useEdgeManager } from './useEdgeManager'
import { usePendingConnection } from './usePendingConnection'

export function useFlowTreeConnections({ nodes, edges, maxLevels, templates }) {
  const { addEdgeFromConnection, removeEdge } = useEdgeManager({ nodes, edges, maxLevels, templates })
  const { pendingConnection, pendingOptions, confirmConnection, cancelConnection } =
    usePendingConnection({ nodes, edges, templates, addEdgeFromConnection })

  function onConnect(connection) {
    const alreadyExists = edges.value.some(
      (e) => e.source === connection.source && e.target === connection.target,
    )
    if (alreadyExists) return

    const sourceNode = nodes.value.find((n) => n.id === connection.source)
    const targetNode = nodes.value.find((n) => n.id === connection.target)

    if (targetNode && targetNode.data.level <= sourceNode.data.level) {
      const newLevel = targetNode.data.level + 1
      if (newLevel > maxLevels) {
        console.warn('Não é possível ajustar: ultrapassaria o nível máximo')
        return
      }
      nodes.value = nodes.value.map((n) =>
        n.id === connection.target ? { ...n, data: { ...n.data, level: newLevel } } : n,
      )
    }

    const result = validateConnection(connection, nodes.value, edges.value, maxLevels)
    if (!result.valid) {
      console.warn('Conexão bloqueada:', result.errors)
      return
    }

    const templateConfig = templates.find((t) => t.id === sourceNode?.data?.templateId)

    if (templateConfig?.options?.length > 0) {
      const usedOptionIds = new Set(
        edges.value
          .filter((e) => e.source === connection.source)
          .map((e) => e.data?.optionId)
          .filter((id) => id != null),
      )
      const available = templateConfig.options.filter((o) => !usedOptionIds.has(o.id))
      if (available.length === 0) return
      pendingConnection.value = connection
    } else {
      addEdgeFromConnection(connection, null)
    }
  }

  return {
    nodes,
    edges,
    pendingConnection,
    pendingOptions,
    addEdgeFromConnection,
    removeEdge,
    onConnect,
    confirmConnection,
    cancelConnection,
  }
}
