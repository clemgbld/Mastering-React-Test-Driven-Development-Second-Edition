import { storeSpy, expectRedux } from "expect-redux";
import {
  fetchResponseOk,
  fetchResponseError,
} from "../builders/fetch";
import {
  itMaintainsExistingState,
  itSetsStatus,
} from "../reducerGenerators";
import { configureStore } from "../../src/store";
import { reducer } from "../../src/sagas/customer";

describe("addCustomer", () => {
  const customer = { id: 123 };
  let store;

  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockReturnValue(fetchResponseOk(customer));
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = (customer) =>
    store.dispatch({
      type: "ADD_CUSTOMER_REQUEST",
      customer,
    });

  it("sets current status to submitting", () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: "ADD_CUSTOMER_SUBMITTING" });
  });

  it("sends HTTP request to POST /customers", async () => {
    const inputCustomer = { firstName: "Ashley" };
    dispatchRequest(inputCustomer);

    expect(global.fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  if (
    ("calls fetch with correction configuration",
    async () => {
      const inputCustomer = { firstName: "Ashley" };
      dispatchRequest(inputCustomer);

      expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
        })
      );
    })
  );

  it("calls fetch with customer as request body", async () => {
    const inputCustomer = { firstName: "Ashley" };
    dispatchRequest(inputCustomer);

    expect(global.fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: JSON.stringify(inputCustomer),
      })
    );
  });

  it("dispatches ADD_CUSTOMER_SUCCESSFUL on success", () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: "ADD_CUSTOMER_SUCCESSFUL", customer });
  });

  it("dispatches ADD_CUSTOMER_FAILED on non-specific error", () => {
    global.fetch.mockReturnValue(fetchResponseError());
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: "ADD_CUSTOMER_FAILED" });
  });

  it("dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned", () => {
    const errors = {
      field: "field",
      description: "error text",
    };
    global.fetch.mockReturnValue(
      fetchResponseError(422, { errors })
    );

    dispatchRequest();

    return expectRedux(store).toDispatchAnAction().matching({
      type: "ADD_CUSTOMER_VALIDATION_FAILED",
      validationErrors: errors,
    });
  });
});

describe("reducer", () => {
  it("returns a default state for an undefined existing state", () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false,
    });
  });

  describe("ADD_CUSTOMER_SUBMITTING action", () => {
    const action = { type: "ADD_CUSTOMER_SUBMITTING" };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, "SUBMITTING");

    it("resets error to false", () => {
      expect(reducer({ error: true }, action)).toMatchObject({
        error: false,
      });
    });
  });

  describe("ADD_CUSTOMER_FAILED action", () => {
    const action = { type: "ADD_CUSTOMER_FAILED" };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, "FAILED");

    it("sets error to true", () => {
      expect(reducer(undefined, action)).toMatchObject({
        error: true,
      });
    });
  });

  describe("ADD_CUSTOMER_VALIDATION_FAILED action", () => {
    const validationErrors = { field: "error text" };
    const action = {
      type: "ADD_CUSTOMER_VALIDATION_FAILED",
      validationErrors,
    };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, "VALIDATION_FAILED");

    it("sets validation errors to provided errors", () => {
      expect(reducer(undefined, action)).toMatchObject({
        validationErrors,
      });
    });
  });

  describe("ADD_CUSTOMER_SUCCESSFUL action", () => {
    const customer = { id: 123 };
    const action = {
      type: "ADD_CUSTOMER_SUCCESSFUL",
      customer,
    };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, "SUCCESSFUL");

    it("sets customer to provided customer", () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer,
      });
    });
  });
});
