/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";

import NodeList from "./NodeList";
import type { NodeData } from "@/types";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  // jsdom does not implement scrollTo on DOM elements
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    value: jest.fn(),
    writable: true,
  });
});

const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
  { id: "node-2", name: "Gamma", type: "Node" },
];

describe("NodeList component", () => {
  describe("rendering", () => {
    it("should render all node names", () => {
      // given / when
      render(<NodeList nodes={NODES} selectedId={null} onSelect={jest.fn()} />);

      // then
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
      expect(screen.getByText("Gamma")).toBeInTheDocument();
    });

    it("should render no options when the node list is empty", () => {
      // given / when
      render(<NodeList nodes={[]} selectedId={null} onSelect={jest.fn()} />);

      // then
      expect(screen.queryByRole("option")).not.toBeInTheDocument();
    });

    it("should show the link count badge for nodes that have links", () => {
      // given
      const linkCountMap = new Map([["node-0", 3]]);

      // when
      render(
        <NodeList
          nodes={NODES}
          selectedId={null}
          onSelect={jest.fn()}
          linkCountMap={linkCountMap}
        />,
      );

      // then
      expect(screen.getByText("3 links")).toBeInTheDocument();
    });

    it("should use the singular form when a node has exactly one link", () => {
      // given
      const linkCountMap = new Map([["node-1", 1]]);

      // when
      render(
        <NodeList
          nodes={NODES}
          selectedId={null}
          onSelect={jest.fn()}
          linkCountMap={linkCountMap}
        />,
      );

      // then
      expect(screen.getByText("1 link")).toBeInTheDocument();
    });

    it("should not show a link badge when a node has no links", () => {
      // given / when
      render(
        <NodeList nodes={NODES} selectedId={null} onSelect={jest.fn()} linkCountMap={new Map()} />,
      );

      // then
      expect(screen.queryByText(/link/)).not.toBeInTheDocument();
    });
  });

  describe("selection state", () => {
    it("should set aria-selected to true on the selected node", () => {
      // given / when
      render(<NodeList nodes={NODES} selectedId="node-1" onSelect={jest.fn()} />);

      // then
      const options = screen.getAllByRole("option");
      const beta = options.find((o) => o.textContent?.includes("Beta"));

      expect(beta).toHaveAttribute("aria-selected", "true");
    });

    it("should set aria-selected to false on non-selected nodes", () => {
      // given / when
      render(<NodeList nodes={NODES} selectedId="node-1" onSelect={jest.fn()} />);

      // then
      const options = screen.getAllByRole("option");
      const alpha = options.find((o) => o.textContent?.includes("Alpha"));

      expect(alpha).toHaveAttribute("aria-selected", "false");
    });

    it("should expose correct position-in-set for each option", () => {
      // given / when
      render(<NodeList nodes={NODES} selectedId={null} onSelect={jest.fn()} />);

      // then
      const options = screen.getAllByRole("option");

      expect(options[0]).toHaveAttribute("aria-posinset", "1");
      expect(options[1]).toHaveAttribute("aria-posinset", "2");
      expect(options[2]).toHaveAttribute("aria-posinset", "3");
    });

    it("should expose the total node count as aria-setsize", () => {
      // given / when
      render(<NodeList nodes={NODES} selectedId={null} onSelect={jest.fn()} />);

      // then
      screen.getAllByRole("option").forEach((option) => {
        expect(option).toHaveAttribute("aria-setsize", "3");
      });
    });
  });

  describe("interaction", () => {
    it("should call onSelect with the node id when a row is clicked", () => {
      // given
      const onSelect = jest.fn();

      render(<NodeList nodes={NODES} selectedId={null} onSelect={onSelect} />);

      // when
      fireEvent.click(screen.getByText("Alpha"));

      // then
      expect(onSelect).toHaveBeenCalledWith("node-0");
    });

    it("should call onSelect when Enter is pressed on a row", () => {
      // given
      const onSelect = jest.fn();

      render(<NodeList nodes={NODES} selectedId={null} onSelect={onSelect} />);

      // when
      fireEvent.keyDown(screen.getAllByRole("option")[1], { key: "Enter" });

      // then
      expect(onSelect).toHaveBeenCalledWith("node-1");
    });

    it("should call onSelect when Space is pressed on a row", () => {
      // given
      const onSelect = jest.fn();

      render(<NodeList nodes={NODES} selectedId={null} onSelect={onSelect} />);

      // when
      fireEvent.keyDown(screen.getAllByRole("option")[2], { key: " " });

      // then
      expect(onSelect).toHaveBeenCalledWith("node-2");
    });

    it("should not call onSelect for other key presses", () => {
      // given
      const onSelect = jest.fn();

      render(<NodeList nodes={NODES} selectedId={null} onSelect={onSelect} />);

      // when
      fireEvent.keyDown(screen.getAllByRole("option")[0], { key: "ArrowDown" });

      // then
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
