import { ref } from "vue";
import { version as PKG_VERSION } from "../../../../package.json";

const STORAGE_KEY = "vft-settings";

const DEFAULTS = {
  showValidationPanel: true,
  showControls: true,
  lastVersionSeen: null,
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

  const hasNewVersion = ref(
    settings.value.lastVersionSeen !== PKG_VERSION &&
    settings.value.lastVersionSeen !== null
  );

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
  }

  function dismissVersionNotification() {
    settings.value.lastVersionSeen = PKG_VERSION;
    hasNewVersion.value = false;
    saveSettings();
  }

  if (settings.value.lastVersionSeen === null) {
    settings.value.lastVersionSeen = PKG_VERSION;
    saveSettings();
    hasNewVersion.value = false;
  }

  return { settings, saveSettings, hasNewVersion, dismissVersionNotification };
}
