import { setVolume, getVolume, playTone } from './modules/audio.js';
import { initTheme, setTheme } from './modules/theme.js';
import { getParams, processCommandTemplate } from './modules/commandBuilder.js';
import { loadToolsFromStorage, getTools, saveCustomTool, deleteCustomTool, toggleFavorite, isFavorite, exportToolsJson } from './modules/storage.js';
import { renderTermTabs, executeCommand, runPlaybook, createTermTab, handleTabAutocomplete, printTermLine } from './modules/terminal.js';
import { renderSocDashboard } from './modules/socDashboard.js';
import { initShortcuts, toggleShortcutsModal } from './modules/shortcuts.js';
import { CHEATS } from './data/cheats.js';
import { PLAYBOOKS } from './data/playbooks.js';

let activeCategory = "ALL";
let activeSkill = 0;
let tacticalMode = "RED";
let currentWotd = null;
let startTime = Date.now();

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadToolsFromStorage();
  initCategories();
  initSkills();
  renderArsenal();
  rollWotd();
  initCheats();
  initBootLog();
  initTicker();
  initHeroTyping();
  renderTermTabs();
  renderSocDashboard();
  initShortcuts();

  setInterval(updateClocks, 1000);

  // Event Listeners
  document.getElementById("search")?.addEventListener("input", renderArsenal);

  ["paramTarget", "paramPort", "paramIface", "paramWordlist"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => {
      renderArsenal();
      initCheats();
      rollWotd();
    });
  });

  document.getElementById("resetParamsBtn")?.addEventListener("click", () => {
    document.getElementById("paramTarget").value = "192.168.1.1";
    document.getElementById("paramPort").value = "4444";
    document.getElementById("paramIface").value = "eth0";
    document.getElementById("paramWordlist").value = "rockyou.txt";
    renderArsenal();
    initCheats();
    rollWotd();
    showToast("PARAMETERS RESET TO DEFAULTS");
  });

  document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
    setVolume(parseFloat(e.target.value));
  });

  document.getElementById("modeToggleBtn")?.addEventListener("click", toggleTacticalMode);
  document.getElementById("rollBtn")?.addEventListener("click", rollWotd);
  document.getElementById("goRoll")?.addEventListener("click", () => {
    rollWotd();
    document.getElementById("deck")?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById("goArsenal")?.addEventListener("click", () => {
    document.getElementById("arsenal")?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById("exportToolsBtn")?.addEventListener("click", exportToolsJson);

  document.getElementById("openShortcutsBtn")?.addEventListener("click", toggleShortcutsModal);
  document.getElementById("closeShortcutsBtn")?.addEventListener("click", toggleShortcutsModal);

  // Custom tool modal setup
  const customModal = document.getElementById("customToolOverlay");
  document.getElementById("openCustomToolModalBtn").onclick = () => customModal.classList.add("active");
  document.getElementById("customToolClose").onclick = () => customModal.classList.remove("active");
  document.getElementById("customToolCancel").onclick = () => customModal.classList.remove("active");

  document.getElementById("customToolForm").onsubmit = (e) => {
    e.preventDefault();
    const newTool = {
      id: document.getElementById("cId").value.trim().toLowerCase().replace(/\s+/g, '-'),
      name: document.getElementById("cName").value.trim(),
      cat: document.getElementById("cCat").value,
      color: "var(--cyn)",
      skill: parseInt(document.getElementById("cSkill").value, 10),
      skillLab: document.getElementById("cSkill").value === "1" ? "ENTRY" : document.getElementById("cSkill").value === "2" ? "CONF" : "VET",
      desc: document.getElementById("cDesc").value.trim(),
      install: document.getElementById("cInstall").value.trim(),
      run: document.getElementById("cRun").value.trim(),
      defense: document.getElementById("cDefense").value.trim(),
      notes: document.getElementById("cNotes").value.trim()
    };
    saveCustomTool(newTool);
    customModal.classList.remove("active");
    document.getElementById("customToolForm").reset();
    renderArsenal();
    initCategories();
    showToast(`MODULE '${newTool.name}' SAVED TO LOCAL ARSENAL`);
  };

  document.getElementById("addTabBtn").onclick = createTermTab;

  const termInput = document.getElementById("termInput");
  termInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      executeCommand(termInput.value);
      termInput.value = "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabAutocomplete();
    }
  });

  // Modal close handlers
  document.getElementById("modalClose")?.addEventListener("click", closeModal);
  document.getElementById("modalOverlay")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });

  window.runPlaybook = runPlaybook;
  window.setTheme = setTheme;
});

