export type Testimonial = {
  id: number
  name: string
  location: string
  instrument: string
  tier: 'signal' | 'audit' | 'forensic'
  flag_label: string
  flag_amount: string
  flag_count?: number
  quote: string
  avatar_initials: string
  verified: boolean
  date: string
  pending?: boolean
}

// TODO: Add 2-3 real beta user testimonials before public launch
// Required format: name, role, location, metric, quote
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Khalil — Founder",
    location: "Lebanon",
    instrument: "XAUUSD",
    tier: "forensic",
    flag_label: "No stop-loss losses",
    flag_amount: "$4,753",
    flag_count: 48,
    quote: "I built X-Ray to diagnose my own trading first. 276 revenge trades. 48 positions with no stop. Asian session at 77.8% win rate — I barely traded it. New York at 30.9% — I traded it 475 times. The machine found what I couldn't see in 15 years.",
    avatar_initials: "K",
    verified: true,
    date: "2026-05",
  },
]

// Helper: get non-pending for production use
export const verifiedTestimonials = testimonials.filter((t) => !t.pending)

// Helper: get by tier
export const getByTier = (tier: Testimonial['tier']) =>
  testimonials.filter((t) => t.tier === tier && !t.pending)
