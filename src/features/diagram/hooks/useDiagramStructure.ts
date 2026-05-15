import { useEffect } from "react";

import * as go from "gojs";

import type { NodeData, LinkData } from "@/types/index";
import { findFreePosition, zoomToNode } from "../utils/diagramLayout";

type Props = {
  nodes: NodeData[];
  links: LinkData[];
  diagramRef: React.MutableRefObject<go.Diagram | null>;
  nameMapRef: React.MutableRefObject<Map<string, string>>;
  lastAddedNodeIdRef: React.MutableRefObject<string | null>;
  isDiagramReady: boolean;
};

export function useDiagramStructure({
  nodes,
  links,
  diagramRef,
  nameMapRef,
  lastAddedNodeIdRef,
  isDiagramReady,
}: Props): void {
  useEffect(() => {
    const diagram = diagramRef.current;

    if (!diagram) return;

    const model = diagram.model as go.GraphLinksModel;
    const existingNodeKeys = new Set((model.nodeDataArray as NodeData[]).map((data) => data.id));
    const newNodes = nodes.filter((node) => !existingNodeKeys.has(node.id));

    const existingLinkKeys = new Set(
      model.linkDataArray.map((data: go.ObjectData) => `${data["from"]}->${data["to"]}`),
    );
    const newLinks = links.filter((link) => !existingLinkKeys.has(`${link.from}->${link.to}`));

    model.commit((gm) => {
      const graphModel = gm as go.GraphLinksModel;

      const currentNodeKeys = new Set(nodes.map((node) => node.id));

      graphModel.nodeDataArray.slice().forEach((data) => {
        const node = data as NodeData;
        if (!currentNodeKeys.has(node.id)) graphModel.removeNodeData(data);
      });
      newNodes.forEach((node) => graphModel.addNodeData({ ...node }));

      const currentLinkSet = new Set(links.map((link) => `${link.from}->${link.to}`));

      graphModel.linkDataArray.slice().forEach((data: go.ObjectData) => {
        if (!currentLinkSet.has(`${data["from"]}->${data["to"]}`)) graphModel.removeLinkData(data);
      });

      const syncedLinkSet = new Set(
        graphModel.linkDataArray.map((data: go.ObjectData) => `${data["from"]}->${data["to"]}`),
      );

      links.forEach((link) => {
        if (!syncedLinkSet.has(`${link.from}->${link.to}`))
          graphModel.addLinkData({ from: link.from, to: link.to });
      });
    }, null);

    if (newNodes.length > 0 && existingNodeKeys.size > 0) {
      lastAddedNodeIdRef.current = newNodes[newNodes.length - 1].id;
      requestAnimationFrame(() => {
        newNodes.forEach((node) => {
          const gojsNode = diagram.findNodeForKey(node.id);

          if (gojsNode)
            gojsNode.location = findFreePosition(diagram, diagram.viewportBounds.center);
        });
      });
    }

    if (newLinks.length > 0) {
      const lastId = lastAddedNodeIdRef.current;

      requestAnimationFrame(() => {
        newLinks.forEach((link) => {
          const fromNode = diagram.findNodeForKey(link.from);
          const toNode = diagram.findNodeForKey(link.to);

          if (!fromNode || !toNode) return;

          const fromLoc = fromNode.location.copy();
          const toLoc = toNode.location.copy();
          const dist = Math.hypot(fromLoc.x - toLoc.x, fromLoc.y - toLoc.y);
          const idealDistance = 200;

          if (dist <= idealDistance) return;

          const isNewNodeLink = link.from === lastId || link.to === lastId;

          if (isNewNodeLink) {
            lastAddedNodeIdRef.current = null;

            const anchorId = link.from === lastId ? link.to : link.from;
            const anchorNode = diagram.findNodeForKey(anchorId);

            if (!anchorNode) return;

            const anchorLoc = anchorNode.location;
            const targetNode = diagram.findNodeForKey(lastId!);

            if (targetNode) targetNode.location = new go.Point(anchorLoc.x + 160, anchorLoc.y + 80);
            requestAnimationFrame(() => zoomToNode(diagram, lastId!));
          } else {
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
            requestAnimationFrame(() => zoomToNode(diagram, link.from));
          }
        });
      });
    }

    nodes.forEach((node) => nameMapRef.current.set(node.id, node.name));

    if (existingNodeKeys.size === 0 && nodes.length > 0) {
      diagram.layoutDiagram(true);
      diagram.layout.isOngoing = false;
      diagram.zoomToFit();
    }
  }, [nodes.length, links.length, isDiagramReady]);
}
