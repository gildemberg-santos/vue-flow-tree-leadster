import { describe, it, expect, beforeEach } from 'vitest'
import { useFlowSettings } from './useFlowSettings'

beforeEach(() => {
  localStorage.clear()
})

describe('useFlowSettings', () => {
  describe('estado inicial', () => {
    it('retorna os valores padrão quando localStorage está vazio', () => {
      const { settings } = useFlowSettings()
      expect(settings.value).toEqual({
        showValidationPanel: true,
        showControls: true,
      })
    })

    it('carrega configurações salvas do localStorage', () => {
      localStorage.setItem('vft-settings', JSON.stringify({ showValidationPanel: false }))
      const { settings } = useFlowSettings()
      expect(settings.value.showValidationPanel).toBe(false)
    })

    it('preenche chaves ausentes no localStorage com os padrões', () => {
      localStorage.setItem('vft-settings', JSON.stringify({ showValidationPanel: false }))
      const { settings } = useFlowSettings()
      expect(settings.value.showControls).toBe(true)
    })

    it('usa os padrões quando localStorage tem JSON inválido', () => {
      localStorage.setItem('vft-settings', 'invalido{{{')
      const { settings } = useFlowSettings()
      expect(settings.value).toEqual({
        showValidationPanel: true,
        showControls: true,
      })
    })
  })

  describe('saveSettings', () => {
    it('persiste as configurações no localStorage', () => {
      const { settings, saveSettings } = useFlowSettings()
      settings.value.showValidationPanel = false
      saveSettings()
      const stored = JSON.parse(localStorage.getItem('vft-settings'))
      expect(stored.showValidationPanel).toBe(false)
    })

    it('sobrescreve uma gravação anterior', () => {
      const { settings, saveSettings } = useFlowSettings()
      settings.value.showControls = false
      saveSettings()
      settings.value.showControls = true
      saveSettings()
      const stored = JSON.parse(localStorage.getItem('vft-settings'))
      expect(stored.showControls).toBe(true)
    })

    it('persiste todas as chaves juntas', () => {
      const { settings, saveSettings } = useFlowSettings()
      settings.value.showValidationPanel = false
      settings.value.showControls = false
      saveSettings()
      const stored = JSON.parse(localStorage.getItem('vft-settings'))
      expect(stored).toMatchObject({ showValidationPanel: false, showControls: false })
    })
  })
})
