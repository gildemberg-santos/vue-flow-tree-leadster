/**
 * Calcula os níveis dos blocos com base nas conexões (edges).
 * Algoritmo BFS topológico: raiz recebe nível 1, cada filho recebe
 * max(nível dos pais) + 1, limitado a maxLevels.
 *
 * @param {Array}  nodes
 * @param {Array}  edges
 * @param {number} maxLevels
 * @returns {Array} nodes com data.level atualizado
 */
export function calculateFlowLevels(nodes, edges, maxLevels = 3) {
  if (!nodes) return []

  const nodeMap = {}
  const adj = {}
  const inDegree = {}

  nodes.forEach((node) => {
    nodeMap[node.id] = { ...node, data: { ...node.data, level: 0 } }
    adj[node.id] = []
    inDegree[node.id] = 0
  })

  if (edges) {
    edges.forEach((edge) => {
      if (adj[edge.source] && nodeMap[edge.target]) {
        adj[edge.source].push(edge.target)
        inDegree[edge.target]++
      }
    })
  }

  let queue = []
  let hasRoot = false
  Object.keys(inDegree).forEach((id) => {
    if (inDegree[id] === 0) {
      nodeMap[id].data.level = hasRoot ? maxLevels : 1
      hasRoot = true
      queue.push(id)
    }
  })

  while (queue.length > 0) {
    const uId = queue.shift()
    const currentLevel = nodeMap[uId].data.level

    adj[uId].forEach((vId) => {
      const targetLevel = Math.min(currentLevel + 1, maxLevels)
      if (targetLevel > nodeMap[vId].data.level) {
        nodeMap[vId].data.level = targetLevel
      }
      inDegree[vId]--
      if (inDegree[vId] === 0) queue.push(vId)
    })
  }

  return Object.values(nodeMap)
}