function initCategories() {
  const catList = document.getElementById("catList");
  if (!catList) return;
  catList.replaceChildren();

  const TOOLS = getTools();
  const cats = ["ALL", ...new Set(TOOLS.map(t => t.cat))];
  
  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `cat-btn ${cat === activeCategory ? 'on' : ''}`;
    
    let color = "var(--grn)";
    if (cat === "Web") color = "var(--cyn)";
    if (cat === "Exploit" || cat === "Post-Ex") color = "var(--mag)";
    if (cat === "Cracking") color = "var(--amb)";
    if (cat === "Forensics") color = "var(--lime)";
    if (cat === "Wireless") color = "var(--lav)";
    if (cat === "Network") color = "var(--blu)";

    btn.style.setProperty("--c", color);
    const count = cat === "ALL" ? TOOLS.length : TOOLS.filter(t => t.cat === cat).length;
    
    btn.innerHTML = `<span>${cat.toUpperCase()}</span><span class="n">[${count}]</span>`;
    btn.onclick = () => {
      playTone(600, 0.04);
      activeCategory = cat;
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      renderArsenal();
    };
    catList.appendChild(btn);
  });

  const domainCount = document.getElementById("domainCount");
  if (domainCount) domainCount.textContent = `N=${cats.length - 1}`;
}

function initSkills() {
  const skillOpts = document.getElementById("skillOpts");
  if (!skillOpts) return;
  const btns = skillOpts.querySelectorAll(".sk-btn");
  btns.forEach(btn => {
    btn.onclick = () => {
      playTone(550, 0.04);
      btns.forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      activeSkill = parseInt(btn.dataset.sk, 10);
      renderArsenal();
    };
  });
}

