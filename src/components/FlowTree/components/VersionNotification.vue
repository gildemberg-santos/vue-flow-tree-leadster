<template>
  <Transition name="version-notif">
    <div v-if="visible" class="version-notification" @click="$emit('dismiss')">
      <div class="notif-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
      <div class="notif-content">
        <span class="notif-title">Nova versão disponível!</span>
        <span class="notif-subtitle">Clique para fechar</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['dismiss'])

const visible = ref(true)

function dismiss() {
  visible.value = false
  emit('dismiss')
}

onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, 5000)
})

defineExpose({ dismiss })
</script>

<style scoped>
.version-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  cursor: pointer;
  z-index: 9999;
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 280px;
}

.notif-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notif-title {
  font-weight: 600;
  font-size: 14px;
}

.notif-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.version-notif-enter-active,
.version-notif-leave-active {
  transition: all 0.4s ease;
}

.version-notif-enter-from,
.version-notif-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>