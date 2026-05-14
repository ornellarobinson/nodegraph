import type { NodeData } from "./Node.types";
import type { LinkData } from "./Link.types";

export type Graph = {
  nodes: NodeData[];
  links: LinkData[];
};
