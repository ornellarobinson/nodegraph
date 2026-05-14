import { useEffect, useRef } from "react";
import * as go from "gojs";

import type { NodeData } from "@/types/index";
import { colors } from "@/theme/tokens";
import { createNodeTemplate, createLinkTemplate } from "../utils/diagramTemplates";
import { zoomToNode } from "../utils/diagramLayout";

type Props = {
  divRef: React.RefObject<HTMLDivElement | null>;
  overviewRef: React.RefObject<HTMLDivElement | null>;
  diagramRef: React.MutableRefObject<go.Diagram | null>;
  isInternalChange: React.MutableRefObject<boolean>;
  onSelectionChange: (id: string | null) => void;
  onAddLink: (from: string, to: string) => void;
};

export function useDiagramInit({
  divRef,
  overviewRef,
  diagramRef,
  isInternalChange,
  onSelectionChange,
  onAddLink,
}: Props): void {
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onAddLinkRef = useRef(onAddLink);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);
  useEffect(() => {
    onAddLinkRef.current = onAddLink;
  }, [onAddLink]);

  useEffect(() => {
    if (!divRef.current || !overviewRef.current) return;
    if (diagramRef.current) return;

    const diagram = new go.Diagram(divRef.current, {
      "undoManager.isEnabled": true,
      layout: new go.ForceDirectedLayout({
        defaultSpringLength: 180,
        defaultElectricalCharge: 600,
      }),
    });

    diagram.nodeTemplate = createNodeTemplate();
    diagram.linkTemplate = createLinkTemplate();

    diagram.addDiagramListener("ChangedSelection", () => {
      if (isInternalChange.current) return;

      const selection = diagram.selection.first();

      if (selection instanceof go.Node) {
        onSelectionChangeRef.current((selection.data as NodeData).id);
      } else if (diagram.selection.count === 0) {
        onSelectionChangeRef.current(null);
      }
    });

    diagram.addDiagramListener("LinkDrawn", (event) => {
      const link = event.subject as go.Link;
      const fromNode = link.fromNode!;
      const toNode = link.toNode!;
      const fromId = (fromNode.data as NodeData).id;
      const toId = (toNode.data as NodeData).id;

      onAddLinkRef.current(fromId, toId);

      // Pull nodes together if too far apart, then zoom — mirrors side-panel link behaviour.
      // useDiagramStructure skips this because GoJS already added the link to its model
      // before React state updates, so newLinks ends up empty on canvas-drawn links.
      // Two nested rAFs: first lets GoJS re-render the pulled positions, second zooms
      // using updated actualBounds — same pattern as useDiagramStructure's newLinks path.
      requestAnimationFrame(() => {
        const fromLoc = fromNode.location.copy();
        const toLoc = toNode.location.copy();
        const dist = Math.hypot(fromLoc.x - toLoc.x, fromLoc.y - toLoc.y);
        const idealDistance = 200;

        if (dist > idealDistance) {
          const angle = Math.atan2(toLoc.y - fromLoc.y, toLoc.x - fromLoc.x);
          const pull = (dist - idealDistance) * 0.4;

          fromNode.location = new go.Point(
            fromLoc.x + Math.cos(angle) * pull,
            fromLoc.y + Math.sin(angle) * pull,
          );
          toNode.location = new go.Point(
            toLoc.x - Math.cos(angle) * pull,
            toLoc.y - Math.sin(angle) * pull,
          );
        }
        requestAnimationFrame(() => zoomToNode(diagram, fromId));
      });

      isInternalChange.current = true;
      diagram.select(fromNode);
      isInternalChange.current = false;
      onSelectionChangeRef.current(fromId);
    });

    const model = new go.GraphLinksModel();

    model.nodeKeyProperty = "id";
    diagram.model = model;

    const overview = new go.Overview(overviewRef.current, { observed: diagram });

    (overview.box.elt(0) as go.Shape).stroke = colors.primary;
    (overview.box.elt(0) as go.Shape).strokeWidth = 2;
    overviewRef.current.style.background = "white";

    diagramRef.current = diagram;
    return () => {
      overview.div = null;
      diagram.div = null;
      diagramRef.current = null;
    };
  }, []);
}
