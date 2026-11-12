import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { careerById, getAffiliations, getChildren, mainNodes, type CareerNode } from '../data/career';
import type { OrgRole } from '../data/orgs';
import OrgLogo from './OrgLogo';
import { caseStudies, type CaseStudy, type Result, type Tone } from '../data/case-studies';
import type { Locale, UIStrings } from '../i18n/ui';
import FlowDiagram from './FlowDiagram';
import IllustratedFlow from './IllustratedFlow';

/**
 * Experience: a slim timeline of stops, and one case study at a time below it.
 * Each case study reads top to bottom: what it is (with a screenshot when there is one),
 * results, the problem / what was built / technical details beside a layered stack,
 * and an animated "how it works" flow.
 */

const DEFAULT_ID = 'trust-gtw';

/* ---------- Pieces ---------- */

const Person = ({ lit }: { lit?: boolean }) => (
  <svg viewBox="0 0 16 20" className={`person${lit ? ' is-lit' : ''}`} aria-hidden>
    <circle cx="8" cy="5" r="4" />
    <path d="M1 20v-3a7 7 0 0 1 14 0v3z" />
  </svg>
);

/** One before/after result, drawn to scale. */
function Compare({ r, lang, ui }: { r: Result; lang: Locale; ui: UIStrings }) {
  const c = r.compare!;
  const rows = [
    { key: 'before', label: ui['experience.before'], text: r.before, n: c.from },
    { key: 'now', label: ui['experience.now'], text: r.value, n: c.to },
  ];
  const max = Math.max(c.from, c.to);
  return (
    <div className="compare">
      <p className="compare__head">
        <span>{r.label[lang]}</span>
        {r.gain && <strong className="compare__gain">{r.gain[lang]}</strong>}
      </p>
      {rows.map((row) => (
        <div key={row.key} className={`compare__row is-${row.key}`}>
          <span className="compare__when">{row.label}</span>
          {c.kind === 'bar' ? (
            <span className="compare__track" aria-hidden>
              <span className="compare__bar" style={{ width: `${(row.n / max) * 100}%` }} />
            </span>
          ) : (
            <span className="compare__people" aria-hidden>
              {Array.from({ length: row.n }, (_, i) => (
                <span key={i} style={{ animationDelay: `${i * 80}ms` }}>
                  <Person lit={row.key === 'now'} />
                </span>
              ))}
            </span>
          )}
          <span className="compare__value">{row.text}</span>
        </div>
      ))}
    </div>
  );
}

