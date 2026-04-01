/**
 * Remove conexões inválidas ao carregar dados do storage.
 * Garante consistência sem alterar os nós.
 *
 * @param {Array}  nodes
 * @param {Array}  edges
 * @param {number} maxLevels
 * @returns {Array} edges saneados
 */
export function sanitizeEdges(nodes, edges, maxLevels = 3) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  const seen = new Set()
  const dedupedEdges = edges.filter((edge) => {
    const key = `${edge.source}->${edge.target}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const outgoingCount = {}
  const usedOptionIds = {}

  return dedupedEdges.filter((edge) => {
    const source = nodeMap[edge.source]
    const target = nodeMap[edge.target]

    if (!source || !target) return false
    if (target.data.level <= source.data.level) return false
    if (source.data.level >= maxLevels) return false

    if (source.data.maxConnections != null) {
      outgoingCount[source.id] = (outgoingCount[source.id] ?? 0) + 1
      if (outgoingCount[source.id] > source.data.maxConnections) return false
    }

    const optionId = edge.data?.optionId
    if (optionId != null) {
      if (!usedOptionIds[source.id]) usedOptionIds[source.id] = new Set()
      if (usedOptionIds[source.id].has(optionId)) return false
      usedOptionIds[source.id].add(optionId)
    }

    return true
  })
}
