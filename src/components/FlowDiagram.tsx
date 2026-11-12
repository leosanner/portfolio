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
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { FlowStep } from '../data/case-studies';
import type { Locale } from '../i18n/ui';

/**
 * "How it works" pipeline. Steps light up one after another, like data moving
 * through the system. Horizontal when it fits, vertical otherwise.
 */
const STEP_W = 156;
const STEP_H = 68;
const GAP_X = 36;
const GAP_Y = 26;
const TICK_MS = 1100;

type StepData = { step: FlowStep; lang: Locale; state: 'idle' | 'active' | 'done'; vertical: boolean };
type StepNode = Node<StepData, 'step'>;

const Step = memo(function Step({ data }: NodeProps<StepNode>) {
  const { step, lang, state, vertical } = data;
  return (
    <div className={`flow-step is-${state}`}>
      <Handle type="target" position={vertical ? Position.Top : Position.Left} className="flow-handle" />
      <span className="flow-step__label">{step.label[lang]}</span>
      {step.note && <span className="flow-step__note">{step.note}</span>}
      <Handle type="source" position={vertical ? Position.Bottom : Position.Right} className="flow-handle" />
    </div>
  );
});

const nodeTypes: NodeTypes = { step: Step };

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

function Diagram({ steps, lang, label }: { steps: FlowStep[]; lang: Locale; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  const [tick, setTick] = useState(0);
  const reduced = usePrefersReducedMotion();
  const { setViewport } = useReactFlow();

  const hWidth = steps.length * STEP_W + (steps.length - 1) * GAP_X;
  const vertical = available > 0 && available < hWidth * 0.8;
  // Vertical steps fill the column (up to a comfortable reading width).
  const vStepW = Math.min(Math.max(available, STEP_W), 320);
  const height = vertical ? steps.length * STEP_H + (steps.length - 1) * GAP_Y : STEP_H;
  const zoom = vertical ? 1 : Math.min(1, available / hWidth || 1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvailable(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    void setViewport({ x: 0, y: 0, zoom });
  }, [setViewport, zoom]);

  // One extra tick at the end so the last step is "done" before looping.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % (steps.length + 1)), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced, steps.length]);

  const { nodes, edges } = useMemo(() => {
    const active = reduced ? -1 : tick;
    const nodes: StepNode[] = steps.map((step, i) => ({
      id: `s${i}`,
      type: 'step',
      position: vertical ? { x: 0, y: i * (STEP_H + GAP_Y) } : { x: i * (STEP_W + GAP_X), y: 0 },
      width: vertical ? vStepW : STEP_W,
      height: STEP_H,
      draggable: false,
      selectable: false,
      focusable: false,
      data: { step, lang, vertical, state: i === active ? 'active' : i < active ? 'done' : 'idle' },
    }));
    const edges: BuiltInEdge[] = steps.slice(1).map((_, i) => ({
      id: `e${i}`,
      source: `s${i}`,
      target: `s${i + 1}`,
      type: 'straight',
      animated: true,
      className: `flow-edge${i + 1 <= active ? ' is-lit' : ''}`,
    }));
    return { nodes, edges };
  }, [steps, lang, vertical, vStepW, tick, reduced]);

  return (
    <div
      className="flow"
      ref={wrapRef}
      role="img"
      aria-label={`${label}: ${steps.map((s) => s.label[lang]).join(' → ')}`}
      style={{ height: height * zoom }}
    >
      {available > 0 && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom }}
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
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}

export default function FlowDiagram(props: { steps: FlowStep[]; lang: Locale; label: string }) {
  return (
    <ReactFlowProvider>
      <Diagram {...props} />
    </ReactFlowProvider>
  );
}
