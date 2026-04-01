import { describe, it, expect, beforeEach } from 'vitest'
import { useFlowTheme } from './useFlowTheme'

beforeEach(() => {
  localStorage.clear()
})

describe('useFlowTheme', () => {
  describe('estado inicial', () => {
    it('usa tema dark quando localStorage está vazio', () => {
      const { theme } = useFlowTheme()
      expect(theme.value).toBe('dark')
    })

    it('carrega tema salvo do localStorage', () => {
      localStorage.setItem('vft-theme', 'light')
      const { theme } = useFlowTheme()
      expect(theme.value).toBe('light')
    })
  })

  describe('isDark', () => {
    it('é true quando tema é dark', () => {
      const { isDark } = useFlowTheme()
      expect(isDark.value).toBe(true)
    })

    it('é false quando tema é light', () => {
      localStorage.setItem('vft-theme', 'light')
      const { isDark } = useFlowTheme()
      expect(isDark.value).toBe(false)
    })
  })

  describe('themeVars', () => {
    it('retorna variáveis do tema dark por padrão', () => {
      const { themeVars } = useFlowTheme()
      expect(themeVars.value['--t-bg']).toBe('#000000')
    })

    it('retorna variáveis do tema light quando carregado', () => {
      localStorage.setItem('vft-theme', 'light')
      const { themeVars } = useFlowTheme()
      expect(themeVars.value['--t-bg']).toBe('#eef5ff')
    })

    it('contém todas as variáveis CSS esperadas', () => {
      const expectedVars = [
        '--t-bg', '--t-panel-bg', '--t-section-bg', '--t-input-bg',
        '--t-panel-border', '--t-input-border',
        '--t-text-primary', '--t-text-secondary', '--t-text-muted',
        '--t-grid-color', '--t-badge-bg', '--t-badge-border', '--t-badge-text',
        '--t-overlay',
      ]
      const { themeVars } = useFlowTheme()
      expectedVars.forEach((v) => expect(themeVars.value).toHaveProperty(v))
    })
  })

  describe('toggleTheme', () => {
    it('alterna de dark para light', () => {
      const { theme, toggleTheme } = useFlowTheme()
      toggleTheme()
      expect(theme.value).toBe('light')
    })

    it('alterna de light para dark', () => {
      localStorage.setItem('vft-theme', 'light')
      const { theme, toggleTheme } = useFlowTheme()
      toggleTheme()
      expect(theme.value).toBe('dark')
    })

    it('persiste o novo tema no localStorage', () => {
      const { toggleTheme } = useFlowTheme()
      toggleTheme()
      expect(localStorage.getItem('vft-theme')).toBe('light')
    })

    it('atualiza themeVars após alternância', () => {
      const { themeVars, toggleTheme } = useFlowTheme()
      expect(themeVars.value['--t-bg']).toBe('#000000')
      toggleTheme()
      expect(themeVars.value['--t-bg']).toBe('#eef5ff')
    })

    it('dois toggles retornam ao tema original', () => {
      const { theme, toggleTheme } = useFlowTheme()
      toggleTheme()
      toggleTheme()
      expect(theme.value).toBe('dark')
    })
  })
})
