import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { calculateNewNodePosition } from '../utils/nodePositionCalculator'

export function useAddNode({ nodes, maxLevels, templates, onGenerateId, maxPerLevel }) {
  const { getViewport } = useVueFlow()

  const showAddModal = ref(false)
  const addForm = ref({ label: '', level: maxLevels, maxConnections: null })
  const addNodeError = ref('')
  const lastSelectedNode = ref(null)

  function openAddModal() {
    addForm.value = { label: '', level: maxLevels, maxConnections: null }
    addNodeError.value = ''
    showAddModal.value = true
  }

  function addNode() {
    const label = addForm.value.label.trim()
    if (!label) return

    const existingAtLevel = nodes.value.filter((n) => n.data.level === addForm.value.level)
    if (existingAtLevel.length >= maxPerLevel[addForm.value.level]) {
      addNodeError.value = `Nível ${addForm.value.level} já atingiu o limite de ${maxPerLevel[addForm.value.level]} nó(s).`
      return
    }

    addNodeError.value = ''

    const position = calculateNewNodePosition({
      getViewport,
      nodes: nodes.value,
      anchorNodeId: lastSelectedNode.value?.id ?? null,
    })

    const templateConfig = templates.find((t) => t.label === label)
    nodes.value.push({
      id: onGenerateId?.() ?? crypto.randomUUID(),
      type: 'custom',
      position,
      data: {
        label,
        level: addForm.value.level,
        templateId: templateConfig?.id ?? null,
        maxConnections: templateConfig?.options?.length ?? null,
      },
    })
    showAddModal.value = false
  }

  function onNodeClick({ node }) {
    lastSelectedNode.value = node
  }

  return { showAddModal, addForm, addNodeError, lastSelectedNode, openAddModal, addNode, onNodeClick }
}
