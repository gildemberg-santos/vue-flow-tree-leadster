export { buildMaxPerLevel, DEFAULT_NODES, DEFAULT_EDGES };

import { ref } from "vue";
import {
  DEFAULT_NODES,
  DEFAULT_EDGES,
  buildMaxPerLevel,
} from "./useFlowTreeState";
import { useFlowTreePersistence } from "./useFlowTreePersistence";
import { useFlowTreeValidation } from "./useFlowTreeValidation";
import { useFlowTreeNodes } from "./useFlowTreeNodes";
import { useFlowTreeConnections } from "./useFlowTreeConnections";

export function useFlowTree({
  onSave,
  onLoad,
  onGenerateId,
  maxLevels = 3,
  templates = [],
} = {}) {
  const nodes = ref(DEFAULT_NODES);
  const edges = ref(DEFAULT_EDGES);

  const persistence = useFlowTreePersistence({
    nodes,
    edges,
    maxLevels,
    onSave,
    onLoad,
  });

  // Inicializa snapshot após setup completo
  persistence.initSnapshot();

  const validation = useFlowTreeValidation({
    nodes,
    edges,
    maxLevels,
    templates,
  });

  const nodeHandlers = useFlowTreeNodes({
    nodes,
    edges,
    maxLevels,
    templates,
    onGenerateId,
  });

  const connections = useFlowTreeConnections({
    nodes,
    edges,
    maxLevels,
    templates,
  });

  return {
    nodes,
    edges,
    validation: validation.validation,
    saveStatus: persistence.saveStatus,
    manualSave: persistence.manualSave,
    ...nodeHandlers,
    ...connections,
  };
}
