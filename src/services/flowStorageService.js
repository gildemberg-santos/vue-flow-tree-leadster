/**
 * Serviço de persistência relacional simulada via localStorage.
 *
 * "Tabelas":
 *   vft-blocks       → blocos (id, template_id, label, level, x, y)
 *   vft-connections  → ligações (id, parent_id, child_id)
 */

const KEY_BLOCKS = "vft-blocks";
const KEY_CONNECTIONS = "vft-connections";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gera um ID único no formato UUIDv4.
 * @returns {string}  ex: "110e8400-e29b-41d4-a716-446655440000"
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Persiste os dados relacionais no localStorage.
 *
 * @param {{ blocks: Array, connections: Array }} data
 *
 * @example
 * // ENTRADA:
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
 * // EFEITO (localStorage após execução):
 * // "vft-blocks"      → '[{"id":"abc-123","template_id":1,"label":"Diretoria","level":1,"x":100,"y":200},...]'
 * // "vft-connections" → '[{"id":"e-abc-123-def-456","parent_id":"abc-123","child_id":"def-456"}]'
 */
export async function save({ blocks, connections }) {
  await delay(0);
  localStorage.setItem(KEY_BLOCKS, JSON.stringify(blocks));
  localStorage.setItem(KEY_CONNECTIONS, JSON.stringify(connections));
}

/**
 * Carrega os dados relacionais do localStorage.
 * Retorna null se não houver dados salvos ou se ocorrer erro de parse.
 *
 * @returns {Promise<{ blocks: Array, connections: Array } | null>}
 *
 * @example
 * // ESTADO DO localStorage (entrada implícita):
 * // "vft-blocks"      → '[{"id":"abc-123","template_id":1,"label":"Diretoria","level":1,"x":100,"y":200}]'
 * // "vft-connections" → '[{"id":"e-abc-123-def-456","parent_id":"abc-123","child_id":"def-456"}]'
 *
 * // SAÍDA (com dados salvos):
 * {
 *   blocks: [
 *     { id: "abc-123", template_id: 1, label: "Diretoria", level: 1, x: 100, y: 200 }
 *   ],
 *   connections: [
 *     { id: "e-abc-123-def-456", parent_id: "abc-123", child_id: "def-456" }
 *   ]
 * }
 *
 * // SAÍDA (sem dados salvos ou erro):
 * null
 */
export async function load() {
  await delay(0);
  try {
    const blocks = JSON.parse(localStorage.getItem(KEY_BLOCKS));
    const connections = JSON.parse(localStorage.getItem(KEY_CONNECTIONS));
    return blocks && connections ? { blocks, connections } : null;
  } catch {
    return null;
  }
}
