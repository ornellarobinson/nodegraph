/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";

import IdentitySection from "./IdentitySection";
import type { NodeData } from "@/types";

const NODE: NodeData = { id: "node-0", name: "Alpha", type: "Node" };
const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
];

describe("IdentitySection component", () => {
  describe("rendering", () => {
    it("should display the node name in the input", () => {
      // given / when
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      // then
      expect(screen.getByDisplayValue("Alpha")).toBeInTheDocument();
    });

    it("should display the node id as read-only", () => {
      // given / when
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      // then
      expect(screen.getByText("node-0")).toBeInTheDocument();
    });

    it("should display the character count helper text", () => {
      // given / when
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      // then
      expect(screen.getByText("5/25")).toBeInTheDocument();
    });
  });

  describe("name update", () => {
    it("should call onUpdateName with the trimmed value on valid input", () => {
      // given
      const onUpdateName = jest.fn();

      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={onUpdateName} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "  Gamma  " } });

      // then
      expect(onUpdateName).toHaveBeenCalledWith("node-0", "Gamma");
    });

    it("should not call onUpdateName when input is cleared", () => {
      // given
      const onUpdateName = jest.fn();

      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={onUpdateName} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "" } });

      // then
      expect(onUpdateName).not.toHaveBeenCalled();
    });

    it("should not call onUpdateName when input is whitespace only", () => {
      // given
      const onUpdateName = jest.fn();

      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={onUpdateName} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "   " } });

      // then
      expect(onUpdateName).not.toHaveBeenCalled();
    });

    it("should restore the original name on blur when input is empty", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      fireEvent.change(input, { target: { value: "" } });

      // when
      fireEvent.blur(input);

      // then
      expect(screen.getByDisplayValue("Alpha")).toBeInTheDocument();
    });
  });

  describe("validation feedback", () => {
    it("should show an error when the name is empty", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "" } });

      // then
      expect(screen.getByText("Name can't be empty.")).toBeInTheDocument();
    });

    it("should show an error when the name hits the 25-character limit", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "A".repeat(25) } });

      // then
      expect(screen.getByText("Max 25 characters reached.")).toBeInTheDocument();
    });

    it("should update the character count as the user types", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "Hello" } });

      // then
      expect(screen.getByText("5/25")).toBeInTheDocument();
    });
  });

  describe("duplicate name warning", () => {
    it("should show a warning when the name matches another node", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when — type the name of an existing node
      fireEvent.change(input, { target: { value: "Beta" } });

      // then
      expect(screen.getByText("Another node already uses this name.")).toBeInTheDocument();
    });

    it("should show a warning for case-insensitive duplicate names", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "BETA" } });

      // then
      expect(screen.getByText("Another node already uses this name.")).toBeInTheDocument();
    });

    it("should not show a warning when the name is unique", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.change(input, { target: { value: "Gamma" } });

      // then
      expect(screen.queryByText("Another node already uses this name.")).not.toBeInTheDocument();
    });

    it("should not show a warning when the name matches the node itself", () => {
      // given / when — node keeps its own name, no warning expected
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      // then
      expect(screen.queryByText("Another node already uses this name.")).not.toBeInTheDocument();
    });

    it("should not show the duplicate warning when the name is also invalid", () => {
      // given
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when — empty name is invalid, warning should be suppressed
      fireEvent.change(input, { target: { value: "" } });

      // then
      expect(screen.queryByText("Another node already uses this name.")).not.toBeInTheDocument();
    });
  });

  describe("autofocus", () => {
    it("should focus the name input on mount when autoFocus is true", () => {
      // given / when
      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} autoFocus />);

      // then
      expect(screen.getByDisplayValue("Alpha")).toHaveFocus();
    });

    it("should select all text when the name input is focused", () => {
      // given
      const selectSpy = jest.spyOn(HTMLInputElement.prototype, "select");

      render(<IdentitySection node={NODE} nodes={NODES} onUpdateName={jest.fn()} />);

      const input = screen.getByDisplayValue("Alpha");

      // when
      fireEvent.focus(input);

      // then
      expect(selectSpy).toHaveBeenCalled();

      selectSpy.mockRestore();
    });
  });

  describe("node switch", () => {
    it("should display the new node name when remounted with a different key", () => {
      // given — PropertiesPanel passes key={node.id} so switching nodes unmounts/remounts
      const { rerender } = render(
        <IdentitySection key="node-0" node={NODE} nodes={NODES} onUpdateName={jest.fn()} />,
      );

      const nextNode: NodeData = { id: "node-1", name: "Beta", type: "Node" };

      // when
      rerender(
        <IdentitySection key="node-1" node={nextNode} nodes={NODES} onUpdateName={jest.fn()} />,
      );

      // then
      expect(screen.getByDisplayValue("Beta")).toBeInTheDocument();
    });
  });
});
