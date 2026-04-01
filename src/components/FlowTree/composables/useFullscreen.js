import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Gerencia o estado de tela cheia e os listeners de DOM associados.
 */
export function useFullscreen() {
  const isFullscreen = ref(false)

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  function onFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement
  }

  onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
  onUnmounted(() => document.removeEventListener('fullscreenchange', onFullscreenChange))

  return { isFullscreen, toggleFullscreen }
}
