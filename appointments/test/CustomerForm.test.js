import React from "react";
import {
  initializeReactContainer,
  render,
  element,
  form,
  field,
  clickAndWait,
  submitAndWait,
  change,
  submit,
  submitButton,
  labelFor,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  beforeEach(() => {
    initializeReactContainer();
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk({}));
  });

  const bodyOfLastFetchRequest = () => {
    const allCalls = global.fetch.mock.calls;
    const lastCall = allCalls[allCalls.length - 1];
    return JSON.parse(lastCall[1].body);
  };

  const fetchResponseOk = (body) => ({
    ok: true,
    json: () => Promise.resolve(body),
  });

  const fetchResponseError = () => ({ ok: false });

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(submitButton()).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName)).toBeInputFieldOfType("text");
    });

  const itIncludesTheExistingValue = (fieldName, existing) =>
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing };
      render(<CustomerForm original={customer} />);
      expect(field(fieldName).value).toEqual(existing);
    });

  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the text box", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`renders '${text}' as the label content`, () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", async () => {
      const customer = { [fieldName]: value };
      render(
        <CustomerForm original={customer} onSave={() => {}} />
      );
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject(customer);
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", async () => {
      render(
        <CustomerForm
          original={blankCustomer}
          onSave={() => {}}
        />
      );
      change(field(fieldName), value);
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject({
        [fieldName]: value,
      });
    });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName", "existingValue");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue("firstName", "existingValue");
    itSubmitsNewValue("firstName", "newValue");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName", "existingValue");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSubmitsExistingValue("lastName", "existingValue");
    itSubmitsNewValue("lastName", "newValue");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber", "12345");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSubmitsExistingValue("phoneNumber", "12345");
    itSubmitsNewValue("phoneNumber", "67890");
  });

  it("prevents the default action when submitting the form", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => {}}
      />
    );
    const event = await submitAndWait(form());
    expect(event.defaultPrevented).toBe(true);
  });

  it("sends HTTP request to POST /customers when submitting data", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => {}}
      />
    );
    await clickAndWait(submitButton());

    expect(global.fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("calls fetch with correct configuration", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => {}}
      />
    );
    await clickAndWait(submitButton());

    expect(global.fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    global.fetch.mockResolvedValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(
      <CustomerForm original={blankCustomer} onSave={saveSpy} />
    );
    await clickAndWait(submitButton());

    expect(saveSpy).toBeCalledWith(customer);
  });

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue(fetchResponseError());
    });

    it("does not notify onSave if the POST request returns an error", async () => {
      const saveSpy = jest.fn();

      render(
        <CustomerForm
          original={blankCustomer}
          onSave={saveSpy}
        />
      );
      await clickAndWait(submitButton());

      expect(saveSpy).not.toBeCalled();
    });

    it("renders error message when fetch call fails", async () => {
      render(<CustomerForm original={blankCustomer} />);
      await clickAndWait(submitButton());

      expect(element(".error")).toContainText("error occurred");
    });
  });
});
