import React from "react";
import {
  initializeReactContainer,
  render,
  form,
  labelFor,
  change,
  submit,
  withEvent,
} from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";

describe("AppointmentForm", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  const field = (name) => form("appointment").elements[name];

  const firstOption = (element) => element.childNodes[0];

  const labelsOfAllOptions = (element) =>
    Array.from(element.childNodes, (node) => node.textContent);

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      (option) => option.textContent === textContent
    );
  };

  it("renders a form", () => {
    render(<AppointmentForm />);
    expect(form("appointment")).not.toBeNull();
  });

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });

    it("has a blank value as the first value", () => {
      render(<AppointmentForm />);
      expect(firstOption(field("service")).value).toEqual("");
    });

    it("initially has the first option selected", () => {
      render(<AppointmentForm />);
      expect(firstOption(field("service")).selected).toBe(true);
    });

    it("lists all salon services", () => {
      const services = ["Cut", "Blow-dry"];

      render(<AppointmentForm selectableServices={services} />);

      expect(labelsOfAllOptions(field("service"))).toEqual(
        expect.arrayContaining(services)
      );
    });

    it("pre-selects the existing value", () => {
      const services = ["Cut", "Blow-dry"];
      render(
        <AppointmentForm
          selectableServices={services}
          service="Blow-dry"
        />
      );
      const option = findOption(field("service"), "Blow-dry");
      expect(option.selected).toBe(true);
    });

    it("renders a label", () => {
      render(<AppointmentForm />);
      expect(labelFor("service")).toContainText(
        "Salon service"
      );
    });

    it("assigns an id that matches the label id", () => {
      render(<AppointmentForm />);
      expect(field("service").id).toEqual("service");
    });

    it("saves existing value when submitted", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service="Blow-dry"
          onSubmit={({ service }) =>
            expect(service).toEqual("Blow-dry")
          }
        />
      );
      submit(form("appointment"));
    });

    it("saves new value when submitted", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service="Blow-dry"
          onSubmit={({ service }) =>
            expect(service).toEqual("Cut")
          }
        />
      );
      change(field("service"), withEvent("service", "Cut"));
      submit(form("appointment"));
    });
  });
});
