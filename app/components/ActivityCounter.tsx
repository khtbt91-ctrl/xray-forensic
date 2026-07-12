"use client";

import { useEffect, useState } from "react";

const MONO = "'JetBrains Mono', monospace";

interface BenchmarkStats {
  total_traders_analyzed: number;
  total_leaks_identified: number;
  total_leaks_quantified: number;
}

export default function ActivityCounter() {
  const [stats, setStats] = useState<BenchmarkStats>({
    total_traders_analyzed: 0,
    total_leaks_identified: 0,
    total_leaks_quantified: 0,
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/benchmarks`)
      .then(r => r.json())
      .then((data: any) => {
        setStats({
          total_traders_analyzed: data.total_traders_analyzed || 0,
          total_leaks_identified: data.total_leaks_identified || 0,
          total_leaks_quantified: data.total_leaks_quantified || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{
      background: '#131A24',
      borderBottom: '1px solid #26313F',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#10b981',
          boxShadow: '0 0 6px #10b981',
          animation: 'acPulse 2s infinite',
        }} />
        <span style={{
          fontFamily: MONO,
          fontSize: 10,
          color: '#10b981',
          letterSpacing: '0.12em',
        }}>SYSTEM ACTIVE</span>
      </div>

      <span style={{
        fontFamily: MONO,
        fontSize: 11,
        color: '#8B98A9',
        letterSpacing: '0.05em',
      }}>
        <span style={{ color: '#38BDF8', fontWeight: 700 }}>
          {stats.total_traders_analyzed.toLocaleString()}
        </span>{' '}accounts diagnosed
        &nbsp;·&nbsp;
        <span style={{ color: '#38BDF8', fontWeight: 700 }}>
          {stats.total_leaks_identified.toLocaleString()}
        </span>{' '}behavioral leaks identified
        &nbsp;·&nbsp;
        <span style={{ color: '#38BDF8', fontWeight: 700 }}>
          ${stats.total_leaks_quantified.toLocaleString()}
        </span>{' '}in leaks quantified
      </span>

      <span style={{
        fontFamily: MONO,
        fontSize: 9,
        color: 'var(--text-muted)',
        marginLeft: 'auto',
      }}>
        Aggregate data · not financial advice
      </span>

      <style>{`
        @keyframes acPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
