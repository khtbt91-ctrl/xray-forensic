'use client'

export default function ToolsPage() {
  return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      paddingTop: '80px'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>

        {/* Header */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--accent-primary)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          width: '100%',
          display: 'block',
          marginBottom: '16px'
        }}>
          X-RAY TOOLS
        </p>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Diagnostic Utilities
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          textAlign: 'center',
          fontSize: '0.9rem',
          marginBottom: '48px'
        }}>
          Free tools to extract richer data
          from your trading platform.
        </p>

        {/* Algo Autopsy Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(201,168,76,0.45)',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--accent-primary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                EA DIAGNOSTIC
              </p>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                Algo Autopsy
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                From $79 · One-time
              </p>
            </div>
            <span style={{
              background: 'rgba(201,168,76,0.12)',
              color: 'var(--accent-primary)',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontFamily: 'monospace'
            }}>
              NEW
            </span>
          </div>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            marginBottom: '24px'
          }}>
            Forensic analysis of Expert Advisor behavior. Detects martingale
            patterns, calculates account ruin probability, and identifies
            which market regimes your EA actually works in.
          </p>

          <a
            href="/new?type=ea"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: 'var(--accent-primary)',
              color: 'var(--bg)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            Diagnose Your EA →
          </a>
        </div>

        {/* MQL5 Tool Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{
                fontFamily:
                  'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--warning)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                MT5 · MQL5 SCRIPT
              </p>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                X-Ray Magic Export
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                Free · Version 1.0
              </p>
            </div>
            <span style={{
              background: 'rgba(63,185,80,0.1)',
              color: 'var(--profit)',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontFamily: 'monospace'
            }}>
              FREE
            </span>
          </div>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            marginBottom: '24px'
          }}>
            Exports your complete MT5 trade history
            including <strong style={{
              color: 'var(--text-primary)'
            }}>magic numbers</strong> — allowing
            X-Ray to separate your manual trades
            from each EA and analyze them independently.
          </p>

          {/* What it reveals */}
          <div style={{
            background: 'var(--bg-elevated)',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              WHAT THIS UNLOCKS
            </p>
            {[
              'Which EA is profitable — and which to stop',
              'Whether your manual trades undermine your bot',
              'EA strategy type: scalper, grid, martingale',
              'Deployment quality score for each EA',
              'Manual vs EA P/L benchmark',
            ].map((item, i) => (
              <p key={i} style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{
                  color: 'var(--profit)',
                  flexShrink: 0
                }}>→</span>
                {item}
              </p>
            ))}
          </div>

          {/* Instructions */}
          <div style={{
            background: 'var(--bg-elevated)',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              HOW TO INSTALL
            </p>
            {[
              'Download XRay_Magic_Export.mq5 below',
              'In MT5: File → Open Data Folder → MQL5 → Scripts',
              'Copy the file into the Scripts folder',
              'In MT5: Navigator panel → Scripts → Refresh',
              'Drag XRay_Magic_Export onto any chart',
              'Set your date range → Click OK',
              'Find xray_magic_export.csv in MQL5/Files/',
              'Upload it at xrayforensic.com/new',
            ].map((step, i) => (
              <p key={i} style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--accent-primary)',
                  flexShrink: 0,
                  minWidth: '20px'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {step}
              </p>
            ))}
          </div>

          {/* Download button */}
          <a
            href="/tools/XRay_Magic_Export.mq5"
            download="XRay_Magic_Export.mq5"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: 'var(--accent-primary)',
              color: 'var(--bg-base)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              textAlign: 'center'
            }}
          >
            Download XRay_Magic_Export.mq5
          </a>

          <p style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.65rem',
            marginTop: '12px',
            fontStyle: 'italic'
          }}>
            Free forever. No account required.
            Works with all MT5 brokers.
          </p>
        </div>

        {/* Coming soon */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '24px',
          opacity: 0.5
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            COMING SOON
          </p>
          <h3 style={{
            fontSize: '1rem',
            color: 'var(--text-primary)',
            fontWeight: 600
          }}>
            cTrader Export Script
          </h3>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            marginTop: '4px'
          }}>
            Same diagnostic export for cTrader accounts.
          </p>
        </div>

      </div>
    </div>
  )
}
