import React from "react";
import { act } from "react-dom/test-utils";
import { App } from "../src/App";
import {
  initializeReactContainer,
  render,
  element,
  click,
  propsOf,
} from "./reactTestExtensions";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";

jest.mock("../src/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => (
    <div id="AppointmentFormLoader" />
  )),
}));
jest.mock("../src/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => (
    <div id="AppointmentsDayViewLoader" />
  )),
}));
jest.mock("../src/CustomerForm", () => ({
  CustomerForm: jest.fn(() => <div id="CustomerForm" />),
}));

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("initially shows the AppointmentDayViewLoader", () => {
    render(<App />);
    expect(AppointmentsDayViewLoader).toBeRenderedWithProps({});
  });

  it("has a menu bar", () => {
    render(<App />);
    expect(element("menu")).not.toBeNull();
  });

  it("has a button to initiate add customer and appointment action", () => {
    render(<App />);
    const firstButton = element(
      "menu > li > button:first-of-type"
    );
    expect(firstButton).toContainText(
      "Add customer and appointment"
    );
  });

  const beginAddingCustomerAndAppointment = () => {
    render(<App />);
    click(element("menu > li > button:first-of-type"));
  };

  it("displays the CustomerForm when button is clicked", async () => {
    beginAddingCustomerAndAppointment();
    expect(CustomerForm).toBeRenderedWithProps(
      expect.objectContaining({ original: {} })
    );
  });

  it("hides the AppointmentDayViewLoader when button is clicked", async () => {
    beginAddingCustomerAndAppointment();
    expect(element("#AppointmentsDayViewLoader")).toBeNull();
  });

  it("hides the button bar when CustomerForm is being displayed", async () => {
    beginAddingCustomerAndAppointment();
    expect(element("menu")).toBeNull();
  });

  const saveCustomer = (customer) =>
    act(() => propsOf(CustomerForm).onSave(customer));

  it("passes the customer to the AppointmentForm", async () => {
    const customer = { id: 123 };

    beginAddingCustomerAndAppointment();
    saveCustomer(customer);

    expect(AppointmentFormLoader).toBeRenderedWithProps(
      expect.objectContaining({
        original: expect.objectContaining({
          customer: customer.id,
        }),
      })
    );
  });

  const saveAppointment = () =>
    act(() => propsOf(AppointmentFormLoader).onSave());

  it("renders AppointmentDayViewLoader after AppointmentForm is submitted", async () => {
    const customer = { id: 123 };

    beginAddingCustomerAndAppointment();
    saveCustomer(customer);
    saveAppointment();

    expect(AppointmentsDayViewLoader).toBeRendered();
  });
});
