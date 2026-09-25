import { playTone } from './audio.js';
import { getParams, processCommandTemplate } from './commandBuilder.js';
import { getTools } from './storage.js';

let termTabs = [
  { id: 1, name: "Shell #1", output: [], history: [], historyIdx: -1 }
];
let activeTabId = 1;
let isRecording = false;
let recordedCommands = [];

export function getActiveTab() {
  return termTabs.find(t => t.id === activeTabId) || termTabs[0];
}

export function renderActiveTabOutput() {
  const termOutput = document.getElementById("termOutput");
  if (!termOutput) return;
  const tab = getActiveTab();
  termOutput.replaceChildren();
  tab.output.forEach(item => {
    const line = document.createElement("div");
    line.className = item.type;
    line.textContent = item.text;
    termOutput.appendChild(line);
  });
  termOutput.scrollTop = termOutput.scrollHeight;
}

export function printTermLine(text, type = "out") {
  const tab = getActiveTab();
  tab.output.push({ text, type });
  renderActiveTabOutput();
}

export function renderTermTabs() {
  const tabsBar = document.getElementById("termTabsBar");
  const addBtn = document.getElementById("addTabBtn");
  if (!tabsBar || !addBtn) return;
  
  const existingTabs = tabsBar.querySelectorAll(".term-tab");
  existingTabs.forEach(t => t.remove());

  termTabs.forEach(tab => {
    const tabEl = document.createElement("div");
    tabEl.className = `term-tab ${tab.id === activeTabId ? 'active' : ''}`;
    
    const label = document.createElement("span");
    label.textContent = tab.name;
    tabEl.appendChild(label);

    if (termTabs.length > 1) {
      const closeSpan = document.createElement("span");
      closeSpan.className = "close-tab";
      closeSpan.textContent = "✕";
      closeSpan.onclick = (e) => {
        e.stopPropagation();
        closeTermTab(tab.id);
      };
      tabEl.appendChild(closeSpan);
    }

    tabEl.onclick = () => switchTermTab(tab.id);
    tabsBar.insertBefore(tabEl, addBtn);
  });

  renderActiveTabOutput();
}

export function switchTermTab(tabId) {
  playTone(650, 0.03);
  activeTabId = tabId;
  renderTermTabs();
}

export function createTermTab() {
  playTone(700, 0.04);
  const newId = Date.now();
  const tabName = `Shell #${termTabs.length + 1}`;
  termTabs.push({ id: newId, name: tabName, output: [], history: [], historyIdx: -1 });
  activeTabId = newId;
  renderTermTabs();
  printTermLine(`GHOSTDECK TERMINAL SESSION [${tabName}] INITIALIZED.`, "ok");
}

export function closeTermTab(tabId) {
  if (termTabs.length <= 1) return;
  termTabs = termTabs.filter(t => t.id !== tabId);
  if (activeTabId === tabId) {
    activeTabId = termTabs[0].id;
  }
  renderTermTabs();
}

export function handleTabAutocomplete() {
  const termInput = document.getElementById("termInput");
  if (!termInput) return;
  const inputVal = termInput.value;
  if (!inputVal) return;

  const parts = inputVal.split(" ");
  const currentWord = parts[parts.length - 1].toLowerCase();

  const baseCmds = ["help", "ls", "cat", "run", "search", "wotd", "mode", "reset", "clear", "export", "sys", "record", "stop", "play"];
  const toolIds = getTools().map(t => t.id);
  const allTokens = [...baseCmds, ...toolIds];

  const matches = allTokens.filter(t => t.toLowerCase().startsWith(currentWord));

  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    termInput.value = parts.join(" ") + " ";
    playTone(900, 0.04);
  } else if (matches.length > 1) {
    printTermLine(`AUTOCOMPLETE MATCHES: ${matches.join("  ")}`, "dm");
    playTone(500, 0.04);
  }
}

