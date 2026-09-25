import { playTone } from './audio.js';

export function initShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
      if (e.key === "Escape") {
        e.target.blur();
      }
      return;
    }

    if (e.key === "/") {
      e.preventDefault();
      document.getElementById("search")?.focus();
    } else if (e.key.toLowerCase() === "t") {
      e.preventDefault();
      const termInput = document.getElementById("termInput");
      termInput?.focus();
      document.getElementById("deck")?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key.toLowerCase() === "j") {
      window.scrollBy({ top: 120, behavior: 'smooth' });
    } else if (e.key.toLowerCase() === "k") {
      window.scrollBy({ top: -120, behavior: 'smooth' });
    } else if (e.key === "?" || (e.key.toLowerCase() === "k" && e.ctrlKey)) {
      e.preventDefault();
      toggleShortcutsModal();
    }
  });
}

export function toggleShortcutsModal() {
  let modal = document.getElementById("shortcutsModalOverlay");
  if (!modal) return;
  modal.classList.toggle("active");
  playTone(800, 0.04);
}
