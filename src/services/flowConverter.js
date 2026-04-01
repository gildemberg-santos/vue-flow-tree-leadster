/**
 * Converte o formato VueFlow (nodes + edges) para o formato relacional.
 *
 * @param {{ nodes: Array, edges: Array }} flowData
 * @returns {{ blocks: Array, connections: Array }}
 *
 * @example
 * // ENTRADA (formato VueFlow):
 * {
 *   nodes: [
 *     {
 *       id: "abc-123",
 *       type: "custom",
 *       position: { x: 100, y: 200 },
 *       data: { label: "Diretoria", level: 1, templateId: 1, maxConnections: 4 }
 *     },
 *     {
 *       id: "def-456",
 *       type: "custom",
 *       position: { x: 300, y: 400 },
 *       data: { label: "Gerência", level: 2, templateId: 2, maxConnections: 5 }
 *     }
 *   ],
 *   edges: [
 *     { id: "e-abc-123-def-456", source: "abc-123", target: "def-456", animated: true }
 *   ]
 * }
 *
 * // SAÍDA (formato relacional para localStorage):
 * {
 *   blocks: [
 *     { id: "abc-123", template_id: 1, label: "Diretoria", level: 1, x: 100, y: 200 },
 *     { id: "def-456", template_id: 2, label: "Gerência",  level: 2, x: 300, y: 400 }
 *   ],
 *   connections: [
 *     { id: "e-abc-123-def-456", parent_id: "abc-123", child_id: "def-456" }
 *   ]
 * }
 */
export function toRelational({ nodes, edges }) {
  const blocks = nodes.map((n) => ({
    id: n.id,
    template_id: n.data.templateId ?? null,
    label: n.data.label,
    level: n.data.level,
    x: n.position.x,
    y: n.position.y,
  }));

  const connections = edges.map((e) => ({
    id: e.id,
    parent_id: e.source,
    child_id: e.target,
    option_id: e.data?.optionId ?? null,
  }));

  return { blocks, connections };
}

/**
 * Converte o formato relacional para o formato VueFlow (nodes + edges).
 * O campo maxConnections é sempre null após a conversão — deve ser
 * enriquecido pelo consumidor via templateId (ver handleLoad em App.vue).
 *
 * @param {{ blocks: Array, connections: Array }} relationalData
 * @returns {{ nodes: Array, edges: Array }}
 *
 * @example
 * // ENTRADA (formato relacional do localStorage):
 * {
 *   blocks: [
 *     { id: "abc-123", template_id: 1, label: "Diretoria", level: 1, x: 100, y: 200 },
 *     { id: "def-456", template_id: 2, label: "Gerência",  level: 2, x: 300, y: 400 }
 *   ],
 *   connections: [
 *     { id: "e-abc-123-def-456", parent_id: "abc-123", child_id: "def-456" }
 *   ]
 * }
 *
 * // SAÍDA (formato VueFlow — maxConnections null até enriquecimento):
 * {
 *   nodes: [
 *     {
 *       id: "abc-123",
 *       type: "custom",
 *       position: { x: 100, y: 200 },
 *       data: { label: "Diretoria", level: 1, templateId: 1, maxConnections: null }
 *     },
 *     {
 *       id: "def-456",
 *       type: "custom",
 *       position: { x: 300, y: 400 },
 *       data: { label: "Gerência", level: 2, templateId: 2, maxConnections: null }
 *     }
 *   ],
 *   edges: [
 *     { id: "e-abc-123-def-456", source: "abc-123", target: "def-456", animated: true }
 *   ]
 * }
 */
export function fromRelational({ blocks, connections }) {
  const nodes = blocks.map((b) => ({
    id: b.id,
    type: "custom",
    position: { x: b.x, y: b.y },
    data: {
      label: b.label,
      level: b.level,
      templateId: b.template_id ?? null,
      maxConnections: null,
    },
  }));

  const edges = connections.map((c) => ({
    id: c.id,
    source: c.parent_id,
    target: c.child_id,
    animated: true,
    data: { optionId: c.option_id ?? null },
  }));

  return { nodes, edges };
}
