import { computed } from "vue";
import { validateFlow } from "../utils/flowValidator";

export function useFlowTreeValidation({ nodes, edges, maxLevels, templates }) {
  const validation = computed(() => {
    const result = validateFlow(nodes.value, edges.value, maxLevels);

    if (templates.length > 0) {
      const validIds = new Set(templates.map((t) => t.id));
      const orphanErrors = [];

      for (const node of nodes.value) {
        if (
          node.data.templateId == null ||
          !validIds.has(node.data.templateId)
        ) {
          orphanErrors.push(
            `O bloco "${node.data.label}" não possui um template válido.`,
          );
        }
      }

      if (orphanErrors.length > 0) {
        return {
          valid: false,
          errors: [...result.errors, ...orphanErrors],
          suggestions: [
            ...new Set([
              ...result.suggestions,
              "Edite os blocos sem template e selecione um válido.",
            ]),
          ],
        };
      }
    }

    return result;
  });

  return { validation };
}
