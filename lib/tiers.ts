export const tierData = {
  'signal': { name: 'SIGNAL', price: 'Free', type: 'subscription' as const },
  'forensic': { name: 'FORENSIC', price: '$29/mo', type: 'subscription' as const },
  'operator': { name: 'OPERATOR', price: '$79/mo', type: 'subscription' as const },
  'elite': { name: 'ELITE', price: '$149/mo', type: 'subscription' as const },
  'spot-audit': { name: 'Spot Audit', price: '$49', type: 'one-time' as const },
  'pre-challenge': { name: 'Pre-Challenge Clearance', price: '$79', type: 'one-time' as const },
  'failure-autopsy': { name: 'Failure Autopsy', price: '$99', type: 'one-time' as const },
  'ea-autopsy': {
    name: 'EA Autopsy',
    price: '$99',
    priceAmount: 99,
    type: 'one-time' as const,
    reportLevel: 'forensic' as const,
    requiresPayment: true,
    tagline: 'Did your bot blow the account, or did you?',
    features: [
      'Magic number EA identification',
      'Per-EA performance audit',
      'EA strategy classification',
      'Manual vs EA benchmark',
      'Deployment quality score',
      'Verdict: run it, fix it, or stop it',
    ],
    footnote: 'Requires Magic Export file from MT5. Download the free script at xrayforensic.com/tools',
    includes: null,
  },
} as const;

export type TierSlug = keyof typeof tierData;
