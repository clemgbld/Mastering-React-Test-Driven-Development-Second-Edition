import React from "react";
import { expectRedux } from "expect-redux";
import {
  initializeReactContainer,
  renderWithStore,
  container,
  element,
  elements,
  textOf,
} from "./reactTestExtensions";
import { fetchQuery } from "relay-runtime";
import { CustomerHistory } from "../src/CustomerHistory";
jest.mock("relay-runtime");

const date = new Date("February 16, 2019");

const appointments = [
  {
    startsAt: date.setHours(9, 0, 0, 0),
    stylist: "Jo",
    service: "Cut",
    notes: "Note one",
  },
  {
    startsAt: date.setHours(10, 0, 0, 0),
    stylist: "Stevie",
    service: "Cut & color",
    notes: "Note two",
  },
];

const customer = {
  firstName: "Ashley",
  lastName: "Jones",
  phoneNumber: "123",
  appointments,
};

describe("Customer", () => {
  beforeEach(() => {
    initializeReactContainer();
    fetchQuery.mockReturnValue({ customer });
    renderWithStore(<CustomerHistory id={123} />);
  });

  describe("successful", () => {
    it("dispatches queryCustomer on mount", () => {
      return expectRedux(store)
        .toDispatchAnAction()
        .matching({ type: "QUERY_CUSTOMER_REQUEST", id: 123 });
    });

    it("renders the first name and last name together in a h2", () => {
      expect(element("h2")).toContainText("Ashley Jones");
    });

    it("renders the phone number", () => {
      expect(document.body).toContainText("123");
    });

    it("renders a Booked appointments heading", () => {
      expect(element("h3")).not.toBeNull();
      expect(element("h3")).toContainText(
        "Booked appointments"
      );
    });

    it("renders a table with four column headings", () => {
      const headings = elements("table > thead > tr > th");
      expect(textOf(headings)).toEqual([
        "When",
        "Stylist",
        "Service",
        "Notes",
      ]);
    });

    const columnValues = (columnNumber) =>
      elements("tbody > tr").map(
        (tr) => tr.childNodes[columnNumber]
      );

    it("renders the start time of each appointment in the correct format", () => {
      expect(textOf(columnValues(0))).toEqual([
        "Sat Feb 16 2019 09:00",
        "Sat Feb 16 2019 10:00",
      ]);
    });

    it("renders the stylist", () => {
      expect(columnValues(1)).toEqual(["Jo", "Stevie"]);
    });

    it("renders the service", () => {
      expect(columnValues(2)).toEqual(["Cut", "Cut & color"]);
    });

    it("renders notes", () => {
      expect(columnValues(3)).toEqual(["Note one", "Note two"]);
    });
  });

  describe("submitting", () => {
    it("displays a loading message", () => {
      renderWithStore(<CustomerHistory />);
      store.dispatch({ type: "QUERY_CUSTOMER_SUBMITTING" });
      expect(container.firstChild.id).toEqual("loading");
      expect(container).toContainText("Loading");
    });
  });

  describe("failed", () => {
    it("displays an error message", () => {
      renderWithStore(<CustomerHistory />);
      store.dispatch({ type: "QUERY_CUSTOMER_FAILED" });
      expect(container.firstChild.id).toEqual("error");
      expect(container).toContainText(
        "Sorry, an error occurred while pulling data from the server."
      );
    });
  });
});
