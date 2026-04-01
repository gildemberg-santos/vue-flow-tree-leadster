/**
 * Detecta se adicionar source→target criaria um ciclo no grafo.
 * BFS a partir do target: se alcançar source, há ciclo.
 */
function wouldCreateCycle(source, target, edges) {
  const visited = new Set()
  const queue = [target]

  while (queue.length > 0) {
    const current = queue.shift()
    if (current === source) return true
    if (visited.has(current)) continue
    visited.add(current)
    edges.filter((e) => e.source === current).forEach((e) => queue.push(e.target))
  }

  return false
}

/**
 * Valida se uma conexão é permitida pelas regras da árvore.
 *
 * @param {Object} connection - { source, target }
 * @param {Array}  nodes
 * @param {Array}  edges
 * @param {number} maxLevels
 * @returns {{ valid: boolean, errors: string[], suggestions: string[] }}
 */
export function validateConnection(connection, nodes, edges, maxLevels = 3) {
  const errors = []
  const suggestions = []

  const sourceNode = nodes.find((n) => n.id === connection.source)
  const targetNode = nodes.find((n) => n.id === connection.target)

  if (!sourceNode || !targetNode) {
    errors.push('Nó de origem ou destino não encontrado.')
    return { valid: false, errors, suggestions }
  }

  if (targetNode.data.level <= sourceNode.data.level) {
    errors.push(
      `Conexão inválida (${sourceNode.data.level} → ${targetNode.data.level}). O destino deve ser de um nível superior ao da origem.`,
    )
    suggestions.push('Conecte apenas para blocos de nível superior.')
  }

  const outgoingFromSource = edges.filter((e) => e.source === connection.source)
  if (sourceNode.data.level >= maxLevels) {
    errors.push(`Nós do nível ${maxLevels} (final) não podem ter conexões de saída.`)
    suggestions.push(`O fluxo não pode ultrapassar o nível ${maxLevels}.`)
  } else if (
    sourceNode.data.maxConnections != null &&
    outgoingFromSource.length >= sourceNode.data.maxConnections
  ) {
    errors.push(
      `O bloco "${sourceNode.data.label}" atingiu o limite de saída (${outgoingFromSource.length}/${sourceNode.data.maxConnections}).`,
    )
    suggestions.push('Este bloco atingiu o número máximo de conexões de saída permitido.')
  }

  if (wouldCreateCycle(connection.source, connection.target, edges)) {
    errors.push('Esta conexão criaria um ciclo no fluxo.')
    suggestions.push('Verifique se o nó destino não é ancestral do nó origem.')
  }

  return { valid: errors.length === 0, errors, suggestions }
}
