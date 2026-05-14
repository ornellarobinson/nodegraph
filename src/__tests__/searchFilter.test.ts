import { filterNodes } from "@/utils/filterNodes";
import type { NodeData } from "@/types";

const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
  { id: "node-2", name: "Gamma", type: "Node" },
  { id: "node-3", name: "Delta", type: "Node" },
];

describe("filterNodes utility", () => {
  it("should return all nodes when search is empty", () => {
    // when
    const result = filterNodes(NODES, "");

    // then
    expect(result).toHaveLength(4);
  });

  it("should return all nodes when search is whitespace only", () => {
    // when
    const result = filterNodes(NODES, "   ");

    // then
    expect(result).toHaveLength(4);
  });

  it("should filter nodes by name (case-insensitive)", () => {
    // when
    const result = filterNodes(NODES, "ALPHA");

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("node-0");
  });

  it("should filter nodes by id", () => {
    // when
    const result = filterNodes(NODES, "node-2");

    // then
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Gamma");
  });

  it("should return multiple matches when several nodes share a name substring", () => {
    // given
    const nodes: NodeData[] = [
      { id: "abc-0", name: "Server Alpha", type: "Node" },
      { id: "abc-1", name: "Server Beta", type: "Node" },
      { id: "abc-2", name: "Client", type: "Node" },
    ];

    // when
    const result = filterNodes(nodes, "server");

    // then
    expect(result).toHaveLength(2);
  });

  it("should return an empty array when no nodes match", () => {
    // when
    const result = filterNodes(NODES, "zzz");

    // then
    expect(result).toHaveLength(0);
  });

  it("should trim the search string before filtering", () => {
    // when
    const result = filterNodes(NODES, "  alpha  ");

    // then
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alpha");
  });

  it("should match partial names", () => {
    // when
    const result = filterNodes(NODES, "elt");

    // then
    expect(result[0].name).toBe("Delta");
  });

  it("should match partial ids", () => {
    // when
    const result = filterNodes(NODES, "node-");

    // then
    expect(result).toHaveLength(4);
  });
});
