import { useState, useCallback, useTransition, useRef } from "react";

import type { NodeData, LinkData } from "@/types";
import { generateGraph } from "@/utils/generateGraph";
import { canAddLink } from "@/utils/canAddLink";

const { nodes: INITIAL_NODES, links: INITIAL_LINKS } = generateGraph(1000);

export function useGraphState() {
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [links, setLinks] = useState<LinkData[]>(INITIAL_LINKS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [lastAddedNodeId, setLastAddedNodeId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const nodeCounterRef = useRef(INITIAL_NODES.length);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const addNode = useCallback(() => {
    const index = nodeCounterRef.current++;
    const id = `node-${index}`;

    setNodes((prev) => [...prev, { id, name: `Node ${index}`, type: "Node" }]);
    setSelectedNodeId(id);
    setLastAddedNodeId(id);
  }, []);

  const addLink = useCallback((from: string, to: string) => {
    setLinks((prev) => {
      if (!canAddLink(from, to, prev)) return prev;

      return [...prev, { from, to }];
    });
  }, []);

  const updateNodeName = useCallback((id: string, name: string) => {
    startTransition(() => {
      setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, name } : node)));
    });
  }, []);

  return {
    nodes,
    links,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    addNode,
    addLink,
    updateNodeName,
    lastAddedNodeId,
  };
}
