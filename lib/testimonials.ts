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
  disclaimer?: string
  avatar_initials: string
  verified: boolean
  date: string
  pending?: boolean
}

// TODO: Add 2-3 real beta user testimonials before public launch
// Required format: name, role, location, metric, quote

// PENDING — replace with real user data before uncommenting
// {
//   id: 2,
//   name: "",
//   location: "",
//   instrument: "",
//   tier: "forensic",
//   flag_label: "",
//   flag_amount: "",
//   quote: "",
//   avatar_initials: "",
//   verified: false,
//   date: "",
// },

// PENDING — replace with real user data before uncommenting
// {
//   id: 3,
//   name: "",
//   location: "",
//   instrument: "",
//   tier: "audit",
//   flag_label: "",
//   flag_amount: "",
//   quote: "",
//   avatar_initials: "",
//   verified: false,
//   date: "",
// },

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Khalil — Founder",
    location: "Lebanon",
    instrument: "XAUUSD",
    tier: "forensic",
    flag_label: "No stop-loss losses (demo account)",
    flag_amount: "$4,753",
    flag_count: 48,
    quote: "Built by a trader who ran his own demo account through X-Ray and found $4,753 in stop-loss leaks. X-Ray exists because the data doesn't lie — and most traders never see it.",
    disclaimer: "Example based on a demonstration account. Individual results vary. Trading involves risk.",
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
