<template>
  <Transition name="toast">
    <div v-if="saveStatus" class="toast" :class="saveStatus">
      <span
        v-if="saveStatus === 'loading' || saveStatus === 'saving'"
        class="toast-spinner"
      />
      <span v-else class="toast-icon">{{
        saveStatus === "saved" ? "✓" : "✕"
      }}</span>
      <span class="toast-text">{{ label }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  saveStatus: {
    type: String,
    default: "",
  },
});

const label = computed(() => {
  const map = {
    loading: "Carregando dados...",
    saving: "Salvando...",
    saved: "Salvo automaticamente",
    error: "Não salvo — fluxo inválido",
  };
  return map[props.saveStatus] ?? "";
});
</script>

<style scoped>
.toast {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 16px #00000066;
}

.toast.saved {
  background: #001838;
  border: 1px solid #0060d0;
  color: #e8f0ff;
}

.toast.error {
  background: #1e0808;
  border: 1px solid #cc2020;
  color: #ffe0e0;
}

.toast.loading,
.toast.saving {
  background: #001c30;
  border: 1px solid #0090c0;
  color: #d8f4ff;
}

.toast-icon {
  font-size: 14px;
  font-weight: 700;
}

.toast-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid #003848;
  border-top-color: #0090c0;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
