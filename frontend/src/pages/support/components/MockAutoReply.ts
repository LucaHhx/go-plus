/** Mock auto-reply logic for first-phase customer service. */

const keywordReplies: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['deposit', 'recharge', 'top up', 'top-up'],
    reply:
      'For deposit issues, please ensure you used a valid payment method. If your balance has not updated within 10 minutes, please share your transaction ID and we will investigate immediately.',
  },
  {
    keywords: ['withdraw', 'withdrawal', 'cash out', 'cashout'],
    reply:
      'Withdrawal requests are typically processed within 1-24 hours. If your withdrawal is pending for longer, please provide your registered phone number so we can check the status.',
  },
  {
    keywords: ['bonus', 'promotion', 'offer'],
    reply:
      'We have exciting promotions running! Please check our Promotions page for the latest offers. Is there a specific promotion you need help with?',
  },
  {
    keywords: ['account', 'login', 'password', 'locked'],
    reply:
      'For account-related issues, please verify your registered phone number. If you are locked out, try resetting your password via OTP. Need further assistance?',
  },
];

const defaultReply =
  'Thank you for reaching out! Our support agent will respond shortly. In the meantime, you can also contact us via Telegram or WhatsApp for faster assistance.';

const welcomeMessage =
  'Hello! Welcome to GO PLUS support. How can I help you today?';

export function getAutoReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const entry of keywordReplies) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.reply;
    }
  }
  return defaultReply;
}

export function getWelcomeMessage(): string {
  return welcomeMessage;
}

/** Random delay between 1-2 seconds to simulate agent typing */
export function getReplyDelay(): number {
  return 1000 + Math.random() * 1000;
}
