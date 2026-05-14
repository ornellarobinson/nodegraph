import type { NodeData, LinkData } from "@/types";

export function getConnectedNodes(
  nodeId: string,
  links: LinkData[],
  nodes: NodeData[],
): NodeData[] {
  return links
    .filter((link) => link.from === nodeId || link.to === nodeId)
    .map((link) => {
      const otherId = link.from === nodeId ? link.to : link.from;

      return nodes.find((node) => node.id === otherId);
    })
    .filter((node): node is NodeData => node !== undefined);
}
