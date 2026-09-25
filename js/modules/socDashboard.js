import { SIEM_RULES, SOC_CHECKLISTS } from '../data/socChecklists.js';

export function renderSocDashboard() {
  const container = document.getElementById("socContainer");
  if (!container) return;

  container.replaceChildren();

  const grid = document.createElement("div");
  grid.className = "soc-grid";

  // SIEM Alerts Stream
  const alertsCard = document.createElement("div");
  alertsCard.className = "soc-card";
  
  const h3 = document.createElement("h3");
  h3.innerHTML = `<span>🛡️ REAL-TIME SIEM ALERTS STREAM</span><button class="btn cyn" style="padding:3px 8px; font-size:10px;" id="simAlertBtn">SIMULATE ALERT</button>`;
  
  const stream = document.createElement("div");
  stream.className = "alert-stream";
  stream.id = "alertStream";

  SIEM_RULES.forEach(rule => {
    const item = document.createElement("div");
    item.className = `alert-item ${rule.severity === 'CRITICAL' ? 'crit' : ''}`;
    item.innerHTML = `<b>[${rule.severity}] ${rule.id}</b> - ${rule.name}<br><code style="font-size:10px; color:var(--dim);">${rule.query}</code>`;
    stream.appendChild(item);
  });

  alertsCard.appendChild(h3);
  alertsCard.appendChild(stream);

  // SOC Incident Response Checklist
  const irCard = document.createElement("div");
  irCard.className = "soc-card";
  
  const h3Ir = document.createElement("h3");
  h3Ir.innerHTML = `<span>📋 INCIDENT RESPONSE TRIAGE PLAYBOOK</span>`;
  
  const irList = document.createElement("div");
  irList.style.display = "flex";
  irList.style.flexDirection = "column";
  irList.style.gap = "12px";

  SOC_CHECKLISTS.forEach(phase => {
    const group = document.createElement("div");
    group.style.background = "var(--bg0)";
    group.style.border = "1px solid var(--line)";
    group.style.padding = "10px 14px";
    
    const title = document.createElement("div");
    title.style.fontSize = "11px";
    title.style.color = "var(--mode-accent)";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "6px";
    title.textContent = phase.phase;
    
    group.appendChild(title);

    phase.items.forEach(item => {
      const line = document.createElement("label");
      line.style.display = "flex";
      line.style.gap = "8px";
      line.style.fontSize = "11.5px";
      line.style.color = "var(--ink)";
      line.style.cursor = "pointer";
      line.style.marginBottom = "4px";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      
      const txt = document.createElement("span");
      txt.textContent = item;

      line.appendChild(cb);
      line.appendChild(txt);
      group.appendChild(line);
    });

    irList.appendChild(group);
  });

  irCard.appendChild(h3Ir);
  irCard.appendChild(irList);

  grid.appendChild(alertsCard);
  grid.appendChild(irCard);
  container.appendChild(grid);

  document.getElementById("simAlertBtn")?.addEventListener("click", simulateAlert);
}

export function simulateAlert() {
  const stream = document.getElementById("alertStream");
  if (!stream) return;
  
  const randRule = SIEM_RULES[Math.floor(Math.random() * SIEM_RULES.length)];
  const item = document.createElement("div");
  item.className = `alert-item ${randRule.severity === 'CRITICAL' ? 'crit' : ''}`;
  item.innerHTML = `<b>[${randRule.severity}] ALERT TRIGGERED @ ${new Date().toLocaleTimeString()}</b><br>${randRule.name} - Target: 192.168.1.1`;
  stream.prepend(item);
}
