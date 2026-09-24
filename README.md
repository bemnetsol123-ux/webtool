# GHOSTDECK v3.0 — Cyber Security Tactical Arsenal & Telemetry Deck

![GHOSTDECK Banner](https://img.shields.module.badge.svg?label=GHOSTDECK&message=v3.0-pro&color=46ffa6)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Mode](https://img.shields.io/badge/Tactical_Mode-Red%2FBlue_Dual-5ad1ff.svg)

**GHOSTDECK** is an interactive, browser-native cyber security tool arsenal and command reference deck built for penetration testers, security researchers, red teams, and SOC defenders.

It requires no node server, database, or external dependencies—simply open `index.html` in any modern web browser.

---

## ⚡ Features

### 1. 🎯 Interactive Parameter Builder
- Customize target variables globally: `{TARGET}` (IP/Host), `{PORT}`, `{IFACE}`, and `{WORDLIST}`.
- All command one-liners dynamically render with your active target parameters in real time.

### 2. 🛡️ Dual-Mode Red / Blue Team Telemetry
- **Red Team (Offensive)**: Highlighting verified penetration testing commands, syntax, and one-click copy options.
- **Blue Team (Defensive)**: Displays SOC countermeasures, Sysmon Event IDs, Snort/Suricata SIDs, YARA signatures, WAF rules, and OS hardening scripts.

### 3. 🖥️ Multi-Tab VT100 Terminal Simulator
- Built-in multi-session interactive shell with tab creation/deletion.
- **TAB Autocomplete**: Autocompletes terminal commands (`help`, `ls`, `cat`, `run`, `search`, `mode`, `export`) and module names (`nmap`, `burpsuite`, `hashcat`, etc.).
- **Command History**: Navigate terminal input history using `Up` (`↑`) and `Down` (`↓`) arrow keys.

### 4. 🌐 Custom Tool Manager & LocalStorage Persistence
- Add custom tools to your personal arsenal with custom installation steps, execution commands, and defensive signatures.
- LocalStorage persistence saves your custom tools across browser sessions.
- Export and import your custom tool collection as JSON files.

### 5. 🎨 Retro Cyberpunk Aesthetics & Audio Synthesizer
- Built-in Web Audio API synthesizer for tactile keypress and button feedback.
- Customizable color themes: **Neon Green**, **Cyber Amber**, **Matrix Cyan**, and **Synthwave Magenta**.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `/` | Jump focus directly to search bar |
| `T` | Focus active terminal input and scroll to Command Deck |
| `R` | Reroll **Weapon of the Session** |
| `ESC` | Close active modal or blur input focus |
| `TAB` | Autocomplete command or tool slug in terminal |
| `↑` / `↓` | Cycle command history in active terminal tab |

---

## 🚀 Getting Started

1. Clone or download this repository:
   ```bash
   git clone https://github.com/bemnetsol123-ux/webtool.git
   ```
2. Open `index.html` in any web browser.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

*Disclaimer: GHOSTDECK is designed strictly for authorized security auditing and educational purposes.*
