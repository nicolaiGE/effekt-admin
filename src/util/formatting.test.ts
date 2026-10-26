import { describe, expect, it } from "vitest";
import { amountToInput, isValidAmountInput, parseAmountInput, thousandize } from "./formatting";

describe("thousandize", () => {
  it("formats numbers for display", () => {
    expect(thousandize(1234567)).toContain("1");
  });

  it("returns '-' for nullish input", () => {
    expect(thousandize(undefined)).toBe("-");
    expect(thousandize(null)).toBe("-");
  });
});

describe("isValidAmountInput", () => {
  it("accepts amounts while they are being typed", () => {
    for (const text of ["", "100", "100,", "100.", "100,5", "100,50", "100.50", ",5"]) {
      expect(isValidAmountInput(text)).toBe(true);
    }
  });

  it("rejects letters, negative amounts and more than two decimals", () => {
    for (const text of ["abc", "-100", "100,505", "1,000.50", "100 kr"]) {
      expect(isValidAmountInput(text)).toBe(false);
    }
  });
});

describe("parseAmountInput", () => {
  it("parses comma and dot as decimal separator", () => {
    expect(parseAmountInput("100,50")).toBe(100.5);
    expect(parseAmountInput("100.25")).toBe(100.25);
    expect(parseAmountInput("100,")).toBe(100);
    expect(parseAmountInput("250")).toBe(250);
  });

  it("returns undefined for empty or invalid input", () => {
    expect(parseAmountInput("")).toBeUndefined();
    expect(parseAmountInput(",")).toBeUndefined();
    expect(parseAmountInput("abc")).toBeUndefined();
  });
});

describe("amountToInput", () => {
  it("shows a stored amount with at most two decimals", () => {
    expect(amountToInput(100.5)).toBe("100.5");
    expect(amountToInput(0.1 + 0.2)).toBe("0.3");
    expect(amountToInput(250)).toBe("250");
  });

  it("returns an empty string when there is no amount", () => {
    expect(amountToInput(undefined)).toBe("");
    expect(amountToInput(NaN)).toBe("");
  });
});
