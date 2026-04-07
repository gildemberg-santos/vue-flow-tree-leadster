<template>
  <div class="layout">
    <!-- Top bar -->
    <header class="topbar">
      <div class="topbar-left">
        <!-- <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen" title="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button> -->
        <div class="logo">
          <span class="logo-icon">◈</span>
          <span class="logo-text">Leadster</span>
        </div>
      </div>
      <!-- <nav class="topbar-nav">
        <a class="nav-link">Dashboard</a>
        <a class="nav-link active">Fluxos</a>
        <a class="nav-link">Relatórios</a>
        <a class="nav-link">Configurações</a>
      </nav>
      <div class="topbar-right">
        <div class="avatar">GS</div>
      </div> -->
    </header>

    <div class="body">
      <!-- Sidebar -->
      <!--
      <aside class="sidebar" :class="{ collapsed: !sidebarOpen }">
        <nav class="sidebar-nav">
          <div class="sidebar-section-label">Principal</div>
          <a class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a class="sidebar-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M2 12h3m14 0h3M12 2v3m0 14v3" />
            </svg>
            <span>Editor de Fluxo</span>
          </a>
          <a class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Leads</span>
          </a>
          <a class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Relatórios</span>
          </a>
          <div class="sidebar-section-label">Configuração</div>
          <a class="sidebar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Configurações</span>
          </a>
        </nav>
      </aside>
      -->

      <!-- Main content -->
      <main class="main">
        <div class="page-header">
          <div>
            <div class="breadcrumb">Fluxos <span class="sep">/</span> Editor</div>
            <h2 class="page-title">Editor de Fluxo</h2>
          </div>
          <!-- <div class="page-actions">
            <button class="btn-secondary">Duplicar</button>
            <button class="btn-primary">Publicar</button>
          </div> -->
        </div>

        <div class="flow-area">
          <FlowTree :on-load="handleLoad" :on-save="handleSave" :on-generate-id="generateId" :templates="flowTemplates"
            :max-levels="10" :fullscreen="false" />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2025 Leadster · Todos os direitos reservados</span>
      <span>v{{ version }}</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { version } from '../package.json'
import FlowTree from "./components/FlowTree/index.js"
import { save, load, generateId } from "./services/flowStorageService.js"
import { toRelational, fromRelational } from "./services/flowConverter.js"
import { enrichNodes, enrichEdges } from "./services/templateEnricher.js"
import { flowTemplates } from "./config/flowTemplates.js"

const sidebarOpen = ref(true)

async function handleLoad() {
  const data = await load()
  if (!data) return null
  const result = fromRelational(data)
  result.nodes = enrichNodes(result.nodes, flowTemplates)
  result.edges = enrichEdges(result.edges, result.nodes, flowTemplates)
  return result
}

async function handleSave(data) {
  await save(toRelational(data))
}
</script>

<style scoped>
/* ── Layout shell ──────────────────────────────────────────────────────── */
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0d1117;
  color: #c9d1d9;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* ── Topbar ─────────────────────────────────────────────────────────────── */
.topbar {
  height: 52px;
  background: #161b22;
  border-bottom: 1px solid #21262d;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  flex-shrink: 0;
  z-index: 100;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-toggle {
  background: transparent;
  border: none;
  color: #8b949e;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 6px;
}

.sidebar-toggle:hover {
  background: #21262d;
  color: #c9d1d9;
}

.sidebar-toggle svg {
  width: 18px;
  height: 18px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: #f0f6fc;
}

.logo-icon {
  color: #58a6ff;
  font-size: 18px;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  margin-left: 8px;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #8b949e;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: #21262d;
  color: #c9d1d9;
}

.nav-link.active {
  color: #f0f6fc;
  background: #21262d;
}

.topbar-right {
  margin-left: auto;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1f6feb;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ── Body (sidebar + main) ──────────────────────────────────────────────── */
.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Sidebar ────────────────────────────────────────────────────────────── */
.sidebar {
  width: 220px;
  background: #161b22;
  border-right: 1px solid #21262d;
  flex-shrink: 0;
  overflow-y: auto;
  transition: width 0.2s ease;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.sidebar-section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #484f58;
  padding: 12px 8px 4px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #8b949e;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.sidebar-item:hover {
  background: #21262d;
  color: #c9d1d9;
}

.sidebar-item.active {
  background: #1f3d5c;
  color: #58a6ff;
}

.sidebar-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ── Main ───────────────────────────────────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0d1117;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 12px;
  border-bottom: 1px solid #21262d;
  flex-shrink: 0;
}

.breadcrumb {
  font-size: 12px;
  color: #484f58;
  margin-bottom: 4px;
}

.breadcrumb .sep {
  margin: 0 4px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #f0f6fc;
}

.page-actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.btn-primary {
  background: #238636;
  color: #fff;
}

.btn-primary:hover {
  background: #2ea043;
}

.btn-secondary {
  background: #21262d;
  color: #c9d1d9;
  border: 1px solid #30363d;
}

.btn-secondary:hover {
  background: #30363d;
}

.flow-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
.footer {
  height: 36px;
  background: #161b22;
  border-top: 1px solid #21262d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 11px;
  color: #484f58;
  flex-shrink: 0;
}
</style>
