<template>
  <div
    class="panel-title"
    :class="[isMobile ? 'panel-title--mobile' : 'panel-title--desktop', { clickable: isMobile }]"
    @click="isMobile && emit('toggle')"
  >
    <span class="status-dot" :class="valid ? 'dot-valid' : 'dot-invalid'"></span>
    <strong class="title-text">{{ valid ? 'Fluxo Válido' : 'Fluxo Inválido' }}</strong>
    <svg
      v-if="isMobile"
      class="chevron"
      :class="{ open: isExpanded }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  valid: { type: Boolean, required: true },
  isMobile: { type: Boolean, required: true },
  isExpanded: { type: Boolean, required: true },
})

const emit = defineEmits(['toggle'])
</script>

<style scoped>
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  flex-shrink: 0;
}

.panel-title--desktop { padding-bottom: 10px; }
.panel-title--mobile  { padding: 14px 0; cursor: default; }

.panel-title.clickable {
  cursor: pointer;
  user-select: none;
}

.title-text { flex: 1; }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-valid   { background: #0070f0; box-shadow: 0 0 6px rgba(0, 112, 240, 0.7); }
.dot-invalid { background: #e53e3e; box-shadow: 0 0 6px rgba(229, 62, 62, 0.7); }

.chevron {
  width: 16px;
  height: 16px;
  color: var(--t-text-muted);
  transition: transform 0.25s ease;
  transform: rotate(180deg);
}

.chevron.open { transform: rotate(0deg); }
</style>
