let masterVolume = parseFloat(localStorage.getItem("ghostdeck_volume") || "0.5");

export function setVolume(vol) {
  masterVolume = Math.max(0, Math.min(1, vol));
  localStorage.setItem("ghostdeck_volume", masterVolume.toString());
}

export function getVolume() {
  return masterVolume;
}

export function playTone(freq = 440, duration = 0.05, type = 'sine') {
  if (masterVolume <= 0) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}
