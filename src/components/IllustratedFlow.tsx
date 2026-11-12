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

/* ---------- Research programme overview ---------- */

function Library() {
  const shelf = (y: number, seed: number) =>
    Array.from({ length: 11 }, (_, i) => {
      const h = 22 + ((i * 7 + seed) % 4) * 4;
      return <rect key={`${y}-${i}`} x={14 + i * 11} y={y - h} width="9" height={h} rx="1.5" className={`art-spine art-spine--${(i + seed) % 3}`} />;
    });
  return (
    <>
      {shelf(52, 0)}
      <path d="M8 53h132" className="art-shelf" />
      {shelf(100, 2)}
      <path d="M8 101h132" className="art-shelf" />
      {/* More papers keep arriving */}
      {[0, 1, 2].map((i) => (
        <g key={i} className="art-arrive" style={{ animationDelay: `${i * 0.9}s` }}>
          <Doc x={162} y={70} s={0.9} />
        </g>
      ))}
    </>
  );
}

function Screen() {
  return (
    <>
      {/* Funnel */}
      <path d="M62 30h76l-26 34v20H88V64z" className="art-funnel" />
      {/* Articles falling in, then sorted: relevant to the right, the rest to the left */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={i % 2 ? 'art-sort-out' : 'art-sort-keep'} style={{ animationDelay: `${i * 0.75}s` }}>
          <Doc x={89} y={-4} s={0.8} />
        </g>
      ))}
      <path d="M20 108h40" className="art-grid" />
      <path d="M140 108h40" className="art-tray" />
      <path d="M152 96l6 6 12-12" className="art-check" />
      <path d="M34 92l12 12m0-12-12 12" className="art-x art-x--still" />
    </>
  );
}

function Ask() {
  return (
    <>
      {/* Question */}
      <g className="art-bubble-q">
        <rect x="92" y="10" width="96" height="24" rx="12" className="art-cell" />
        <rect x="104" y="19" width="64" height="6" rx="3" className="art-cell--light" />
      </g>
      {/* Typing, then the answer with its references */}
      <g className="art-typing">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={28 + i * 9} cy="56" r="3" className="art-tone" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </g>
      <g className="art-bubble-a">
        <rect x="12" y="44" width="124" height="66" rx="12" className="art-answer" />
        <rect x="24" y="56" width="96" height="6" rx="3" className="art-tone" />
        <rect x="24" y="68" width="80" height="6" rx="3" className="art-tone art-dim" />
        <rect x="24" y="80" width="88" height="6" rx="3" className="art-tone art-dim" />
        <rect x="24" y="92" width="18" height="10" rx="3" className="art-ref" />
        <rect x="46" y="92" width="18" height="10" rx="3" className="art-ref" />
        <text x="33" y="100" textAnchor="middle" className="art-text art-text--ref">1</text>
        <text x="55" y="100" textAnchor="middle" className="art-text art-text--ref">2</text>
      </g>
    </>
  );
}

const GRAPH_NODES = [
  [100, 60, 9],
  [50, 34, 6],
  [150, 30, 6],
  [40, 88, 5],
  [158, 86, 6],
  [100, 104, 5],
  [76, 20, 4],
  [128, 64, 4],
] as const;
const GRAPH_EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 7], [4, 7], [1, 3], [5, 4],
] as const;

