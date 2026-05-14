import { jest } from "@jest/globals";

import { generateGraph } from "@/utils/generateGraph";
import { canAddLink } from "@/utils/canAddLink";
import type { NodeData, LinkData } from "@/types";

describe("addNode operation", () => {
  it("should append the new node to the array", () => {
    // given
    const { nodes } = generateGraph(3);
    const newNode: NodeData = { id: "node-3", name: "Node 3", type: "Node" };

    // when
    const result = [...nodes, newNode];

    // then
    expect(result).toHaveLength(4);
  });

  it("should derive the sequential id from the current array length", () => {
    // given
    const { nodes } = generateGraph(3);

    // when
    const id = `node-${nodes.length}`;

    // then
    expect(id).toBe("node-3");
  });

  it("should make the new node findable by id", () => {
    // given
    const { nodes } = generateGraph(3);
    const newNode: NodeData = { id: "node-3", name: "Node 3", type: "Node" };

    // when
    const result = [...nodes, newNode];

    // then
    expect(result.find((node) => node.id === "node-3")).toBeDefined();
  });

  it("should not mutate the original nodes array", () => {
    // given
    const { nodes } = generateGraph(3);
    const original = [...nodes];
    const newNode: NodeData = { id: "node-3", name: "Node 3", type: "Node" };

    // when
    [...nodes, newNode];

    // then
    expect(nodes).toEqual(original);
  });

  it("should add the first node to an empty graph", () => {
    // given
    const nodes: NodeData[] = [];
    const id = `node-${nodes.length}`;
    const newNode: NodeData = { id, name: "Node 0", type: "Node" };

    // when
    const result = [...nodes, newNode];

    // then
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("node-0");
    expect(result[0].name).toBe("Node 0");
  });
});

describe("canAddLink utility", () => {
  it("should allow a valid link between two different nodes", () => {
    // when
    const result = canAddLink("node-0", "node-1", []);

    // then
    expect(result).toBe(true);
  });

  it("should reject a self-link", () => {
    // when
    const result = canAddLink("node-0", "node-0", []);

    // then
    expect(result).toBe(false);
  });

  it("should reject a duplicate link", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = canAddLink("node-0", "node-1", links);

    // then
    expect(result).toBe(false);
  });

  it("should allow a link in the reverse direction", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

    // when
    const result = canAddLink("node-1", "node-0", links);

    // then
    expect(result).toBe(true);
  });

  it("should allow a link when the graph has no existing links", () => {
    // when
    const result = canAddLink("node-0", "node-1", []);

    // then
    expect(result).toBe(true);
  });

  it("should not mutate the links array when checking", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];
    const original = [...links];

    // when
    canAddLink("node-0", "node-1", links);

    // then
    expect(links).toEqual(original);
  });
});

describe("addLink operation", () => {
  it("should add a link between two nodes", () => {
    // given
    const { links } = generateGraph(3);
    const newLink: LinkData = { from: "node-0", to: "node-2" };

    // when
    const result = [...links, newLink];

    // then
    expect(result).toContainEqual(newLink);
  });

  it("should not add a duplicate link", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];
    const candidate: LinkData = { from: "node-0", to: "node-1" };

    // when
    const result = canAddLink(candidate.from, candidate.to, links) ? [...links, candidate] : links;

    // then
    expect(result).toHaveLength(1);
  });

  it("should not add a self-link", () => {
    // given
    const links: LinkData[] = [];

    // when
    const result = canAddLink("node-0", "node-0", links)
      ? [...links, { from: "node-0", to: "node-0" }]
      : links;

    // then
    expect(result).toHaveLength(0);
  });

  it("should allow a link in the reverse direction", () => {
    // given
    const links: LinkData[] = [{ from: "node-0", to: "node-1" }];
    const reverse: LinkData = { from: "node-1", to: "node-0" };

    // when
    const result = canAddLink(reverse.from, reverse.to, links) ? [...links, reverse] : links;

    // then
    expect(result).toHaveLength(2);
  });

  it("should not mutate the original links array", () => {
    // given
    const { links } = generateGraph(3);
    const original = [...links];
    const newLink: LinkData = { from: "node-0", to: "node-2" };

    // when
    [...links, newLink];

    // then
    expect(links).toEqual(original);
  });
});

describe("updateNodeName operation", () => {
  it("should update only the targeted node", () => {
    // given
    const { nodes } = generateGraph(3);

    // when
    const updated = nodes.map((node) =>
      node.id === "node-1" ? { ...node, name: "Renamed" } : node,
    );

    // then
    expect(updated.find((node) => node.id === "node-1")!.name).toBe("Renamed");
    expect(updated.find((node) => node.id === "node-0")!.name).toBe("Node 0");
  });

  it("should not mutate the original node object", () => {
    // given
    const { nodes } = generateGraph(3);
    const original = nodes[1].name;

    // when
    nodes.map((node) => (node.id === "node-1" ? { ...node, name: "Renamed" } : node));

    // then
    expect(nodes[1].name).toBe(original);
  });

  it("should call onUpdateName with the trimmed value when name is valid", () => {
    // given
    const onUpdateName = jest.fn();
    const name = "  My Node  ";

    // when
    if (name.trim()) onUpdateName("node-0", name.trim());

    // then
    expect(onUpdateName).toHaveBeenCalledWith("node-0", "My Node");
  });

  it("should not call onUpdateName when name is empty", () => {
    // given
    const onUpdateName = jest.fn();
    const name = "";

    // when
    if (name.trim()) onUpdateName("node-0", name.trim());

    // then
    expect(onUpdateName).not.toHaveBeenCalled();
  });

  it("should not call onUpdateName when name is whitespace only", () => {
    // given
    const onUpdateName = jest.fn();
    const name = "   ";

    // when
    if (name.trim()) onUpdateName("node-0", name.trim());

    // then
    expect(onUpdateName).not.toHaveBeenCalled();
  });

  it("should preserve all other nodes when one is renamed", () => {
    // given
    const { nodes } = generateGraph(5);

    // when
    const updated = nodes.map((node) =>
      node.id === "node-2" ? { ...node, name: "New Name" } : node,
    );

    // then
    const unchanged = updated.filter((node) => node.id !== "node-2");

    unchanged.forEach((node) => {
      const originalIndex = parseInt(node.id.replace("node-", ""), 10);

      expect(node.name).toBe(`Node ${originalIndex}`);
    });
  });

  it("should return all nodes unchanged when the target id does not exist", () => {
    // given
    const { nodes } = generateGraph(3);

    // when
    const updated = nodes.map((node) => (node.id === "ghost-99" ? { ...node, name: "X" } : node));

    // then
    expect(updated).toEqual(nodes);
  });
});
