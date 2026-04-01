import { ref, computed } from 'vue'

/**
 * Gerencia o estado de conexão pendente e as opções disponíveis
 * para o modal de seleção de opção de saída.
 */
export function usePendingConnection({ nodes, edges, templates, addEdgeFromConnection }) {
  const pendingConnection = ref(null)

  const pendingOptions = computed(() => {
    if (!pendingConnection.value) return []
    const sourceId = pendingConnection.value.source
    const sourceNode = nodes.value.find((n) => n.id === sourceId)
    if (!sourceNode) return []
    const templateConfig = templates.find((t) => t.id === sourceNode.data.templateId)
    if (!templateConfig?.options?.length) return []
    const usedOptionIds = new Set(
      edges.value
        .filter((e) => e.source === sourceId)
        .map((e) => e.data?.optionId)
        .filter((id) => id != null),
    )
    return templateConfig.options.filter((o) => !usedOptionIds.has(o.id))
  })

  function confirmConnection(optionId) {
    if (!pendingConnection.value) return
    addEdgeFromConnection(pendingConnection.value, optionId)
    pendingConnection.value = null
  }

  function cancelConnection() {
    pendingConnection.value = null
  }

  return { pendingConnection, pendingOptions, confirmConnection, cancelConnection }
}
