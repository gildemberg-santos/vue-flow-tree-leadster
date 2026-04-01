/**
 * Calcula a posição (x, y) para um novo nó.
 *
 * Estratégia:
 * - Se houver um nó âncora (último selecionado ou raiz), posiciona com offset fixo.
 * - Caso contrário, usa o centro atual do viewport.
 *
 * @param {{ getViewport: Function, nodes: Array, anchorNodeId: string|null }} params
 * @returns {{ x: number, y: number }}
 */
export function calculateNewNodePosition({ getViewport, nodes, anchorNodeId }) {
  const { x: vx, y: vy, zoom } = getViewport()
  const centerX = (window.innerWidth / 2 - vx) / zoom
  const centerY = (window.innerHeight / 2 - vy) / zoom

  const anchor = anchorNodeId
    ? nodes.find((n) => n.id === anchorNodeId)
    : nodes.find((n) => n.data.level === 1)

  return {
    x: anchor ? anchor.position.x + 180 : centerX,
    y: anchor ? anchor.position.y + 170 : centerY,
  }
}
