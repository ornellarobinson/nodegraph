import type { NodeData, LinkData } from "@/types";

export function getLinkableNodes(nodeId: string, nodes: NodeData[], links: LinkData[]): NodeData[] {
  return nodes.filter(
    (other) =>
      other.id !== nodeId &&
      !links.some(
        (link) =>
          (link.from === nodeId && link.to === other.id) ||
          (link.from === other.id && link.to === nodeId),
      ),
  );
}
