"use client";
import { useEffect, useRef } from "react";

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const section = sectionRef.current;
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section
      id="comparison"
      ref={sectionRef}
      className="comparison-section fade-in-up"
    >
      <div className="comparison-container">
        <span className="comparison-eyebrow">THE DIFFERENCE</span>
        <h2 className="comparison-headline">
          Not a journal. An investigation.
        </h2>
        <div className="comparison-columns">
          <div className="comparison-left">
            <h3 className="comparison-left-header">Trading Journals</h3>
            <ul className="comparison-list">
              <li>Record what you did</li>
              <li>Confirm that you lost money</li>
              <li>Require manual tagging and discipline</li>
              <li>Give you data you must interpret yourself</li>
              <li>Tell you to journal more</li>
            </ul>
          </div>
          <div className="comparison-right">
            <h3 className="comparison-right-header">X-Ray Forensic</h3>
            <ul className="comparison-list">
              <li>Investigates why you lost money</li>
              <li>Prices every behavioral leak in dollars</li>
              <li>Automated from MT5 export — zero manual work</li>
              <li>Gives you a verdict you cannot negotiate</li>
              <li>Gives you a prescription with a measurable target</li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        .comparison-section {
          padding: 80px 24px;
          background-color: var(--bg-base);
        }
        .comparison-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .comparison-eyebrow {
          display: block;
          font-family: "JetBrains Mono", monospace;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--accent-primary);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
          text-align: center;
          width: 100%;
        }
        .comparison-headline {
          font-family: "Inter", sans-serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 48px;
          line-height: 1.2;
          text-align: center;
        }
        .comparison-columns {
          display: flex;
          gap: 48px;
        }
        .comparison-left {
          width: 40%;
          flex-shrink: 0;
        }
        .comparison-right {
          width: 60%;
          border-left: 2px solid var(--accent-primary);
          padding-left: 24px;
        }
        .comparison-left-header {
          font-family: "Inter", sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .comparison-right-header {
          font-family: "Inter", sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 24px;
        }
        .comparison-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .comparison-list li {
          font-family: "Inter", sans-serif;
          font-size: 0.9rem;
          line-height: 1.65;
          margin-bottom: 16px;
          max-width: 65ch;
        }
        .comparison-left .comparison-list li {
          color: var(--text-muted);
          font-weight: 300;
          transition: text-decoration 150ms;
        }
        .comparison-left .comparison-list li:hover {
          text-decoration: line-through;
        }
        .comparison-right .comparison-list li {
          color: var(--text-primary);
        }
        @media (max-width: 768px) {
          .comparison-columns {
            flex-direction: column;
            gap: 32px;
          }
          .comparison-left,
          .comparison-right {
            width: 100%;
          }
          .comparison-right {
            border-left: none;
            border-top: 2px solid var(--accent-primary);
            padding-left: 0;
            padding-top: 24px;
          }
        }
      `}</style>
    </section>
  );
}
