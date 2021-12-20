import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import {
  Appointment,
  AppointmentsDayView,
} from "../src/AppointmentsDayView";

describe("Appointment", () => {
  let container;
  let customer = {};

  beforeEach(() => {
    container = document.createElement("div");
  });

  const render = (component) =>
    act(() => ReactDOM.createRoot(container).render(component));

  const appointmentTable = () =>
    container.querySelector("#appointmentView > table");

  it("renders a table", () => {
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).not.toBeNull();
  });

  it("renders the customer first name", () => {
    customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch("Ashley");
  });

  it("renders another customer first name", () => {
    customer = { firstName: "Jordan" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch("Jordan");
  });

  it("renders the customer last name", () => {
    customer = { lastName: "Jones" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch("Jones");
  });

  it("renders another customer last name", () => {
    customer = { lastName: "Smith" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch("Smith");
  });

  it("renders the customer phone number", () => {
    customer = { phoneNumber: "123456789" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch("123456789");
  });

  it("renders another customer phone number", () => {
    customer = { phoneNumber: "234567890" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch("234567890");
  });

  it("renders the stylist name", () => {
    render(<Appointment customer={customer} stylist="Sam" />);
    expect(appointmentTable().textContent).toMatch("Sam");
  });

  it("renders another stylist name", () => {
    render(<Appointment customer={customer} stylist="Jo" />);
    expect(appointmentTable().textContent).toMatch("Jo");
  });

  it("renders the salon service", () => {
    render(<Appointment customer={customer} service="Cut" />);
    expect(appointmentTable().textContent).toMatch("Cut");
  });

  it("renders another salon service", () => {
    render(
      <Appointment customer={customer} service="Blow-dry" />
    );
    expect(appointmentTable().textContent).toMatch("Blow-dry");
  });

  it("renders the appointments notes", () => {
    render(<Appointment customer={customer} notes="abc" />);
    expect(appointmentTable().textContent).toMatch("abc");
  });

  it("renders other appointment notes", () => {
    render(<Appointment customer={customer} notes="def" />);
    expect(appointmentTable().textContent).toMatch("def");
  });

  it("renders a heading with the time", () => {
    const today = new Date();
    const timestamp = today.setHours(9, 0, 0);
    render(
      <Appointment customer={customer} startsAt={timestamp} />
    );
    expect(container.querySelector("h3")).not.toBeNull();
    expect(container.querySelector("h3").textContent).toEqual(
      "Today’s appointment at 09:00"
    );
  });
});

describe("AppointmentsDayView", () => {
  const today = new Date();
  const twoAppointments = [
    {
      startsAt: today.setHours(12, 0),
      customer: { firstName: "Ashley" },
    },
    {
      startsAt: today.setHours(13, 0),
      customer: { firstName: "Jordan" },
    },
  ];

  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  const render = (component) =>
    act(() => ReactDOM.createRoot(container).render(component));

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(
      container.querySelector("div#appointmentsDayView")
    ).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    const listElement = container.querySelector("ol");
    expect(listElement).not.toBeNull();
  });

  it("renders an li for each appointment", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );

    const listChildren = container.querySelectorAll("ol > li");
    expect(listChildren).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );

    const listChildren = container.querySelectorAll("li");
    expect(listChildren[0].textContent).toEqual("12:00");
    expect(listChildren[1].textContent).toEqual("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.textContent).toMatch(
      "There are no appointments scheduled for today."
    );
  });

  it("selects the first appointment by default", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    expect(container.textContent).toMatch("Ashley");
  });

  it("has a button element in each li", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );

    const buttons = container.querySelectorAll("li > button");

    expect(buttons).toHaveLength(2);
    expect(buttons[0].type).toEqual("button");
  });

  it("renders another appointment when selected", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    const button = container.querySelectorAll("button")[1];
    act(() => ReactTestUtils.Simulate.click(button));
    expect(container.textContent).toMatch("Jordan");
  });

  it("adds toggled class to button when selected", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    const button = container.querySelectorAll("button")[1];
    act(() => ReactTestUtils.Simulate.click(button));
    expect(button.className).toMatch("toggled");
  });

  it("does not add toggled class if button is not selected", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    const button = container.querySelectorAll("button")[1];
    expect(button.className).not.toMatch("toggled");
  });
});
