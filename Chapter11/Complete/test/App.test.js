import React from "react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import {
  initializeReactContainer,
  render,
  element,
  click,
  propsOf,
  container,
  renderAdditional,
  propsMatching,
} from "./reactTestExtensions";
import { Route, Link, Switch } from "react-router-dom";
import { App, MainScreen } from "../src/App";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";
import { CustomerSearchRoute } from "../src/CustomerSearchRoute";

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
jest.mock("../src/CustomerSearchRoute", () => ({
  CustomerSearchRoute: jest.fn(() => (
    <div id="CustomerSearchRoute" />
  )),
}));
jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, children }) => (
    <div id={`Link-${to}`}>{children}</div>
  )),
}));

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("initially shows the AppointmentDayViewLoader", () => {
    render(<App />);
    expect(AppointmentsDayViewLoader).toBeRendered();
  });

  it("has a menu bar", () => {
    render(<App />);
    expect(element("menu")).not.toBeNull();
  });

  it.only("renders a Link to /addCustomer", () => {
    render(<MainScreen />);
    expect(element("menu > li:first-of-type")).toContainText(
      "Add customer and appointment"
    );
    expect(
      propsOfId(Link, { id: "Link-/addCustomer" })
    ).toMatchObject({
      role: "button",
    });
  });

  it("renders a Link to /searchCustomers", () => {
    render(<MainScreen />);
    const links = elements("menu > li"))
    expect(links[1].type).toEqual(Link);
    expect(links[1].props.to).toEqual("/searchCustomers");
    expect(links[1].props.className).toEqual("button");
    expect(links[1].props.children).toEqual("Search customers");
  });
});

describe("App", () => {
  let historySpy;

  beforeEach(() => {
    initializeReactContainer();
    historySpy = jest.fn();
  });

  const routeFor = (path) =>
    propsMatching(Route, { path: "/addCustomer" });

  it("renders the MainScreen as the default route", () => {
    render(<App />);
    const routes = childRoutes();
    const lastRoute = routes[routes.length - 1];
    expect(lastRoute.props.component).toEqual(MainScreen);
  });

  it("renders CustomerForm at the /addCustomer endpoint", () => {
    render(<App />);
    expect(
      routeFor("/addCustomer").props.render().type
    ).toEqual(CustomerForm);
  });

  it("renders AppointmentFormLoader at /addAppointment", () => {
    render(<App />);
    expect(
      routeFor("/addAppointment").props.render().type
    ).toEqual(AppointmentFormLoader);
  });

  it("renders CustomerSearchRoute at /searchCustomers", () => {
    render(<App />);
    expect(
      routeFor("/searchCustomers").props.render().type
    ).toEqual(CustomerSearchRoute);
  });

  const customer = { id: 123 };

  it("navigates to /addAppointment after the CustomerForm is submitted", () => {
    render(<App history={{ push: historySpy }} />);
    const onSave =
      routeFor("/addCustomer").props.render().props.onSave;
    onSave(customer);
    expect(historySpy).toBeCalledWith("/addAppointment");
  });

  it("passes saved customer to AppointmentFormLoader after the CustomerForm is submitted", () => {
    render(<App history={{ push: historySpy }} />);
    const onSave =
      routeFor("/addCustomer").props.render().props.onSave;
    onSave(customer);
    let renderFunc = routeFor("/addAppointment").props.render;
    expect(renderFunc().props.customer).toEqual(customer);
  });

  it("navigates to / when AppointmentFormLoader is saved", () => {
    render(<App history={{ push: historySpy }} />);
    const onSave = routeFor("/addAppointment").props.render()
      .props.onSave;
    onSave();
    expect(historySpy).toBeCalledWith("/");
  });

  describe("search customers", () => {
    it("has a button to search customers", () => {
      render(<App />);
      const secondButton = element(
        "menu > li:nth-of-type(2) > button"
      );
      expect(secondButton).toContainText("Search customers");
    });

    const navigateToSearchCustomers = () =>
      click(element("menu > li:nth-of-type(2) > button"));

    const searchFor = (customer) =>
      propsOf(CustomerSearch).renderCustomerActions(customer);

    it("displays the CustomerSearch when button is clicked", async () => {
      render(<App />);
      navigateToSearchCustomers();
      expect(element("#CustomerSearch")).not.toBeNull();
    });

    it("passes a button to the CustomerSearch named Create appointment", async () => {
      render(<App history={{ push: historySpy }} />);
      navigateToSearchCustomers();
      const buttonContainer = renderAdditional(searchFor());
      expect(buttonContainer.firstChild).toBeElementWithTag(
        "button"
      );
      expect(buttonContainer.firstChild).toContainText(
        "Create appointment"
      );
    });

    it("navigates to /addAppointment when clicking the Create appointment button", () => {
      render(<App />);
      navigateToSearchCustomers();
      const buttonContainer = renderAdditional(
        searchFor(customer)
      );
      click(buttonContainer.firstChild);
      expect(historySpy).toBeCalledWith("/addAppointment");
    });

    it("passes saved customer to AppointmentFormLoader when clicking the Create appointment button", () => {
      render(<App />);
      navigateToSearchCustomers();
      const buttonContainer = renderAdditional(
        searchFor(customer)
      );
      click(buttonContainer.firstChild);
      expect(
        propsOf(AppointmentFormLoader).original
      ).toMatchObject({ customer: customer.id });
    });
  });
});