function renderArsenal() {
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  if (!grid) return;

  const TOOLS = getTools();
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = TOOLS.filter(tool => {
    const matchCat = activeCategory === "ALL" || tool.cat === activeCategory;
    const matchSkill = activeSkill === 0 || tool.skill === activeSkill;
    const matchQuery = !query || 
      tool.name.toLowerCase().includes(query) ||
      tool.cat.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      tool.run.toLowerCase().includes(query);

    return matchCat && matchSkill && matchQuery;
  });

  document.getElementById("count").textContent = filtered.length;
  document.getElementById("maxCount").textContent = TOOLS.length;
  document.getElementById("footerModuleCount").textContent = `${TOOLS.length} Active`;
  document.getElementById("tMods").textContent = TOOLS.length;

  grid.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "⚡ NO SECURITY MODULES MATCH YOUR GREP FILTER";
    grid.appendChild(empty);
    return;
  }

  filtered.forEach((tool, idx) => {
    const card = document.createElement("article");
    card.className = "tool";
    card.style.setProperty("--c", tool.color);
    card.style.setProperty("--i", idx);

    const favStatus = isFavorite(tool.id);

    const hdr = document.createElement("header");
    hdr.innerHTML = `<span class="idx">[#0${idx + 1}]</span>
      <h3 onclick="openModal('${tool.id}')">${tool.name}</h3>
      <button class="fav-btn ${favStatus ? 'on' : ''}" title="Bookmark Tool">${favStatus ? '★' : '☆'}</button>
      <span class="chip" style="border-color:${tool.color}; color:${tool.color}">${tool.cat.toUpperCase()}</span>`;

    hdr.querySelector(".fav-btn").onclick = (e) => {
      e.stopPropagation();
      const updated = toggleFavorite(tool.id);
      showToast(updated ? "ADDED TO FAVORITES ⭐" : "REMOVED FROM FAVORITES");
      renderArsenal();
    };

    const desc = document.createElement("p");
    desc.textContent = tool.desc;

    const skillDiv = document.createElement("div");
    skillDiv.className = "skill";
    skillDiv.innerHTML = `<span class="bars" style="color:${tool.color}">${tool.skill === 1 ? "▮▯▯" : tool.skill === 2 ? "▮▮▯" : "▮▮▮"}</span>
      <span>SKILL LEVEL: ${tool.skillLab}</span>`;

    const ftr = document.createElement("footer");
    if (tacticalMode === "RED") {
      const processedCmd = processCommandTemplate(tool.run);
      ftr.innerHTML = `<div class="cline">
        <span class="pr">$</span>
        <code>${processedCmd}</code>
        <button class="copy" id="run_${tool.id}" style="background:rgba(70,255,166,0.15); border-color:var(--grn); color:var(--grn)">▶ RUN</button>
      </div>`;
      ftr.querySelector(`#run_${tool.id}`).onclick = (e) => {
        e.stopPropagation();
        executeCommand(`run ${tool.id}`);
        document.getElementById("deck")?.scrollIntoView({ behavior: 'smooth' });
      };
    } else {
      ftr.innerHTML = `<div class="def-box"><b>🛡️ DEFENSIVE TELEMETRY: </b>${tool.defense || "Monitor process logs."}</div>`;
    }

    card.append(hdr, desc, skillDiv, ftr);
    grid.appendChild(card);
  });
}