function ResultsBand({ study, lang, ui, side }: { study: CaseStudy; lang: Locale; ui: UIStrings; side?: boolean }) {
  const all = study.results ?? [];
  const compares = all.filter((r) => r.compare);
  const figures = all.filter((r) => !r.compare);
  const outcomes = study.outcomes ?? [];
  if (!all.length && !outcomes.length) return null;
  return (
    <div className={`case__results${side ? ' case__results--side' : ''}`}>
      <h4 className="case__label">{ui['experience.results']}</h4>
      {compares.length > 0 && (
        <div className="case__compares">
          {compares.map((r) => (
            <Compare key={r.label.en} r={r} lang={lang} ui={ui} />
          ))}
        </div>
      )}
      <div className="case__tail">
        {figures.length > 0 && (
          <dl className="case__figures">
            {figures.map((r) => (
              <div key={r.value + r.label.en}>
                <dt>{r.label[lang]}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {outcomes.length > 0 && (
          <ul className="case__outcomes">
            {outcomes.map((o) => (
              <li key={o.en}>{o[lang]}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Affiliations({ node, lang, ui }: { node: CareerNode; lang: Locale; ui: UIStrings }) {
  const all = getAffiliations(node);
  if (!all.length) return null;
  const roles: OrgRole[] = ['funding', 'university', 'company'];
  return (
    <dl className="case__orgs">
      {roles.map((role) => {
        const items = all.filter((a) => a.role === role);
        if (!items.length) return null;
        return (
          <div key={role}>
            <dt>{ui[`experience.org.${role}`]}</dt>
            <dd>
              {items.map((a) => (
                <OrgLogo key={a.org} id={a.org} lang={lang} />
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function Problem({ study, lang, ui }: { study: CaseStudy; lang: Locale; ui: UIStrings }) {
  if (!study.problem) return null;
  return (
    <section>
      <h4 className="case__label">{study.problemLabel?.[lang] ?? ui['experience.problem']}</h4>
      <p className="case__problem">{study.problem[lang]}</p>
    </section>
  );
}

function Story({
  node,
  study,
  lang,
  ui,
  problemInHead,
}: {
  node: CareerNode;
  study: CaseStudy;
  lang: Locale;
  ui: UIStrings;
  problemInHead?: boolean;
}) {
  const built = study.built?.[lang] ?? node.highlights[lang];
  const details = study.details?.[lang] ?? [];
  const planned = Boolean(study.flowPlanned);
  return (
    <div className="case__story">
      {!problemInHead && <Problem study={study} lang={lang} ui={ui} />}
      {built.length > 0 && (
        <section>
          <h4 className="case__label">{planned ? ui['experience.plannedScope'] : (study.builtLabel?.[lang] ?? ui['experience.built'])}</h4>
          <ul className="case__built">
            {built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}
      {details.length > 0 && (
        <section>
          <h4 className="case__label">{ui['experience.details']}</h4>
          <ul className="case__details">
            {details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}
      <Reading study={study} ui={ui} />
    </div>
  );
}

function ArchitectureDiagram({ study, lang, ui }: { study: CaseStudy; lang: Locale; ui: UIStrings }) {
  const arch = study.architecture;
  if (!arch) return null;
  return (
    <section className="arch">
      <h4 className="case__label">{ui['experience.architecture']}</h4>
      <ol className="arch__zones">
        {arch.zones.map((z, i) => (
          <li
            key={z.label.en}
            className={`arch__zone${z.private ? ' is-private' : ''}`}
            style={{ '--tone': `var(--tone-${z.tone})`, '--tone-next': `var(--tone-${arch.zones[i + 1]?.tone ?? z.tone})` } as CSSProperties}
          >
            <p className="arch__zone-label">
              {z.private && (
                <svg viewBox="0 0 16 16" className="arch__lock" role="img" aria-label={ui['experience.private']}>
                  <rect x="3" y="7" width="10" height="8" rx="2" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              )}
              {z.label[lang]}
            </p>
            <ul className="arch__nodes">
              {z.nodes.map((n) => (
                <li key={n.label.en}>
                  <span>{n.label[lang]}</span>
                  {n.note && <em>{n.note}</em>}
                </li>
              ))}
            </ul>
            {i < arch.zones.length - 1 && (
              <span className="arch__link" aria-hidden>
                <span />
              </span>
            )}
          </li>
        ))}
      </ol>
      {arch.services && (
        <div className="arch__services">
          <p>{ui['experience.services']}</p>
          <ul>
            {arch.services.map((n) => (
              <li key={n.label.en}>
                <span>{n.label[lang]}</span>
                {n.note && <em>{n.note}</em>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Reading({ study, ui }: { study: CaseStudy; ui: UIStrings }) {
  if (!study.references?.length) return null;
  return (
    <section className="case__reading">
      <h4 className="case__label">{ui['experience.reading']}</h4>
      <ul className="books">
        {study.references.map((r, i) => {
          const cover = (
            <>
              <span className="book__cover" aria-hidden>
                <span className="book__spine" />
                <span className="book__title">{r.title}</span>
                <span className="book__marks">
                  <i />
                  <i />
                  <i />
                </span>
              </span>
              <span className="book__meta">
                <cite>{r.title}</cite>
                <span>{r.authors}</span>
                <em>
                  {r.publisher}, {r.year}
                </em>
              </span>
            </>
          );
          return (
            <li
              key={r.title}
              className="book"
              style={{ '--tone': `var(--tone-${r.tone ?? TONES[i % TONES.length]})` } as CSSProperties}
            >
              {r.url ? (
                <a href={r.url} target="_blank" rel="noopener">
                  {cover}
                </a>
              ) : (
                <div>{cover}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Screenshot({ study, lang }: { study: CaseStudy; lang: Locale }) {
  const media = study.media?.[0];
  if (!media) return null;
  const host = study.links
    ?.find((l) => l.kind === 'live')
    ?.url.replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  return (
    <figure className="case__media">
      <div className="case__media-bar" aria-hidden>
        <span />
        <span />
        <span />
        {host && <em>{host}</em>}
      </div>
      {media.type === 'video' ? (
        <video src={media.src} poster={media.poster} muted loop autoPlay playsInline aria-label={media.alt[lang]} />
      ) : (
        <img src={media.src} alt={media.alt[lang]} loading="lazy" decoding="async" />
      )}
    </figure>
  );
}

function Flow({ study, lang, ui }: { study: CaseStudy; lang: Locale; ui: UIStrings }) {
  if (!study.flow?.length) return null;
  const label = study.flowPlanned ? ui['experience.planned'] : ui['experience.how'];
  return (
    <div className="case__flow">
      <p className="case__label">{label}</p>
      {study.flow.some((s) => s.art) ? (
        <IllustratedFlow steps={study.flow} lang={lang} label={label} mineLabel={ui['experience.myPart']} />
      ) : (
        <FlowDiagram steps={study.flow} lang={lang} label={label} />
      )}
    </div>
  );
}

function Links({ study, ui }: { study: CaseStudy; ui: UIStrings }) {
  if (!study.links?.length) return null;
  return (
    <p className="case__links">
      {study.links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener">
          {ui[`experience.link.${l.kind}`]}
        </a>
      ))}
    </p>
  );
}

const TONES: Tone[] = ['cyan', 'green', 'violet', 'amber', 'coral'];

function Stack({ node, study, lang, ui }: { node: CareerNode; study: CaseStudy; lang: Locale; ui: UIStrings }) {
  const layers: { layer: CaseStudy['problem'] | null; items: string[]; tone?: Tone }[] =
    study.stack ?? (node.tech.length ? [{ layer: null, items: node.tech }] : []);
  if (!layers.length) return null;
  return (
    <section className="case__stack">
      <h4 className="case__label">{node.techTitle?.[lang] ?? ui['experience.tech']}</h4>
      <dl>
        {layers.map((l, i) => (
          <div
            key={i}
            className={l.layer ? 'case__layer' : undefined}
            style={l.layer ? ({ '--tone': `var(--tone-${l.tone ?? TONES[i % TONES.length]})` } as CSSProperties) : undefined}
          >
            {l.layer && <dt>{l.layer[lang]}</dt>}
            <dd>
              <ul className="case__tech">
                {l.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Component ---------- */

export default function Experience({ lang, ui }: { lang: Locale; ui: UIStrings }) {
  const [id, setId] = useState(DEFAULT_ID);
  const trackRef = useRef<HTMLDivElement>(null);

  const node = careerById[id];
  const parent = node.parentId ? careerById[node.parentId] : undefined;
  const group = parent ?? node;
  const projects = getChildren(group);
  const study = caseStudies[id] ?? {};
  const hasMedia = Boolean(study.media?.length);
  const hasResults = Boolean(study.results?.length || study.outcomes?.length);
  // Without a screenshot, results and organisations share the column beside the intro.
  const overview = Boolean(study.overview);
  const sideResults = !hasMedia && hasResults && !overview;
  const sideOrgs = sideResults || overview;

  const openProject = (pid: string) => {
    setId(pid);
    document.getElementById('experience-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const meta = [getAffiliations(node).length ? null : (node.org ?? parent?.org), node.period?.[lang]].filter(Boolean).join(', ');

  // Hero route links point at #tab-<id>: select that stop on load and on every jump.
  useEffect(() => {
    const fromHash = () => {
      const target = decodeURIComponent(location.hash).replace(/^#tab-/, '');
      if (target !== location.hash && careerById[target]) setId(target);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  // Keep the selected stop visible when the track scrolls sideways (small screens).
  useEffect(() => {
    const track = trackRef.current;
    const tab = track?.querySelector<HTMLElement>(`[data-id="${group.id}"]`);
    if (!track || !tab) return;
    track.scrollTo({ left: tab.offsetLeft - track.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' });
  }, [group.id]);

  // Tabs pattern: ← → move between stops, Home/End jump to the ends.
  const onTrackKey = (e: KeyboardEvent) => {
    const i = mainNodes.findIndex((n) => n.id === group.id);
    const target =
      e.key === 'ArrowRight' ? (i + 1) % mainNodes.length
      : e.key === 'ArrowLeft' ? (i - 1 + mainNodes.length) % mainNodes.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? mainNodes.length - 1
      : -1;
    if (target < 0) return;
    e.preventDefault();
    const next = mainNodes[target];
    setId(next.id);
    trackRef.current?.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus();
  };

  return (
    <div className="experience">
      <div className="track" role="tablist" aria-label={ui['experience.timeline']} ref={trackRef} onKeyDown={onTrackKey}>
        {mainNodes.map((n) => {
          const selected = n.id === group.id;
          return (
            <button
              key={n.id}
              id={`tab-${n.id}`}
              data-id={n.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="experience-panel"
              tabIndex={selected ? 0 : -1}
              className={`track__stop track__stop--${n.kind}`}
              onClick={() => setId(n.id)}
            >
              <span className="track__dot" aria-hidden />
              <span className="track__period">{n.ongoing ? ui['experience.ongoing'] : n.period?.[lang]}</span>
              <span className="track__title">{n.title[lang]}</span>
            </button>
          );
        })}
      </div>

      <section className="case" id="experience-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`} key={id}>
        {projects.length > 0 && (
          <div className="case__projects" role="group" aria-label={ui['experience.projects']}>
            {[group, ...projects].map((p) => (
              <button key={p.id} type="button" aria-pressed={p.id === id} onClick={() => setId(p.id)}>
                {p.id === group.id ? ui['experience.overview'] : p.title[lang]}
              </button>
            ))}
          </div>
        )}

        <div className={`case__head${hasMedia ? ' has-media' : sideOrgs ? ' has-results' : ''}`}>
          <div>
            <p className="case__category">
              {parent ? `${ui['experience.subprojectOf']} ${parent.title[lang]}` : node.category[lang]}
            </p>
            <h3 className="case__title">{node.title[lang]}</h3>
            <p className="case__meta">
              {meta}
              {node.ongoing && <span className="case__badge">{ui['experience.ongoing']}</span>}
            </p>
            <p className="case__summary">{node.summary[lang]}</p>
            {sideResults && (
              <div className="case__head-problem">
                <Problem study={study} lang={lang} ui={ui} />
              </div>
            )}
            {!sideOrgs && <Affiliations node={node} lang={lang} ui={ui} />}
            <Links study={study} ui={ui} />
          </div>
          {hasMedia && <Screenshot study={study} lang={lang} />}
          {sideOrgs && (
            <div className={`case__side${overview ? ' is-orgs-only' : ''}`}>
              {sideResults && <ResultsBand study={study} lang={lang} ui={ui} side />}
              <Affiliations node={node} lang={lang} ui={ui} />
            </div>
          )}
        </div>

        {hasMedia && <ResultsBand study={study} lang={lang} ui={ui} />}

        {!overview && (
          <div className="case__body">
            <Story node={node} study={study} lang={lang} ui={ui} problemInHead={sideResults} />
            <aside className="case__rail">
              <Stack node={node} study={study} lang={lang} ui={ui} />
            </aside>
          </div>
        )}

        <ArchitectureDiagram study={study} lang={lang} ui={ui} />

        <Flow study={study} lang={lang} ui={ui} />

        {overview && projects.length > 0 && (
          <section className="case__subprojects">
            <h4 className="case__label">{ui['experience.projects']}</h4>
            <ul className="subprojects">
              {projects.map((p, i) => (
                <li
                  key={p.id}
                  style={{ '--tone': `var(--tone-${study.projectTones?.[p.id] ?? TONES[i % TONES.length]})` } as CSSProperties}
                >
                  <button type="button" onClick={() => openProject(p.id)}>
                    <span className="subprojects__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="subprojects__title">{p.title[lang]}</span>
                    <span className="subprojects__summary">{p.summary[lang]}</span>
                    <span className="subprojects__open">
                      {ui['experience.open']} <span aria-hidden>→</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </div>
  );
}
