import { truncateLabel } from "@/utils/truncateLabel";

describe("truncateLabel utility", () => {
  it("should return the name unchanged when it is 30 characters or fewer", () => {
    // given
    const name = "A".repeat(30);

    // when
    const result = truncateLabel(name);

    // then
    expect(result).toBe(name);
  });

  it("should return the name unchanged when it is shorter than 30 characters", () => {
    // given
    const name = "Short Name";

    // when
    const result = truncateLabel(name);

    // then
    expect(result).toBe("Short Name");
  });

  it("should truncate to 27 characters and append an ellipsis when name exceeds 30 characters", () => {
    // given
    const name = "A".repeat(31);

    // when
    const result = truncateLabel(name);

    // then
    expect(result).toBe("A".repeat(27) + "…");
  });

  it("should produce a display label of 28 characters (27 + ellipsis) for long names", () => {
    // given
    const name = "A".repeat(50);

    // when
    const result = truncateLabel(name);

    // then
    expect([...result].length).toBe(28);
  });

  it("should not truncate a name of exactly 30 characters", () => {
    // given
    const name = "x".repeat(30);

    // when
    const result = truncateLabel(name);

    // then
    expect(result).toHaveLength(30);
  });

  it("should preserve the full name in React state — only the display label is shortened", () => {
    // given
    const fullName = "This is a very long node name that exceeds the limit";

    // when
    const displayLabel = truncateLabel(fullName);

    // then
    expect(displayLabel).not.toBe(fullName);
    expect(fullName).toHaveLength(52);
    expect(displayLabel).toBe(fullName.slice(0, 27) + "…");
  });
});
