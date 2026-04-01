import { ref } from "vue";

const STORAGE_KEY = "vft-settings";

const DEFAULTS = {
  showValidationPanel: true,
  showControls: true,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function useFlowSettings() {
  const settings = ref(loadSettings());

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
  }

  return { settings, saveSettings };
}
