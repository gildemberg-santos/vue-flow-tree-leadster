import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFlowSettings } from './useFlowSettings'

vi.mock('../../../../package.json', () => ({
  version: '1.0.0'
}))

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
        lastVersionSeen: '1.0.0',
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
        lastVersionSeen: '1.0.0',
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

  describe('hasNewVersion', () => {
    it('retorna false quando é primeira vez (lastVersionSeen null)', () => {
      localStorage.setItem('vft-settings', JSON.stringify({ lastVersionSeen: null }))
      const { hasNewVersion } = useFlowSettings()
      expect(hasNewVersion.value).toBe(false)
    })

    it('retorna false quando versão atual é igual à salva', () => {
      localStorage.setItem('vft-settings', JSON.stringify({ lastVersionSeen: '1.0.0' }))
      const { hasNewVersion } = useFlowSettings()
      expect(hasNewVersion.value).toBe(false)
    })

    it('retorna true quando versão salva é diferente da atual', () => {
      localStorage.setItem('vft-settings', JSON.stringify({ lastVersionSeen: '0.9.0' }))
      const { hasNewVersion } = useFlowSettings()
      expect(hasNewVersion.value).toBe(true)
    })
  })

  describe('dismissVersionNotification', () => {
    it('atualiza lastVersionSeen e define hasNewVersion como false', () => {
      localStorage.setItem('vft-settings', JSON.stringify({ lastVersionSeen: '0.9.0' }))
      const { hasNewVersion, dismissVersionNotification, settings } = useFlowSettings()
      expect(hasNewVersion.value).toBe(true)
      dismissVersionNotification()
      expect(hasNewVersion.value).toBe(false)
      expect(settings.value.lastVersionSeen).toBe('1.0.0')
    })
  })
})