function openModal(toolId) {
  const tool = getTools().find(t => t.id === toolId);
  if (!tool) return;
  playTone(800, 0.05);

  document.getElementById("mName").textContent = tool.name;
  const chip = document.getElementById("mChip");
  chip.textContent = tool.cat.toUpperCase();
  chip.style.borderColor = tool.color;
  chip.style.color = tool.color;

  document.getElementById("mSkill").textContent = `SKILL LEVEL: ${tool.skillLab}`;
  document.getElementById("mDesc").textContent = tool.desc;
  document.getElementById("mInstall").textContent = tool.install;
  
  const processedRun = processCommandTemplate(tool.run);
  document.getElementById("mRun").textContent = processedRun;
  
  document.getElementById("mDefense").innerHTML = `<b>🛡️ TELEMETRY ALERT: </b>${tool.defense || "No explicit telemetry rule cataloged."}`;
  document.getElementById("mNotes").textContent = tool.notes || "No additional usage notes recorded.";

  document.getElementById("mRunInTerm").onclick = () => {
    closeModal();
    executeCommand(`run ${tool.id}`);
    document.getElementById("deck")?.scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById("modalOverlay").classList.add("active");
}

function closeModal() {
  document.getElementById("modalOverlay")?.classList.remove("active");
}

function toggleTacticalMode() {
  const modeBadge = document.getElementById("modeBadge");
  const modeToggleBtn = document.getElementById("modeToggleBtn");
  if (tacticalMode === "RED") {
    tacticalMode = "BLUE";
    document.documentElement.setAttribute("data-mode", "blue");
    modeToggleBtn.className = "mode-toggle blue";
    modeBadge.textContent = "BLUE (DEFENSIVE)";
    showToast("TACTICAL MODE: BLUE TEAM (DEFENSIVE OVERLAY)");
  } else {
    tacticalMode = "RED";
    document.documentElement.removeAttribute("data-mode");
    modeToggleBtn.className = "mode-toggle red";
    modeBadge.textContent = "RED (OFFENSIVE)";
    showToast("TACTICAL MODE: RED TEAM (OFFENSIVE ARSENAL)");
  }
  renderArsenal();
}

function rollWotd() {
  const TOOLS = getTools();
  if (!TOOLS.length) return;
  const idx = Math.floor(Math.random() * TOOLS.length);
  currentWotd = TOOLS[idx];
  
  document.getElementById("wName").textContent = currentWotd.name;
  const chip = document.getElementById("wChip");
  chip.textContent = currentWotd.cat.toUpperCase();
  chip.style.borderColor = currentWotd.color;
  chip.style.color = currentWotd.color;
  document.getElementById("wBlurb").textContent = currentWotd.desc;
  
  const runCmd = processCommandTemplate(currentWotd.run);
  document.getElementById("wCmds").innerHTML = `<div class="cline"><span class="pr">#</span><code>${currentWotd.install}</code></div>
    <div class="cline"><span class="pr">$</span><code>${runCmd}</code></div>`;
}

function initCheats() {
  const cheatsGrid = document.getElementById("cheatsGrid");
  if (!cheatsGrid) return;
  cheatsGrid.replaceChildren();

  CHEATS.forEach(c => {
    const card = document.createElement("div");
    card.className = "cheat";
    const processedCode = processCommandTemplate(c.code);
    card.innerHTML = `<div class="lab"><span>${c.category}</span></div>
      <div class="code">${processedCode}</div>
      <div class="desc">${c.desc}</div>`;
    cheatsGrid.appendChild(card);
  });
}

function initBootLog() {
  const bootLog = document.getElementById("bootLog");
  if (!bootLog) return;
  const logLines = [
    { text: "SYS:// INITIALIZING GHOSTDECK MODULAR ENGINE v3.0.0...", type: "dm" },
    { text: "[OK] ES MODULES & VITE BUNDLER ARCHITECTURE LOADED", type: "ok" },
    { text: "[OK] BLUE TEAM SOC DASHBOARD & ALERTS STREAM ACTIVE", type: "ok" },
    { text: "[OK] SCRIPT COMMAND MACRO RECORDER & REPLAY ENGINE READY", type: "ok" },
    { text: "SYS:// GHOSTDECK READY FOR OPERATION.", type: "cm" }
  ];
  bootLog.replaceChildren();
  logLines.forEach((item, index) => {
    setTimeout(() => {
      const line = document.createElement("div");
      line.className = item.type;
      line.textContent = item.text;
      bootLog.appendChild(line);
    }, index * 150);
  });
}

function initTicker() {
  const track = document.getElementById("ticker");
  if (!track) return;
  const items = [
    "⚡ <b>GHOSTDECK v3.0:</b> Modular ES Architecture & Vite Build System",
    "🛡️ <b>BLUE TEAM SOC:</b> Real-time SIEM alert stream & Incident Response Triage",
    "🔴 <b>MACRO RECORDER:</b> Record & replay command script automation",
    "⌨️ <b>POWER SHORTCUTS:</b> Press '?' or 'Ctrl+K' for shortcuts modal"
  ];
  track.innerHTML = `<span>${items.join('<span class="sep">///</span>')}</span>`;
}

function initHeroTyping() {
  const lines = [
    "nmap -sC -sV -oA scan {TARGET}",
    "msfconsole -q -x 'use exploit/multi/handler'",
    "objection -g com.app explore"
  ];
  let lineIdx = 0; let charIdx = 0; let isDeleting = false;
  const typedEl = document.getElementById("typedLine");
  if (!typedEl) return;

  function typeStep() {
    const current = lines[lineIdx];
    typedEl.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
    charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
    let delay = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx === current.length) { delay = 2000; isDeleting = true; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; lineIdx = (lineIdx + 1) % lines.length; delay = 400; }
    setTimeout(typeStep, delay);
  }
  typeStep();
}

function updateClocks() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toTimeString().split(" ")[0];
  const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
  const hrs = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
  const secs = String(elapsedSec % 60).padStart(2, '0');
  document.getElementById("uptime").textContent = `${hrs}:${mins}:${secs}`;
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

window.openModal = openModal;
