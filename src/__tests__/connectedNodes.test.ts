import { getConnectedNodes } from "@/utils/getConnectedNodes";
import type { NodeData, LinkData } from "@/types";

const NODES: NodeData[] = [
  { id: "node-0", name: "A", type: "Node" },
  { id: "node-1", name: "B", type: "Node" },
  { id: "node-2", name: "C", type: "Node" },
  { id: "node-3", name: "D", type: "Node" },
];

describe("getConnectedNodes utility", () => {
  it("should return an empty array when the node has no links", () => {
    // given
    const links: LinkData[] = [];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result).toHaveLength(0);
  });

  it("should return nodes connected via outgoing links", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("node-1");
  });

  it("should return nodes connected via incoming links", () => {
    // given
    const links: LinkData[] = [{ from: "node-1", to: "node-0" }];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("node-1");
  });

  it("should return nodes connected in both directions", () => {
    // given
    const links: LinkData[] = [
      { from: "node-0", to: "node-1" },
      { from: "node-2", to: "node-0" },
    ];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    const ids = result.map((node) => node.id);

    expect(ids).toContain("node-1");
    expect(ids).toContain("node-2");
  });

  it("should not include the node itself in the result", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result.find((node) => node.id === "node-0")).toBeUndefined();
  });

  it("should return multiple connected nodes", () => {
    // given
    const links: LinkData[] = [
      { from: "node-0", to: "node-1" },
      { from: "node-0", to: "node-2" },
      { from: "node-3", to: "node-0" },
    ];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result).toHaveLength(3);
  });

  it("should ignore links that do not involve the node", () => {
    // given
    const links: LinkData[] = [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
    ];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result).toHaveLength(0);
  });

  it("should skip links that reference non-existent node ids", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "ghost-99" }];

    // when
    const result = getConnectedNodes("node-0", links, NODES);

    // then
    expect(result).toHaveLength(0);
  });

  it("should select the correct neighbor when clicking a linked node to navigate", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = getConnectedNodes("node-0", links, NODES);
    const neighbor = result[0];

    // then
    expect(neighbor.id).toBe("node-1");
    expect(neighbor.name).toBe("B");
  });
});
