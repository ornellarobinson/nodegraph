import type { NodeData, LinkData, Graph } from "@/types";

export function generateGraph(count: number): Graph {
  const nodes: NodeData[] = Array.from({ length: count }, (_, index) => ({
    id: `node-${index}`,
    name: `Node ${index}`,
    type: "Node",
  }));

  const links: LinkData[] = nodes.slice(1).map((node, index) => ({
    from: nodes[index].id,
    to: node.id,
  }));

  return { nodes, links };
}
