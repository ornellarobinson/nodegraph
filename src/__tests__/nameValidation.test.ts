import { validateNodeName, MAX_NAME_LENGTH } from "@/utils/validateNodeName";

describe("validateNodeName utility", () => {
  it("should return valid for a normal name", () => {
    // when
    const result = validateNodeName("My Node");

    // then
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should return invalid when name is empty", () => {
    // when
    const result = validateNodeName("");

    // then
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Name can't be empty.");
  });

  it("should return invalid when name is whitespace only", () => {
    // when
    const result = validateNodeName("   ");

    // then
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Name can't be empty.");
  });

  it("should return valid for a name just under the limit", () => {
    // given
    const name = "A".repeat(MAX_NAME_LENGTH - 1);

    // when
    const result = validateNodeName(name);

    // then
    expect(result.isValid).toBe(true);
  });

  it("should return invalid when name reaches the 25-character limit", () => {
    // given
    const name = "A".repeat(MAX_NAME_LENGTH);

    // when
    const result = validateNodeName(name);

    // then
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Max 25 characters reached.");
  });

  it("should return invalid when name exceeds the 25-character limit", () => {
    // given
    const name = "A".repeat(MAX_NAME_LENGTH + 10);

    // when
    const result = validateNodeName(name);

    // then
    expect(result.isValid).toBe(false);
  });

  it("should include character count hint when name is valid", () => {
    // given
    const name = "Hello";

    // when
    const result = validateNodeName(name);

    // then
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });
});
