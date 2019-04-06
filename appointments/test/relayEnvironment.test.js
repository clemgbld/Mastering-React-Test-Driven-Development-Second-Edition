import "whatwg-fetch";
import {
  fetchResponseOk,
  fetchResponseError,
} from "./spyHelpers";
import {
  performFetch,
  getEnvironment,
} from "../src/relayEnvironment";
import {
  Environment,
  Network,
  Store,
  RecordSource,
} from "relay-runtime";
jest.mock("relay-runtime");

describe("performFetch", () => {
  let response = { data: { id: 123 } };
  const text = "test";
  const variables = { a: 123 };

  beforeEach(() => {
    jest
      .spyOn(window, "fetch")
      .mockReturnValue(fetchResponseOk(response));
  });

  it("calls window fetch", () => {
    performFetch({ text }, variables);
    expect(window.fetch).toBeCalledWith("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: text,
        variables,
      }),
    });
  });

  it("returns the request data", async () => {
    const result = await performFetch({ text }, variables);
    expect(result).toEqual(response);
  });

  it("rejects when the request fails", () => {
    window.fetch.mockReturnValue(fetchResponseError(500));
    return expect(
      performFetch({ text }, variables)
    ).rejects.toEqual(new Error(500));
  });
});

describe("getEnvironment", () => {
  const environment = { a: 123 };
  const network = { b: 234 };
  const store = { c: 345 };
  const recordSource = { d: 456 };

  beforeAll(() => {
    Environment.mockImplementation(() => environment);
    Network.create.mockReturnValue(network);
    Store.mockImplementation(() => store);
    RecordSource.mockImplementation(() => recordSource);

    getEnvironment();
  });

  it("returns environmennt", () => {
    expect(getEnvironment()).toEqual(environment);
  });

  it("calls Environment with network and store", () => {
    expect(Environment).toBeCalledWith({ network, store });
  });

  it("calls Network.create with performFetch", () => {
    expect(Network.create).toBeCalledWith(performFetch);
  });

  it("calls Store with RecordSource", () => {
    expect(Store).toBeCalledWith(recordSource);
  });

  it("constructs the object only once", () => {
    getEnvironment();
    expect(Environment.mock.calls.length).toEqual(1);
  });
});
