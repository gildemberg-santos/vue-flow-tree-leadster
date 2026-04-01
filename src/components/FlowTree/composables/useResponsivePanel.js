import { ref, computed, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 600

export function useResponsivePanel() {
  const windowWidth = ref(window.innerWidth)

  function onResize() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  const isMobile = computed(() => windowWidth.value < MOBILE_BREAKPOINT)
  const isExpanded = ref(false)

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
  }

  const panelMaxHeight = computed(() => {
    if (isMobile.value) return 'none'
    return 'calc(100vh - 32px)'
  })

  return { isMobile, isExpanded, toggleExpanded, panelMaxHeight }
}
