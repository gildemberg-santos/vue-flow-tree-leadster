export function buildMaxPerLevel(maxLevels) {
  const map = {};
  for (let i = 1; i <= maxLevels; i++) {
    map[i] = Math.pow(3, i - 1);
  }
  return map;
}

export const DEFAULT_NODES = [];

export const DEFAULT_EDGES = [];
