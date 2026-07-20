import { Lab } from '../types';

export const labsData: Lab[] = [
  {
    id: 'spot-phishing',
    title: 'Phishing Detection Lab',
    category: 'Social Engineering',
    difficulty: 'Beginner',
    description: 'Inspect details of an incoming corporate email. Identify spelling anomalies, sender address masquerading, urgent headers, and bad URLs to secure your workspace.',
    instructions: [
      'Analyze the provided email headers and content carefully.',
      'Select and click on the elements that you think are suspicious indicators of phishing.',
      'Identify the spoofed domain name in the sender email.',
      'Submit the correct security flag to solve the lab. Hint: The flag is found by spotting all three major indicators.'
    ],
    vulnerabilityDescription: 'Masquerading as internal administration with urgent action links hosted on external lookalike domains.',
    hints: [
      'Look very closely at the sender domain spelling in the header. Is it "microsoft.com" or "m1crosoft-security-portal.com"?',
      'Check the urgent, emotional request in the subject line demanding password updates within 2 hours.',
      'Hover over or inspect the action link. It points to a non-standard port and a generic IP.'
    ],
    flag: 'FLAG{PHISH_SPOTTED_7493}',
    points: 100
  },
  {
    id: 'sql-injection-lab',
    title: 'SQL Injection Sandbox',
    category: 'Web Security',
    difficulty: 'Intermediate',
    description: 'Exploit a mock vulnerable login interface using standard SQL injection payloads. Understand how parameterization stops SQLi.',
    instructions: [
      'Your target is a search query where user input is concatenated directly to SQL.',
      'Input classic SQL payloads like: `admin\' OR \'1\'=\'1` or `\' UNION SELECT NULL, password FROM users --` to dump data.',
      'Once the administration user database records are dumped into the screen view, locate the flag in the results.',
      'Submit the flag in the form below.'
    ],
    vulnerabilityDescription: 'Concatenated input in SQL commands allows structural query hijacking.',
    hints: [
      'Try placing a single quote `\'` in the search field to see if it causes a syntax database error.',
      'Try typing the classic bypass payload: `\' OR \'1\'=\'1` into the search field and submit.'
    ],
    flag: 'FLAG{SQL_INJECT_SUCCESS_8830}',
    points: 150
  },
  {
    id: 'firewall-builder-lab',
    title: 'Firewall Defensive Policy',
    category: 'Infrastructure',
    difficulty: 'Intermediate',
    description: 'Create firewall security rules to block malicious traffic from reaching critical database servers while keeping public web ports accessible.',
    instructions: [
      'Analyze the incoming traffic log containing Source IP, Destination Port, and Protocol.',
      'Configure the firewall ruleset: ALLOW standard HTTP/S ports from any IP, but BLOCK SSH port 22 and Database port 5432 from all public ranges EXCEPT our internal Admin IP `10.0.8.44`.',
      'Deploy the configuration and test it against the automated simulated traffic generator.',
      'Successfully block 100% of malicious probes to unlock the flag.'
    ],
    vulnerabilityDescription: 'Open ports to unauthorized IP blocks leading to potential database scanning and SSH brute forcing.',
    hints: [
      'The database runs on port 5432. Make sure you add a BLOCK rule for port 5432 from ANY source.',
      'Then, add an ALLOW rule for source IP `10.0.8.44` on port 22 (SSH) and 5432, place it at higher priority (at the top).',
      'Make sure standard web port 80 and 443 are allowed for ALL.'
    ],
    flag: 'FLAG{FIREWALL_HARDENED_9210}',
    points: 200
  },
  {
    id: 'caesar-cipher-cracking',
    title: 'Caesar Cipher Decryption CTF',
    category: 'Cryptography',
    difficulty: 'Beginner',
    description: 'An intercepted spy transmission is encrypted using a Caesar cipher with an unknown shift. Analyze character frequency and find the flag.',
    instructions: [
      'Review the encrypted ciphertext transmission.',
      'Use the interactive slider to shift letters in real-time.',
      'Look for the decrypted text to make logical English sense.',
      'Copy the decoded flag and paste it in the submission panel.'
    ],
    vulnerabilityDescription: 'Weak symmetric substitution cipher with small key space ($26$ possible shift options) vulnerable to brute force.',
    hints: [
      'Look for words like "THE", "FLAG", or standard English spaces.',
      'Try moving the shift slider to exactly 7 or 13, and inspect the changes.'
    ],
    flag: 'FLAG{ROT_CIPHER_SOLVED_2209}',
    points: 100
  },
  {
    id: 'incident-response',
    title: 'Active Incident Response Lab',
    category: 'Social Engineering',
    difficulty: 'Advanced',
    description: 'A ransomware threat actor is inside the internal corporate network! Execute security playbooks to isolate servers, search syslogs, and recover the decrypt key.',
    instructions: [
      'Step 1: Check your network monitoring interface. Identify the compromised server (the one broadcasting outbound connections on port 6667 to a known C2 server).',
      'Step 2: Terminate the compromised process using the Linux CLI tools or networking control buttons.',
      'Step 3: Analyze syslog files to find the entry point. Find the name of the suspicious downloaded script.',
      'Step 4: Use the memory dump hash to find the decrypter key on VirusTotal database.',
      'Enter the correct final decryption key flag to restore operations.'
    ],
    vulnerabilityDescription: 'Compromised workstation communicating with external IRC C2 channels, deploying secondary payloads.',
    hints: [
      'Examine the list of active processes on Server-B. There is a process running with an irregular name `/tmp/.sys_daemon`.',
      'Kill that process first to stop the active C2 communication link!',
      'Check `/var/log/syslog` using the `cat` command in the terminal tool.'
    ],
    flag: 'FLAG{INCIDENT_ISOLATED_8401}',
    points: 250
  }
];
