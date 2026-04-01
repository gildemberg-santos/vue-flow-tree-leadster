import { describe, it, expect } from 'vitest'
import { flowTemplates } from './flowTemplates'

describe('flowTemplates.js', () => {
  describe('flowTemplates', () => {
    it('é um array', () => {
      expect(Array.isArray(flowTemplates)).toBe(true)
    })

    it('possui templates definidos', () => {
      expect(flowTemplates.length).toBeGreaterThan(0)
    })

    it('cada template possui id e label', () => {
      flowTemplates.forEach((template) => {
        expect(template).toHaveProperty('id')
        expect(template).toHaveProperty('label')
      })
    })

    it('cada template possui options array', () => {
      flowTemplates.forEach((template) => {
        expect(template).toHaveProperty('options')
        expect(Array.isArray(template.options)).toBe(true)
      })
    })

    it('todos os ids são únicos', () => {
      const ids = flowTemplates.map((t) => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('todos os labels são strings não vazias', () => {
      flowTemplates.forEach((template) => {
        expect(typeof template.label).toBe('string')
        expect(template.label.length).toBeGreaterThan(0)
      })
    })

    it('cada option possui id e label', () => {
      flowTemplates.forEach((template) => {
        template.options.forEach((option) => {
          expect(option).toHaveProperty('id')
          expect(option).toHaveProperty('label')
        })
      })
    })

    it('todos os option ids são únicos no array total', () => {
      const allOptionIds = flowTemplates.flatMap((t) => t.options.map((o) => o.id))
      const uniqueOptionIds = new Set(allOptionIds)
      expect(uniqueOptionIds.size).toBe(allOptionIds.length)
    })
  })

  describe('templates específicos', () => {
    it('contém template "Diretoria"', () => {
      const diretoria = flowTemplates.find((t) => t.label === 'Diretoria')
      expect(diretoria).toBeDefined()
      expect(diretoria.options.length).toBe(4)
    })

    it('contém template "Gerência"', () => {
      const gerencia = flowTemplates.find((t) => t.label === 'Gerência')
      expect(gerencia).toBeDefined()
      expect(gerencia.options.length).toBe(5)
    })

    it('contém template "Desenvolvimento"', () => {
      const desenvolvimento = flowTemplates.find((t) => t.label === 'Desenvolvimento')
      expect(desenvolvimento).toBeDefined()
      expect(desenvolvimento.options.length).toBe(6)
    })

    it('contém template "Produto"', () => {
      const produto = flowTemplates.find((t) => t.label === 'Produto')
      expect(produto).toBeDefined()
    })

    it('contém template "QA / Qualidade"', () => {
      const qa = flowTemplates.find((t) => t.label === 'QA / Qualidade')
      expect(qa).toBeDefined()
      expect(qa.options.length).toBe(3)
    })

    it('contém template "DevOps"', () => {
      const devops = flowTemplates.find((t) => t.label === 'DevOps')
      expect(devops).toBeDefined()
      expect(devops.options.length).toBe(2)
    })

    it('contém template "Produção"', () => {
      const producao = flowTemplates.find((t) => t.label === 'Produção')
      expect(producao).toBeDefined()
    })

    it('contém template "Manutenção"', () => {
      const manutencao = flowTemplates.find((t) => t.label === 'Manutenção')
      expect(manutencao).toBeDefined()
      expect(manutencao.options.length).toBe(4)
    })
  })

  describe('estrutura de opções', () => {
    it('opções podem ter múltiplos items', () => {
      const templatesWithManyOptions = flowTemplates.filter((t) => t.options.length > 4)
      expect(templatesWithManyOptions.length).toBeGreaterThan(0)
    })

    it('opções podem ter apenas 1 item', () => {
      const templatesWithOneOption = flowTemplates.filter((t) => t.options.length === 1)
      expect(templatesWithOneOption.length).toBeGreaterThan(0)
    })

    it('opções podem ter 0 items', () => {
      const templatesWithNoOptions = flowTemplates.filter((t) => t.options.length === 0)
      expect(templatesWithNoOptions.length).toBeGreaterThan(0)
    })

    it('todas as opções de "Desenvolvimento" são válidas', () => {
      const desenvolvimento = flowTemplates.find((t) => t.label === 'Desenvolvimento')
      const validOptions = ['Feature', 'Bugfix', 'Refactor', 'Hotfix', 'Release', 'Infra']
      desenvolvimento.options.forEach((option) => {
        expect(validOptions).toContain(option.label)
      })
    })
  })

  describe('ranges de ids', () => {
    it('ids de template vão de 1 a N', () => {
      const ids = flowTemplates.map((t) => t.id)
      const maxId = Math.max(...ids)
      const minId = Math.min(...ids)
      expect(minId).toBe(1)
      expect(maxId).toBe(ids.length)
    })

    it('ids de opções seguem padrão centena (101, 102, ...)', () => {
      const allOptionIds = flowTemplates.flatMap((t) => t.options.map((o) => o.id))
      expect(allOptionIds.some((id) => id >= 100)).toBe(true)
    })
  })
})
