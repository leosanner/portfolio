import { useEffect, useState, type CSSProperties } from 'react';
import type { FlowArt, FlowStep } from '../data/case-studies';
import type { Locale } from '../i18n/ui';

/**
 * Illustrated "how it works": one card per stage, each with an animated drawing,
 * joined by links that carry a data packet from one stage to the next.
 * Stages light up in turn. Drawings are decorative; the text carries the meaning.
 */
const TICK_MS = 1800;

/* ---------- Drawings (viewBox 200 × 120, coloured by --tone) ---------- */

const wave = (y: number, amp: number) => {
  let d = `M-40 ${y}`;
  for (let x = -40; x < 240; x += 20) d += ` q5 ${-amp} 10 0 t10 0`;
  return d;
};

function Probe() {
  return (
    <>
      {/* Port: a crane and stacked containers on the quay */}
      <g className="art-ink">
        <path d="M24 66V20M24 22h44M64 22v12M24 34l14-12" fill="none" />
        <rect x="8" y="54" width="22" height="8" rx="1" />
        <rect x="32" y="54" width="22" height="8" rx="1" />
        <rect x="20" y="46" width="22" height="8" rx="1" />
      </g>
      <rect x="0" y="66" width="200" height="54" className="art-water" />
      <path d={wave(66, 3)} className="art-wave" />
      <path d={wave(84, 2)} className="art-wave art-wave--slow" />
      {/* Probe: a buoy that bobs, a cable and a sensor tip, readings rising as bubbles */}
      <g className="art-bob">
        <path d="M132 42v-12" className="art-line" />
        <circle cx="132" cy="28" r="3" className="art-blink" />
        <path d="M122 22a14 14 0 0 1 20 0M118 17a20 20 0 0 1 28 0" className="art-signal" />
        <rect x="120" y="46" width="24" height="22" rx="6" className="art-tone" />
        <rect x="120" y="54" width="24" height="5" className="art-band" />
        <path d="M132 68v30" className="art-line art-line--dash" />
        <rect x="127" y="98" width="10" height="13" rx="3" className="art-tone" />
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={128 + i * 4} cy="100" r={1.6 + i * 0.4} className="art-bubble" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </>
  );
}

function Readings() {
  const rows = [0, 1, 2, 3];
  return (
    <>
      {/* Live chart of incoming readings */}
      <rect x="10" y="10" width="112" height="70" rx="6" className="art-panel" />
      <path d="M20 66h92M20 48h92M20 30h92" className="art-grid" />
      <path
        d="M20 58 L34 50 L46 54 L58 40 L70 44 L82 32 L94 38 L106 26 L112 30"
        pathLength={1}
        className="art-trace"
      />
      <circle cx="112" cy="30" r="3.5" className="art-tone art-blink" />
      <text x="18" y="22" className="art-text">pH</text>
      {/* Readings landing as rows of a table */}
      <rect x="132" y="10" width="58" height="100" rx="6" className="art-panel" />
      <rect x="140" y="18" width="42" height="6" rx="2" className="art-tone" />
      {rows.map((i) => (
        <g key={i} className="art-row" style={{ animationDelay: `${i * 0.45}s` }}>
          <rect x="140" y={32 + i * 18} width="16" height="6" rx="2" className="art-cell" />
          <rect x="160" y={32 + i * 18} width="22" height="6" rx="2" className="art-cell" />
        </g>
      ))}
      {/* Values travelling from the chart to the table */}
      {[0, 1].map((i) => (
        <circle key={i} cx="118" cy="30" r="2.5" className="art-tone art-hop" style={{ animationDelay: `${i * 1.1}s` }} />
      ))}
      <path d="M10 98h112" className="art-grid" />
      <path d="M10 98h112" pathLength={1} className="art-progress" />
    </>
  );
}

/* Samples start mixed, then the model sorts them into three groups. */
const GROUPS = [
  { cx: 50, cy: 42, c: 'var(--tone-cyan)' },
  { cx: 150, cy: 40, c: 'var(--tone-green)' },
  { cx: 100, cy: 90, c: 'var(--tone-coral)' },
];
const DOTS = [
  [30, 90, 0], [64, 70, 1], [92, 30, 2], [120, 64, 0], [146, 92, 1], [172, 72, 2],
  [40, 20, 1], [80, 98, 0], [110, 18, 2], [160, 18, 0], [24, 60, 2], [182, 40, 1],
].map(([x, y, g], i) => {
  const grp = GROUPS[g];
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 6 + (i % 3) * 4;
  return { x, y, c: grp.c, dx: grp.cx + Math.cos(a) * r - x, dy: grp.cy + Math.sin(a) * r - y };
});

