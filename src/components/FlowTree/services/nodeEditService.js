/**
 * Calcula quais edges sobrevivem após a edição de um nó.
 *
 * Aplica dois filtros em sequência:
 * 1. Remove edges de saída cujo optionId não pertence mais ao template atualizado.
 * 2. Remove edges de saída/entrada incompatíveis com o novo nível do nó.
 *
 * @returns {Array} novo array de edges válidas
 */
export function adjustEdgesForEdit({ edges, nodes, id, newLevel, templateConfig, maxLevels }) {
  let result = edges

  if (templateConfig?.options?.length > 0) {
    const validOptionIds = new Set(templateConfig.options.map((o) => o.id))
    result = result.filter((e) => {
      if (e.source !== id) return true
      const optionId = e.data?.optionId
      return optionId != null && validOptionIds.has(optionId)
    })
  }

  result = result.filter((e) => {
    if (e.source === id) {
      if (newLevel >= maxLevels) return false
      const target = nodes.find((n) => n.id === e.target)
      return target && target.data.level > newLevel
    }
    if (e.target === id) {
      const source = nodes.find((n) => n.id === e.source)
      return source && source.data.level < newLevel
    }
    return true
  })

  return result
}
