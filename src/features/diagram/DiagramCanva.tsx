import { memo } from "react";

import type { NodeData, LinkData } from "@/types/index";
import { colors, textures } from "@/theme/tokens";
import { useDiagram } from "./hooks/useDiagram";
import { DiagramOverlay } from "./DiagramOverlay";

type Props = {
  nodes: NodeData[];
  links: LinkData[];
  selectedNodeId: string | null;
  onSelectionChange: (id: string | null) => void;
  onAddLink: (from: string, to: string) => void;
};

function DiagramCanvas({ nodes, links, selectedNodeId, onSelectionChange, onAddLink }: Props) {
  const { divRef, overviewRef } = useDiagram({
    nodes,
    links,
    selectedNodeId,
    onSelectionChange,
    onAddLink,
  });

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        position: "relative",
        backgroundColor: colors.canvas,
        backgroundImage: textures.canvasDots,
        backgroundRepeat: "repeat",
      }}
    >
      <div
        ref={divRef}
        role="application"
        aria-label="Node graph diagram"
        style={{ width: "100%", height: "100%" }}
      />
      <DiagramOverlay nodeCount={nodes.length} linkCount={links.length} overviewRef={overviewRef} />
    </div>
  );
}

export default memo(DiagramCanvas);