function Classify() {
  return (
    <>
      {GROUPS.map((g, i) => (
        <circle key={i} cx={g.cx} cy={g.cy} r="22" className="art-ring" style={{ stroke: g.c } as CSSProperties} />
      ))}
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r="4"
          className="art-dot"
          style={{ '--dx': `${d.dx}px`, '--dy': `${d.dy}px`, '--c': d.c, animationDelay: `${(i % 4) * 0.08}s` } as CSSProperties}
        />
      ))}
    </>
  );
}

function WebApp() {
  const bars = [
    { h: 46, c: 'var(--tone-cyan)' },
    { h: 30, c: 'var(--tone-green)' },
    { h: 58, c: 'var(--tone-cyan)' },
    { h: 22, c: 'var(--tone-coral)' },
    { h: 40, c: 'var(--tone-green)' },
  ];
  return (
    <>
      <rect x="8" y="6" width="184" height="108" rx="8" className="art-panel" />
      <path d="M8 22h184" className="art-grid" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={18 + i * 8} cy="14" r="2.4" className="art-cell" />
      ))}
      <rect x="48" y="10" width="80" height="8" rx="4" className="art-cell" />
      {/* Sidebar: the three groups */}
      {GROUPS.map((g, i) => (
        <g key={i}>
          <circle cx="24" cy={40 + i * 18} r="4" style={{ fill: g.c }} />
          <rect x="32" y={37 + i * 18} width="30" height="6" rx="2" className="art-cell" />
        </g>
      ))}
      <path d="M72 30v76" className="art-grid" />
      {/* Chart: results growing in */}
      <path d="M84 100h98" className="art-grid" />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={88 + i * 19}
          y={100 - b.h}
          width="12"
          height={b.h}
          rx="2"
          className="art-bar"
          style={{ fill: b.c, animationDelay: `${i * 0.12}s` }}
        />
      ))}
      {/* Pointer checking a result */}
      <path d="M0 0l0 12 3.5-3 2.5 5.5 2-1-2.5-5.5 4.5 0z" className="art-pointer" />
    </>
  );
}

