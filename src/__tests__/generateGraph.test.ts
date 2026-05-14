import { generateGraph } from "@/utils/generateGraph";

describe("generateGraph utility", () => {
  it("should generate the requested number of nodes", () => {
    // when
    const { nodes } = generateGraph(10);

    // then
    expect(nodes).toHaveLength(10);
  });

  it("should assign sequential ids starting from node-0", () => {
    // when
    const { nodes } = generateGraph(3);

    // then
    expect(nodes.map((node) => node.id)).toEqual(["node-0", "node-1", "node-2"]);
  });

  it('should set name to "Node {index}" for every node', () => {
    // when
    const { nodes } = generateGraph(3);

    // then
    expect(nodes.map((node) => node.name)).toEqual(["Node 0", "Node 1", "Node 2"]);
  });

  it('should set type to "Node" for every node', () => {
    // when
    const { nodes } = generateGraph(5);

    // then
    nodes.forEach((node) => expect(node.type).toBe("Node"));
  });

  it("should produce unique node ids", () => {
    // when
    const { nodes } = generateGraph(100);

    // then
    const ids = new Set(nodes.map((node) => node.id));

    expect(ids.size).toBe(100);
  });

  it("should create a chain of count-1 links", () => {
    // when
    const { links } = generateGraph(5);

    // then
    expect(links).toHaveLength(4);
  });

  it("should link each node to the next one in order", () => {
    // when
    const { links } = generateGraph(3);

    // then
    expect(links).toEqual([
      { from: "node-0", to: "node-1" },
      { from: "node-1", to: "node-2" },
    ]);
  });

  it("should return empty arrays when count is 0", () => {
    // when
    const { nodes, links } = generateGraph(0);

    // then
    expect(nodes).toHaveLength(0);
    expect(links).toHaveLength(0);
  });

  it("should return 1 node and no links when count is 1", () => {
    // when
    const { nodes, links } = generateGraph(1);

    // then
    expect(nodes).toHaveLength(1);
    expect(links).toHaveLength(0);
  });
});