export function executeCommand(cmdStr) {
  const input = cmdStr.trim();
  if (!input) return;

  const tab = getActiveTab();
  tab.history.push(input);
  tab.historyIdx = tab.history.length;

  if (isRecording && !input.startsWith("stop") && !input.startsWith("play")) {
    recordedCommands.push(input);
  }

  printTermLine(`ghostdeck@local:~$ ${input}`, "cy");
  playTone(400, 0.03);

  const parts = input.split(" ");
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(" ");
  const TOOLS = getTools();

  switch (cmd) {
    case "help":
      printTermLine("GHOSTDECK SHELL COMMANDS:", "ok");
      printTermLine("  ls              List all indexed security tools");
      printTermLine("  cat [tool]      View installation & details for a tool");
      printTermLine("  run [tool]      Execute parameterized tool runner");
      printTermLine("  search [query]  Search tools matching query");
      printTermLine("  record / stop   Record script command macro");
      printTermLine("  play            Replay recorded command script");
      printTermLine("  wotd            Show Weapon of the Session");
      printTermLine("  reset           Reset target parameter variables");
      printTermLine("  clear           Clear current terminal output");
      printTermLine("  sys             Print system status metrics");
      break;

    case "record":
      isRecording = true;
      recordedCommands = [];
      printTermLine("[🔴 RECORDING]: Script command recording started. Type commands and 'stop' to save.", "warn");
      break;

    case "stop":
      isRecording = false;
      printTermLine(`[⏹️ RECORDING STOPPED]: Saved ${recordedCommands.length} commands to session buffer. Type 'play' to execute script.`, "ok");
      break;

    case "play":
      if (recordedCommands.length === 0) {
        printTermLine("[!] No recorded commands found in session buffer.", "warn");
      } else {
        printTermLine(`[▶️ REPLAYING SCRIPT]: Executing ${recordedCommands.length} recorded commands...`, "ok");
        recordedCommands.forEach((recordedCmd, i) => {
          setTimeout(() => executeCommand(recordedCmd), (i + 1) * 800);
        });
      }
      break;

    case "ls":
      printTermLine(`INDEXED TOOLS (${TOOLS.length}):`, "ok");
      TOOLS.forEach(t => {
        printTermLine(`  - ${t.id.padEnd(14)} [${t.cat.toUpperCase().padEnd(9)}] ${t.desc.substring(0, 45)}...`);
      });
      break;

    case "cat":
      if (!arg) {
        printTermLine("Usage: cat <tool_name>", "warn");
        break;
      }
      const tCat = TOOLS.find(t => t.id === arg || t.name.toLowerCase() === arg);
      if (tCat) {
        printTermLine(`=== [ ${tCat.name.toUpperCase()} ] ===`, "ok");
        printTermLine(`Category: ${tCat.cat} | Skill: ${tCat.skillLab}`);
        printTermLine(`Desc:     ${tCat.desc}`);
        printTermLine(`Install:  ${tCat.install}`);
        printTermLine(`Execute:  ${processCommandTemplate(tCat.run)}`);
        printTermLine(`Defense:  ${tCat.defense || 'None cataloged.'}`);
      } else {
        printTermLine(`Tool '${arg}' not found in index. Type 'ls' for list.`, "err");
      }
      break;

    case "run":
      if (!arg) {
        printTermLine("Usage: run <tool_name>", "warn");
        break;
      }
      const tRun = TOOLS.find(t => t.id === arg.toLowerCase() || t.name.toLowerCase() === arg.toLowerCase());
      if (tRun) {
        const processedRun = processCommandTemplate(tRun.run);
        const p = getParams();
        printTermLine(`[+] Initializing process sandbox for [${tRun.name.toUpperCase()}]...`, "ok");
        printTermLine(`$ ${processedRun}`, "cy");
        
        setTimeout(() => {
          const id = tRun.id;
          if (id === "nmap") {
            printTermLine(`Starting Nmap 7.94 at ${new Date().toISOString().substring(0,19).replace('T',' ')} UTC`, "dm");
            printTermLine(`Nmap scan report for ${p.target} (Host is up: 0.0018s latency)`);
            printTermLine(`PORT     STATE SERVICE       VERSION`, "ok");
            printTermLine(`22/tcp   open  ssh           OpenSSH 8.9p1 Ubuntu`, "ok");
            printTermLine(`80/tcp   open  http          Apache httpd 2.4.52`, "ok");
            printTermLine(`443/tcp  open  ssl/https     nginx/1.18.0`, "ok");
          } else if (id === "gobuster" || id === "ffuf") {
            printTermLine(`Target URL: http://${p.target} | Wordlist: ${p.wordlist}`, "dm");
            printTermLine(`[+] /admin                (Status: 301) [Size: 312]`, "ok");
            printTermLine(`[+] /login.php            (Status: 200) [Size: 4210]`, "ok");
            printTermLine(`[+] /api/v1/users         (Status: 200) [Size: 844]`, "warn");
          } else {
            printTermLine(`[>] ${tRun.name}: Processing request on interface ${p.iface}...`, "out");
            printTermLine(`[>] Packet stream dispatched. Execution finished cleanly.`, "ok");
          }

          if (tRun.defense) {
            printTermLine(`[🛡️ TELEMETRY ALERT]: ${tRun.defense.substring(0, 90)}...`, "warn");
          }
          printTermLine(`[✓] ${tRun.name} execution sequence completed successfully.`, "ok");
        }, 500);
      } else {
        printTermLine(`Unknown module '${arg}'. Type 'ls' for available tools.`, "err");
      }
      break;

    case "clear":
      tab.output = [];
      renderActiveTabOutput();
      break;

    default:
      const matchedTool = TOOLS.find(t => t.id === cmd || t.name.toLowerCase() === cmd);
      if (matchedTool) {
        executeCommand(`run ${matchedTool.id}`);
      } else {
        printTermLine(`Command not recognized: '${cmd}'. Type 'help' for command list.`, "err");
      }
  }
}

