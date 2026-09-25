export const PLAYBOOKS = [
  {
    id: "web",
    title: "🌐 WEB APP PENETRATION AUDIT",
    color: "var(--cyn)",
    desc: "Full web application security assessment sequence from subdomains to parameter injection.",
    steps: [
      { no: "01", name: "Subdomain Discovery", cmd: "subfinder -d {TARGET}" },
      { no: "02", name: "Active Web Probing", cmd: "httpx -u http://{TARGET}" },
      { no: "03", name: "Directory Fuzzing", cmd: "gobuster dir -u http://{TARGET}" },
      { no: "04", name: "Vulnerability Scan", cmd: "nuclei -u http://{TARGET}" }
    ]
  },
  {
    id: "ad",
    title: "🏰 ACTIVE DIRECTORY ASSESSMENT",
    color: "var(--amb)",
    desc: "Active Directory domain mapping, Kerberos enumeration, and credential harvesting workflow.",
    steps: [
      { no: "01", name: "AD Graph Collection", cmd: "SharpHound.exe -c All" },
      { no: "02", name: "User Pre-Auth Enum", cmd: "kerbrute userenum -d domain.local" },
      { no: "03", name: "SMB Share Auditing", cmd: "crackmapexec smb {TARGET}" },
      { no: "04", name: "LSA / Hash Extraction", cmd: "impacket-secretsdump" }
    ]
  },
  {
    id: "mobile",
    title: "📱 ANDROID REVERSE ENGINEERING",
    color: "var(--blu)",
    desc: "Decompile APK, inspect manifest badging, bypass SSL pinning, and hook dynamic methods.",
    steps: [
      { no: "01", name: "Manifest & Badging Dump", cmd: "aapt dump badging app.apk" },
      { no: "02", name: "APK Decompilation", cmd: "apktool d app.apk" },
      { no: "03", name: "DEX Java Decompile", cmd: "jadx app.apk -d src/" },
      { no: "04", name: "Dynamic Frida Hooking", cmd: "objection -g com.app explore" }
    ]
  },
  {
    id: "cloud",
    title: "☁️ CLOUD INFRASTRUCTURE AUDIT",
    color: "var(--lime)",
    desc: "Assess AWS/Azure cloud security posture against CIS benchmarks and misconfigurations.",
    steps: [
      { no: "01", name: "Host Asset Discovery", cmd: "shodan host {TARGET}" },
      { no: "02", name: "IaC Terraform Audit", cmd: "checkmarx/kics scan" },
      { no: "03", name: "CIS Benchmark Scan", cmd: "prowler aws --profile default" },
      { no: "04", name: "S3 / IAM Auditing", cmd: "trivy image {TARGET}" }
    ]
  }
];
