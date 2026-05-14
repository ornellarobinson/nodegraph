import type { NodeData } from "@/types";

export function filterNodes(nodes: NodeData[], search: string): NodeData[] {
  const query = search.trim().toLowerCase();

  return !query
    ? nodes
    : nodes.filter(
        (node) => node.name.toLowerCase().includes(query) || node.id.toLowerCase().includes(query),
      );
}
