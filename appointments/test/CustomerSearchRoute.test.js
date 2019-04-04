import React from "react";
import {
  initializeReactContainer,
  render,
} from "./reactTestExtensions";
import { Route, Link, Switch } from "react-router-dom";
import { CustomerSearchRoute } from "../src/CustomerSearchRoute";
import { CustomerSearch } from "../src/CustomerSearch/CustomerSearch";

jest.mock("../src/CustomerSearch/CustomerSearch", () => ({
  CustomerSearch: jest.fn(() => <div id="CustomerSearch" />),
}));

describe("CustomerSearchRoute", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("parses searchTerm from query string", () => {
    const location = { search: "?searchTerm=abc" };
    render(<CustomerSearchRoute location={location} />);
    expect(CustomerSearch).toBeRenderedWithProps(
      expect.objectContaining({
        searchTerm: "abc",
      })
    );
  });

  it("parses limit from query string", () => {
    const location = { search: "?limit=123" };
    render(<CustomerSearchRoute location={location} />);
    expect(CustomerSearch).toBeRenderedWithProps(
      expect.objectContaining({
        limit: 123,
      })
    );
  });

  it("parses lastRowIds from query string", () => {
    const location = {
      search: "?lastRowIds=" + encodeURIComponent("1,2,3"),
    };
    render(<CustomerSearchRoute location={location} />);
    expect(CustomerSearch).toBeRenderedWithProps(
      expect.objectContaining({
        lastRowIds: ["1", "2", "3"],
      })
    );
  });

  it("removes empty lastRowIds from query string", () => {
    const location = { search: "?lastRowIds=" };
    render(<CustomerSearchRoute location={location} />);
    expect(CustomerSearch).toBeRenderedWithProps(
      expect.objectContaining({
        lastRowIds: [],
      })
    );
  });

  it("passes all other props through to CustomerSearch", () => {
    const props = { a: "123", b: "456" };
    render(<CustomerSearchRoute {...props} location={{}} />);
    expect(CustomerSearch).toBeRenderedWithProps(
      expect.objectContaining({
        a: "123",
        b: "456",
      })
    );
  });
});
