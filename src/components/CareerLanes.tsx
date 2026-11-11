import {
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type BuiltInEdge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { careerById, getChildren, lanes, mainNodes, type CareerNode } from '../data/career';
import type { Locale, UIStrings } from '../i18n/ui';

/* ---------- Layout ---------- */

/**
 * Wide screens: lanes are rows and the route runs left → right.
 * Narrow screens: lanes become two columns and the route runs top → bottom.
 */
const H = { LABEL: 86, COL: 140, CARD_W: 132, CARD_H: 96, LANE: 124 };
const V = { LABEL: 44, ROW: 112, CARD_W: 158, CARD_H: 98, LANE: 174 };
const H_WIDTH = H.LABEL + mainNodes.length * H.COL;
const H_HEIGHT = lanes.length * H.LANE;
const V_WIDTH = lanes.length * V.LANE;
const V_HEIGHT = V.LABEL + mainNodes.length * V.ROW;
/** Switch to the vertical layout below this available width (px). */
const VERTICAL_BELOW = 640;
/** Shrink the wide layout down to this zoom to fit; below it, scroll sideways instead. */
const MIN_FIT_ZOOM = 0.8;

type StopData = {
  node: CareerNode;
  lang: Locale;
  active: boolean;
  ongoingLabel: string;
  vertical: boolean;
};
type LaneData = { title: string; index: number; vertical: boolean };
type StopNode = Node<StopData, 'stop'>;
type LaneNode = Node<LaneData, 'lane'>;

function buildGraph(lang: Locale, selectedId: string, ongoingLabel: string, vertical: boolean) {
  const activeId = careerById[selectedId]?.parentId ?? selectedId;
  const nodes: (StopNode | LaneNode)[] = lanes.map((lane, index) => ({
    id: `lane-${lane.id}`,
    type: 'lane',
    position: vertical ? { x: index * V.LANE, y: 0 } : { x: 0, y: index * H.LANE },
    width: vertical ? V.LANE : H_WIDTH,
    height: vertical ? V_HEIGHT : H.LANE,
    zIndex: -1,
    selectable: false,
    focusable: false,
    data: { title: lane.title[lang], index, vertical },
  }));
  const edges: BuiltInEdge[] = [];

  mainNodes.forEach((node, step) => {
    const laneIndex = lanes.findIndex((l) => l.nodeIds.includes(node.id));
    const position = vertical
      ? { x: laneIndex * V.LANE + (V.LANE - V.CARD_W) / 2, y: V.LABEL + step * V.ROW }
      : { x: H.LABEL + step * H.COL, y: laneIndex * H.LANE + (H.LANE - H.CARD_H) / 2 };
    nodes.push({
      id: node.id,
      type: 'stop',
      position,
      width: vertical ? V.CARD_W : H.CARD_W,
      height: vertical ? V.CARD_H : H.CARD_H,
      ariaLabel: [node.title[lang], node.org, node.period?.[lang]].filter(Boolean).join(', '),
      data: { node, lang, active: node.id === activeId, ongoingLabel, vertical },
    });
    const prev = mainNodes[step - 1];
    if (prev) {
      edges.push({
        id: `${prev.id}->${node.id}`,
        source: prev.id,
        target: node.id,
        animated: true,
        className: 'lanes-edge',
      });
    }
  });
  return { nodes, edges };
}

/* ---------- Nodes ---------- */

const Stop = memo(function Stop({ data }: NodeProps<StopNode>) {
  const { node, lang, active, ongoingLabel, vertical } = data;
  return (
    <div className={`stop${active ? ' is-active' : ''}`}>
      <Handle type="target" position={vertical ? Position.Top : Position.Left} className="lanes-handle" />
      <span className="stop__period">{node.ongoing ? ongoingLabel : node.period?.[lang]}</span>
      <span className="stop__title">{node.title[lang]}</span>
      {node.org && <span className="stop__org">{node.org}</span>}
      <Handle type="source" position={vertical ? Position.Bottom : Position.Right} className="lanes-handle" />
    </div>
  );
});

function Lane({ data }: NodeProps<LaneNode>) {
  return (
    <div className={`lane lane--${data.index}${data.vertical ? ' lane--vertical' : ''}`}>
      <span>{data.title}</span>
    </div>
  );
}

const nodeTypes: NodeTypes = { stop: Stop, lane: Lane };

/* ---------- Details ---------- */

function Details({
  node,
  lang,
  ui,
  onSelect,
}: {
  node: CareerNode;
  lang: Locale;
  ui: UIStrings;
  onSelect: (id: string) => void;
}) {
  const parent = node.parentId ? careerById[node.parentId] : undefined;
  const group = parent ?? node;
  const projects = getChildren(group);
  const meta = [node.org ?? parent?.org, node.period?.[lang]].filter(Boolean).join(', ');

  return (
    <article className="details" aria-live="polite">
      <header className="details__head">
        <p className="details__category">
          {parent ? `${ui['experience.subprojectOf']} ${parent.title[lang]}` : node.category[lang]}
        </p>
        <h3 className="details__title">{node.title[lang]}</h3>
        <p className="details__meta">
          {meta}
          {node.ongoing && <span className="details__badge">{ui['experience.ongoing']}</span>}
        </p>
      </header>

      <div className="details__body">
        <p className="details__summary">{node.summary[lang]}</p>
        {node.outcome && <p className="details__outcome">{node.outcome[lang]}</p>}
        {node.highlights[lang].length > 0 && (
          <ul className="details__list">
            {node.highlights[lang].map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
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
        {node.links?.map((link) => (
          <a key={link.url} className="details__link" href={link.url} target="_blank" rel="noopener">
            {link.label[lang]}
          </a>
        ))}
      </div>

      {projects.length > 0 && (
        <nav className="details__projects" aria-label={ui['experience.projects']}>
          <h4 className="details__heading">{ui['experience.projects']}</h4>
          <div>
            {[group, ...projects].map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === node.id}
                onClick={() => onSelect(p.id)}
              >
                {p.id === group.id ? ui['experience.overview'] : p.title[lang]}
              </button>
            ))}
          </div>
        </nav>
      )}
    </article>
  );
}

/* ---------- Component ---------- */

function Lanes({ lang, ui }: { lang: Locale; ui: UIStrings }) {
  // Open on the current role so the details area is never empty.
  const [selectedId, setSelectedId] = useState('trust-gtw');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(H_WIDTH);
  const { setViewport } = useReactFlow();

  const vertical = available < VERTICAL_BELOW;
  const width = vertical ? V_WIDTH : H_WIDTH;
  const height = vertical ? V_HEIGHT : H_HEIGHT;
  const zoom = vertical
    ? Math.min(1, available / V_WIDTH)
    : Math.max(MIN_FIT_ZOOM, Math.min(1, available / H_WIDTH));

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    void setViewport({ x: 0, y: 0, zoom });
  }, [setViewport, zoom]);

  const { nodes, edges } = useMemo(
    () => buildGraph(lang, selectedId, ui['experience.ongoing'], vertical),
    [lang, selectedId, ui, vertical],
  );

  const select = useCallback((id: string) => {
    if (careerById[id]) setSelectedId(id);
  }, []);

  // Enter/Space on a focused stop selects it.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const id = (e.target as HTMLElement).closest<HTMLElement>('.react-flow__node')?.dataset.id;
    if (id && careerById[id]) {
      e.preventDefault();
      select(id);
    }
  };

  const selected = careerById[selectedId];

  return (
    <div className="lanes">
      <div className="lanes__scroll" ref={scrollRef} onKeyDown={onKeyDown}>
        <div style={{ width: width * zoom, height: height * zoom }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, n) => select(n.id)}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.5}
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
      </div>
      {selected && <Details key={selected.id} node={selected} lang={lang} ui={ui} onSelect={select} />}
    </div>
  );
}

export default function CareerLanes(props: { lang: Locale; ui: UIStrings }) {
  return (
    <ReactFlowProvider>
      <Lanes {...props} />
    </ReactFlowProvider>
  );
}
