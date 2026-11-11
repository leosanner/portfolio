import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { careerById, getChildren, mainNodes, type CareerNode } from '../data/career';
import { caseStudies, type CaseStudy } from '../data/case-studies';
import type { Locale, UIStrings } from '../i18n/ui';
import FlowDiagram from './FlowDiagram';

/**
 * Experience: a slim timeline of stops, and one case study at a time below it.
 * The case study leads with real results (when supplied), shows a screenshot when
 * there is one, and always explains "how it works" with an animated flow.
 */

const DEFAULT_ID = 'trust-gtw';

/* ---------- Pieces ---------- */

function Results({ study, lang, ui }: { study: CaseStudy; lang: Locale; ui: UIStrings }) {
  if (!study.results?.length) return null;
  return (
    <dl className="case__results" aria-label={ui['experience.results']}>
      {study.results.map((r) => (
        <div key={r.value + r.label.en}>
          <dt>{r.label[lang]}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
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
      <FlowDiagram steps={study.flow} lang={lang} label={label} />
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

function Tech({ node, lang, ui }: { node: CareerNode; lang: Locale; ui: UIStrings }) {
  if (!node.tech.length) return null;
  return (
    <ul className="case__tech" aria-label={node.techTitle?.[lang] ?? ui['experience.tech']}>
      {node.tech.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
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
  const meta = [node.org ?? parent?.org, node.period?.[lang]].filter(Boolean).join(', ');

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

        <div className="case__grid">
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
            {node.outcome && <p className="case__outcome">{node.outcome[lang]}</p>}
            <Results study={study} lang={lang} ui={ui} />
            <Links study={study} ui={ui} />
          </div>
          <div>{hasMedia ? <Screenshot study={study} lang={lang} /> : <Flow study={study} lang={lang} ui={ui} />}</div>
        </div>

        {hasMedia && <Flow study={study} lang={lang} ui={ui} />}
        <Tech node={node} lang={lang} ui={ui} />
      </section>
    </div>
  );
}
