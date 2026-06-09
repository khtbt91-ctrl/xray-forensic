'use client'

export default function SupportButton() {
  return (
    <a
      href="mailto:admin@xrayforensic.com?subject=Support%20Request%20%E2%80%94%20X-Ray%20Forensic"
      title="Contact Support"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: '#C9A84C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        textDecoration: 'none',
        color: '#000',
        transition: 'opacity 200ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </a>
  )
}
