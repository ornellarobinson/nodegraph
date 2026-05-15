import { getLinkableNodes } from "@/utils/getLinkableNodes";
import type { NodeData, LinkData } from "@/types";

const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
  { id: "node-2", name: "Gamma", type: "Node" },
  { id: "node-3", name: "Delta", type: "Node" },
];

describe("getLinkableNodes utility", () => {
  it("should exclude the current node from the results", () => {
    // given / when
    const result = getLinkableNodes("node-0", NODES, []);

    // then
    expect(result.find((node) => node.id === "node-0")).toBeUndefined();
  });

  it("should return all other nodes when there are no links", () => {
    // given / when
    const result = getLinkableNodes("node-0", NODES, []);

    // then
    expect(result).toHaveLength(3);
  });

  it("should exclude a node already connected in the from direction", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = getLinkableNodes("node-0", NODES, links);

    // then
    expect(result.find((node) => node.id === "node-1")).toBeUndefined();
  });

  it("should exclude a node already connected in the reverse direction", () => {
    // given
    const links: LinkData[] = [{ from: "node-1", to: "node-0" }];

    // when
    const result = getLinkableNodes("node-0", NODES, links);

    // then
    expect(result.find((node) => node.id === "node-1")).toBeUndefined();
  });

  it("should return unconnected nodes when some links exist", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = getLinkableNodes("node-0", NODES, links);

    // then
    expect(result.find((node) => node.id === "node-2")).toBeDefined();
    expect(result.find((node) => node.id === "node-3")).toBeDefined();
  });

  it("should return an empty array when all other nodes are already connected", () => {
    // given
    const links: LinkData[] = [
      { from: "node-0", to: "node-1" },
      { from: "node-0", to: "node-2" },
      { from: "node-3", to: "node-0" },
    ];

    // when
    const result = getLinkableNodes("node-0", NODES, links);

    // then
    expect(result).toHaveLength(0);
  });

  it("should return an empty array when there are no nodes", () => {
    // given / when
    const result = getLinkableNodes("node-0", [], []);

    // then
    expect(result).toHaveLength(0);
  });
});