function Explore() {
  return (
    <>
      {GRAPH_EDGES.map(([a, b], i) => {
        const [x1, y1] = GRAPH_NODES[a];
        const [x2, y2] = GRAPH_NODES[b];
        return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} pathLength={1} className="art-edge" style={{ animationDelay: `${i * 0.15}s` }} />;
      })}
      {GRAPH_NODES.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          className={`art-node art-node--${i % 3}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <circle cx="100" cy="60" r="9" className="art-pulse art-pulse--tone" />
    </>
  );
}

/* ---------- Article classifier ---------- */

function Pipeline() {
  const lanes = [26, 60, 94];
  return (
    <>
      {lanes.map((y, i) => (
        <g key={y}>
          <Doc x={10} y={y - 14} s={0.9} />
          <path d={`M36 ${y}H96Q110 ${y} 110 ${(y + 60) / 2}V60H134`} className="art-pipe" />
          <circle cx="40" cy={y} r="3.5" className="art-tone art-flow" style={{ animationDelay: `${i * 0.5}s` }} />
        </g>
      ))}
      {/* Storage */}
      <path d="M140 40v40c0 6 22 10 22 10s22-4 22-10V40" className="art-db" />
      <ellipse cx="162" cy="40" rx="22" ry="8" className="art-db-top" />
      <path d="M140 54c0 5 44 5 44 0M140 68c0 5 44 5 44 0" className="art-db-ring" />
    </>
  );
}

const TERMS = ['impact', 'species', 'habitat', 'emission'];

function Tfidf() {
  const weights = [
    [0.9, 0.2, 0.5, 0.1, 0.7],
    [0.3, 0.8, 0.1, 0.6, 0.2],
    [0.6, 0.1, 0.9, 0.3, 0.4],
    [0.1, 0.5, 0.3, 0.8, 0.9],
  ];
  return (
    <>
      {TERMS.map((w, i) => (
        <g key={w}>
          <rect x="8" y={14 + i * 24} width="54" height="16" rx="8" className="art-chip" />
          <text x="35" y={25 + i * 24} textAnchor="middle" className="art-text art-text--chip">
            {w}
          </text>
        </g>
      ))}
      <path d="M70 60h18m-6-6 6 6-6 6" className="art-arrow art-arrow--thin" />
      {weights.map((row, r) =>
        row.map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={98 + c * 19}
            y={14 + r * 24}
            width="16"
            height="16"
            rx="3"
            className="art-weight"
            style={{ '--w': v, animationDelay: `${(r + c) * 0.12}s` } as CSSProperties}
          />
        )),
      )}
    </>
  );
}

/* Random search: candidate settings appear one by one, the best gets a ring. */
const TRIALS = [
  [40, 70], [76, 30], [58, 48], [96, 64], [30, 34], [84, 46], [66, 76], [104, 26],
] as const;

function Tune() {
  return (
    <>
      <rect x="10" y="10" width="110" height="78" rx="6" className="art-panel" />
      <path d="M22 20v58h90" className="art-grid" />
      {TRIALS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className="art-trial" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <circle cx="84" cy="46" r="9" className="art-best" />
      {/* Folds: the validation fold moves along */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={10 + i * 23} y="98" width="20" height="12" rx="3" className="art-fold" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      {/* Train / test split */}
      <rect x="132" y="22" width="56" height="48" rx="4" className="art-split-train" />
      <rect x="132" y="76" width="56" height="16" rx="4" className="art-split-test" />
      <text x="160" y="50" textAnchor="middle" className="art-text">train</text>
      <text x="160" y="87" textAnchor="middle" className="art-text art-text--alt">test</text>
    </>
  );
}

function Confusion() {
  const cells = [
    { x: 40, y: 18, hit: true },
    { x: 88, y: 18, hit: false },
    { x: 40, y: 64, hit: false },
    { x: 88, y: 64, hit: true },
  ];
  return (
    <>
      <text x="76" y="12" textAnchor="middle" className="art-text art-text--soft">predicted</text>
      <text x="22" y="64" textAnchor="middle" className="art-text art-text--soft" transform="rotate(-90 22 64)" style={{ transformBox: 'view-box' }}>
        actual
      </text>
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width="44"
          height="42"
          rx="5"
          className={`art-cm${c.hit ? ' is-hit' : ''}`}
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <path d="M54 39l6 6 10-10M102 85l6 6 10-10" className="art-check art-check--bg" />
      {/* Metric bars */}
      {[0.86, 0.78, 0.82].map((v, i) => (
        <g key={i}>
          <rect x={148 + i * 14} y="22" width="10" height="84" rx="3" className="art-cell" />
          <rect
            x={148 + i * 14}
            y={22 + 84 * (1 - v)}
            width="10"
            height={84 * v}
            rx="3"
            className="art-bar art-tone"
            style={{ animationDelay: `${0.8 + i * 0.15}s` }}
          />
        </g>
      ))}
    </>
  );
}

function Infer() {
  return (
    <>
      <g className="art-feed">
        <Doc x={8} y={44} s={1.1} />
      </g>
      {/* The trained model */}
      <rect x="64" y="28" width="64" height="64" rx="14" className="art-model" />
      {[[84, 48], [108, 48], [84, 72], [108, 72], [96, 60]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className="art-tone art-blink" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      <path d="M84 48l12 12 12-12M84 72l12-12 12 12" className="art-line" />
      {/* The label it returns */}
      <g className="art-label">
        <rect x="136" y="48" width="56" height="24" rx="12" className="art-tone" />
        <path d="M146 60l4 4 8-8" className="art-check art-check--bg" />
        <rect x="162" y="57" width="22" height="6" rx="3" className="art-cell--bg" />
      </g>
    </>
  );
}

/* ---------- Literature review data pipeline ---------- */

/* Models from different providers each give an opinion; the opinions are combined. */
function Vote() {
  const voters = [
    { x: 22, y: 18, c: 'var(--tone-cyan)', yes: true },
    { x: 22, y: 76, c: 'var(--tone-amber)', yes: false },
    { x: 152, y: 18, c: 'var(--tone-green)', yes: true },
    { x: 152, y: 76, c: 'var(--tone-coral)', yes: true },
  ];
  return (
    <>
      {voters.map((v, i) => (
        <g key={i}>
          <path d={`M${v.x + 13} ${v.y + 13}L100 60`} className="art-grid art-grid--dash" />
          <rect x={v.x} y={v.y} width="26" height="26" rx="7" style={{ fill: v.c }} />
          <circle cx={v.x + 9} cy={v.y + 11} r="2" className="art-eye" />
          <circle cx={v.x + 17} cy={v.y + 11} r="2" className="art-eye" />
          <rect x={v.x + 8} y={v.y + 17} width="10" height="2.5" rx="1" className="art-eye" />
          <g className="art-opinion" style={{ animationDelay: `${i * 0.45}s` }}>
            <circle cx={v.x + 28} cy={v.y + 2} r="8" className={v.yes ? 'art-yes' : 'art-no'} />
            <path
              d={v.yes ? `M${v.x + 24} ${v.y + 2}l3 3 5-5` : `M${v.x + 25} ${v.y - 1}l6 6m0-6-6 6`}
              className="art-check art-check--bg art-check--small"
            />
          </g>
        </g>
      ))}
      <Doc x={89} y={45} s={1} />
      {/* Combined verdict */}
      <g className="art-verdict">
        <circle cx="100" cy="60" r="22" className="art-ring-tone" />
      </g>
    </>
  );
}

function Filters() {
  const rows = [0, 1, 2, 3, 4, 5, 6];
  const keep = new Set([1, 4, 6]);
  return (
    <>
      {/* Filter controls */}
      <path d="M12 16h70M12 32h70" className="art-track" />
      <circle cx="30" cy="16" r="5" className="art-tone art-knob" />
      <circle cx="64" cy="32" r="5" className="art-tone art-knob art-knob--b" />
      <rect x="94" y="9" width="44" height="14" rx="7" className="art-chip-tone" />
      <rect x="142" y="9" width="48" height="14" rx="7" className="art-chip-tone" />
      <rect x="94" y="27" width="56" height="14" rx="7" className="art-chip-tone" />
      {/* Articles: most drop out, a few stay */}
      {rows.map((i) => (
        <g key={i} className={keep.has(i) ? 'art-keep' : 'art-drop-row'} style={{ animationDelay: `${i * 0.12}s` }}>
          <rect x="12" y={50 + i * 9.5} width="176" height="7" rx="2" className={keep.has(i) ? 'art-tone' : 'art-cell'} />
        </g>
      ))}
    </>
  );
}

function Curated() {
  return (
    <>
      {/* The full volume */}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} className="art-pile" style={{ animationDelay: `${i * 0.1}s` }} transform={`rotate(${(i * 29) % 40 - 20} ${30 + (i % 3) * 14} ${60 + Math.floor(i / 3) * 12})`}>
          <rect x={20 + (i % 3) * 14} y={40 + Math.floor(i / 3) * 12} width="20" height="26" rx="2" className="art-pile-doc" />
        </g>
      ))}
      <path d="M78 60h20m-6-6 6 6-6 6" className="art-arrow art-arrow--thin" />
      {/* The manageable set */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={110 + i * 4} y={34 + i * 6} width="28" height="38" rx="3" className="art-stack-doc" />
      ))}
      {/* Exposed to the app */}
      <path d="M150 58h12" className="art-line" />
      <rect x="162" y="44" width="30" height="28" rx="6" className="art-api" />
      <text x="177" y="62" textAnchor="middle" className="art-text art-text--api">API</text>
      <circle cx="177" cy="86" r="3" className="art-tone art-blink" />
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
  library: Library,
  screen: Screen,
  ask: Ask,
  explore: Explore,
  pipeline: Pipeline,
  tfidf: Tfidf,
  tune: Tune,
  confusion: Confusion,
  infer: Infer,
  vote: Vote,
  filters: Filters,
  curated: Curated,
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
    <ol className={`ill${steps.length > 5 ? ' ill--wrap' : ''}`} aria-label={label}>
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
