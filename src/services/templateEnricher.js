/**
 * Resolve templateId e maxConnections de cada nó a partir da lista de templates.
 * Suporta fallback por label para dados legados sem templateId.
 */
export function enrichNodes(nodes, templates) {
  return nodes.map((node) => {
    const templateConfig =
      node.data.templateId != null
        ? templates.find((t) => t.id === node.data.templateId)
        : templates.find((t) => t.label === node.data.label)

    if (!templateConfig) return node

    return {
      ...node,
      data: {
        ...node.data,
        templateId: templateConfig.id,
        maxConnections: templateConfig.options?.length ?? null,
      },
    }
  })
}

/**
 * Enriquece as arestas com o label da opção correspondente ao optionId salvo.
 */
export function enrichEdges(edges, nodes, templates) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  return edges.map((edge) => {
    const optionId = edge.data?.optionId
    if (optionId == null) return edge

    const sourceNode = nodeMap[edge.source]
    const templateConfig =
      sourceNode?.data?.templateId != null
        ? templates.find((t) => t.id === sourceNode.data.templateId)
        : null

    const optionLabel = templateConfig?.options?.find((o) => o.id === optionId)?.label
    return optionLabel ? { ...edge, label: optionLabel } : edge
  })
}
