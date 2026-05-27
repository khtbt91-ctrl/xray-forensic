export const tierData = {
  'signal': { name: 'SIGNAL', price: 'Free', type: 'subscription' as const },
  'audit': { name: 'AUDIT', price: '$29/mo', type: 'subscription' as const },
  'forensic': { name: 'FORENSIC', price: '$79/mo', type: 'subscription' as const },
  'guardian': { name: 'GUARDIAN', price: '$149/mo', type: 'subscription' as const },
  'sovereign': { name: 'SOVEREIGN', price: '$399/mo', type: 'subscription' as const },
  'spot-audit': { name: 'Spot Audit', price: '$49', type: 'one-time' as const },
  'pre-challenge': { name: 'Pre-Challenge Clearance', price: '$79', type: 'one-time' as const },
  'failure-autopsy': { name: 'Failure Autopsy', price: '$99', type: 'one-time' as const },
} as const;

export type TierSlug = keyof typeof tierData;
