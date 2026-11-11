import type { BuiltInEdge, Edge, Node } from '@xyflow/react';
import { getChildren, mainNodes, phases, type CareerNode } from '../data/career';
import type { Locale } from '../i18n/ui';

/**
 * Vertical "route" layout: phases top → bottom, main stops zig-zag slightly like a
 * plotted course, and an expanded stop's projects are inserted below it, indented.
 * The route passes through the projects before continuing to the next stop.
 */
export const MAIN_W = 344;
export const MAIN_H = 88;
export const SUB_W = 264;
export const SUB_H = 52;
const PHASE_H = 44;
const GAP = 30;
const SUB_GAP = 14;
const ZIG = 32;
const SUB_X = 56;
export const LAYOUT_W = Math.max(ZIG + MAIN_W, SUB_X + SUB_W);

export type StopData = {
  node: CareerNode;
  lang: Locale;
  selected: boolean;
  expanded: boolean;
  childCount: number;
  ongoingLabel: string;
  projectsLabel: string;
};
export type PhaseData = { title: string };

export type StopNode = Node<StopData, 'stop' | 'sub'>;
export type PhaseNode = Node<PhaseData, 'phase'>;
export type RouteNode = StopNode | PhaseNode;

interface BuildArgs {
  lang: Locale;
  expandedId: string | null;
  selectedId: string | null;
  ongoingLabel: string;
  projectsLabel: string;
}

export function buildRoute({ lang, expandedId, selectedId, ongoingLabel, projectsLabel }: BuildArgs) {
  const nodes: RouteNode[] = [];
  const edges: Edge[] = [];
  let y = 0;
  let prevId: string | null = null;
  let index = 0;

  const link = (target: string, isSub: boolean) => {
    if (prevId) {
      const edge: BuiltInEdge = {
        id: `${prevId}->${target}`,
        source: prevId,
        target,
        type: 'default',
        animated: true,
        className: isSub ? 'route-edge route-edge--sub' : 'route-edge',
      };
      edges.push(edge);
    }
    prevId = target;
  };

  for (const phase of phases) {
    nodes.push({
      id: phase.id,
      type: 'phase',
      position: { x: 0, y },
      width: LAYOUT_W,
      height: PHASE_H,
      selectable: false,
      focusable: false,
      draggable: false,
      data: { title: phase.title[lang] },
    });
    y += PHASE_H;

    for (const id of phase.nodeIds) {
      const node = mainNodes.find((n) => n.id === id);
      if (!node) continue;
      const children = getChildren(node);
      const expanded = expandedId === node.id && children.length > 0;

      nodes.push({
        id: node.id,
        type: 'stop',
        position: { x: index % 2 === 0 ? 0 : ZIG, y },
        width: MAIN_W,
        height: MAIN_H,
        draggable: false,
        ariaLabel: `${node.title[lang]}. ${node.period?.[lang] ?? ''}${
          children.length ? `. ${children.length} ${projectsLabel}` : ''
        }`,
        data: {
          node,
          lang,
          selected: selectedId === node.id,
          expanded,
          childCount: children.length,
          ongoingLabel,
          projectsLabel,
        },
      });
      link(node.id, false);
      y += MAIN_H + GAP;
      index += 1;

      if (!expanded) continue;
      y -= GAP - SUB_GAP;
      children.forEach((child) => {
        nodes.push({
          id: child.id,
          type: 'sub',
          position: { x: SUB_X, y },
          width: SUB_W,
          height: SUB_H,
          draggable: false,
          ariaLabel: child.title[lang],
          data: {
            node: child,
            lang,
            selected: selectedId === child.id,
            expanded: false,
            childCount: 0,
            ongoingLabel,
            projectsLabel,
          },
        });
        link(child.id, true);
        y += SUB_H + SUB_GAP;
      });
      y += GAP - SUB_GAP;
    }
  }

  return { nodes, edges, height: y - GAP };
}
