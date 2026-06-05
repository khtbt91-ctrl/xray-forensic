'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import NavBar from '../components/NavBar'

// ── constants ─────────────────────────────────────────────────────────────────

const ADMIN_EMAILS = ['admin@xrayforensic.com', 'kh.tbt91@gmail.com']
const API = process.env.NEXT_PUBLIC_API_URL || ''
const BG = '#050811'
const CARD = '#0e1626'
const BORDER = '#1e293b'
const GOLD = '#e5b83c'
const MONO = "'JetBrains Mono', monospace"
const SANS = "'Space Grotesk', sans-serif"

const TIER_PRICES: Record<string, string> = {
  signal: 'Free', audit: '$29/mo', forensic: '$79/mo',
  guardian: '$149/mo', sovereign: '$399/mo',
  'spot-audit': '$49', 'pre-challenge': '$79', 'failure-autopsy': '$99',
}

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  signal:          { bg: 'rgba(100,116,139,0.15)', text: '#64748b' },
  audit:           { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
  forensic:        { bg: 'rgba(59,130,246,0.15)',  text: '#3b82f6' },
  operator:        { bg: 'rgba(229,184,60,0.15)',  text: '#e5b83c' },
  guardian:        { bg: 'rgba(16,185,129,0.15)',  text: '#10b981' },
  sovereign:       { bg: 'rgba(16,185,129,0.15)',  text: '#10b981' },
  elite:           { bg: 'rgba(16,185,129,0.15)',  text: '#10b981' },
}

// ── types ─────────────────────────────────────────────────────────────────────

interface Stats {
  total_users: number
  total_analyses: number
  active_subscribers: number
  pending_payments: number
  revenue_this_month: number
}

interface PendingPayment {
  id: string
  tx_hash: string
  email: string
  tier_id: string
  status: string
  created_at: string
  _localStatus?: 'confirmed' | 'rejected'
}

interface AdminUser {
  id: string
  email: string
  tier_id: string
  subscription_status: string
  analyses_used_this_month: number
  analyses_limit: number
  total_analyses: number
  created_at: string
  last_login_date: string | null
}

interface RecentAnalysis {
  id: string
  user_email: string | null
  overall_score: number | null
  archetype: string | null
  tier_id: string
  total_trades: number | null
  created_at: string
}

// ── helpers ───────────────────────────────────────────────────────────────────

function relTime(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function scoreColor(s: number | null): string {
  if (s == null) return '#475569'
  if (s < 40) return '#ef4444'
  if (s < 70) return '#f59e0b'
  return '#10b981'
}

// ── toast ─────────────────────────────────────────────────────────────────────

interface ToastItem { id: number; msg: string; type: 'success' | 'error' }

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)
  const toast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = ++counter.current
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])
  return { toasts, toast }
}

function Toasts({ items }: { items: ToastItem[] }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, pointerEvents: 'none' }}>
      {items.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: t.type === 'success' ? '#10b981' : '#ef4444',
          padding: '10px 16px', borderRadius: 6,
          fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em',
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── skeleton ──────────────────────────────────────────────────────────────────

function Skel({ h, mb = 8 }: { h: number; mb?: number }) {
  return <div className="skeleton" style={{ height: h, background: '#0b1220', borderRadius: 6, marginBottom: mb }} />
}

// ── section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontWeight: 700 }}>
      {children}
    </span>
  )
}

// ── tier badge ────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: string }) {
  const c = TIER_COLORS[tier] ?? { bg: 'rgba(71,85,105,0.15)', text: '#475569' }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
      background: c.bg, color: c.text, fontFamily: MONO,
    }}>
      {tier}
    </span>
  )
}

// ── th helper ─────────────────────────────────────────────────────────────────

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 700, whiteSpace: 'nowrap' as const }}>
      {children}
    </th>
  )
}

// ── main component ────────────────────────────────────────────────────────────

