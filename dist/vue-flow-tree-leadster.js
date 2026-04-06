import { ref as C, watch as Le, computed as V, inject as me, openBlock as v, createElementBlock as m, unref as f, normalizeStyle as D, createVNode as k, createElementVNode as r, toDisplayString as x, createCommentVNode as $, normalizeClass as _, withModifiers as z, Fragment as F, withCtx as I, onMounted as G, onUnmounted as pe, createBlock as B, normalizeProps as le, guardReactiveProps as se, createStaticVNode as De, renderList as O, createTextVNode as ge, useCssVars as Pe, withDirectives as X, vShow as je, useModel as be, withKeys as ze, vModelText as ye, vModelSelect as Re, mergeModels as J, reactive as ae, Transition as xe, provide as ie, isRef as re } from "vue";
import { useVueFlow as ke, Handle as ue, Position as de, getBezierPath as Ue, BaseEdge as Ye, EdgeLabelRenderer as He, VueFlow as Xe } from "@vue-flow/core";
import { Background as Je } from "@vue-flow/background";
import { Controls as Ke, ControlButton as Ge } from "@vue-flow/controls";
function We(e) {
  const o = {};
  for (let t = 1; t <= e; t++)
    o[t] = Math.pow(3, t - 1);
  return o;
}
const Z = [], ee = [];
function K(e, o, t = 3) {
  if (!e) return [];
  const s = {}, n = {}, l = {};
  e.forEach((a) => {
    s[a.id] = { ...a, data: { ...a.data, level: 0 } }, n[a.id] = [], l[a.id] = 0;
  }), o && o.forEach((a) => {
    n[a.source] && s[a.target] && (n[a.source].push(a.target), l[a.target]++);
  });
  let i = [], d = !1;
  for (Object.keys(l).forEach((a) => {
    l[a] === 0 && (s[a].data.level = d ? t : 1, d = !0, i.push(a));
  }); i.length > 0; ) {
    const a = i.shift(), u = s[a].data.level;
    n[a].forEach((c) => {
      const g = Math.min(u + 1, t);
      g > s[c].data.level && (s[c].data.level = g), l[c]--, l[c] === 0 && i.push(c);
    });
  }
  return Object.values(s);
}
function Qe(e, o, t) {
  const s = /* @__PURE__ */ new Set(), n = [o];
  for (; n.length > 0; ) {
    const l = n.shift();
    if (l === e) return !0;
    s.has(l) || (s.add(l), t.filter((i) => i.source === l).forEach((i) => n.push(i.target)));
  }
  return !1;
}
function he(e, o, t, s = 3) {
  const n = [], l = [], i = o.find((u) => u.id === e.source), d = o.find((u) => u.id === e.target);
  if (!i || !d)
    return n.push("Nó de origem ou destino não encontrado."), { valid: !1, errors: n, suggestions: l };
  d.data.level <= i.data.level && (n.push(
    `Conexão inválida (${i.data.level} → ${d.data.level}). O destino deve ser de um nível superior ao da origem.`
  ), l.push("Conecte apenas para blocos de nível superior."));
  const a = t.filter((u) => u.source === e.source);
  return i.data.level >= s ? (n.push(`Nós do nível ${s} (final) não podem ter conexões de saída.`), l.push(`O fluxo não pode ultrapassar o nível ${s}.`)) : i.data.maxConnections != null && a.length >= i.data.maxConnections && (n.push(
    `O bloco "${i.data.label}" atingiu o limite de saída (${a.length}/${i.data.maxConnections}).`
  ), l.push("Este bloco atingiu o número máximo de conexões de saída permitido.")), Qe(e.source, e.target, t) && (n.push("Esta conexão criaria um ciclo no fluxo."), l.push("Verifique se o nó destino não é ancestral do nó origem.")), { valid: n.length === 0, errors: n, suggestions: l };
}
function Y(e, o, t = 3) {
  const s = Object.fromEntries(e.map((a) => [a.id, a])), n = /* @__PURE__ */ new Set(), l = o.filter((a) => {
    const u = `${a.source}->${a.target}`;
    return n.has(u) ? !1 : (n.add(u), !0);
  }), i = {}, d = {};
  return l.filter((a) => {
    var y;
    const u = s[a.source], c = s[a.target];
    if (!u || !c || c.data.level <= u.data.level || u.data.level >= t || u.data.maxConnections != null && (i[u.id] = (i[u.id] ?? 0) + 1, i[u.id] > u.data.maxConnections))
      return !1;
    const g = (y = a.data) == null ? void 0 : y.optionId;
    if (g != null) {
      if (d[u.id] || (d[u.id] = /* @__PURE__ */ new Set()), d[u.id].has(g)) return !1;
      d[u.id].add(g);
    }
    return !0;
  });
}
function Q(e, o, t = 3) {
  const s = [], n = [];
  e.length > 0 && !e.some((l) => l.data.level === 1) && (s.push("O fluxo precisa ter ao menos um bloco de nível 1 (Raiz)."), n.push("Adicione ou ajuste um bloco para o nível 1."));
  for (const l of e) {
    if (l.data.level === 1) continue;
    o.some((d) => d.target === l.id) || (s.push(
      `O bloco "${l.data.label}" (nível ${l.data.level}) não possui nenhuma conexão de entrada.`
    ), n.push("Conecte todos os blocos a um bloco de nível superior."));
  }
  for (const l of o) {
    const i = he(
      { source: l.source, target: l.target },
      e,
      o.filter((d) => d.id !== l.id),
      t
    );
    i.valid || (s.push(...i.errors.map((d) => `[${l.id}] ${d}`)), n.push(...i.suggestions));
  }
  return {
    valid: s.length === 0,
    errors: [...new Set(s)],
    suggestions: [...new Set(n)]
  };
}
function Ze({ nodes: e, edges: o }) {
  let t = "[]", s = !1;
  function n() {
    return s && JSON.stringify({ nodes: e.value, edges: o.value }) !== t;
  }
  function l() {
    t = JSON.stringify({ nodes: e.value, edges: o.value }), s = !0;
  }
  function i(a, u) {
    t = JSON.stringify({ nodes: a, edges: u });
  }
  function d() {
    return s;
  }
  return { hasChanges: n, initSnapshot: l, updateSnapshot: i, isReady: d };
}
function et({ nodes: e, edges: o, maxLevels: t, onLoad: s }) {
  const n = s == null ? void 0 : s(), l = n instanceof Promise;
  if (!l) {
    const i = (n == null ? void 0 : n.nodes) ?? Z, d = (n == null ? void 0 : n.edges) ?? ee;
    e.value = i, o.value = Y(i, d, t);
  }
  return {
    isAsyncLoad: l,
    asyncPromise: l ? n : null
  };
}
function tt({ nodes: e, edges: o, maxLevels: t, onSave: s, onLoad: n }) {
  const { isAsyncLoad: l, asyncPromise: i } = et({ nodes: e, edges: o, maxLevels: t, onLoad: n }), d = Ze({ nodes: e, edges: o }), a = C(l ? "loading" : "");
  let u = !1;
  l && i.then((p) => {
    e.value = (p == null ? void 0 : p.nodes) ?? Z, o.value = Y(e.value, (p == null ? void 0 : p.edges) ?? ee, t), d.initSnapshot(), a.value = "";
  }).catch((p) => {
    console.error("Failed to load:", p), a.value = "error";
  });
  async function c() {
    const p = Y(e.value, o.value, t);
    o.value = p;
    const h = s == null ? void 0 : s({ nodes: e.value, edges: p });
    if (h instanceof Promise) {
      a.value = "saving";
      try {
        await h, d.updateSnapshot(e.value, p), a.value = "saved";
      } catch {
        a.value = "error";
        return;
      }
    } else
      d.updateSnapshot(e.value, p), a.value = "saved";
    setTimeout(() => a.value = "", 3e3);
  }
  async function g() {
    if (u) return;
    const p = Y(e.value, o.value, t);
    if (o.value = p, !Q(e.value, p, t).valid) {
      a.value = "error", setTimeout(() => a.value = "", 3e3);
      return;
    }
    u = !0;
    try {
      await c();
    } finally {
      u = !1;
    }
  }
  async function y() {
    if (!d.isReady() || !d.hasChanges() || u) return;
    if (!Q(e.value, o.value, t).valid) {
      a.value = "error";
      return;
    }
    u = !0;
    try {
      await c();
    } finally {
      u = !1;
    }
  }
  return Le([e, o], y, { deep: !0 }), {
    nodes: e,
    edges: o,
    saveStatus: a,
    hasChanges: d.hasChanges,
    manualSave: g,
    autoSave: y,
    initSnapshot: d.initSnapshot
  };
}
function nt({ nodes: e, edges: o, maxLevels: t, templates: s }) {
  return { validation: V(() => {
    const l = Q(e.value, o.value, t);
    if (s.length > 0) {
      const i = new Set(s.map((a) => a.id)), d = [];
      for (const a of e.value)
        (a.data.templateId == null || !i.has(a.data.templateId)) && d.push(
          `O bloco "${a.data.label}" não possui um template válido.`
        );
      if (d.length > 0)
        return {
          valid: !1,
          errors: [...l.errors, ...d],
          suggestions: [
            .../* @__PURE__ */ new Set([
              ...l.suggestions,
              "Edite os blocos sem template e selecione um válido."
            ])
          ]
        };
    }
    return l;
  }) };
}
function ot({ getViewport: e, nodes: o, anchorNodeId: t }) {
  const { x: s, y: n, zoom: l } = e(), i = (window.innerWidth / 2 - s) / l, d = (window.innerHeight / 2 - n) / l, a = t ? o.find((u) => u.id === t) : o.find((u) => u.data.level === 1);
  return {
    x: a ? a.position.x + 180 : i,
    y: a ? a.position.y + 170 : d
  };
}
function lt({ nodes: e, maxLevels: o, templates: t, onGenerateId: s, maxPerLevel: n }) {
  const { getViewport: l } = ke(), i = C(!1), d = C({ label: "", level: o, maxConnections: null }), a = C(""), u = C(null);
  function c() {
    d.value = { label: "", level: o, maxConnections: null }, a.value = "", i.value = !0;
  }
  function g() {
    var M, b;
    const p = d.value.label.trim();
    if (!p) return;
    if (e.value.filter((S) => S.data.level === d.value.level).length >= n[d.value.level]) {
      a.value = `Nível ${d.value.level} já atingiu o limite de ${n[d.value.level]} nó(s).`;
      return;
    }
    a.value = "";
    const q = ot({
      getViewport: l,
      nodes: e.value,
      anchorNodeId: ((M = u.value) == null ? void 0 : M.id) ?? null
    }), E = t.find((S) => S.label === p);
    e.value.push({
      id: (s == null ? void 0 : s()) ?? crypto.randomUUID(),
      type: "custom",
      position: q,
      data: {
        label: p,
        level: d.value.level,
        templateId: (E == null ? void 0 : E.id) ?? null,
        maxConnections: ((b = E == null ? void 0 : E.options) == null ? void 0 : b.length) ?? null
      }
    }), i.value = !1;
  }
  function y({ node: p }) {
    u.value = p;
  }
  return { showAddModal: i, addForm: d, addNodeError: a, lastSelectedNode: u, openAddModal: c, addNode: g, onNodeClick: y };
}
function st({ edges: e, nodes: o, id: t, newLevel: s, templateConfig: n, maxLevels: l }) {
  var d;
  let i = e;
  if (((d = n == null ? void 0 : n.options) == null ? void 0 : d.length) > 0) {
    const a = new Set(n.options.map((u) => u.id));
    i = i.filter((u) => {
      var g;
      if (u.source !== t) return !0;
      const c = (g = u.data) == null ? void 0 : g.optionId;
      return c != null && a.has(c);
    });
  }
  return i = i.filter((a) => {
    if (a.source === t) {
      if (s >= l) return !1;
      const u = o.find((c) => c.id === a.target);
      return u && u.data.level > s;
    }
    if (a.target === t) {
      const u = o.find((c) => c.id === a.source);
      return u && u.data.level < s;
    }
    return !0;
  }), i;
}
function at({ nodes: e, edges: o, maxLevels: t, templates: s, maxPerLevel: n }) {
  const l = C(null), i = C({ label: "", level: 2, maxConnections: null }), d = C("");
  function a({ node: c }) {
    l.value = c, i.value = {
      label: c.data.label,
      level: c.data.level,
      maxConnections: c.data.maxConnections ?? null
    }, d.value = "";
  }
  function u() {
    var M;
    const c = i.value.label.trim();
    if (!c) return;
    const g = l.value.id, y = i.value.level, p = s.find((b) => b.label === c), h = ((M = p == null ? void 0 : p.options) == null ? void 0 : M.length) ?? null;
    if (e.value.filter((b) => b.id !== g && b.data.level === y).length >= n[y]) {
      d.value = `Nível ${y} já atingiu o limite de ${n[y]} nó(s).`;
      return;
    }
    const E = o.value.filter((b) => {
      if (b.source !== g || y >= t) return !1;
      const S = e.value.find((T) => T.id === b.target);
      return S && S.data.level > y;
    });
    if (h != null && E.length > h) {
      d.value = `"${c}" permite no máx. ${h} saída(s), mas o nó já possui ${E.length} conexão(ões) válida(s).`;
      return;
    }
    d.value = "", o.value = st({
      edges: o.value,
      nodes: e.value,
      id: g,
      newLevel: y,
      templateConfig: p,
      maxLevels: t
    }), e.value = e.value.map(
      (b) => b.id === g ? { ...b, data: { ...b.data, label: c, level: y, templateId: (p == null ? void 0 : p.id) ?? null, maxConnections: h } } : b
    ), e.value = K(e.value, o.value, t), l.value = null;
  }
  return { editingNode: l, editForm: i, editNodeError: d, onNodeDoubleClick: a, saveEdit: u };
}
function it({ nodes: e, edges: o, maxLevels: t, templates: s, onGenerateId: n }) {
  const l = We(t), i = lt({ nodes: e, maxLevels: t, templates: s, onGenerateId: n, maxPerLevel: l }), d = at({ nodes: e, edges: o, maxLevels: t, templates: s, maxPerLevel: l });
  function a({ node: c }) {
    const g = e.value.find((y) => y.id === c.id);
    g && (g.position = { x: c.position.x, y: c.position.y });
  }
  function u(c) {
    e.value = e.value.filter((g) => g.id !== c), o.value = o.value.filter((g) => g.source !== c && g.target !== c), e.value = K(e.value, o.value, t);
  }
  return {
    nodes: e,
    edges: o,
    ...i,
    ...d,
    onNodeDragStop: a,
    deleteNodeById: u
  };
}
function rt({ nodes: e, edges: o, maxLevels: t, templates: s }) {
  function n(i, d) {
    var g, y;
    const a = e.value.find((p) => p.id === i.source), u = s.find((p) => {
      var h;
      return p.id === ((h = a == null ? void 0 : a.data) == null ? void 0 : h.templateId);
    }), c = (y = (g = u == null ? void 0 : u.options) == null ? void 0 : g.find((p) => p.id === d)) == null ? void 0 : y.label;
    o.value = [
      ...o.value,
      {
        id: `e-${i.source}-${i.target}`,
        source: i.source,
        target: i.target,
        animated: !0,
        label: c ?? void 0,
        data: { optionId: d ?? null }
      }
    ], e.value = K(e.value, o.value, t);
  }
  function l(i) {
    o.value = o.value.filter((d) => d.id !== i), e.value = K(e.value, o.value, t);
  }
  return { addEdgeFromConnection: n, removeEdge: l };
}
function ut({ nodes: e, edges: o, templates: t, addEdgeFromConnection: s }) {
  const n = C(null), l = V(() => {
    var y;
    if (!n.value) return [];
    const a = n.value.source, u = e.value.find((p) => p.id === a);
    if (!u) return [];
    const c = t.find((p) => p.id === u.data.templateId);
    if (!((y = c == null ? void 0 : c.options) != null && y.length)) return [];
    const g = new Set(
      o.value.filter((p) => p.source === a).map((p) => {
        var h;
        return (h = p.data) == null ? void 0 : h.optionId;
      }).filter((p) => p != null)
    );
    return c.options.filter((p) => !g.has(p.id));
  });
  function i(a) {
    n.value && (s(n.value, a), n.value = null);
  }
  function d() {
    n.value = null;
  }
  return { pendingConnection: n, pendingOptions: l, confirmConnection: i, cancelConnection: d };
}
function dt({ nodes: e, edges: o, maxLevels: t, templates: s }) {
  const { addEdgeFromConnection: n, removeEdge: l } = rt({ nodes: e, edges: o, maxLevels: t, templates: s }), { pendingConnection: i, pendingOptions: d, confirmConnection: a, cancelConnection: u } = ut({ nodes: e, edges: o, templates: s, addEdgeFromConnection: n });
  function c(g) {
    var M;
    if (o.value.some(
      (b) => b.source === g.source && b.target === g.target
    )) return;
    const p = e.value.find((b) => b.id === g.source), h = e.value.find((b) => b.id === g.target);
    if (h && h.data.level <= p.data.level) {
      const b = h.data.level + 1;
      if (b > t) {
        console.warn("Não é possível ajustar: ultrapassaria o nível máximo");
        return;
      }
      e.value = e.value.map(
        (S) => S.id === g.target ? { ...S, data: { ...S.data, level: b } } : S
      );
    }
    const q = he(g, e.value, o.value, t);
    if (!q.valid) {
      console.warn("Conexão bloqueada:", q.errors);
      return;
    }
    const E = s.find((b) => {
      var S;
      return b.id === ((S = p == null ? void 0 : p.data) == null ? void 0 : S.templateId);
    });
    if (((M = E == null ? void 0 : E.options) == null ? void 0 : M.length) > 0) {
      const b = new Set(
        o.value.filter((T) => T.source === g.source).map((T) => {
          var R;
          return (R = T.data) == null ? void 0 : R.optionId;
        }).filter((T) => T != null)
      );
      if (E.options.filter((T) => !b.has(T.id)).length === 0) return;
      i.value = g;
    } else
      n(g, null);
  }
  return {
    nodes: e,
    edges: o,
    pendingConnection: i,
    pendingOptions: d,
    addEdgeFromConnection: n,
    removeEdge: l,
    onConnect: c,
    confirmConnection: a,
    cancelConnection: u
  };
}
function ct({
  onSave: e,
  onLoad: o,
  onGenerateId: t,
  maxLevels: s = 3,
  templates: n = []
} = {}) {
  const l = C(Z), i = C(ee), d = tt({
    nodes: l,
    edges: i,
    maxLevels: s,
    onSave: e,
    onLoad: o
  });
  d.initSnapshot();
  const a = nt({
    nodes: l,
    edges: i,
    maxLevels: s,
    templates: n
  }), u = it({
    nodes: l,
    edges: i,
    maxLevels: s,
    templates: n,
    onGenerateId: t
  }), c = dt({
    nodes: l,
    edges: i,
    maxLevels: s,
    templates: n
  });
  return {
    nodes: l,
    edges: i,
    validation: a.validation,
    saveStatus: d.saveStatus,
    manualSave: d.manualSave,
    ...u,
    ...c
  };
}
const ce = [
  { bg: "#001240", border: "#0070F0", text: "#80b8ff" },
  // Azul
  { bg: "#0e0828", border: "#7b5fff", text: "#c0a8ff" },
  // Roxo
  { bg: "#002010", border: "#25d366", text: "#70e890" },
  // Verde
  { bg: "#2a1200", border: "#f07820", text: "#ffb878" },
  // Laranja
  { bg: "#1a0020", border: "#c040f0", text: "#e090ff" },
  // Magenta
  { bg: "#001e1e", border: "#00d4b0", text: "#70f0e0" },
  // Teal
  { bg: "#1a1000", border: "#e0c020", text: "#fff0a0" },
  // Amarelo
  { bg: "#200010", border: "#f04080", text: "#ffb0c8" },
  // Rosa
  { bg: "#0a1a00", border: "#80c820", text: "#c8f060" },
  // Lima
  { bg: "#10001a", border: "#a060f0", text: "#d8b0ff" }
  // Violeta
];
function j(e) {
  const o = {};
  for (let t = 1; t <= e; t++)
    o[t] = { ...ce[(t - 1) % ce.length] };
  return o;
}
j(3);
const Ce = "vft-colors";
function vt(e) {
  try {
    const o = localStorage.getItem(Ce), t = j(e);
    if (!o) return t;
    const s = JSON.parse(o);
    return { ...t, ...s };
  } catch {
    return j(e);
  }
}
function ft(e = 3) {
  const o = C(vt(e)), t = V(() => {
    var i, d, a;
    const l = {};
    for (let u = 1; u <= e; u++)
      l[`--level-${u}-bg`] = (i = o.value[u]) == null ? void 0 : i.bg, l[`--level-${u}-border`] = (d = o.value[u]) == null ? void 0 : d.border, l[`--level-${u}-text`] = (a = o.value[u]) == null ? void 0 : a.text;
    return l;
  });
  function s() {
    localStorage.setItem(Ce, JSON.stringify(o.value));
  }
  function n() {
    o.value = j(e);
  }
  return { colors: o, cssVars: t, saveColors: s, resetColors: n };
}
const mt = {
  // Fundos
  "--t-bg": "#000000",
  "--t-panel-bg": "#0e0e1c",
  "--t-section-bg": "#080812",
  "--t-input-bg": "#13131f",
  // Bordas derivadas do Primary Blue escurecido
  "--t-panel-border": "#0d1e3a",
  "--t-input-border": "#162844",
  // Texto
  "--t-text-primary": "#e8eeff",
  "--t-text-secondary": "#7888aa",
  "--t-text-muted": "#424e6a",
  // Grade e badges
  "--t-grid-color": "#0a1628",
  "--t-badge-bg": "#0a1628",
  "--t-badge-border": "#162844",
  "--t-badge-text": "#4090c8",
  // Overlay com alpha em hex 8 dígitos (70% preto)
  "--t-overlay": "#000000b3"
}, pt = {
  // Fundos
  "--t-bg": "#eef5ff",
  "--t-panel-bg": "#ffffff",
  "--t-section-bg": "#f5f9ff",
  "--t-input-bg": "#f0f6ff",
  // Bordas derivadas do Primary Blue clareado
  "--t-panel-border": "#cce2fc",
  "--t-input-border": "#b0d0f8",
  // Texto
  "--t-text-primary": "#101828",
  "--t-text-secondary": "#485870",
  "--t-text-muted": "#7080a0",
  // Grade e badges
  "--t-grid-color": "#d8ecfe",
  "--t-badge-bg": "#e8f2ff",
  "--t-badge-border": "#b0d0f8",
  "--t-badge-text": "#0058c8",
  // Overlay com alpha em hex 8 dígitos (30% preto)
  "--t-overlay": "#0000004d"
}, ve = "vft-theme";
function gt() {
  const e = C(localStorage.getItem(ve) || "dark"), o = V(() => e.value === "dark"), t = V(() => o.value ? mt : pt);
  function s() {
    e.value = o.value ? "light" : "dark", localStorage.setItem(ve, e.value);
  }
  return { theme: e, isDark: o, themeVars: t, toggleTheme: s };
}
const H = "1.0.5", we = "vft-settings", W = {
  showValidationPanel: !0,
  showControls: !0,
  lastVersionSeen: null
};
function bt() {
  try {
    const e = localStorage.getItem(we);
    return e ? { ...W, ...JSON.parse(e) } : { ...W };
  } catch {
    return { ...W };
  }
}
function yt() {
  const e = C(bt()), o = C(
    e.value.lastVersionSeen !== H && e.value.lastVersionSeen !== null
  );
  function t() {
    localStorage.setItem(we, JSON.stringify(e.value));
  }
  function s() {
    e.value.lastVersionSeen = H, o.value = !1, t();
  }
  return e.value.lastVersionSeen === null && (e.value.lastVersionSeen = H, t(), o.value = !1), { settings: e, saveSettings: t, hasNewVersion: o, dismissVersionNotification: s };
}
function xt() {
  let e = 0;
  function o(t) {
    const s = Date.now();
    s - e < 300 && (t.preventDefault(), t.currentTarget.dispatchEvent(new MouseEvent("dblclick", { bubbles: !0 }))), e = s;
  }
  return { onTouchEnd: o };
}
const w = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [s, n] of o)
    t[s] = n;
  return t;
}, kt = { class: "node-badge" }, ht = {
  key: 0,
  class: "node-warn",
  title: "Sem template válido"
}, Ct = { class: "node-label" }, wt = {
  __name: "FlowNode",
  props: {
    id: { type: String, required: !0 },
    data: { type: Object, required: !0 },
    selected: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, t = me("deleteNodeById"), { edges: s } = ke(), n = V(
      () => s.value.filter((i) => i.source === o.id).length
    ), { onTouchEnd: l } = xt();
    return (i, d) => (v(), m("div", {
      class: "flow-node",
      style: D({
        background: `var(--level-${e.data.level}-bg)`,
        borderColor: `var(--level-${e.data.level}-border)`,
        color: `var(--level-${e.data.level}-text)`
      }),
      onTouchend: d[1] || (d[1] = (...a) => f(l) && f(l)(...a))
    }, [
      k(f(ue), {
        type: "target",
        position: f(de).Top
      }, null, 8, ["position"]),
      r("div", kt, "N" + x(e.data.level), 1),
      e.data.templateId == null ? (v(), m("div", ht, "!")) : $("", !0),
      r("div", Ct, x(e.data.label), 1),
      e.data.maxConnections != null ? (v(), m("div", {
        key: 1,
        class: _(["node-connections", { full: n.value >= e.data.maxConnections }])
      }, " ↑ " + x(n.value) + "/" + x(e.data.maxConnections), 3)) : $("", !0),
      k(f(ue), {
        type: "source",
        position: f(de).Bottom
      }, null, 8, ["position"]),
      e.selected ? (v(), m("button", {
        key: 2,
        class: "node-delete nodrag",
        onClick: d[0] || (d[0] = z((a) => f(t)(e.id), ["stop"]))
      }, "×")) : $("", !0)
    ], 36));
  }
}, $t = /* @__PURE__ */ w(wt, [["__scopeId", "data-v-6224fb46"]]), St = {
  __name: "FlowEdge",
  props: {
    id: { type: String, required: !0 },
    sourceX: { type: Number, required: !0 },
    sourceY: { type: Number, required: !0 },
    targetX: { type: Number, required: !0 },
    targetY: { type: Number, required: !0 },
    sourcePosition: { type: String, required: !0 },
    targetPosition: { type: String, required: !0 },
    data: { type: Object, default: () => ({}) },
    markerEnd: { type: String, default: void 0 },
    style: { type: Object, default: () => ({}) },
    label: { type: String, default: void 0 },
    selected: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, t = me("removeEdge"), s = V(
      () => Ue({
        sourceX: o.sourceX,
        sourceY: o.sourceY,
        sourcePosition: o.sourcePosition,
        targetX: o.targetX,
        targetY: o.targetY,
        targetPosition: o.targetPosition
      })
    ), n = V(() => s.value[0]), l = V(() => s.value[1]), i = V(() => s.value[2]);
    return (d, a) => (v(), m(F, null, [
      k(f(Ye), {
        id: e.id,
        path: n.value,
        "marker-end": e.markerEnd,
        style: D(e.style)
      }, null, 8, ["id", "path", "marker-end", "style"]),
      k(f(He), null, {
        default: I(() => [
          e.label ? (v(), m("div", {
            key: 0,
            class: "edge-label nodrag nopan",
            style: D({ transform: `translate(-50%, -50%) translate(${l.value}px, ${i.value}px)` })
          }, x(e.label), 5)) : $("", !0),
          e.selected ? (v(), m("button", {
            key: 1,
            class: "edge-delete nodrag nopan",
            style: D({ transform: `translate(-50%, -50%) translate(${l.value}px, ${i.value + (e.label ? 18 : 0)}px)` }),
            onClick: a[0] || (a[0] = z((u) => f(t)(e.id), ["stop"]))
          }, "×", 4)) : $("", !0)
        ]),
        _: 1
      })
    ], 64));
  }
}, Nt = /* @__PURE__ */ w(St, [["__scopeId", "data-v-90d24337"]]);
function Et() {
  const e = C(!1);
  function o() {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  }
  function t() {
    e.value = !!document.fullscreenElement;
  }
  return G(() => document.addEventListener("fullscreenchange", t)), pe(() => document.removeEventListener("fullscreenchange", t)), { isFullscreen: e, toggleFullscreen: o };
}
const It = {
  key: 0,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Vt = {
  key: 1,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Ft = {
  __name: "FlowControls",
  setup(e) {
    const { isFullscreen: o, toggleFullscreen: t } = Et();
    return (s, n) => (v(), B(f(Ke), null, {
      "icon-zoom-in": I(() => [...n[0] || (n[0] = [
        r("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round"
        }, [
          r("line", {
            x1: "12",
            y1: "5",
            x2: "12",
            y2: "19"
          }),
          r("line", {
            x1: "5",
            y1: "12",
            x2: "19",
            y2: "12"
          })
        ], -1)
      ])]),
      "icon-zoom-out": I(() => [...n[1] || (n[1] = [
        r("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round"
        }, [
          r("line", {
            x1: "5",
            y1: "12",
            x2: "19",
            y2: "12"
          })
        ], -1)
      ])]),
      "icon-fit-view": I(() => [...n[2] || (n[2] = [
        r("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round"
        }, [
          r("circle", {
            cx: "10",
            cy: "10",
            r: "6.5"
          }),
          r("line", {
            x1: "15",
            y1: "15",
            x2: "21",
            y2: "21"
          }),
          r("line", {
            x1: "7",
            y1: "10",
            x2: "13",
            y2: "10"
          }),
          r("line", {
            x1: "10",
            y1: "7",
            x2: "10",
            y2: "13"
          })
        ], -1)
      ])]),
      "icon-unlock": I(() => [...n[3] || (n[3] = [
        r("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          r("rect", {
            x: "3",
            y: "11",
            width: "18",
            height: "11",
            rx: "2"
          }),
          r("path", { d: "M7 11V7a5 5 0 0 1 9.9-1" })
        ], -1)
      ])]),
      "icon-lock": I(() => [...n[4] || (n[4] = [
        r("svg", {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          r("rect", {
            x: "3",
            y: "11",
            width: "18",
            height: "11",
            rx: "2"
          }),
          r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
        ], -1)
      ])]),
      default: I(() => [
        k(f(Ge), {
          onClick: f(t),
          title: f(o) ? "Sair da tela cheia" : "Tela cheia"
        }, {
          default: I(() => [
            f(o) ? (v(), m("svg", Vt, [...n[6] || (n[6] = [
              r("polyline", { points: "4 14 10 14 10 20" }, null, -1),
              r("polyline", { points: "20 10 14 10 14 4" }, null, -1),
              r("line", {
                x1: "10",
                y1: "14",
                x2: "3",
                y2: "21"
              }, null, -1),
              r("line", {
                x1: "14",
                y1: "10",
                x2: "21",
                y2: "3"
              }, null, -1)
            ])])) : (v(), m("svg", It, [...n[5] || (n[5] = [
              r("polyline", { points: "15 3 21 3 21 9" }, null, -1),
              r("polyline", { points: "9 21 3 21 3 15" }, null, -1),
              r("line", {
                x1: "21",
                y1: "3",
                x2: "14",
                y2: "10"
              }, null, -1),
              r("line", {
                x1: "3",
                y1: "21",
                x2: "10",
                y2: "14"
              }, null, -1)
            ])]))
          ]),
          _: 1
        }, 8, ["onClick", "title"])
      ]),
      _: 1
    }));
  }
}, Tt = {
  __name: "FlowCanvas",
  props: {
    nodes: { type: Array, required: !0 },
    edges: { type: Array, required: !0 },
    gridColor: { type: String, required: !0 },
    showControls: { type: Boolean, default: !0 }
  },
  emits: ["connect", "node-click", "node-drag-stop", "node-double-click"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), B(f(Xe), {
      nodes: e.nodes,
      edges: e.edges,
      "default-viewport": { zoom: 1 },
      "min-zoom": 0.5,
      "max-zoom": 2,
      "zoom-on-pinch": !0,
      "pan-on-drag": !0,
      "pan-on-scroll": !1,
      "fit-view-on-init": "",
      "delete-key-code": null,
      onConnect: n[0] || (n[0] = (l) => t("connect", l)),
      onNodeClick: n[1] || (n[1] = (l) => t("node-click", l)),
      onNodeDragStop: n[2] || (n[2] = (l) => t("node-drag-stop", l)),
      onNodeDoubleClick: n[3] || (n[3] = (l) => t("node-double-click", l))
    }, {
      "node-custom": I((l) => [
        k($t, le(se(l)), null, 16)
      ]),
      "edge-default": I((l) => [
        k(Nt, le(se(l)), null, 16)
      ]),
      default: I(() => [
        k(f(Je), {
          "pattern-color": e.gridColor,
          gap: 20
        }, null, 8, ["pattern-color"]),
        e.showControls ? (v(), B(Ft, { key: 0 })) : $("", !0)
      ]),
      _: 1
    }, 8, ["nodes", "edges"]));
  }
}, At = {
  __name: "AddNodeButton",
  emits: ["click"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), m("button", {
      class: "add-node-btn",
      title: "Adicionar nó",
      onClick: n[0] || (n[0] = (l) => t("click"))
    }, [...n[1] || (n[1] = [
      r("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2.5",
        "stroke-linecap": "round"
      }, [
        r("line", {
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        r("line", {
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        })
      ], -1)
    ])]));
  }
}, Bt = /* @__PURE__ */ w(At, [["__scopeId", "data-v-6d334b2b"]]), Mt = {
  __name: "SettingsButton",
  emits: ["click"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), m("button", {
      class: "settings-btn",
      title: "Configurar cores",
      onClick: n[0] || (n[0] = (l) => t("click"))
    }, [...n[1] || (n[1] = [
      r("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        r("circle", {
          cx: "12",
          cy: "12",
          r: "3"
        }),
        r("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
      ], -1)
    ])]));
  }
}, Ot = /* @__PURE__ */ w(Mt, [["__scopeId", "data-v-ca7a45b8"]]), _t = ["title"], qt = {
  key: 0,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Lt = {
  key: 1,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Dt = {
  __name: "ThemeButton",
  props: {
    isDark: { type: Boolean, required: !0 }
  },
  emits: ["click"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), m("button", {
      class: "theme-btn",
      title: e.isDark ? "Tema claro" : "Tema escuro",
      onClick: n[0] || (n[0] = (l) => t("click"))
    }, [
      e.isDark ? (v(), m("svg", qt, [...n[1] || (n[1] = [
        De('<circle cx="12" cy="12" r="4" data-v-71fb3f52></circle><line x1="12" y1="2" x2="12" y2="5" data-v-71fb3f52></line><line x1="12" y1="19" x2="12" y2="22" data-v-71fb3f52></line><line x1="2" y1="12" x2="5" y2="12" data-v-71fb3f52></line><line x1="19" y1="12" x2="22" y2="12" data-v-71fb3f52></line><line x1="4.22" y1="4.22" x2="6.34" y2="6.34" data-v-71fb3f52></line><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" data-v-71fb3f52></line><line x1="4.22" y1="19.78" x2="6.34" y2="17.66" data-v-71fb3f52></line><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" data-v-71fb3f52></line>', 9)
      ])])) : (v(), m("svg", Lt, [...n[2] || (n[2] = [
        r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }, null, -1)
      ])]))
    ], 8, _t));
  }
}, Pt = /* @__PURE__ */ w(Dt, [["__scopeId", "data-v-71fb3f52"]]), jt = ["disabled"], zt = {
  __name: "SaveButton",
  props: {
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), m("button", {
      class: "save-btn",
      title: "Salvar",
      disabled: e.disabled,
      onClick: n[0] || (n[0] = (l) => t("click"))
    }, [...n[1] || (n[1] = [
      r("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [
        r("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
        r("polyline", { points: "17 21 17 13 7 13 7 21" }),
        r("polyline", { points: "7 3 7 8 15 8" })
      ], -1)
    ])], 8, jt));
  }
}, Rt = /* @__PURE__ */ w(zt, [["__scopeId", "data-v-bd7b0c18"]]), Ut = 600;
function Yt() {
  const e = C(window.innerWidth);
  function o() {
    e.value = window.innerWidth;
  }
  G(() => window.addEventListener("resize", o)), pe(() => window.removeEventListener("resize", o));
  const t = V(() => e.value < Ut), s = C(!1);
  function n() {
    s.value = !s.value;
  }
  const l = V(() => t.value ? "none" : "calc(100vh - 32px)");
  return { isMobile: t, isExpanded: s, toggleExpanded: n, panelMaxHeight: l };
}
const Ht = { class: "title-text" }, Xt = {
  __name: "PanelTitle",
  props: {
    valid: { type: Boolean, required: !0 },
    isMobile: { type: Boolean, required: !0 },
    isExpanded: { type: Boolean, required: !0 }
  },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), m("div", {
      class: _(["panel-title", [e.isMobile ? "panel-title--mobile" : "panel-title--desktop", { clickable: e.isMobile }]]),
      onClick: n[0] || (n[0] = (l) => e.isMobile && t("toggle"))
    }, [
      r("span", {
        class: _(["status-dot", e.valid ? "dot-valid" : "dot-invalid"])
      }, null, 2),
      r("strong", Ht, x(e.valid ? "Fluxo Válido" : "Fluxo Inválido"), 1),
      e.isMobile ? (v(), m("svg", {
        key: 0,
        class: _(["chevron", { open: e.isExpanded }]),
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }, [...n[1] || (n[1] = [
        r("polyline", { points: "18 15 12 9 6 15" }, null, -1)
      ])], 2)) : $("", !0)
    ], 2));
  }
}, Jt = /* @__PURE__ */ w(Xt, [["__scopeId", "data-v-5dd5e45a"]]), Kt = {
  key: 0,
  class: "section"
}, Gt = {
  __name: "ValidationErrors",
  props: {
    errors: { type: Array, required: !0 }
  },
  setup(e) {
    return (o, t) => e.errors.length ? (v(), m("div", Kt, [
      t[0] || (t[0] = r("p", { class: "section-label" }, "Erros", -1)),
      r("ul", null, [
        (v(!0), m(F, null, O(e.errors, (s) => (v(), m("li", {
          key: s,
          class: "error-item"
        }, x(s), 1))), 128))
      ])
    ])) : $("", !0);
  }
}, Wt = /* @__PURE__ */ w(Gt, [["__scopeId", "data-v-c6407b15"]]), Qt = {
  key: 0,
  class: "section"
}, Zt = {
  __name: "ValidationSuggestions",
  props: {
    suggestions: { type: Array, required: !0 }
  },
  setup(e) {
    return (o, t) => e.suggestions.length ? (v(), m("div", Qt, [
      t[0] || (t[0] = r("p", { class: "section-label" }, "Sugestões", -1)),
      r("ul", null, [
        (v(!0), m(F, null, O(e.suggestions, (s) => (v(), m("li", {
          key: s,
          class: "suggestion-item"
        }, x(s), 1))), 128))
      ])
    ])) : $("", !0);
  }
}, en = /* @__PURE__ */ w(Zt, [["__scopeId", "data-v-d99bd858"]]);
function te(e, o) {
  return e === 1 ? "Nível 1 — Raiz" : e === o ? `Nível ${e} — Final` : `Nível ${e} — Intermediário`;
}
const tn = { class: "legend" }, nn = { class: "legend-list" }, on = {
  __name: "LevelLegend",
  props: {
    maxLevels: { type: Number, required: !0 }
  },
  setup(e) {
    return (o, t) => (v(), m("div", tn, [
      t[0] || (t[0] = r("p", { class: "section-label" }, "Níveis", -1)),
      r("div", nn, [
        (v(!0), m(F, null, O(e.maxLevels, (s) => (v(), m("div", {
          key: s,
          class: "legend-item"
        }, [
          r("span", {
            class: "dot",
            style: D({
              background: `var(--level-${s}-bg)`,
              border: `1px solid var(--level-${s}-border)`
            })
          }, null, 4),
          ge(" " + x(f(te)(s, e.maxLevels)), 1)
        ]))), 128))
      ])
    ]));
  }
}, ln = /* @__PURE__ */ w(on, [["__scopeId", "data-v-77c948b7"]]), sn = { class: "templates-section" }, an = { class: "templates-list" }, rn = { class: "template-header" }, un = { class: "template-name" }, dn = { class: "template-badge" }, cn = {
  key: 0,
  class: "options-list"
}, vn = {
  key: 1,
  class: "no-options"
}, fn = {
  __name: "TemplatesList",
  props: {
    templates: { type: Array, required: !0 }
  },
  setup(e) {
    return (o, t) => e.templates.length ? (v(), m(F, { key: 0 }, [
      t[2] || (t[2] = r("div", { class: "divider" }, null, -1)),
      r("div", sn, [
        t[1] || (t[1] = r("p", { class: "section-label" }, "Templates", -1)),
        r("div", an, [
          (v(!0), m(F, null, O(e.templates, (s) => {
            var n, l;
            return v(), m("div", {
              key: s.id ?? s.label,
              class: "template-item"
            }, [
              r("div", rn, [
                r("span", un, x(s.label), 1),
                r("span", dn, x(((n = s.options) == null ? void 0 : n.length) ?? 0) + " opções", 1)
              ]),
              (l = s.options) != null && l.length ? (v(), m("ul", cn, [
                (v(!0), m(F, null, O(s.options, (i) => (v(), m("li", {
                  key: i.id,
                  class: "option-item"
                }, [
                  t[0] || (t[0] = r("span", { class: "option-dot" }, null, -1)),
                  ge(" " + x(i.label), 1)
                ]))), 128))
              ])) : (v(), m("p", vn, "Sem saídas"))
            ]);
          }), 128))
        ])
      ])
    ], 64)) : $("", !0);
  }
}, mn = /* @__PURE__ */ w(fn, [["__scopeId", "data-v-ac54a8bf"]]), pn = { class: "panel-scroll" }, gn = {
  __name: "ValidationPanel",
  props: {
    validation: { type: Object, required: !0 },
    maxLevels: { type: Number, default: 3 },
    templates: { type: Array, default: () => [] }
  },
  setup(e) {
    Pe((l) => ({
      v5d0b6eb5: f(n)
    }));
    const { isMobile: o, isExpanded: t, toggleExpanded: s, panelMaxHeight: n } = Yt();
    return (l, i) => (v(), m("div", {
      class: _(["validation-panel", [
        e.validation.valid ? "valid" : "invalid",
        f(o) ? "panel-mobile" : "panel-desktop",
        { collapsed: f(o) && !f(t) }
      ]])
    }, [
      k(Jt, {
        valid: e.validation.valid,
        "is-mobile": f(o),
        "is-expanded": f(t),
        onToggle: f(s)
      }, null, 8, ["valid", "is-mobile", "is-expanded", "onToggle"]),
      X(r("div", pn, [
        k(Wt, {
          errors: e.validation.errors
        }, null, 8, ["errors"]),
        k(en, {
          suggestions: e.validation.suggestions
        }, null, 8, ["suggestions"]),
        i[0] || (i[0] = r("div", { class: "divider" }, null, -1)),
        k(ln, { "max-levels": e.maxLevels }, null, 8, ["max-levels"]),
        k(mn, { templates: e.templates }, null, 8, ["templates"])
      ], 512), [
        [je, !f(o) || f(t)]
      ])
    ], 2));
  }
}, bn = /* @__PURE__ */ w(gn, [["__scopeId", "data-v-54e0139e"]]);
function yn({ form: e, templates: o }) {
  const t = C(null);
  G(() => setTimeout(() => {
    var n;
    return (n = t.value) == null ? void 0 : n.focus();
  }, 50));
  function s(n) {
    var i;
    const l = o.find((d) => d.label === n.target.value);
    l && (e.value = {
      ...e.value,
      label: l.label,
      maxConnections: ((i = l.options) == null ? void 0 : i.length) ?? l.maxConnections ?? null
    });
  }
  return { inputRef: t, onTemplateSelect: s };
}
const xn = { class: "modal-form" }, kn = ["value"], hn = ["value"], Cn = ["value"], wn = {
  key: 3,
  class: "form-error"
}, $n = {
  __name: "NodeEditForm",
  props: /* @__PURE__ */ J({
    templates: { type: Array, default: () => [] },
    maxLevels: { type: Number, default: 3 },
    isAdmin: { type: Boolean, default: !1 },
    error: { type: String, default: "" }
  }, {
    form: { required: !0 },
    formModifiers: {}
  }),
  emits: /* @__PURE__ */ J(["save"], ["update:form"]),
  setup(e, { emit: o }) {
    const t = be(e, "form"), s = e, n = o, { inputRef: l, onTemplateSelect: i } = yn({ form: t, templates: s.templates });
    return (d, a) => (v(), m("div", xn, [
      a[6] || (a[6] = r("label", null, "Template", -1)),
      e.templates.length ? (v(), m("select", {
        key: 0,
        value: t.value.label,
        class: "node-select",
        ref_key: "inputRef",
        ref: l,
        onChange: a[0] || (a[0] = (...u) => f(i) && f(i)(...u))
      }, [
        a[4] || (a[4] = r("option", {
          value: "",
          disabled: ""
        }, "Selecione um template", -1)),
        (v(!0), m(F, null, O(e.templates, (u) => {
          var c;
          return v(), m("option", {
            key: u.id ?? u.label,
            value: u.label
          }, x(u.label) + " (máx. " + x(((c = u.options) == null ? void 0 : c.length) ?? u.maxConnections ?? "∞") + ") ", 9, hn);
        }), 128))
      ], 40, kn)) : X((v(), m("input", {
        key: 1,
        "onUpdate:modelValue": a[1] || (a[1] = (u) => t.value.label = u),
        class: "node-input",
        placeholder: "Nome do nó",
        ref_key: "inputRef",
        ref: l,
        onKeyup: a[2] || (a[2] = ze((u) => n("save"), ["enter"]))
      }, null, 544)), [
        [ye, t.value.label]
      ]),
      e.isAdmin ? (v(), m(F, { key: 2 }, [
        a[5] || (a[5] = r("label", null, "Nível", -1)),
        X(r("select", {
          "onUpdate:modelValue": a[3] || (a[3] = (u) => t.value.level = u),
          class: "node-select"
        }, [
          (v(!0), m(F, null, O(e.maxLevels, (u) => (v(), m("option", {
            key: u,
            value: u
          }, x(f(te)(u, e.maxLevels)), 9, Cn))), 128))
        ], 512), [
          [Re, t.value.level]
        ])
      ], 64)) : $("", !0),
      e.error ? (v(), m("p", wn, x(e.error), 1)) : $("", !0)
    ]));
  }
}, Sn = /* @__PURE__ */ w($n, [["__scopeId", "data-v-0266c785"]]), Nn = { class: "modal" }, En = { class: "modal-title" }, In = { class: "modal-actions" }, Vn = {
  __name: "NodeEditModal",
  props: /* @__PURE__ */ J({
    mode: { type: String, default: "edit" },
    error: { type: String, default: "" },
    templates: { type: Array, default: () => [] },
    maxLevels: { type: Number, default: 3 },
    isAdmin: { type: Boolean, default: !1 }
  }, {
    form: { required: !0 },
    formModifiers: {}
  }),
  emits: /* @__PURE__ */ J(["save", "close"], ["update:form"]),
  setup(e, { emit: o }) {
    const t = be(e, "form"), s = o;
    return (n, l) => (v(), m("div", {
      class: "modal-overlay",
      onClick: l[4] || (l[4] = z((i) => s("close"), ["self"]))
    }, [
      r("div", Nn, [
        r("div", En, x(e.mode === "add" ? "Adicionar Nó" : "Editar Nó"), 1),
        k(Sn, {
          form: t.value,
          "onUpdate:form": l[0] || (l[0] = (i) => t.value = i),
          templates: e.templates,
          "max-levels": e.maxLevels,
          "is-admin": e.isAdmin,
          error: e.error,
          onSave: l[1] || (l[1] = (i) => s("save"))
        }, null, 8, ["form", "templates", "max-levels", "is-admin", "error"]),
        r("div", In, [
          r("button", {
            class: "cancel-btn",
            onClick: l[2] || (l[2] = (i) => s("close"))
          }, "Cancelar"),
          r("button", {
            class: "save-btn",
            onClick: l[3] || (l[3] = (i) => s("save"))
          }, x(e.mode === "add" ? "Adicionar" : "Salvar"), 1)
        ])
      ])
    ]));
  }
}, fe = /* @__PURE__ */ w(Vn, [["__scopeId", "data-v-d1d8852d"]]), Fn = { class: "levels" }, Tn = { class: "level-header" }, An = { class: "level-name" }, Bn = { class: "color-input-wrap" }, Mn = ["onUpdate:modelValue"], On = { class: "hex-value" }, _n = {
  __name: "ColorLevelsSection",
  props: {
    draft: { type: Object, required: !0 },
    maxLevels: { type: Number, required: !0 }
  },
  setup(e) {
    const o = { Fundo: "bg", Borda: "border", Texto: "text" };
    return (t, s) => (v(), m("div", Fn, [
      (v(!0), m(F, null, O(e.maxLevels, (n) => (v(), m("div", {
        key: n,
        class: "level-section"
      }, [
        r("div", Tn, [
          r("span", {
            class: "level-preview",
            style: D({
              background: e.draft[n].bg,
              borderColor: e.draft[n].border,
              color: e.draft[n].text
            })
          }, "N" + x(n), 5),
          r("span", An, x(f(te)(n, e.maxLevels)), 1)
        ]),
        (v(), m(F, null, O(o, (l, i) => r("div", {
          key: l,
          class: "color-row"
        }, [
          r("label", null, x(i), 1),
          r("div", Bn, [
            X(r("input", {
              type: "color",
              "onUpdate:modelValue": (d) => e.draft[n][l] = d
            }, null, 8, Mn), [
              [ye, e.draft[n][l]]
            ]),
            r("span", On, x(e.draft[n][l]), 1)
          ])
        ])), 64))
      ]))), 128))
    ]));
  }
}, qn = /* @__PURE__ */ w(_n, [["__scopeId", "data-v-d9d26125"]]), Ln = { class: "view-section" }, Dn = { class: "toggle-row" }, Pn = { class: "toggle-row" }, jn = {
  __name: "ViewSettingsSection",
  props: {
    draftSettings: { type: Object, required: !0 }
  },
  setup(e) {
    return (o, t) => (v(), m("div", Ln, [
      t[6] || (t[6] = r("p", { class: "section-label" }, "Visualização", -1)),
      r("label", Dn, [
        t[3] || (t[3] = r("span", { class: "toggle-label" }, "Painel de validação", -1)),
        r("button", {
          class: _(["toggle-btn", { active: e.draftSettings.showValidationPanel }]),
          onClick: t[0] || (t[0] = (s) => e.draftSettings.showValidationPanel = !e.draftSettings.showValidationPanel)
        }, [...t[2] || (t[2] = [
          r("span", { class: "toggle-thumb" }, null, -1)
        ])], 2)
      ]),
      r("label", Pn, [
        t[5] || (t[5] = r("span", { class: "toggle-label" }, "Controles", -1)),
        r("button", {
          class: _(["toggle-btn", { active: e.draftSettings.showControls }]),
          onClick: t[1] || (t[1] = (s) => e.draftSettings.showControls = !e.draftSettings.showControls)
        }, [...t[4] || (t[4] = [
          r("span", { class: "toggle-thumb" }, null, -1)
        ])], 2)
      ])
    ]));
  }
}, zn = /* @__PURE__ */ w(jn, [["__scopeId", "data-v-228953f4"]]), Rn = { class: "modal" }, Un = { class: "modal-header" }, Yn = { class: "version-badge" }, Hn = { class: "modal-body" }, Xn = { class: "modal-footer" }, Jn = { class: "modal-actions" }, Kn = {
  __name: "ColorConfigModal",
  props: {
    colors: { type: Object, required: !0 },
    maxLevels: { type: Number, default: 3 },
    settings: { type: Object, required: !0 }
  },
  emits: ["save", "close"],
  setup(e, { emit: o }) {
    const t = e, s = o, n = Array.from({ length: t.maxLevels }, (u, c) => c + 1), l = ae(Object.fromEntries(n.map((u) => [u, { ...t.colors[u] }]))), i = ae({ ...t.settings });
    function d() {
      const u = j(t.maxLevels);
      for (const c of n) l[c] = { ...u[c] };
    }
    function a() {
      s("save", {
        colors: Object.fromEntries(n.map((u) => [u, { ...l[u] }])),
        settings: { ...i }
      });
    }
    return (u, c) => (v(), m("div", {
      class: "modal-overlay",
      onClick: c[1] || (c[1] = z((g) => s("close"), ["self"]))
    }, [
      r("div", Rn, [
        r("div", Un, [
          c[2] || (c[2] = r("div", { class: "modal-title" }, "Configurações", -1)),
          r("div", Yn, "v" + x(f(H)), 1)
        ]),
        r("div", Hn, [
          k(qn, {
            draft: l,
            "max-levels": e.maxLevels
          }, null, 8, ["draft", "max-levels"]),
          c[3] || (c[3] = r("div", { class: "divider" }, null, -1)),
          k(zn, { "draft-settings": i }, null, 8, ["draft-settings"])
        ]),
        r("div", Xn, [
          r("div", Jn, [
            r("button", {
              class: "reset-btn",
              onClick: d
            }, "Restaurar padrão"),
            r("button", {
              class: "cancel-btn",
              onClick: c[0] || (c[0] = (g) => s("close"))
            }, "Cancelar"),
            r("button", {
              class: "save-btn",
              onClick: a
            }, "Salvar")
          ])
        ])
      ])
    ]));
  }
}, Gn = /* @__PURE__ */ w(Kn, [["__scopeId", "data-v-55e4f199"]]), Wn = {
  key: 0,
  class: "toast-spinner"
}, Qn = {
  key: 1,
  class: "toast-icon"
}, Zn = { class: "toast-text" }, eo = {
  __name: "NotificationToast",
  props: {
    saveStatus: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const o = e, t = V(() => ({
      loading: "Carregando dados...",
      saving: "Salvando...",
      saved: "Salvo automaticamente",
      error: "Não salvo — fluxo inválido"
    })[o.saveStatus] ?? "");
    return (s, n) => (v(), B(xe, { name: "toast" }, {
      default: I(() => [
        e.saveStatus ? (v(), m("div", {
          key: 0,
          class: _(["toast", e.saveStatus])
        }, [
          e.saveStatus === "loading" || e.saveStatus === "saving" ? (v(), m("span", Wn)) : (v(), m("span", Qn, x(e.saveStatus === "saved" ? "✓" : "✕"), 1)),
          r("span", Zn, x(t.value), 1)
        ], 2)) : $("", !0)
      ]),
      _: 1
    }));
  }
}, to = /* @__PURE__ */ w(eo, [["__scopeId", "data-v-6769efce"]]), no = { class: "modal" }, oo = { class: "options-list" }, lo = ["onClick"], so = { class: "modal-actions" }, ao = {
  __name: "ConnectionOptionModal",
  props: {
    options: { type: Array, required: !0 }
  },
  emits: ["confirm", "cancel"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, n) => (v(), m("div", {
      class: "modal-overlay",
      onClick: n[1] || (n[1] = z((l) => t("cancel"), ["self"]))
    }, [
      r("div", no, [
        n[2] || (n[2] = r("div", { class: "modal-title" }, "Selecione uma opção", -1)),
        n[3] || (n[3] = r("p", { class: "modal-subtitle" }, "Escolha qual opção esta conexão representa.", -1)),
        r("div", oo, [
          (v(!0), m(F, null, O(e.options, (l) => (v(), m("button", {
            key: l.id,
            class: "option-btn",
            onClick: (i) => t("confirm", l.id)
          }, x(l.label), 9, lo))), 128))
        ]),
        r("div", so, [
          r("button", {
            class: "cancel-btn",
            onClick: n[0] || (n[0] = (l) => t("cancel"))
          }, "Cancelar")
        ])
      ])
    ]));
  }
}, io = /* @__PURE__ */ w(ao, [["__scopeId", "data-v-14fb257d"]]), ro = {
  __name: "VersionNotification",
  emits: ["dismiss"],
  setup(e, { expose: o, emit: t }) {
    const s = t, n = C(!0);
    function l() {
      n.value = !1, s("dismiss");
    }
    return G(() => {
      setTimeout(() => {
        n.value = !1;
      }, 5e3);
    }), o({ dismiss: l }), (i, d) => (v(), B(xe, { name: "version-notif" }, {
      default: I(() => [
        n.value ? (v(), m("div", {
          key: 0,
          class: "version-notification",
          onClick: d[0] || (d[0] = (a) => i.$emit("dismiss"))
        }, [...d[1] || (d[1] = [
          r("div", { class: "notif-icon" }, [
            r("svg", {
              viewBox: "0 0 24 24",
              width: "20",
              height: "20",
              fill: "currentColor"
            }, [
              r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" })
            ])
          ], -1),
          r("div", { class: "notif-content" }, [
            r("span", { class: "notif-title" }, "Nova versão disponível!"),
            r("span", { class: "notif-subtitle" }, "Clique para fechar")
          ], -1)
        ])])) : $("", !0)
      ]),
      _: 1
    }));
  }
}, uo = /* @__PURE__ */ w(ro, [["__scopeId", "data-v-19b85436"]]), co = { class: "toolbar" }, vo = {
  __name: "FlowTree",
  props: {
    onSave: { type: Function, default: null },
    onLoad: { type: Function, default: null },
    onGenerateId: { type: Function, default: null },
    templates: { type: Array, default: () => [] },
    maxLevels: { type: Number, default: 3 },
    isAdmin: { type: Boolean, default: !1 }
  },
  emits: ["save"],
  setup(e, { emit: o }) {
    const t = e, s = o, {
      nodes: n,
      edges: l,
      validation: i,
      saveStatus: d,
      manualSave: a,
      showAddModal: u,
      addForm: c,
      addNodeError: g,
      openAddModal: y,
      addNode: p,
      onNodeClick: h,
      onNodeDragStop: q,
      onNodeDoubleClick: E,
      onConnect: M,
      editingNode: b,
      editForm: S,
      editNodeError: T,
      saveEdit: R,
      deleteNodeById: $e,
      removeEdge: Se,
      pendingConnection: Ne,
      pendingOptions: Ee,
      confirmConnection: Ie,
      cancelConnection: Ve
    } = ct({
      onLoad: () => {
        var A;
        return (A = t.onLoad) == null ? void 0 : A.call(t);
      },
      onSave: (A) => {
        var N;
        return s("save", A), (N = t.onSave) == null ? void 0 : N.call(t, A);
      },
      onGenerateId: () => {
        var A;
        return (A = t.onGenerateId) == null ? void 0 : A.call(t);
      },
      maxLevels: t.maxLevels,
      templates: t.templates
    });
    ie("removeEdge", Se), ie("deleteNodeById", $e);
    const { colors: ne, cssVars: Fe, saveColors: Te } = ft(t.maxLevels), { isDark: Ae, themeVars: oe, toggleTheme: Be } = gt(), { settings: P, saveSettings: Me, hasNewVersion: Oe, dismissVersionNotification: _e } = yt(), U = C(!1);
    function qe({ colors: A, settings: N }) {
      ne.value = A, Te(), P.value = N, Me(), U.value = !1;
    }
    return (A, N) => (v(), m("div", {
      class: _(["flow-tree-wrapper", { "panel-hidden": !f(P).showValidationPanel }]),
      style: D({ ...f(oe), ...f(Fe) })
    }, [
      k(Tt, {
        nodes: f(n),
        edges: f(l),
        "grid-color": f(oe)["--t-grid-color"],
        "show-controls": f(P).showControls,
        onConnect: f(M),
        onNodeClick: f(h),
        onNodeDragStop: f(q),
        onNodeDoubleClick: f(E)
      }, null, 8, ["nodes", "edges", "grid-color", "show-controls", "onConnect", "onNodeClick", "onNodeDragStop", "onNodeDoubleClick"]),
      r("div", co, [
        k(Ot, {
          onClick: N[0] || (N[0] = (L) => U.value = !0)
        }),
        k(Pt, {
          "is-dark": f(Ae),
          onClick: f(Be)
        }, null, 8, ["is-dark", "onClick"]),
        k(Bt, { onClick: f(y) }, null, 8, ["onClick"]),
        k(Rt, {
          disabled: f(d) === "saving" || f(d) === "loading",
          onClick: f(a)
        }, null, 8, ["disabled", "onClick"])
      ]),
      f(P).showValidationPanel ? (v(), B(bn, {
        key: 0,
        validation: f(i),
        "max-levels": t.maxLevels,
        templates: t.templates
      }, null, 8, ["validation", "max-levels", "templates"])) : $("", !0),
      f(u) ? (v(), B(fe, {
        key: 1,
        mode: "add",
        form: f(c),
        "onUpdate:form": N[1] || (N[1] = (L) => re(c) ? c.value = L : null),
        error: f(g),
        templates: t.templates,
        "max-levels": t.maxLevels,
        "is-admin": t.isAdmin,
        onSave: f(p),
        onClose: N[2] || (N[2] = (L) => u.value = !1)
      }, null, 8, ["form", "error", "templates", "max-levels", "is-admin", "onSave"])) : $("", !0),
      f(b) ? (v(), B(fe, {
        key: 2,
        mode: "edit",
        form: f(S),
        "onUpdate:form": N[3] || (N[3] = (L) => re(S) ? S.value = L : null),
        error: f(T),
        templates: t.templates,
        "max-levels": t.maxLevels,
        "is-admin": t.isAdmin,
        onSave: f(R),
        onClose: N[4] || (N[4] = (L) => b.value = null)
      }, null, 8, ["form", "error", "templates", "max-levels", "is-admin", "onSave"])) : $("", !0),
      U.value ? (v(), B(Gn, {
        key: 3,
        colors: f(ne),
        "max-levels": t.maxLevels,
        settings: f(P),
        onSave: qe,
        onClose: N[5] || (N[5] = (L) => U.value = !1)
      }, null, 8, ["colors", "max-levels", "settings"])) : $("", !0),
      f(Ne) ? (v(), B(io, {
        key: 4,
        options: f(Ee),
        onConfirm: f(Ie),
        onCancel: f(Ve)
      }, null, 8, ["options", "onConfirm", "onCancel"])) : $("", !0),
      k(to, { "save-status": f(d) }, null, 8, ["save-status"]),
      f(Oe) ? (v(), B(uo, {
        key: 5,
        onDismiss: f(_e)
      }, null, 8, ["onDismiss"])) : $("", !0)
    ], 6));
  }
}, bo = /* @__PURE__ */ w(vo, [["__scopeId", "data-v-2e3ecd73"]]);
export {
  bo as FlowTree,
  bo as default,
  ft as useFlowColors,
  yt as useFlowSettings,
  gt as useFlowTheme,
  ct as useFlowTree
};
