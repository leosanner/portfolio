import {
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { careerById, getChildren, type CareerNode } from '../data/career';
import type { Locale, UIStrings } from '../i18n/ui';
import {
  buildRoute,
  LAYOUT_W,
  type PhaseNode as PhaseFlowNode,
  type StopNode,
} from '../lib/route-layout';

/* ---------- Nodes ---------- */

const StopCard = memo(function StopCard({ data, type }: NodeProps<StopNode>) {
  const { node, lang, selected, expanded, childCount, ongoingLabel, projectsLabel } = data;
  const isSub = type === 'sub';
  return (
    <div
      className={['stop', isSub && 'stop--sub', selected && 'is-selected', expanded && 'is-expanded']
        .filter(Boolean)
        .join(' ')}
    >
      <Handle type="target" position={Position.Top} className="route-handle" />
      <span className={`stop__mark stop__mark--${node.kind}`} aria-hidden />
      <span className="stop__body">
        <span className="stop__title">{node.title[lang]}</span>
        {!isSub && (
          <span className="stop__meta">
            {node.org && <span>{node.org}</span>}
            {node.period && <span>{node.period[lang]}</span>}
            {node.ongoing && <span className="stop__badge">{ongoingLabel}</span>}
            {childCount > 0 && (
              <span className="stop__count">
                {childCount} {projectsLabel}
                <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden>
                  <path d={expanded ? 'M2 6.5 5 3.5 8 6.5' : 'M2 3.5 5 6.5 8 3.5'} />
                </svg>
              </span>
            )}
          </span>
        )}
      </span>
      <Handle type="source" position={Position.Bottom} className="route-handle" />
    </div>
  );
});

function PhaseLabel({ data }: NodeProps<PhaseFlowNode>) {
  return <div className="phase-label"><span>{data.title}</span></div>;
}

const nodeTypes: NodeTypes = { stop: StopCard, sub: StopCard, phase: PhaseLabel };

/* ---------- Details panel ---------- */

function Details({
  node,
  lang,
  ui,
  onClose,
  onExpand,
  expanded,
}: {
  node: CareerNode;
  lang: Locale;
  ui: UIStrings;
  onClose: () => void;
  onExpand: () => void;
  expanded: boolean;
}) {
  const parent = node.parentId ? careerById[node.parentId] : undefined;
  const children = getChildren(node);
  return (
    <article className="details" key={node.id}>
      <button type="button" className="details__close" onClick={onClose} aria-label={ui['experience.close']}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <path d="M3 3l10 10M13 3 3 13" />
        </svg>
      </button>
      <p className="details__category">
        {parent ? `${ui['experience.subprojectOf']} ${parent.title[lang]}` : node.category[lang]}
      </p>
      <h3 className="details__title">{node.title[lang]}</h3>
      <p className="details__meta">
        {[node.org ?? parent?.org, node.period?.[lang]].filter(Boolean).join(', ')}
        {node.ongoing && <span className="stop__badge">{ui['experience.ongoing']}</span>}
      </p>
      <p className="details__summary">{node.summary[lang]}</p>
      {node.outcome && <p className="details__outcome">{node.outcome[lang]}</p>}

      {children.length > 0 && !expanded && (
        <button type="button" className="details__expand" onClick={onExpand}>
          {ui['experience.showProjects']}
        </button>
      )}

      {node.highlights[lang].length > 0 && (
        <>
          <h4 className="details__heading">{ui['experience.highlights']}</h4>
          <ul className="details__list">
            {node.highlights[lang].map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}

      {node.tech.length > 0 && (
        <>
          <h4 className="details__heading">{node.techTitle?.[lang] ?? ui['experience.tech']}</h4>
          <ul className="details__tech">
            {node.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </>
      )}

      {node.links?.map((l) => (
        <a key={l.url} className="details__link" href={l.url} target="_blank" rel="noopener">
          {l.label[lang]}
        </a>
      ))}
    </article>
  );
}

/* ---------- Route ---------- */

const PAD = 12;

function Route({ lang, ui }: { lang: Locale; ui: UIStrings }) {
  const { setViewport } = useReactFlow();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(LAYOUT_W + PAD * 2);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { nodes, edges, height } = useMemo(
    () =>
      buildRoute({
        lang,
        expandedId,
        selectedId,
        ongoingLabel: ui['experience.ongoing'],
        projectsLabel: ui['experience.projects'],
      }),
    [lang, expandedId, selectedId, ui],
  );

  // Scale the whole route to the column width; the page scrolls, the canvas never pans.
  const zoom = Math.min(1, width / (LAYOUT_W + PAD * 2));
  const canvasHeight = Math.ceil((height + PAD * 2) * zoom);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    void setViewport({ x: PAD * zoom, y: PAD * zoom, zoom });
  }, [setViewport, zoom]);

  const activate = useCallback(
    (id: string) => {
      const node = careerById[id];
      if (!node) return; // phase labels
      if (node.childIds?.length) {
        // Clicking an open, selected group closes it.
        if (expandedId === id && selectedId === id) {
          setExpandedId(null);
          setSelectedId(null);
          return;
        }
        setExpandedId(id);
      } else if (!node.parentId) {
        setExpandedId(null);
      }
      setSelectedId(id);
    },
    [expandedId, selectedId],
  );

  const close = useCallback(() => setSelectedId(null), []);

  // Keyboard: Enter/Space on a focused stop opens it, Esc closes the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
        return;
      }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('.react-flow__node');
      const id = el?.dataset.id;
      if (id && careerById[id] && wrapRef.current?.contains(el)) {
        e.preventDefault();
        activate(id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activate]);

  const selected = selectedId ? careerById[selectedId] : undefined;

  return (
    <div className="route">
      <div className="route__canvas" ref={wrapRef} style={{ height: canvasHeight }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, n) => activate(n.id)}
          onPaneClick={close}
          defaultViewport={{ x: PAD, y: PAD, zoom: 1 }}
          minZoom={0.3}
          maxZoom={1}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          aria-label={ui['experience.title']}
        />
      </div>

      <aside className={`route__panel${selected ? ' is-open' : ''}`} aria-live="polite">
        {selected ? (
          <Details
            node={selected}
            lang={lang}
            ui={ui}
            onClose={close}
            expanded={expandedId === selected.id}
            onExpand={() => setExpandedId(selected.id)}
          />
        ) : (
          <p className="route__empty">{ui['experience.empty']}</p>
        )}
      </aside>
    </div>
  );
}

export default function CareerRoute(props: { lang: Locale; ui: UIStrings }) {
  return (
    <ReactFlowProvider>
      <Route {...props} />
    </ReactFlowProvider>
  );
}
