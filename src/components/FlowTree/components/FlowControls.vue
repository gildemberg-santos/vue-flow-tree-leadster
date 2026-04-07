<template>
  <Controls>
    <template #icon-zoom-in>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </template>

    <template #icon-zoom-out>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </template>

    <template #icon-fit-view>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <circle cx="10" cy="10" r="6.5" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="7" y1="10" x2="13" y2="10" />
        <line x1="10" y1="7" x2="10" y2="13" />
      </svg>
    </template>

    <template #icon-unlock>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    </template>

    <template #icon-lock>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </template>

    <ControlButton
      @click="toggleFullscreen"
      :title="isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'"
    >
      <svg
        v-if="!isFullscreen"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="4 14 10 14 10 20" />
        <polyline points="20 10 14 10 14 4" />
        <line x1="10" y1="14" x2="3" y2="21" />
        <line x1="14" y1="10" x2="21" y2="3" />
      </svg>
    </ControlButton>
  </Controls>
</template>

<script setup>
import { Controls, ControlButton } from '@vue-flow/controls'
import { useFullscreen } from '../composables/useFullscreen'

const { isFullscreen, toggleFullscreen } = useFullscreen()
</script>

<style scoped>
:deep(.vue-flow__controls) {
  background: var(--t-panel-bg);
  border: 1px solid var(--t-panel-border);
  border-radius: 10px;
  box-shadow: none;
  overflow: hidden;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: fit-content;
}

:deep(.vue-flow__controls-button) {
  background: transparent;
  border: none;
  border-bottom: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  padding: 6px;
  color: var(--t-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

:deep(.vue-flow__controls-button:hover) {
  background: var(--t-input-bg);
  color: var(--t-text-primary);
}

:deep(.vue-flow__controls-button:active) {
  background: #2b6cb0;
  color: #fff;
}

:deep(.vue-flow__controls-button svg) {
  width: 14px;
  height: 14px;
  max-width: 14px;
  max-height: 14px;
}

:deep(.vue-flow__controls-button:disabled) {
  opacity: 0.3;
  pointer-events: none;
}
</style>
