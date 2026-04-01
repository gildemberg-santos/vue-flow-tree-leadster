/**
 * Retorna o nome descritivo de um nível do fluxo.
 *
 * @param {number} n - Número do nível
 * @param {number} maxLevels - Total de níveis do fluxo
 * @returns {string}
 */
export function levelName(n, maxLevels) {
  if (n === 1) return `Nível 1 — Raiz`
  if (n === maxLevels) return `Nível ${n} — Final`
  return `Nível ${n} — Intermediário`
}
