import { useRef } from "react";
import * as go from "gojs";

import type { NodeData, LinkData } from "@/types/index";
import { useDiagramInit } from "./useDiagramInit";
import { useDiagramStructure } from "./useDiagramStructure";
import { useDiagramNames } from "./useDiagramNames";
import { useDiagramSelection } from "./useDiagramSelection";

type UseDiagramProps = {
  nodes: NodeData[];
  links: LinkData[];
  selectedNodeId: string | null;
  onSelectionChange: (id: string | null) => void;
  onAddLink: (from: string, to: string) => void;
};

type UseDiagramReturn = {
  divRef: React.RefObject<HTMLDivElement | null>;
  overviewRef: React.RefObject<HTMLDivElement | null>;
};

export function useDiagram({
  nodes,
  links,
  selectedNodeId,
  onSelectionChange,
  onAddLink,
}: UseDiagramProps): UseDiagramReturn {
  const divRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<go.Diagram | null>(null);
  const isInternalChange = useRef(false);
  const nameMapRef = useRef<Map<string, string>>(new Map());
  const lastAddedNodeIdRef = useRef<string | null>(null);

  useDiagramInit({
    divRef,
    overviewRef,
    diagramRef,
    isInternalChange,
    onSelectionChange,
    onAddLink,
  });
  useDiagramStructure({ nodes, links, diagramRef, nameMapRef, lastAddedNodeIdRef });
  useDiagramNames({ nodes, diagramRef, nameMapRef });
  useDiagramSelection({ selectedNodeId, diagramRef, isInternalChange, linksLength: links.length });

  return { divRef, overviewRef };
}
