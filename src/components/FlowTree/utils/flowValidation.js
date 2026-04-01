import { validateConnection } from './connectionValidator'

/**
 * Valida o fluxo completo: presença de raiz, conectividade e regras de conexão.
 *
 * @param {Array}  nodes
 * @param {Array}  edges
 * @param {number} maxLevels
 * @returns {{ valid: boolean, errors: string[], suggestions: string[] }}
 */
export function validateFlow(nodes, edges, maxLevels = 3) {
  const errors = []
  const suggestions = []

  if (nodes.length > 0 && !nodes.some((n) => n.data.level === 1)) {
    errors.push('O fluxo precisa ter ao menos um bloco de nível 1 (Raiz).')
    suggestions.push('Adicione ou ajuste um bloco para o nível 1.')
  }

  for (const node of nodes) {
    if (node.data.level === 1) continue
    const hasIncoming = edges.some((e) => e.target === node.id)
    if (!hasIncoming) {
      errors.push(
        `O bloco "${node.data.label}" (nível ${node.data.level}) não possui nenhuma conexão de entrada.`,
      )
      suggestions.push('Conecte todos os blocos a um bloco de nível superior.')
    }
  }

  for (const edge of edges) {
    const result = validateConnection(
      { source: edge.source, target: edge.target },
      nodes,
      edges.filter((e) => e.id !== edge.id),
      maxLevels,
    )
    if (!result.valid) {
      errors.push(...result.errors.map((e) => `[${edge.id}] ${e}`))
      suggestions.push(...result.suggestions)
    }
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
    suggestions: [...new Set(suggestions)],
  }
}
