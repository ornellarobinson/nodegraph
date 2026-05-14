/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";

import PropertiesPanel from "./PropertiesPanel";
import type { NodeData, LinkData } from "@/types";

const NODE: NodeData = { id: "node-0", name: "Alpha", type: "Node" };
const NODES: NodeData[] = [
  { id: "node-0", name: "Alpha", type: "Node" },
  { id: "node-1", name: "Beta", type: "Node" },
];

const defaultProps = {
  node: NODE,
  nodes: NODES,
  links: [] as LinkData[],
  onClose: jest.fn(),
  onUpdateName: jest.fn(),
  onAddLink: jest.fn(),
  onSelect: jest.fn(),
};

describe("PropertiesPanel component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("header", () => {
    it("should display the node name", () => {
      // given / when
      render(<PropertiesPanel {...defaultProps} />);

      // then
      expect(screen.getByText("Alpha")).toBeInTheDocument();
    });

    it("should display the node id", () => {
      // given / when
      render(<PropertiesPanel {...defaultProps} />);

      // then — id appears in both header and identity section
      expect(screen.getAllByText("node-0").length).toBeGreaterThanOrEqual(1);
    });

    it("should derive the avatar letter from the first character of the name", () => {
      // given / when
      render(<PropertiesPanel {...defaultProps} />);

      // then
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should uppercase the avatar letter", () => {
      // given
      const node: NodeData = { id: "node-2", name: "beta", type: "Node" };

      // when
      render(<PropertiesPanel {...defaultProps} node={node} />);

      // then
      expect(screen.getByText("B")).toBeInTheDocument();
    });

    it("should call onClose when the close button is clicked", () => {
      // given
      const onClose = jest.fn();

      render(<PropertiesPanel {...defaultProps} onClose={onClose} />);

      // when
      fireEvent.click(screen.getByRole("button", { name: /close/i }));

      // then
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("composition", () => {
    it("should render the identity section with the name input", () => {
      // given / when
      render(<PropertiesPanel {...defaultProps} />);

      // then
      expect(screen.getByDisplayValue("Alpha")).toBeInTheDocument();
    });

    it("should render the links section", () => {
      // given / when
      render(<PropertiesPanel {...defaultProps} />);

      // then
      expect(screen.getByText("Links (0)")).toBeInTheDocument();
    });

    it("should autofocus the name input when autoFocusName is true", () => {
      // given / when
      render(<PropertiesPanel {...defaultProps} autoFocusName />);

      // then
      expect(screen.getByDisplayValue("Alpha")).toHaveFocus();
    });

    it("should update the header name when the node prop changes", () => {
      // given
      const { rerender } = render(<PropertiesPanel {...defaultProps} />);
      const nextNode: NodeData = { id: "node-1", name: "Beta", type: "Node" };

      // when
      rerender(<PropertiesPanel {...defaultProps} node={nextNode} />);

      // then
      expect(screen.getByText("Beta")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });
  });
});
