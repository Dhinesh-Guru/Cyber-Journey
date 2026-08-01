/* ==========================================================================
   Cyber Academy - Data Module: Phishing Inspector & Email App Interactive Samples
   ========================================================================== */

const PHISHING_DATA = [
    {
        id: 'email_1',
        senderName: 'PayPal Security Support',
        senderAddress: 'service@paypa1-security-alert.com',
        displayDomain: 'paypa1-security-alert.com',
        subject: 'URGENT: Your account has been suspended due to suspicious activity!',
        date: '10 mins ago',
        isPhishing: true,
        content: `
            <p>Dear Valued Customer,</p>
            <p>We detected an unauthorized login attempt to your PayPal account from an unrecognized device in Moscow, Russia.</p>
            <p>To restore full access to your funds, you must verify your identity within <strong>24 HOURS</strong> or your account will be permanently closed.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="#" class="inspectable-link" data-real-url="http://paypa1-security-alert.com/login/verify.html" style="background:#0070ba; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">Click Here to Verify Account Credentials</a>
            </div>
            <p style="font-size:0.8rem; color:#888;">PayPal Fraud Prevention Team</p>
        `,
        redFlags: [
            'Spoofed Domain: "paypa1-security-alert.com" uses a number "1" instead of "l".',
            'Artificial Urgency: Threatens to permanently close account in 24 hours.',
            'Generic Greeting: "Dear Valued Customer" instead of your real name.',
            'Malicious Link: Hovering over the button reveals an unencrypted HTTP scam URL.'
        ]
    },
    {
        id: 'email_2',
        senderName: 'GitHub Security Alerts',
        senderAddress: 'noreply@github.com',
        displayDomain: 'github.com',
        subject: '[GitHub] Security Alert: New SSH key added to your account',
        date: '1 hour ago',
        isPhishing: false,
        content: `
            <p>Hi CyberTrainee,</p>
            <p>A new SSH public key (<em>id_ed25519_dev_laptop</em>) was added to your account on July 30, 2026 at 09:30 UTC.</p>
            <p>If you added this key, no further action is required.</p>
            <p>If you did not add this key, please sign in to GitHub and revoke it immediately from your account settings.</p>
            <div style="margin: 20px 0;">
                <a href="#" class="inspectable-link" data-real-url="https://github.com/settings/keys" style="color:#58a6ff; text-decoration:underline;">https://github.com/settings/keys</a>
            </div>
            <p style="font-size:0.8rem; color:#888;">GitHub Security Team • San Francisco, CA</p>
        `,
        redFlags: []
    },
    {
        id: 'email_3',
        senderName: 'IT Service Desk',
        senderAddress: 'admin-update@company-it-desk.org',
        displayDomain: 'company-it-desk.org',
        subject: 'Mandatory Office 365 Password Migration - Action Required',
        date: '2 hours ago',
        isPhishing: true,
        content: `
            <p>All Employees,</p>
            <p>Our IT department is migrating all corporate mailboxes to Office 365 Cloud storage tonight at 6:00 PM.</p>
            <p>Failure to update your mailbox password before 6:00 PM will result in <strong>PERMANENT LOSS OF YOUR EMAIL HISTORY</strong>.</p>
            <p>Please enter your current network password below to keep your mailbox active:</p>
            <div style="text-align:center; margin:20px 0;">
                <a href="#" class="inspectable-link" data-real-url="http://company-it-desk.org/o365/login.php" style="background:#e81123; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:bold; display:inline-block;">MIGRATE MAILBOX NOW</a>
            </div>
            <p style="font-size:0.8rem; color:#888;">Corporate Information Technology Helpdesk</p>
        `,
        redFlags: [
            'External Sender Address: Domain "company-it-desk.org" is an external domain, not corporate internal email.',
            'Threat of Data Destruction: Claims email history will be permanently deleted.',
            'Credential Harvester Link: Points to an unencrypted `.php` login harvester page.'
        ]
    },
    {
        id: 'email_4',
        senderName: 'Chase Online Banking',
        senderAddress: 'no.reply.alerts@chase.com',
        displayDomain: 'chase.com',
        subject: 'Your monthly e-Statement is ready to view',
        date: 'Yesterday',
        isPhishing: false,
        content: `
            <p>Hello Trainee,</p>
            <p>Your electronic statement for account ending in <strong>#4892</strong> for the billing period ending July 2026 is now available online.</p>
            <p>To view your statement securely, log into your Chase account at <a href="#" class="inspectable-link" data-real-url="https://www.chase.com" style="color:#117aca;">www.chase.com</a> or open the official Chase Mobile app.</p>
            <p style="font-size:0.8rem; color:#666;">Chase Card Services • Customer Service: 1-800-955-9060</p>
        `,
        redFlags: []
    },
    {
        id: 'email_5',
        senderName: 'Amazon Rewards Program',
        senderAddress: 'winner-notify@amaz0n-gift-reward.net',
        displayDomain: 'amaz0n-gift-reward.net',
        subject: 'Congratulations! You won a $500 Amazon Gift Card!',
        date: '3 days ago',
        isPhishing: true,
        content: `
            <p>Congratulations Customer!</p>
            <p>You have been randomly selected as our <strong>Lucky Shopper of the Day</strong>! Claim your <strong>$500 Amazon Digital Gift Card</strong> now before rewards run out.</p>
            <p>Simply pay a $1.99 shipping verification fee using your credit card:</p>
            <div style="text-align:center; margin:20px 0;">
                <a href="#" class="inspectable-link" data-real-url="http://amaz0n-gift-reward.net/claim/card" style="background:#ff9900; color:#111; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">CLAIM $500 GIFT CARD</a>
            </div>
            <p style="font-size:0.8rem; color:#888;">Amazon Customer Promotions Division</p>
        `,
        redFlags: [
            'Typosquatting Domain: "amaz0n" uses zero "0" instead of "o".',
            'Too Good To Be True: Unsolicited $500 prize.',
            'Financial Trap: Asks for credit card details to pay a fake "shipping fee".'
        ]
    }
];
