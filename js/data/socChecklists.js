export const SOC_CHECKLISTS = [
  {
    phase: "PHASE 1: IDENTIFICATION & TRIAGE",
    items: [
      "Validate SIEM alert trigger timestamp and host IP correlation.",
      "Check Endpoint Detection & Response (EDR) process tree for parent execution anomalies.",
      "Inspect network egress connections targeting suspicious external IP blocks."
    ]
  },
  {
    phase: "PHASE 2: CONTAINMENT",
    items: [
      "Isolate affected host endpoint via EDR network isolation policy.",
      "Revoke active Kerberos TGT tickets and reset user credentials.",
      "Block malicious IP/FQDN on edge perimeter firewall and proxy."
    ]
  },
  {
    phase: "PHASE 3: ERADICATION & RECOVERY",
    items: [
      "Terminate unauthorized persistence scheduled tasks and registry run keys.",
      "Verify system integrity via AV/EDR full memory sweep.",
      "Restore compromised system from verified clean backup image."
    ]
  }
];

export const SIEM_RULES = [
  { id: "SEC-1001", name: "LSASS Memory Read Access", query: "process.name == 'lsass.exe' AND event.id == 10", severity: "HIGH" },
  { id: "SEC-1002", name: "PowerShell Encoded Command", query: "process.command_line: '* -enc *' OR process.command_line: '* -e *'", severity: "CRITICAL" },
  { id: "SEC-1003", name: "Kerberos TGT Request Anomaly", query: "event.code == 4768 AND kerberos.ticket_encryption == '0x17'", severity: "MEDIUM" },
  { id: "SEC-1004", name: "Suspicious Scheduled Task Created", query: "event.code == 4698 AND task.action: '*.bat*'", severity: "HIGH" }
];
