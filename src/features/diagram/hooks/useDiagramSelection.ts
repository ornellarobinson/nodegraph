import { useEffect, useRef } from "react";

import * as go from "gojs";

import type { NodeData } from "@/types/index";
import { zoomToNode } from "../utils/diagramLayout";

type Props = {
  selectedNodeId: string | null;
  diagramRef: React.MutableRefObject<go.Diagram | null>;
  isInternalChange: React.MutableRefObject<boolean>;
  linksLength: number;
};

export function useDiagramSelection({
  selectedNodeId,
  diagramRef,
  isInternalChange,
  linksLength,
}: Props): void {
  const prevSelectedNodeIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const diagram = diagramRef.current;

    if (!diagram) return;

    // Only run select/zoom/clearSelection when the selected node actually changed,
    // not when the effect re-runs purely because linksLength changed.
    const selectionChanged = selectedNodeId !== prevSelectedNodeIdRef.current;

    prevSelectedNodeIdRef.current = selectedNodeId;

    isInternalChange.current = true;

    if (selectionChanged) diagram.clearSelection();

    // Collect IDs of nodes directly connected to the selection so they stay at full opacity.
    const connectedNodeIds = new Set<string>();

    diagram.links.each((link) => {
      const fromId = (link.fromNode?.data as NodeData)?.id;
      const toId = (link.toNode?.data as NodeData)?.id;
      const isHighlighted = !!(
        selectedNodeId &&
        (fromId === selectedNodeId || toId === selectedNodeId)
      );

      link.isHighlighted = isHighlighted;
      link.layerName = isHighlighted ? "Foreground" : "";
      link.opacity = !selectedNodeId || isHighlighted ? 1.0 : 0.25;

      if (isHighlighted) {
        if (fromId) connectedNodeIds.add(fromId);
        if (toId) connectedNodeIds.add(toId);
      }
    });

    diagram.nodes.each((node) => {
      const nodeId = (node.data as NodeData)?.id;
      const isSelected = nodeId === selectedNodeId;
      const isConnected = connectedNodeIds.has(nodeId);

      node.layerName = isSelected ? "Foreground" : "";
      node.opacity = !selectedNodeId || isSelected || isConnected ? 1.0 : 0.6;
    });

    if (selectedNodeId && selectionChanged) {
      const node = diagram.findNodeForKey(selectedNodeId);

      if (node) {
        diagram.select(node);
        requestAnimationFrame(() => zoomToNode(diagram, selectedNodeId, 400));
      }
    }

    isInternalChange.current = false;
  }, [selectedNodeId, linksLength]);
}
