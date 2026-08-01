/* ==========================================================================
   CyberOps Lab (Level 2) - Data: Realistic SOC Security Logs
   ========================================================================== */

const SOC_LOG_SAMPLES = [
    { id: 101, timestamp: '10:00:12', severity: 'INFO', sourceIp: '192.168.1.105', user: 'admin', event: 'AUTH_SUCCESS', msg: 'User admin logged in via SSH (Port 22).' },
    { id: 102, timestamp: '10:01:05', severity: 'WARN', sourceIp: '45.142.120.9', user: 'root', event: 'AUTH_FAILURE', msg: 'Failed password attempt for root from 45.142.120.9.' },
    { id: 103, timestamp: '10:01:08', severity: 'WARN', sourceIp: '45.142.120.9', user: 'admin', event: 'AUTH_FAILURE', msg: 'Failed password attempt for admin from 45.142.120.9.' },
    { id: 104, timestamp: '10:01:11', severity: 'WARN', sourceIp: '45.142.120.9', user: 'user1', event: 'AUTH_FAILURE', msg: 'Failed password attempt for user1 from 45.142.120.9.' },
    { id: 105, timestamp: '10:01:14', severity: 'CRITICAL', sourceIp: '45.142.120.9', user: 'admin', event: 'BRUTE_FORCE_DETECTED', msg: 'ALERT: 15 failed logins in 10s from IP 45.142.120.9. Automated dictionary attack flag.' },
    { id: 106, timestamp: '10:01:20', severity: 'CRITICAL', sourceIp: '45.142.120.9', user: 'admin', event: 'AUTH_SUCCESS', msg: 'SUCCESS: User admin authenticated from suspicious IP 45.142.120.9 (Location: Unknown proxy).' },
    { id: 107, timestamp: '10:02:44', severity: 'CRITICAL', sourceIp: '45.142.120.9', user: 'admin', event: 'PROCESS_SPAWN', msg: 'EXPLOIT ALERT: Admin user executed cmd.exe -> powershell.exe -Enc ExecutionPolicy Bypass.' },
    { id: 108, timestamp: '10:03:10', severity: 'WARN', sourceIp: '192.168.1.14', user: 'sarah_m', event: 'WEB_ACCESS', msg: 'GET /download/annual_report_2026.pdf HTTP/1.1 200 OK.' },
    { id: 109, timestamp: '10:04:22', severity: 'CRITICAL', sourceIp: '192.168.1.14', user: 'sarah_m', event: 'FILE_DOWNLOAD', msg: 'WARNING: Downloaded double extension file invoice_july.pdf.exe from unknown-host.ru.' },
    { id: 110, timestamp: '10:05:00', severity: 'INFO', sourceIp: '192.168.1.1', user: 'system', event: 'FIREWALL_RULE', msg: 'Firewall active: Port 443 ALLOWED | Port 80 ALLOWED.' }
];

const SOC_THREAT_HASHES = [
    { name: 'Ransomware.WannaCry.Payload', md5: '84c82835a5d21bbcf5d5f12619319b7b', sha256: '24d004a104d4d54034dbcffc2a4b19a0ac3908c775dd4863653258686a8b4680', threatLevel: 'CRITICAL HIGH' },
    { name: 'Trojan.DisguisedPDF.Exe', md5: '3a99bc12e84d72019ab723491823ab02', sha256: '8f14e45f9a2b8c9d0123ef456789a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', threatLevel: 'HIGH MALWARE' },
    { name: 'Adware.BrowserInjector', md5: 'd41d8cd98f00b204e9800998ecf8427e', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', threatLevel: 'MEDIUM RISK' }
];
