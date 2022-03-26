import React from "react";
import { fetchResponseOk } from "../builders/fetch";
import {
  initializeReactContainer,
  renderAndWait,
  change,
  element,
  elements,
  textOf,
} from "../reactTestExtensions";
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
      .mockResolvedValue(fetchResponseOk([]));
    historySpy = jest.fn();
    actionSpy = jest.fn();
    jest
      .spyOn(SearchButtonsExports, "SearchButtons")
      .mockReturnValue(null);
  });

  const renderCustomerSearch = (props) =>
    renderAndWait(
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

  it("fetches all customer data when component mounts", async () => {
    await renderCustomerSearch();
    expect(global.fetch).toBeCalledWith("/customers", {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("renders all customer data in a table row", async () => {
    global.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    const columns = elements("table > tbody > tr > td");
    expect(columns[0]).toContainText("A");
    expect(columns[1]).toContainText("B");
    expect(columns[2]).toContainText("1");
  });

  it("renders multiple customer rows", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(twoCustomers));
    await renderCustomerSearch();
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
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    const rows = elements("table tbody td");
    expect(rows[rows.length - 1]).toContainText("actions");
  });

  it("passes customer to the renderCustomerActions prop", async () => {
    actionSpy.mockReturnValue("actions");
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    expect(actionSpy).toBeCalledWith(oneCustomer[0]);
  });

  it("renders SearchButtons with props", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(tenCustomers));

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