function AdminContent() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const { toasts, toast } = useToast()
  const paymentsRef = useRef<HTMLDivElement>(null)

  const [stats, setStats] = useState<Stats | null>(null)
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [analyses, setAnalyses] = useState<RecentAnalysis[]>([])
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'down'>('loading')

  const [loadingStats, setLoadingStats]       = useState(true)
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [loadingUsers, setLoadingUsers]       = useState(true)
  const [loadingAnalyses, setLoadingAnalyses] = useState(true)

  const [search, setSearch]                   = useState('')
  const [upgradingUser, setUpgradingUser]     = useState<string | null>(null)
  const [confirmingPmt, setConfirmingPmt]     = useState<string | null>(null)
  const [rejectingPmt, setRejectingPmt]       = useState<string | null>(null)

  const token = session?.access_token

  // ── auth guard — redirect immediately if not admin ──
  useEffect(() => {
    if (loading) return
    if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  // ── fetchers ──
  const fetchStats = useCallback(async () => {
    if (!token) return
    try {
      const r = await fetch(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      if (r.ok) {
        const data = await r.json()
        console.log('[ADMIN] stats response:', data)
        setStats(data)
      } else console.error('[admin] stats fetch failed:', r.status, await r.text())
    } catch (e) { console.error('[admin] stats fetch error:', e) }
    setLoadingStats(false)
  }, [token])

  const fetchPayments = useCallback(async () => {
    if (!token) return
    try {
      const r = await fetch(`${API}/admin/pending-payments`, { headers: { Authorization: `Bearer ${token}` } })
      if (r.ok) {
        const fresh: PendingPayment[] = await r.json()
        // Preserve _localStatus overrides for optimistic UI
        setPayments(prev => {
          const localMap = new Map(prev.map(p => [p.id, p._localStatus]))
          return fresh.map(p => ({ ...p, _localStatus: localMap.get(p.id) }))
        })
      }
    } catch {}
    setLoadingPayments(false)
  }, [token])

  const fetchUsers = useCallback(async () => {
    if (!token) return
    try {
      const r = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      if (r.ok) {
        const data = await r.json()
        console.log('[ADMIN] users response:', data)
        setUsers(Array.isArray(data) ? data : (data.users ?? []))
      } else {
        console.error('[admin] users fetch failed:', r.status, await r.text())
      }
    } catch (e) { console.error('[admin] users fetch error:', e) }
    setLoadingUsers(false)
  }, [token])

  const fetchAnalyses = useCallback(async () => {
    if (!token) return
    try {
      const r = await fetch(`${API}/admin/recent-analyses`, { headers: { Authorization: `Bearer ${token}` } })
      if (r.ok) {
        const data = await r.json()
        setAnalyses(Array.isArray(data) ? data : (data.analyses ?? []))
      } else {
        console.error('[admin] analyses fetch failed:', r.status, await r.text())
      }
    } catch (e) { console.error('[admin] analyses fetch error:', e) }
    setLoadingAnalyses(false)
  }, [token])

  const checkHealth = useCallback(async () => {
    try {
      const r = await fetch(`${API}/health`)
      setApiStatus(r.ok ? 'ok' : 'down')
    } catch { setApiStatus('down') }
  }, [])

  useEffect(() => {
    console.log('[ADMIN] session token:', session?.access_token ? 'present' : 'missing')
    if (!session?.access_token) return
    fetchStats()
    fetchPayments()
    fetchUsers()
    fetchAnalyses()
    checkHealth()
  }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── poll pending payments every 60 s ──
  useEffect(() => {
    if (!session?.access_token) return
    const id = setInterval(fetchPayments, 60_000)
    return () => clearInterval(id)
  }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── actions ──
  const confirmPayment = async (id: string) => {
    if (!token) return
    setConfirmingPmt(id)
    try {
      const r = await fetch(`${API}/payment/confirm/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (r.ok) {
        setPayments(p => p.map(x => x.id === id ? { ...x, _localStatus: 'confirmed' } : x))
        toast('Payment confirmed ✓', 'success')
        fetchStats()
      } else {
        toast('Error — try again', 'error')
      }
    } catch { toast('Error — try again', 'error') }
    setConfirmingPmt(null)
  }

  const rejectPayment = async (id: string) => {
    if (!token) return
    if (!confirm('Are you sure you want to reject this payment?')) return
    setRejectingPmt(id)
    try {
      const r = await fetch(`${API}/payment/reject/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (r.ok) {
        setPayments(p => p.map(x => x.id === id ? { ...x, _localStatus: 'rejected' } : x))
        toast('Payment rejected', 'success')
        fetchStats()
      } else {
        toast('Error — try again', 'error')
      }
    } catch { toast('Error — try again', 'error') }
    setRejectingPmt(null)
  }

  const upgradeUser = async (email: string, tier_id: string) => {
    if (!token || !tier_id) return
    setUpgradingUser(email)
    try {
      const r = await fetch(`${API}/admin/upgrade-user`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier_id }),
      })
      if (r.ok) {
        setUsers(u => u.map(x => x.email === email ? { ...x, tier_id, subscription_status: 'active' } : x))
        toast('User upgraded ✓', 'success')
      } else {
        toast('Error — try again', 'error')
      }
    } catch { toast('Error — try again', 'error') }
    setUpgradingUser(null)
  }

  const resetUsage = async (email: string) => {
    if (!token) return
    try {
      const r = await fetch(`${API}/admin/reset-usage`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (r.ok) {
        setUsers(u => u.map(x => x.email === email ? { ...x, analyses_used_this_month: 0 } : x))
        toast('Usage reset ✓', 'success')
      } else {
        toast('Error — try again', 'error')
      }
    } catch { toast('Error — try again', 'error') }
  }

  // ── guard: render nothing while loading / redirecting ──
  if (loading || !user) return <div style={{ background: BG, minHeight: '100vh' }} />
  if (!ADMIN_EMAILS.includes(user.email ?? '')) return null

  const filteredUsers = search
    ? users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()))
    : users

  const pendingCount = payments.filter(p => !p._localStatus).length

  // ── render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <NavBar />
      <Toasts items={toasts} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '96px 24px 80px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32, borderBottom: `1px solid ${BORDER}`, paddingBottom: 20 }}>
          <SectionLabel>Admin Control Center</SectionLabel>
          <h1 style={{ fontFamily: SANS, fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '8px 0 4px', letterSpacing: '-0.01em' }}>
            X-Ray Forensic — Operator Dashboard
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 11, color: '#475569', margin: 0 }}>
            Internal use only. Not indexed.
          </p>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 1 — PLATFORM OVERVIEW
        ════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {loadingStats ? (
            [1,2,3,4].map(i => <Skel key={i} h={90} mb={0} />)
          ) : ([
            { label: 'Total Users',          value: stats?.total_users ?? '—',          color: '#f8fafc', onClick: undefined },
            { label: 'Total Analyses',       value: stats?.total_analyses ?? '—',       color: '#f8fafc', onClick: undefined },
            { label: 'Active Subscribers',   value: stats?.active_subscribers ?? '—',   color: '#10b981', onClick: undefined },
            {
              label: 'Pending Payments',
              value: pendingCount > 0 ? pendingCount : (stats?.pending_payments ?? 0),
              color: (pendingCount > 0 || (stats?.pending_payments ?? 0) > 0) ? GOLD : '#475569',
              onClick: () => paymentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
            },
          ] as const).map((c, i) => (
            <div
              key={i}
              onClick={c.onClick as any}
              style={{
                background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: '20px 24px',
                cursor: c.onClick ? 'pointer' : 'default',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { if (c.onClick) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(229,184,60,0.4)' }}
              onMouseLeave={e => { if (c.onClick) (e.currentTarget as HTMLDivElement).style.borderColor = BORDER }}
            >
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                {c.label}
              </div>
              <div style={{ fontFamily: MONO, fontSize: '2rem', fontWeight: 700, color: c.color, lineHeight: 1 }}>
                {String(c.value)}
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            SECTION 2 — PENDING PAYMENTS
        ════════════════════════════════════════════ */}
        <div ref={paymentsRef} style={{ marginBottom: 32 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <SectionLabel>Pending Payments</SectionLabel>
              {pendingCount > 0 && (
                <span style={{
                  background: 'rgba(229,184,60,0.12)', color: GOLD,
                  border: '1px solid rgba(229,184,60,0.3)', borderRadius: 4,
                  padding: '1px 8px', fontFamily: MONO, fontSize: 10, fontWeight: 700,
                }}>
                  {pendingCount} awaiting
                </span>
              )}
            </div>

            {loadingPayments ? (
              <div style={{ padding: 24 }}>
                <Skel h={44} /><Skel h={44} mb={0} />
              </div>
            ) : payments.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8, color: '#10b981' }}>✓</div>
                <p style={{ fontFamily: MONO, fontSize: 12, color: '#10b981', margin: 0 }}>No pending payments. You're up to date.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <TH>Payment ID</TH>
                      <TH>Email</TH>
                      <TH>Tier</TH>
                      <TH>Amount</TH>
                      <TH>TX Hash</TH>
                      <TH>Submitted</TH>
                      <TH>Actions</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => {
                      const local = p._localStatus
                      const rowBg = local === 'confirmed'
                        ? 'rgba(16,185,129,0.06)'
                        : local === 'rejected'
                          ? 'rgba(239,68,68,0.06)'
                          : 'transparent'
                      const txLink = p.tx_hash?.startsWith('0x')
                        ? `https://bscscan.com/tx/${p.tx_hash}`
                        : `https://tronscan.org/#/transaction/${p.tx_hash}`

                      return (
                        <tr key={p.id} style={{ borderBottom: `1px solid rgba(30,41,59,0.5)`, background: rowBg }}>
                          <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{p.id.slice(0, 8)}</td>
                          <td style={{ padding: '12px 16px', color: '#e2e8f0' }}>{p.email}</td>
                          <td style={{ padding: '12px 16px' }}><TierBadge tier={p.tier_id} /></td>
                          <td style={{ padding: '12px 16px', color: GOLD }}>{TIER_PRICES[p.tier_id] ?? '—'}</td>
                          <td style={{ padding: '12px 16px' }}>
                            {p.tx_hash ? (
                              <a href={txLink} target="_blank" rel="noreferrer"
                                style={{ color: '#3b82f6', textDecoration: 'none', fontFamily: MONO }}>
                                {p.tx_hash.slice(0, 14)}…
                              </a>
                            ) : '—'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{relTime(p.created_at)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            {local ? (
                              <span style={{ color: local === 'confirmed' ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: 11, fontFamily: MONO }}>
                                {local === 'confirmed' ? 'CONFIRMED' : 'REJECTED'}
                              </span>
                            ) : (
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  onClick={() => confirmPayment(p.id)}
                                  disabled={confirmingPmt === p.id}
                                  style={{ padding: '5px 10px', background: 'rgba(229,184,60,0.12)', border: '1px solid rgba(229,184,60,0.4)', color: GOLD, borderRadius: 4, cursor: 'pointer', fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>
                                  {confirmingPmt === p.id ? '…' : 'Confirm ✓'}
                                </button>
                                <button
                                  onClick={() => rejectPayment(p.id)}
                                  disabled={rejectingPmt === p.id}
                                  style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 4, cursor: 'pointer', fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>
                                  {rejectingPmt === p.id ? '…' : 'Reject ✗'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 3 — USER MANAGEMENT
        ════════════════════════════════════════════ */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <SectionLabel>User Management</SectionLabel>
              <input
                type="text"
                placeholder="Search by email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: '#0b1220', border: `1px solid ${BORDER}`, color: '#f8fafc',
                  padding: '6px 12px', borderRadius: 6, fontFamily: MONO, fontSize: 12,
                  width: 260, outline: 'none',
                }}
              />
            </div>

            {loadingUsers ? (
              <div style={{ padding: 24 }}>
                <Skel h={48} /><Skel h={48} /><Skel h={48} mb={0} />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <TH>Email</TH>
                      <TH>Tier</TH>
                      <TH>Status</TH>
                      <TH>Usage</TH>
                      <TH>Joined</TH>
                      <TH>Last Active</TH>
                      <TH>Actions</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: `1px solid rgba(30,41,59,0.5)` }}>
                        <td style={{ padding: '12px 16px', color: '#e2e8f0' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}><TierBadge tier={u.tier_id} /></td>
                        <td style={{ padding: '12px 16px', color: u.subscription_status === 'active' ? '#10b981' : '#475569' }}>
                          {u.subscription_status}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                          {u.analyses_used_this_month ?? 0}/{u.analyses_limit === -1 ? '∞' : (u.analyses_limit ?? '?')}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{fmtDate(u.created_at)}</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{relTime(u.last_login_date)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                              value=""
                              disabled={upgradingUser === u.email}
                              onChange={e => { const v = e.target.value; if (v) upgradeUser(u.email, v) }}
                              style={{ background: '#0b1220', border: `1px solid ${BORDER}`, color: '#94a3b8', padding: '4px 8px', borderRadius: 4, fontFamily: MONO, fontSize: 11, cursor: 'pointer', outline: 'none' }}>
                              <option value="">Upgrade…</option>
                              {['signal','audit','forensic','guardian','sovereign'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => resetUsage(u.email)}
                              style={{ padding: '4px 10px', background: 'rgba(71,85,105,0.15)', border: `1px solid ${BORDER}`, color: '#94a3b8', borderRadius: 4, cursor: 'pointer', fontFamily: MONO, fontSize: 11 }}>
                              Reset Usage
                            </button>
                            <a
                              href={`/dashboard`}
                              style={{ padding: '4px 10px', background: 'rgba(229,184,60,0.08)', border: '1px solid rgba(229,184,60,0.2)', color: GOLD, borderRadius: 4, textDecoration: 'none', fontFamily: MONO, fontSize: 11 }}>
                              Reports
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: '32px 24px', textAlign: 'center', color: '#475569', fontFamily: MONO, fontSize: 12 }}>
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 4 — RECENT ANALYSES
        ════════════════════════════════════════════ */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BORDER}` }}>
              <SectionLabel>Recent Analyses</SectionLabel>
            </div>

            {loadingAnalyses ? (
              <div style={{ padding: 24 }}>
                <Skel h={44} /><Skel h={44} /><Skel h={44} mb={0} />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: MONO, fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <TH>User</TH>
                      <TH>Score</TH>
                      <TH>Archetype</TH>
                      <TH>Tier</TH>
                      <TH>Trades</TH>
                      <TH>Date</TH>
                      <TH>{''}</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {analyses.map(a => (
                      <tr key={a.id} style={{ borderBottom: `1px solid rgba(30,41,59,0.5)` }}>
                        <td style={{ padding: '12px 16px', color: '#e2e8f0' }}>{a.user_email || '—'}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: scoreColor(a.overall_score), fontFamily: MONO }}>
                          {a.overall_score ?? '—'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{a.archetype || '—'}</td>
                        <td style={{ padding: '12px 16px' }}><TierBadge tier={a.tier_id || 'signal'} /></td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{a.total_trades ?? '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{fmtDate(a.created_at)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href={`/report/${a.id}`}
                            style={{ color: GOLD, textDecoration: 'none', fontSize: 11, border: '1px solid rgba(229,184,60,0.3)', borderRadius: 4, padding: '4px 10px', fontFamily: MONO }}>
                            View →
                          </a>
                        </td>
                      </tr>
                    ))}
                    {analyses.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: '32px 24px', textAlign: 'center', color: '#475569', fontFamily: MONO, fontSize: 12 }}>
                          No analyses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            SECTION 5 — SYSTEM HEALTH
        ════════════════════════════════════════════ */}
        <div>
          <div style={{ marginBottom: 12 }}><SectionLabel>System Health</SectionLabel></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>

            {/* API Status */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '20px 24px' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>API Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: apiStatus === 'ok' ? '#10b981' : apiStatus === 'down' ? '#ef4444' : '#f59e0b',
                }} />
                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: apiStatus === 'ok' ? '#10b981' : apiStatus === 'down' ? '#ef4444' : '#f59e0b' }}>
                  {apiStatus === 'loading' ? 'CHECKING…' : apiStatus === 'ok' ? 'OPERATIONAL' : 'DOWN'}
                </span>
              </div>
            </div>

            {/* Railway */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '20px 24px' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Railway Backend</div>
              <a href="https://railway.app" target="_blank" rel="noreferrer"
                style={{ fontFamily: MONO, fontSize: 12, color: '#3b82f6', textDecoration: 'none' }}>
                → Open Railway Dashboard
              </a>
              <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 10, color: '#475569' }}>delightful-miracle</div>
            </div>

            {/* Supabase */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '20px 24px' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Supabase</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: !loadingUsers ? '#10b981' : '#f59e0b',
                }} />
                <span style={{ fontFamily: MONO, fontSize: 12, color: !loadingUsers ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                  {loadingUsers ? 'CONNECTING…' : 'CONNECTED'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default function AdminPage() {
  return <AdminContent />
}