function Satellite() {
  return (
    <>
      {[[20, 18], [60, 34], [170, 14], [184, 50], [36, 52], [150, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1" className="art-star" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      {/* Earth, mostly ocean */}
      <circle cx="100" cy="230" r="140" className="art-water art-planet" />
      <path d="M40 112q20-14 34-6t30-4M120 104q18-8 36 2" className="art-coast" />
      {/* Scanning beam */}
      <path d="M100 40L70 96h60z" className="art-beam" />
      {/* Satellite */}
      <g className="art-bob">
        <rect x="70" y="26" width="20" height="12" rx="1" className="art-panel-tone" />
        <rect x="110" y="26" width="20" height="12" rx="1" className="art-panel-tone" />
        <path d="M90 32h20" className="art-line" />
        <rect x="92" y="24" width="16" height="18" rx="3" className="art-tone" />
        <circle cx="100" cy="44" r="2.5" className="art-tone art-blink" />
      </g>
      {/* Data coming up to us */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x="150" y="96" width="7" height="7" rx="1.5" className="art-tone art-rise" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </>
  );
}

/* Raw records start scattered and crooked, then line up into a table. */
const TIDY = Array.from({ length: 9 }, (_, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = [14, 46, 22, 70, 30, 84, 12, 58, 40][i];
  const y = [16, 30, 52, 12, 82, 58, 96, 92, 66][i];
  return { x, y, w: col === 0 ? 30 : 22, tx: 112 + [0, 34, 60][col], ty: 30 + row * 22, r: ((i * 47) % 50) - 25 };
});

function Structure() {
  return (
    <>
      <rect x="104" y="12" width="88" height="96" rx="6" className="art-panel" />
      <rect x="112" y="18" width="72" height="6" rx="2" className="art-tone" />
      {TIDY.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height="10"
          rx="2"
          className="art-chunk"
          style={{ '--dx': `${b.tx - b.x}px`, '--dy': `${b.ty - b.y}px`, '--r': `${b.r}deg`, animationDelay: `${(i % 3) * 0.1}s` } as CSSProperties}
        />
      ))}
    </>
  );
}

function Split() {
  const cells = Array.from({ length: 10 }, (_, i) => i);
  return (
    <>
      <text x="16" y="22" className="art-text art-text--soft">dataset</text>
      {cells.map((i) => {
        const test = i >= 8;
        return (
          <rect
            key={i}
            x={12 + i * 17}
            y="30"
            width="15"
            height="22"
            rx="3"
            className={`art-cell-split${test ? ' is-test' : ''}`}
            style={{ '--dx': test ? '8px' : '0px', animationDelay: `${i * 0.03}s` } as CSSProperties}
          />
        );
      })}
      <text x="16" y="104" className="art-text art-fade">train</text>
      <text x="164" y="104" className="art-text art-text--alt art-fade">test</text>
    </>
  );
}

function Train() {
  return (
    <>
      {/* Gradient descent: a ball rolling to the bottom of the error bowl */}
      <path d="M10 24 Q50 140 90 24" className="art-bowl" />
      <circle r="5" className="art-tone art-roll" />
      {/* Loss falling over training */}
      <rect x="104" y="12" width="88" height="96" rx="6" className="art-panel" />
      <path d="M114 96h70M114 96V22" className="art-grid" />
      <path d="M116 30 C130 70 140 82 150 86 S176 92 182 92" pathLength={1} className="art-trace" />
      <text x="118" y="22" className="art-text">loss</text>
    </>
  );
}

function Forecast() {
  return (
    <>
      <path d="M10 104h180" className="art-grid" />
      <path d="M10 34h180" className="art-threshold" />
      <text x="12" y="28" className="art-text art-text--alt">extreme</text>
      <path
        d="M10 86 Q20 76 30 84 T50 82 T70 78 T90 84 T110 76 Q118 72 124 60 L132 24 L140 66 Q150 80 160 80 T190 78"
        pathLength={1}
        className="art-trace"
      />
      <g className="art-alert">
        <circle cx="132" cy="24" r="10" className="art-pulse" />
        <circle cx="132" cy="24" r="4" className="art-alert-dot" />
      </g>
    </>
  );
}

/* ---------- Clinic platform ---------- */

const Doc = ({ x, y, s = 1, label }: { x: number; y: number; s?: number; label?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0h16l6 6v22H0z" className="art-doc" />
    <path d="M16 0v6h6" className="art-doc-fold" />
    {label && (
      <text x="11" y="21" textAnchor="middle" className="art-text art-text--tiny">
        {label}
      </text>
    )}
  </g>
);

function Upload() {
  return (
    <>
      {/* Assessment equipment with a live trace */}
      <rect x="10" y="30" width="62" height="50" rx="6" className="art-panel" />
      <rect x="16" y="36" width="50" height="28" rx="3" className="art-screen" />
      <path d="M18 52h8l3-8 4 14 4-10 3 4h24" pathLength={1} className="art-trace art-trace--thin" />
      <rect x="26" y="80" width="30" height="8" rx="2" className="art-cell" />
      {/* Files travelling to the drop zone */}
      {[0, 1, 2].map((i) => (
        <g key={i} className="art-fly" style={{ animationDelay: `${i * 0.8}s` }}>
          <Doc x={70} y={40} s={0.8} label="PDF" />
        </g>
      ))}
      <rect x="122" y="22" width="68" height="76" rx="8" className="art-drop" />
      <path d="M156 70V46m-8 8 8-8 8 8" className="art-arrow" />
      <path d="M140 82h32" className="art-grid" />
    </>
  );
}

function Gateway() {
  return (
    <>
      <path d="M8 60h184" className="art-grid art-grid--dash" />
      {/* Requests: most pass, one is denied */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="14" cy="60" r="5" className="art-tone art-pass" style={{ animationDelay: `${i * 1}s` }} />
      ))}
      <circle cx="14" cy="60" r="5" className="art-deny" />
      <path d="M76 52l8 8m0-8-8 8" className="art-x" />
      {/* The gateway: a shield with a lock */}
      <path d="M100 22l26 9v20c0 19-12 32-26 38-14-6-26-19-26-38V31z" className="art-shield" />
      <rect x="91" y="54" width="18" height="15" rx="3" className="art-tone" />
      <path d="M95 54v-5a5 5 0 0 1 10 0v5" className="art-shackle" />
      <circle cx="100" cy="61" r="2" className="art-keyhole" />
      <text x="100" y="108" textAnchor="middle" className="art-text art-text--soft">
        deny by default
      </text>
    </>
  );
}

function Match() {
  const lines = [30, 44, 58, 72];
  const entries = [26, 46, 66, 86];
  const pairs = [
    [0, 1],
    [1, 3],
    [2, 0],
    [3, 2],
  ];
  return (
    <>
      {/* The export being read */}
      <rect x="12" y="14" width="56" height="88" rx="4" className="art-panel" />
      {lines.map((y) => (
        <rect key={y} x="20" y={y - 3} width="40" height="6" rx="2" className="art-cell" />
      ))}
      <rect x="12" y="20" width="56" height="3" className="art-tone art-scan" />
      {/* Catalog */}
      <rect x="128" y="14" width="62" height="88" rx="4" className="art-panel" />
      {entries.map((y, i) => (
        <rect key={y} x="136" y={y - 4} width="46" height="9" rx="2" className="art-entry" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      {pairs.map(([a, b], i) => (
        <path
          key={i}
          d={`M62 ${lines[a]} C96 ${lines[a]} 100 ${entries[b]} 134 ${entries[b]}`}
          pathLength={1}
          className="art-link"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </>
  );
}

function Report() {
  return (
    <>
      {/* Stopwatch: done in seconds */}
      <circle cx="34" cy="62" r="20" className="art-watch" />
      <path d="M30 38h8M34 42v-4" className="art-line" />
      <path d="M34 62V48" className="art-hand" />
      {/* Branded Word report */}
      <path d="M76 10h80l14 14v86H76z" className="art-page" />
      <path d="M156 10v14h14" className="art-doc-fold" />
      <rect x="84" y="20" width="46" height="10" rx="2" className="art-tone" />
      {[40, 52, 64, 76, 88].map((y, i) => (
        <rect
          key={y}
          x="84"
          y={y}
          width={i % 2 ? 56 : 74}
          height="6"
          rx="2"
          className="art-row art-cell art-cell--dark"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <rect x="140" y="86" width="22" height="18" rx="3" className="art-badge" />
      <text x="151" y="99" textAnchor="middle" className="art-text art-text--badge">
        W
      </text>
    </>
  );
}

function Portal() {
  return (
    <>
      {/* Email on its way */}
      <g className="art-mail">
        <rect x="0" y="0" width="30" height="20" rx="3" className="art-envelope" />
        <path d="M2 3l13 9 13-9" className="art-envelope-flap" />
      </g>
      {/* Client's phone with the portal open */}
      <rect x="116" y="8" width="60" height="104" rx="10" className="art-panel" />
      <circle cx="146" cy="34" r="10" className="art-tone" />
      <rect x="128" y="52" width="36" height="6" rx="2" className="art-cell" />
      <rect x="128" y="64" width="36" height="16" rx="3" className="art-cell" />
      <rect x="128" y="84" width="36" height="16" rx="3" className="art-cell" />
      {/* Notification badge */}
      <g className="art-notify">
        <circle cx="172" cy="14" r="9" className="art-alert-dot" />
        <text x="172" y="18" textAnchor="middle" className="art-text art-text--badge">
          1
        </text>
      </g>
    </>
  );
}

const ART: Record<FlowArt, () => React.JSX.Element> = {
  probe: Probe,
  readings: Readings,
  classify: Classify,
  webapp: WebApp,
  satellite: Satellite,
  structure: Structure,
  split: Split,
  train: Train,
  forecast: Forecast,
  upload: Upload,
  gateway: Gateway,
  match: Match,
  report: Report,
  portal: Portal,
};

/* ---------- Component ---------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export default function IllustratedFlow({
  steps,
  lang,
  label,
  mineLabel,
}: {
  steps: FlowStep[];
  lang: Locale;
  label: string;
  mineLabel: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % (steps.length + 1)), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced, steps.length]);

  const active = reduced ? -1 : tick;

  return (
    <ol className="ill" aria-label={label}>
      {steps.map((step, i) => {
        const Art = step.art ? ART[step.art] : null;
        const state = i === active ? 'active' : i < active ? 'done' : 'idle';
        const next = steps[i + 1];
        return (
          <li
            key={i}
            className={`ill-step is-${state}`}
            style={
              {
                '--tone': `var(--tone-${step.tone ?? 'amber'})`,
                '--tone-next': `var(--tone-${next?.tone ?? step.tone ?? 'amber'})`,
              } as CSSProperties
            }
          >
            {Art && (
              <div className="ill-step__art" aria-hidden>
                <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
                  <Art />
                </svg>
              </div>
            )}
            <div className="ill-step__body">
              <p className="ill-step__top">
                <span className="ill-step__num">{String(i + 1).padStart(2, '0')}</span>
                {step.mine && <span className="ill-step__mine">{mineLabel}</span>}
              </p>
              <h5 className="ill-step__label">{step.label[lang]}</h5>
              {step.caption && <p className="ill-step__caption">{step.caption[lang]}</p>}
              {step.note && <p className="ill-step__note">{step.note}</p>}
            </div>
            {next && (
              <span className={`ill-link${i < active ? ' is-lit' : ''}`} aria-hidden>
                <span className="ill-link__packet" />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
