import { ref } from 'vue'
import { calculateFlowLevels } from '../utils/flowValidator'
import { adjustEdgesForEdit } from '../services/nodeEditService'

export function useEditNode({ nodes, edges, maxLevels, templates, maxPerLevel }) {
  const editingNode = ref(null)
  const editForm = ref({ label: '', level: 2, maxConnections: null })
  const editNodeError = ref('')

  function onNodeDoubleClick({ node }) {
    editingNode.value = node
    editForm.value = {
      label: node.data.label,
      level: node.data.level,
      maxConnections: node.data.maxConnections ?? null,
    }
    editNodeError.value = ''
  }

  function saveEdit() {
    const label = editForm.value.label.trim()
    if (!label) return

    const id = editingNode.value.id
    const newLevel = editForm.value.level
    const templateConfig = templates.find((t) => t.label === label)
    const newMaxConnections = templateConfig?.options?.length ?? null

    const existingAtLevel = nodes.value.filter((n) => n.id !== id && n.data.level === newLevel)
    if (existingAtLevel.length >= maxPerLevel[newLevel]) {
      editNodeError.value = `Nível ${newLevel} já atingiu o limite de ${maxPerLevel[newLevel]} nó(s).`
      return
    }

    const survivingOutgoing = edges.value.filter((e) => {
      if (e.source !== id) return false
      if (newLevel >= maxLevels) return false
      const target = nodes.value.find((n) => n.id === e.target)
      return target && target.data.level > newLevel
    })

    if (newMaxConnections != null && survivingOutgoing.length > newMaxConnections) {
      editNodeError.value = `"${label}" permite no máx. ${newMaxConnections} saída(s), mas o nó já possui ${survivingOutgoing.length} conexão(ões) válida(s).`
      return
    }

    editNodeError.value = ''

    edges.value = adjustEdgesForEdit({
      edges: edges.value,
      nodes: nodes.value,
      id,
      newLevel,
      templateConfig,
      maxLevels,
    })

    nodes.value = nodes.value.map((n) =>
      n.id === id
        ? { ...n, data: { ...n.data, label, level: newLevel, templateId: templateConfig?.id ?? null, maxConnections: newMaxConnections } }
        : n,
    )
    nodes.value = calculateFlowLevels(nodes.value, edges.value, maxLevels)
    editingNode.value = null
  }

  return { editingNode, editForm, editNodeError, onNodeDoubleClick, saveEdit }
}
