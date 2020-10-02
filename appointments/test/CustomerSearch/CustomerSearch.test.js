import React from "react";
import { fetchResponseOk } from "../builders/fetch";
import { expectRedux } from "expect-redux";
import {
  initializeReactContainer,
  renderWithStore,
  change,
  element,
  elements,
  textOf,
  store,
} from "../reactTestExtensions";
import { MemoryRouter } from "react-router-dom";
import * as SearchButtonsExports from "../../src/CustomerSearch/SearchButtons";
import { CustomerSearch } from "../../src/CustomerSearch/CustomerSearch";

const oneCustomer = [
  { id: 1, firstName: "A", lastName: "B", phoneNumber: "1" },
];

const twoCustomers = [
  { id: 1, firstName: "A", lastName: "B", phoneNumber: "1" },
  { id: 2, firstName: "C", lastName: "D", phoneNumber: "2" },
];

const tenCustomers = Array.from("0123456789", (id) => ({ id }));

describe("CustomerSearch", () => {
  let historySpy, actionSpy;

  beforeEach(() => {
    initializeReactContainer();
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk(oneCustomer));
    historySpy = jest.fn();
    actionSpy = jest.fn(() => {});
    jest
      .spyOn(SearchButtonsExports, "SearchButtons")
      .mockResolvedValue(null);
  });

  const renderCustomerSearch = (props) =>
    renderWithStore(
      <CustomerSearch
        {...props}
        history={{ push: historySpy }}
        renderCustomerActions={actionSpy}
        location={{ pathname: "/path" }}
      />
    );

  it("renders a table with four headings", async () => {
    await renderCustomerSearch();
    const headings = elements("table th");
    expect(textOf(headings)).toEqual([
      "First name",
      "Last name",
      "Phone number",
      "Actions",
    ]);
  });

  it("dispatches SEARCH_CUSTOMERS_REQUEST when component mounts", async () => {
    const lastRowIds = [123, 234, 345];
    const searchTerm = "test";
    const limit = 10;
    await renderCustomerSearch({
      lastRowIds,
      searchTerm,
      limit,
    });
    return expectRedux(store).toDispatchAnAction().matching({
      type: "SEARCH_CUSTOMERS_REQUEST",
      lastRowIds,
      searchTerm,
      limit,
    });
  });

  it("renders all customer data in a table row", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    await new Promise(setTimeout);
    const columns = elements("table > tbody > tr > td");
    expect(columns[0]).toContainText("A");
    expect(columns[1]).toContainText("B");
    expect(columns[2]).toContainText("1");
  });

  it("renders multiple customer rows", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(twoCustomers));
    await renderCustomerSearch();
    await new Promise(setTimeout);
    const rows = elements("table tbody tr");
    expect(rows[1].childNodes[0]).toContainText("C");
  });

  it("has a search input field with a placeholder", async () => {
    await renderCustomerSearch();
    expect(element("input")).not.toBeNull();
    expect(
      element("input").getAttribute("placeholder")
    ).toEqual("Enter filter text");
  });

  it("changes location when search term is changed", async () => {
    await renderCustomerSearch();
    change(element("input"), "name");
    expect(historySpy).toBeCalledWith("/path?searchTerm=name");
  });

  it("displays provided action buttons for each customer", async () => {
    actionSpy.mockReturnValue("actions");
    await renderCustomerSearch();
    await new Promise(setTimeout);
    const rows = elements("table tbody td");
    expect(rows[rows.length - 1]).toContainText("actions");
  });

  it("passes customer to the renderCustomerActions prop", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    await new Promise(setTimeout);
    expect(actionSpy).toBeCalledWith(oneCustomer[0]);
  });

  it("renders SearchButtons with props", async () => {
    store.dispatch({
      type: "SEARCH_CUSTOMERS_SUCCESSFUL",
      customers: tenCustomers,
    });

    await renderCustomerSearch({
      searchTerm: "term",
      limit: 20,
      lastRowIds: ["123"],
      pathname: "/path",
    });

    expect(SearchButtonsExports.SearchButtons).toBeCalledWith(
      {
        customers: tenCustomers,
        searchTerm: "term",
        limit: 20,
        lastRowIds: ["123"],
        pathname: "/path",
      },
      expect.anything()
    );
  });
});
