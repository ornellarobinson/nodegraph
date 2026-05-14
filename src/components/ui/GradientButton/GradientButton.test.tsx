/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";

import GradientButton from "./GradientButton";

describe("GradientButton component", () => {
  describe("rendering", () => {
    it("should render its children as the button label", () => {
      // given / when
      render(<GradientButton onClick={jest.fn()}>Save</GradientButton>);

      // then
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("should render a startIcon when provided", () => {
      // given / when
      render(
        <GradientButton onClick={jest.fn()} startIcon={<span data-testid="icon" />}>
          New node
        </GradientButton>,
      );

      // then
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("should call onClick when clicked", () => {
      // given
      const onClick = jest.fn();

      render(<GradientButton onClick={onClick}>Click me</GradientButton>);

      // when
      fireEvent.click(screen.getByRole("button", { name: "Click me" }));

      // then
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      // given
      const onClick = jest.fn();

      render(
        <GradientButton onClick={onClick} disabled>
          Click me
        </GradientButton>,
      );

      // when
      fireEvent.click(screen.getByRole("button", { name: "Click me" }));

      // then
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    it("should have the disabled attribute when disabled prop is true", () => {
      // given / when
      render(
        <GradientButton onClick={jest.fn()} disabled>
          Submit
        </GradientButton>,
      );

      // then
      expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    });

    it("should not be disabled by default", () => {
      // given / when
      render(<GradientButton onClick={jest.fn()}>Submit</GradientButton>);

      // then
      expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
    });
  });
});
