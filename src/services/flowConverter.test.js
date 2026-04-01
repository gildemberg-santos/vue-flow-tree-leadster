import { describe, it, expect } from 'vitest';
import { toRelational, fromRelational } from './flowConverter.js';

describe('flowConverter', () => {
  it('toRelational converte VueFlow para relacional', () => {
    const input = {
      nodes: [
        {
          id: 'abc-123',
          type: 'custom',
          position: { x: 100, y: 200 },
          data: { label: 'Diretoria', level: 1, templateId: 1, maxConnections: 4 }
        },
        {
          id: 'def-456',
          type: 'custom',
          position: { x: 300, y: 400 },
          data: { label: 'Gerência', level: 2, templateId: 2, maxConnections: 5 }
        }
      ],
      edges: [
        { id: 'e-abc-123-def-456', source: 'abc-123', target: 'def-456', animated: true }
      ]
    };
    const expected = {
      blocks: [
        { id: 'abc-123', template_id: 1, label: 'Diretoria', level: 1, x: 100, y: 200 },
        { id: 'def-456', template_id: 2, label: 'Gerência',  level: 2, x: 300, y: 400 }
      ],
      connections: [
        { id: 'e-abc-123-def-456', parent_id: 'abc-123', child_id: 'def-456', option_id: null }
      ]
    };
    expect(toRelational(input)).toEqual(expected);
  });

  it('fromRelational converte relacional para VueFlow', () => {
    const input = {
      blocks: [
        { id: 'abc-123', template_id: 1, label: 'Diretoria', level: 1, x: 100, y: 200 },
        { id: 'def-456', template_id: 2, label: 'Gerência',  level: 2, x: 300, y: 400 }
      ],
      connections: [
        { id: 'e-abc-123-def-456', parent_id: 'abc-123', child_id: 'def-456' }
      ]
    };
    const expected = {
      nodes: [
        {
          id: 'abc-123',
          type: 'custom',
          position: { x: 100, y: 200 },
          data: { label: 'Diretoria', level: 1, templateId: 1, maxConnections: null }
        },
        {
          id: 'def-456',
          type: 'custom',
          position: { x: 300, y: 400 },
          data: { label: 'Gerência', level: 2, templateId: 2, maxConnections: null }
        }
      ],
      edges: [
        { id: 'e-abc-123-def-456', source: 'abc-123', target: 'def-456', animated: true, data: { optionId: null } }
      ]
    };
    expect(fromRelational(input)).toEqual(expected);
  });
});
