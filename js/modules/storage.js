import { DEFAULT_TOOLS } from '../data/tools.js';

let TOOLS = [...DEFAULT_TOOLS];
let favoriteToolIds = new Set(JSON.parse(localStorage.getItem("ghostdeck_fav_tools") || "[]"));

export function loadToolsFromStorage() {
  try {
    const stored = localStorage.getItem("ghostdeck_custom_tools");
    if (stored) {
      const customArray = JSON.parse(stored);
      TOOLS = [...DEFAULT_TOOLS, ...customArray];
    } else {
      TOOLS = [...DEFAULT_TOOLS];
    }
  } catch (e) {
    TOOLS = [...DEFAULT_TOOLS];
  }
  return TOOLS;
}

export function getTools() {
  return TOOLS;
}

export function saveCustomTool(toolObj) {
  try {
    const stored = localStorage.getItem("ghostdeck_custom_tools");
    let customArray = stored ? JSON.parse(stored) : [];
    
    const idx = customArray.findIndex(t => t.id === toolObj.id);
    if (idx >= 0) {
      customArray[idx] = toolObj;
    } else {
      customArray.push(toolObj);
    }

    localStorage.setItem("ghostdeck_custom_tools", JSON.stringify(customArray));
    loadToolsFromStorage();
  } catch (e) {}
}

export function deleteCustomTool(toolId) {
  try {
    const stored = localStorage.getItem("ghostdeck_custom_tools");
    if (stored) {
      let customArray = JSON.parse(stored);
      customArray = customArray.filter(t => t.id !== toolId);
      localStorage.setItem("ghostdeck_custom_tools", JSON.stringify(customArray));
    }
    loadToolsFromStorage();
  } catch (e) {}
}

export function toggleFavorite(toolId) {
  if (favoriteToolIds.has(toolId)) {
    favoriteToolIds.delete(toolId);
  } else {
    favoriteToolIds.add(toolId);
  }
  localStorage.setItem("ghostdeck_fav_tools", JSON.stringify([...favoriteToolIds]));
  return favoriteToolIds.has(toolId);
}

export function isFavorite(toolId) {
  return favoriteToolIds.has(toolId);
}

export function getFavorites() {
  return favoriteToolIds;
}

export function exportToolsJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(TOOLS, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ghostdeck_profile_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
