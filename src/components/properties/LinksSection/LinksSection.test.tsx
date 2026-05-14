/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";

import LinksSection from "./LinksSection";
import type { NodeData, LinkData } from "@/types";

const NODE: NodeData = { id: "node-0", name: "Alpha", type: "Node" };

const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
  { id: "node-2", name: "Gamma", type: "Node" },
];

describe("LinksSection component", () => {
  describe("connected nodes list", () => {
    it('should show "No links yet." when the node has no connections', () => {
      // given / when
      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={[]}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      // then
      expect(screen.getByText("No links yet.")).toBeInTheDocument();
    });

    it("should render each connected node by name", () => {
      // given
      const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

      // when
      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={links}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      // then
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    it("should show the correct link count in the section header", () => {
      // given
      const links: LinkData[] = [
        { from: "node-0", to: "node-1" },
        { from: "node-2", to: "node-0" },
      ];

      // when
      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={links}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      // then
      expect(screen.getByText("Links (2)")).toBeInTheDocument();
    });

    it("should call onSelect when a connected node is clicked", () => {
      // given
      const onSelect = jest.fn();
      const links: LinkData[] = [{ from: "node-0", to: "node-1" }];

      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={links}
          onAddLink={jest.fn()}
          onSelect={onSelect}
        />,
      );

      // when
      fireEvent.click(screen.getByText("Beta"));

      // then
      expect(onSelect).toHaveBeenCalledWith("node-1");
    });
  });

  describe("create link button", () => {
    it("should be disabled when no target node is selected", () => {
      // given / when
      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={[]}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      // then
      expect(screen.getByRole("button", { name: "Create link" })).toBeDisabled();
    });

    it("should not call onAddLink when button is disabled", () => {
      // given
      const onAddLink = jest.fn();

      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={[]}
          onAddLink={onAddLink}
          onSelect={jest.fn()}
        />,
      );

      // when
      fireEvent.click(screen.getByRole("button", { name: "Create link" }));

      // then
      expect(onAddLink).not.toHaveBeenCalled();
    });

    it("should call onAddLink with the correct ids when a target is selected and Create link is clicked", () => {
      // given
      const onAddLink = jest.fn();

      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={[]}
          onAddLink={onAddLink}
          onSelect={jest.fn()}
        />,
      );

      // when — open the autocomplete and pick Beta
      fireEvent.mouseDown(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("Beta"));
      fireEvent.click(screen.getByRole("button", { name: "Create link" }));

      // then
      expect(onAddLink).toHaveBeenCalledWith("node-0", "node-1");
    });

    it("should clear the autocomplete after creating a link", () => {
      // given
      render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={[]}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      fireEvent.mouseDown(screen.getByRole("combobox"));
      fireEvent.click(screen.getByText("Beta"));

      // when
      fireEvent.click(screen.getByRole("button", { name: "Create link" }));

      // then — button goes back to disabled (no target selected)
      expect(screen.getByRole("button", { name: "Create link" })).toBeDisabled();
    });
  });

  describe("node switch", () => {
    it("should show the correct connections after switching to a different node", () => {
      // given
      const links: LinkData[] = [
        { from: "node-0", to: "node-1" },
        { from: "node-1", to: "node-2" },
      ];

      const { rerender } = render(
        <LinksSection
          node={NODE}
          nodes={NODES}
          links={links}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      const nodeOne: NodeData = { id: "node-1", name: "Beta", type: "Node" };

      // when
      rerender(
        <LinksSection
          node={nodeOne}
          nodes={NODES}
          links={links}
          onAddLink={jest.fn()}
          onSelect={jest.fn()}
        />,
      );

      // then
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Gamma")).toBeInTheDocument();
    });
  });
});
