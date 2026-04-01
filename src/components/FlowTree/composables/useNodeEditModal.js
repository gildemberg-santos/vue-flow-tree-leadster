import { ref, onMounted } from 'vue'

/**
 * Gerencia comportamentos de interação do NodeEditModal:
 * - foco automático no campo de entrada ao montar
 * - seleção de template com atualização do formulário
 */
export function useNodeEditModal({ form, templates }) {
  const inputRef = ref(null)

  onMounted(() => setTimeout(() => inputRef.value?.focus(), 50))

  function onTemplateSelect(e) {
    const selected = templates.find((item) => item.label === e.target.value)
    if (selected) {
      form.value = {
        ...form.value,
        label: selected.label,
        maxConnections: selected.options?.length ?? selected.maxConnections ?? null,
      }
    }
  }

  return { inputRef, onTemplateSelect }
}
