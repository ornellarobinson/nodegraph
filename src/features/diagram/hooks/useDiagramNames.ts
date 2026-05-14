import { useEffect } from "react";

import * as go from "gojs";

import type { NodeData } from "@/types/index";

type Props = {
  nodes: NodeData[];
  diagramRef: React.MutableRefObject<go.Diagram | null>;
  nameMapRef: React.MutableRefObject<Map<string, string>>;
};

export function useDiagramNames({ nodes, diagramRef, nameMapRef }: Props): void {
  useEffect(() => {
    const diagram = diagramRef.current;

    if (!diagram) return;

    const changed = nodes.filter((node) => nameMapRef.current.get(node.id) !== node.name);

    if (changed.length === 0) return;

    diagram.model.commit((m) => {
      const gm = m as go.GraphLinksModel;

      changed.forEach((node) => {
        const data = gm.findNodeDataForKey(node.id);

        if (data) gm.setDataProperty(data, "name", node.name);
      });
    }, null);

    changed.forEach((node) => nameMapRef.current.set(node.id, node.name));
  }, [nodes]);
}
