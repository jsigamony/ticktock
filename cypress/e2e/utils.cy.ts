/// <reference types="cypress" />

import {
  cn,
  formatDate,
  formatWeekRange,
  capitalise,
  getTimesheetStatus,
} from "../../src/lib/utils";

describe("Utils", () => {
  describe("cn", () => {
    it("joins multiple class names", () => {
      cy.wrap(cn("class1", "class2", "class3")).should(
        "eq",
        "class1 class2 class3",
      );
    });

    it("filters out falsy values", () => {
      cy.wrap(cn("class1", null, "class2", undefined, false, "class3")).should(
        "eq",
        "class1 class2 class3",
      );
    });

    it("handles empty input", () => {
      cy.wrap(cn()).should("eq", "");
    });

    it("handles single class", () => {
      cy.wrap(cn("single")).should("eq", "single");
    });
  });

  describe("formatDate", () => {
    it("formats a valid ISO date string", () => {
      cy.wrap(formatDate("2023-10-15")).should("eq", "Oct 15, 2023");
    });

    it("formats another date", () => {
      cy.wrap(formatDate("2021-01-01")).should("eq", "Jan 1, 2021");
    });

    it("formats date with leading zeros", () => {
      cy.wrap(formatDate("2022-02-02")).should("eq", "Feb 2, 2022");
    });
  });

  describe("formatWeekRange", () => {
    it("formats a week range within the same year", () => {
      cy.wrap(formatWeekRange("2023-10-01", "2023-10-07")).should(
        "eq",
        "Oct 1 – Oct 7, 2023",
      );
    });

    it("formats a week range across years", () => {
      cy.wrap(formatWeekRange("2022-12-25", "2023-01-01")).should(
        "eq",
        "Dec 25 – Jan 1, 2023",
      );
    });

    it("formats same start and end date", () => {
      cy.wrap(formatWeekRange("2023-05-05", "2023-05-05")).should(
        "eq",
        "May 5 – May 5, 2023",
      );
    });
  });

  describe("capitalise", () => {
    it("capitalises the first letter of a string", () => {
      cy.wrap(capitalise("hello")).should("eq", "Hello");
    });

    it("handles empty string", () => {
      cy.wrap(capitalise("")).should("eq", "");
    });

    it("handles single character", () => {
      cy.wrap(capitalise("a")).should("eq", "A");
    });

    it("leaves already capitalised string unchanged", () => {
      cy.wrap(capitalise("World")).should("eq", "World");
    });

    it("handles string with numbers", () => {
      cy.wrap(capitalise("123abc")).should("eq", "123abc");
    });
  });

  describe("getTimesheetStatus", () => {
    it("marks zero hours as missing", () => {
      cy.wrap(getTimesheetStatus(0)).should("eq", "missing");
    });

    it("marks less than 40 hours as incomplete", () => {
      cy.wrap(getTimesheetStatus(39.5)).should("eq", "incomplete");
    });

    it("marks 40 or more hours as completed", () => {
      cy.wrap(getTimesheetStatus(40)).should("eq", "completed");
      cy.wrap(getTimesheetStatus(42)).should("eq", "completed");
    });
  });
});