export function runPlaybook(type) {
  playTone(800, 0.08);
  document.getElementById("deck")?.scrollIntoView({ behavior: 'smooth' });
  const p = getParams();
  
  if (type === 'web') {
    printTermLine(`[⚡ PLAYBOOK INITIALIZED]: Web Application Penetration Audit`, "cy");
    printTermLine(`[1/4] Running Subdomain Discovery: subfinder -d ${p.target}`, "dm");
    setTimeout(() => printTermLine(`[+] Found subdomains: api.${p.target}, dev.${p.target}, admin.${p.target}`, "ok"), 500);
    setTimeout(() => printTermLine(`[2/4] Probing HTTP endpoints: httpx -u http://${p.target}`, "dm"), 1000);
    setTimeout(() => printTermLine(`[+] Probed http://${p.target} [200 OK] Server: NGINX/1.18.0`, "ok"), 1500);
    setTimeout(() => printTermLine(`[3/4] Fuzzing paths: gobuster dir -u http://${p.target} -w ${p.wordlist}`, "dm"), 2000);
    setTimeout(() => printTermLine(`[+] Discovered: /admin [301], /api/v1 [200], /login.php [200]`, "ok"), 2500);
    setTimeout(() => printTermLine(`[4/4] Launching Nuclei CVE Scanner: nuclei -u http://${p.target}`, "dm"), 3000);
    setTimeout(() => {
      printTermLine(`[CVE-2023-28432] [CRITICAL] Exposed MinIO Disclosure at http://${p.target}/minio/bootstrap`, "err");
      printTermLine(`[✓] Web App Penetration Audit Playbook completed successfully.`, "ok");
    }, 3600);
  } else if (type === 'ad') {
    printTermLine(`[⚡ PLAYBOOK INITIALIZED]: Active Directory Domain Assessment`, "cy");
    printTermLine(`[1/4] Collecting AD Graph telemetry via SharpHound...`, "dm");
    setTimeout(() => printTermLine(`[+] Zip archived: ad_data_${Date.now()}.zip (1,420 AD objects collected)`, "ok"), 600);
    setTimeout(() => printTermLine(`[2/4] Enumerating Kerberos Pre-Auth: kerbrute userenum -d domain.local`, "dm"), 1200);
    setTimeout(() => printTermLine(`[+] Valid User Accounts: svc_sql, admin, krbtgt, jdoe`, "ok"), 1800);
    setTimeout(() => printTermLine(`[3/4] Probing SMB shares: crackmapexec smb ${p.target} -u 'svc_sql'`, "dm"), 2400);
    setTimeout(() => printTermLine(`[+] Pwn3d! SMB Access Granted (READ, WRITE) on \\\\${p.target}\\SYSVOL`, "ok"), 3000);
    setTimeout(() => {
      printTermLine(`[4/4] Executing remote secretsdump: impacket-secretsdump domain/svc_sql@${p.target}`, "dm");
      printTermLine(`[+] Dumped Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::`, "err");
      printTermLine(`[✓] Active Directory Playbook completed successfully.`, "ok");
    }, 3700);
  }
}
