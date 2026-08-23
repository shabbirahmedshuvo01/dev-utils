import { describe, expect, it } from "vitest";
import {
  getErrorMessage,
  buildQueryParams,
  getPaginationMetadata,
  cleanObject,
  maskData,
  formatRelativeTime,
  formatIsoString,
  convertTimezone
} from "../src/index.js";

describe("dev-utils", () => {
  it("extracts error messages safely", () => {
    expect(getErrorMessage(new Error("Boom"))).toBe("Boom");
    expect(getErrorMessage("Oops")).toBe("Oops");
    expect(getErrorMessage({ message: "Bad request" })).toBe("Bad request");
    expect(getErrorMessage(null)).toBe("An unknown error occurred");
  });

  it("builds query params", () => {
    expect(
      buildQueryParams({
        page: 2,
        tags: ["a", "b"],
        empty: ""
      })
    ).toBe("?page=2&tags=a&tags=b");
  });

  it("calculates pagination", () => {
    expect(getPaginationMetadata(45, 2, 10)).toEqual({
      page: 2,
      limit: 10,
      total: 45,
      totalPages: 5,
      skip: 10,
      hasNextPage: true,
      hasPreviousPage: true
    });
  });

  it("cleans objects", () => {
    expect(
      cleanObject({
        name: "John",
        email: "",
        age: null,
        city: undefined
      })
    ).toEqual({
      name: "John"
    });
  });

  it("masks sensitive data", () => {
    expect(
      maskData({
        password: "secret123",
        user: {
          token: "abcdef"
        }
      })
    ).toEqual({
      password: "se*****23",
      user: {
        token: "ab***ef"
      }
    });
  });

  it("formats relative time", () => {
    const now = Date.parse("2026-01-01T00:00:00Z");

    expect(
      formatRelativeTime(
        "2026-01-01T00:01:00Z",
        "en",
        now
      )
    ).toBe("in 1 minute");
  });

  it("formats ISO strings", () => {
    const result = formatIsoString(
      "2026-01-01T12:00:00Z",
      {
        locale: "en-US",
        timeZone: "Asia/Dhaka"
      }
    );

    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });

  it("converts timezone", () => {
    const result = convertTimezone(
      "2026-01-01T12:00:00Z",
      "Asia/Dhaka",
      "en-US"
    );

    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });

  it("throws for invalid dates", () => {
    expect(() =>
      convertTimezone(
        "invalid-date",
        "Asia/Dhaka"
      )
    ).toThrow("Invalid date");

    expect(() =>
      formatIsoString("invalid-date")
    ).toThrow("Invalid date");
  });
});