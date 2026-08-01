/* ==========================================================================
   CyberOps Lab (Level 2) - Data: Realistic PCAP Network Packet Captures
   ========================================================================== */

const SOC_PCAP_SAMPLES = [
    {
        num: 1,
        time: '0.000000',
        source: '192.168.1.105',
        dest: '142.250.190.46',
        protocol: 'HTTPS (TLS 1.3)',
        port: 443,
        length: 512,
        info: 'Client Hello [TLS 1.3 Encrypted Handshake]',
        isSuspicious: false,
        payloadHex: '16 03 01 02 00 01 00 01 fc 03 03 4a 5b 9f 12 ... [ENCRYPTED TLS PAYLOAD]'
    },
    {
        num: 2,
        time: '0.042105',
        source: '192.168.1.14',
        dest: '198.51.100.42',
        protocol: 'HTTP (Cleartext)',
        port: 80,
        length: 284,
        info: 'POST /login.php HTTP/1.1 (uname=admin&pass=T!ger#92)',
        isSuspicious: true,
        payloadHex: '50 4f 53 54 20 2f 6c 6f 67 69 6e 2e 70 68 70 20 48 54 54 50 [CLEAR-TEXT PASSWORDS EXPOSED!]'
    },
    {
        num: 3,
        time: '0.104289',
        source: '45.142.120.9',
        dest: '192.168.1.1',
        protocol: 'TCP SYN FLOOD',
        port: 80,
        length: 64,
        info: '45.142.120.9 -> 192.168.1.1 [SYN] Seq=0 Win=64240 Len=0',
        isSuspicious: true,
        payloadHex: '00 00 00 00 00 00 00 00 [DOS PORT SCAN SYN FLOOD]'
    },
    {
        num: 4,
        time: '0.189342',
        source: '192.168.1.14',
        dest: '8.8.8.8',
        protocol: 'DNS Lookup',
        port: 53,
        length: 78,
        info: 'Standard query 0x1a2b A exfil-data-chunk1.unknown-host.ru',
        isSuspicious: true,
        payloadHex: '65 78 66 69 6c 2d 64 61 74 61 2d 63 68 75 6e 6b 31 [DNS TUNNELING EXFILTRATION]'
    }
];
