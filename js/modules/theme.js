import { playTone } from './audio.js';

let currentTheme = localStorage.getItem("ghostdeck_theme") || "default";

export function initTheme() {
  setTheme(currentTheme, false);
}

export function setTheme(themeName, playSound = true) {
  if (playSound) playTone(700, 0.05);
  currentTheme = themeName;
  localStorage.setItem("ghostdeck_theme", themeName);

  if (themeName === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeName);
  }
}

export function getTheme() {
  return currentTheme;
}
