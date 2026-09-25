export function getParams() {
  return {
    target: document.getElementById("paramTarget")?.value || "192.168.1.1",
    port: document.getElementById("paramPort")?.value || "4444",
    iface: document.getElementById("paramIface")?.value || "eth0",
    wordlist: document.getElementById("paramWordlist")?.value || "rockyou.txt"
  };
}

export function processCommandTemplate(template) {
  if (!template) return "";
  const p = getParams();
  return template
    .replace(/\{TARGET\}/g, p.target)
    .replace(/\{PORT\}/g, p.port)
    .replace(/\{IFACE\}/g, p.iface)
    .replace(/\{WORDLIST\}/g, p.wordlist);
}

export function getSavedPresets() {
  return JSON.parse(localStorage.getItem("ghostdeck_presets") || "[]");
}

export function savePreset(name, cmd) {
  const presets = getSavedPresets();
  presets.push({ id: Date.now(), name, cmd });
  localStorage.setItem("ghostdeck_presets", JSON.stringify(presets));
}
