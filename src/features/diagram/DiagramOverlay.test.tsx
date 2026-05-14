/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { DiagramOverlay } from "./DiagramOverlay";

const overviewRef = { current: null };

describe("DiagramOverlay component", () => {
  it("should display the node count", () => {
    // given / when
    render(<DiagramOverlay nodeCount={42} linkCount={0} overviewRef={overviewRef} />);

    // then
    expect(screen.getByText(/42 nodes/)).toBeInTheDocument();
  });

  it("should display the link count", () => {
    // given / when
    render(<DiagramOverlay nodeCount={0} linkCount={17} overviewRef={overviewRef} />);

    // then
    expect(screen.getByText(/17 links/)).toBeInTheDocument();
  });

  it("should display node and link counts together", () => {
    // given / when
    render(<DiagramOverlay nodeCount={1000} linkCount={999} overviewRef={overviewRef} />);

    // then
    expect(screen.getByText("1000 nodes · 999 links")).toBeInTheDocument();
  });

  it("should display the section label", () => {
    // given / when
    render(<DiagramOverlay nodeCount={0} linkCount={0} overviewRef={overviewRef} />);

    // then
    expect(screen.getByText(/overview/i)).toBeInTheDocument();
  });

  it("should display the interaction hint", () => {
    // given / when
    render(<DiagramOverlay nodeCount={0} linkCount={0} overviewRef={overviewRef} />);

    // then
    expect(screen.getByText(/scroll to zoom/i)).toBeInTheDocument();
  });
});
