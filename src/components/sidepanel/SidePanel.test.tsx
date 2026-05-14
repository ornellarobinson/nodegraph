/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";

import SidePanel from "./SidePanel";
import type { NodeData, LinkData } from "@/types";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
  { id: "node-2", name: "Gamma", type: "Node" },
];

describe("SidePanel component", () => {
  describe("header", () => {
    it("should display the section label", () => {
      // given / when
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // then
      expect(screen.getByText("Nodes")).toBeInTheDocument();
    });

    it("should display the count as visible-of-total", () => {
      // given / when
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // then
      expect(screen.getByText("3 of 3")).toBeInTheDocument();
    });
  });

  describe("node list", () => {
    it("should render each node name", () => {
      // given / when
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // then
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
      expect(screen.getByText("Gamma")).toBeInTheDocument();
    });

    it("should call onSelect with the node id when a row is clicked", () => {
      // given
      const onSelect = jest.fn();

      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={onSelect} />);

      // when
      fireEvent.click(screen.getByText("Beta"));

      // then
      expect(onSelect).toHaveBeenCalledWith("node-1");
    });

    it("should show the link count for nodes that have links", () => {
      // given
      const links: LinkData[] = [
        { from: "node-0", to: "node-1" },
        { from: "node-0", to: "node-2" },
      ];

      // when
      render(<SidePanel nodes={NODES} links={links} selectedNodeId={null} onSelect={jest.fn()} />);

      // then — node-0 appears in both links so count = 2
      expect(screen.getByText("2 links")).toBeInTheDocument();
    });

    it('should show singular "link" when a node has exactly one link', () => {
      // given
      const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

      // when
      render(<SidePanel nodes={NODES} links={links} selectedNodeId={null} onSelect={jest.fn()} />);

      // then
      expect(screen.getAllByText("1 link")).toHaveLength(2); // node-0 and node-1 each have 1
    });
  });

  describe("search", () => {
    it("should filter nodes by name", () => {
      // given
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // when
      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "Alpha" } });

      // then
      expect(screen.getByText("1 of 3")).toBeInTheDocument();
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    });

    it("should filter nodes by id", () => {
      // given
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // when
      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "node-2" } });

      // then
      expect(screen.getByText("Gamma")).toBeInTheDocument();
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    });

    it("should be case-insensitive", () => {
      // given
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // when
      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "ALPHA" } });

      // then
      expect(screen.getByText("Alpha")).toBeInTheDocument();
    });

    it("should update the count to match filtered results", () => {
      // given — 'er' appears in Server and Service but not Client
      const nodes: NodeData[] = [
        { id: "node-0", name: "Server", type: "Node" },
        { id: "node-1", name: "Client", type: "Node" },
        { id: "node-2", name: "Service", type: "Node" },
      ];

      render(<SidePanel nodes={nodes} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // when
      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "er" } });

      // then
      expect(screen.getByText("2 of 3")).toBeInTheDocument();
    });

    it("should show the empty state when no nodes match", () => {
      // given
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      // when
      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "zzz" } });

      // then
      expect(screen.getByText("No node found.")).toBeInTheDocument();
    });

    it("should restore all nodes when the search is cleared", () => {
      // given
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);
      const input = screen.getByPlaceholderText(/search/i);

      fireEvent.change(input, { target: { value: "Alpha" } });

      // when
      fireEvent.change(input, { target: { value: "" } });

      // then
      expect(screen.getByText("3 of 3")).toBeInTheDocument();
    });

    it("should clear the search and restore all nodes when the clear button is clicked", () => {
      // given
      render(<SidePanel nodes={NODES} links={[]} selectedNodeId={null} onSelect={jest.fn()} />);

      fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: "Alpha" } });

      expect(screen.getByText("1 of 3")).toBeInTheDocument();

      // when
      fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

      // then
      expect(screen.getByText("3 of 3")).toBeInTheDocument();
    });
  });
});
