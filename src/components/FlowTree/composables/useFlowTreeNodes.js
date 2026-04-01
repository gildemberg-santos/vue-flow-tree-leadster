import { calculateFlowLevels } from '../utils/flowValidator'
import { buildMaxPerLevel } from './useFlowTreeState'
import { useAddNode } from './useAddNode'
import { useEditNode } from './useEditNode'

export function useFlowTreeNodes({ nodes, edges, maxLevels, templates, onGenerateId }) {
  const maxPerLevel = buildMaxPerLevel(maxLevels)

  const addNode = useAddNode({ nodes, maxLevels, templates, onGenerateId, maxPerLevel })
  const editNode = useEditNode({ nodes, edges, maxLevels, templates, maxPerLevel })

  function onNodeDragStop({ node }) {
    const target = nodes.value.find((n) => n.id === node.id)
    if (target) target.position = { x: node.position.x, y: node.position.y }
  }

  function deleteNodeById(id) {
    nodes.value = nodes.value.filter((n) => n.id !== id)
    edges.value = edges.value.filter((e) => e.source !== id && e.target !== id)
    nodes.value = calculateFlowLevels(nodes.value, edges.value, maxLevels)
  }

  return {
    nodes,
    edges,
    ...addNode,
    ...editNode,
    onNodeDragStop,
    deleteNodeById,
  }
}
