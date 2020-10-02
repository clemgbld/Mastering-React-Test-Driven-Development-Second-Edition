import React from "react";
import { expectRedux } from "expect-redux";
import { act } from "react-dom/test-utils";
import { bodyOfLastFetchRequest } from "./spyHelpers";
import {
  fetchResponseOk,
  fetchResponseError,
} from "./builders/fetch";
import {
  initializeReactContainer,
  renderWithStore,
  form,
  field,
  element,
  elements,
  clickAndWait,
  submitButton,
  labelFor,
  change,
  store,
} from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";
import { today, todayAt, tomorrowAt } from "./builders/time";
import { blankAppointment } from "./builders/appointment";

describe("AppointmentForm", () => {
  const availableTimeSlots = [
    {
      startsAt: todayAt(9),
      stylists: ["Ashley", "Jo"],
    },
    {
      startsAt: todayAt(9, 30),
      stylists: ["Ashley"],
    },
  ];

  const services = ["Cut", "Blow-dry"];
  const stylists = ["Asley", "Jo"];

  const testProps = {
    today,
    selectableServices: services,
    selectableStylists: stylists,
    availableTimeSlots,
    original: blankAppointment,
    onSave: () => {},
  };

  beforeEach(() => {
    initializeReactContainer();
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk({}));
  });

  const startsAtField = (index) =>
    elements("input[name=startsAt]")[index];

  const labelsOfAllOptions = (element) =>
    Array.from(element.childNodes, (node) => node.textContent);

  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find(
      (option) => option.textContent === textContent
    );
  };

  it("renders a form", () => {
    renderWithStore(<AppointmentForm {...testProps} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    renderWithStore(<AppointmentForm {...testProps} />);
    expect(submitButton()).not.toBeNull();
  });

  it("dispatches ADD_APPOINTMENT_REQUEST when submitting data", async () => {
    const appointment = {
      service: "Blow-dry",
      startsAt: 123,
      stylist: "Joe",
    };
    const exampleCustomer = { id: 123 };
    store.dispatch({
      type: "SET_CUSTOMER_FOR_APPOINTMENT",
      customer: exampleCustomer,
    });

    renderWithStore(
      <AppointmentForm {...testProps} original={appointment} />
    );
    await clickAndWait(submitButton());

    return expectRedux(store).toDispatchAnAction().matching({
      type: "ADD_APPOINTMENT_REQUEST",
      appointment,
      customer: exampleCustomer,
    });
  });

  it("renders error message when error prop is true", async () => {
    renderWithStore(<AppointmentForm {...testProps} />);
    await act(async () =>
      store.dispatch({ type: "ADD_APPOINTMENT_FAILED" })
    );

    expect(element(".error")).toContainText("error occurred");
  });

  it("passes the customer id to fetch when submitting", async () => {
    renderWithStore(<AppointmentForm {...testProps} />);
    await act(async () =>
      store.dispatch({
        type: "SET_CUSTOMER_FOR_APPOINTMENT",
        customer: { id: "123" },
      })
    );
    await clickAndWait(submitButton());
    expect(bodyOfLastFetchRequest()).toMatchObject({
      customer: "123",
    });
  });

  const itRendersAsASelectBox = (fieldName) => {
    it("renders as a select box", () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      expect(field(fieldName)).toBeElementWithTag("select");
    });
  };

  const itInitiallyHasABlankValueChosen = (fieldName) => {
    it("has a blank value as the first value", () => {
      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={blankAppointment}
        />
      );
      const firstOption = field(fieldName).childNodes[0];
      expect(firstOption.value).toEqual("");
    });
  };

  const itPreselectsExistingValue = (fieldName, existing) => {
    it("pre-selects the existing value", () => {
      const appointment = { [fieldName]: existing };
      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );
      const option = findOption(field(fieldName), existing);
      expect(option.selected).toBe(true);
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the field", () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`render '${text}' as the label content`, () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id", () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, existing) => {
    it("saves existing value when submitted", async () => {
      const appointment = { [fieldName]: existing };
      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject(
        appointment
      );
    });
  };

  const itSubmitsNewValue = (fieldName, newValue) => {
    it("saves new value when submitted", async () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      change(field(fieldName), newValue);
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject({
        [fieldName]: newValue,
      });
    });
  };

  describe("service field", () => {
    itRendersAsASelectBox("service");
    itInitiallyHasABlankValueChosen("service");
    itPreselectsExistingValue("service", "Cut");
    itRendersALabel("service", "Salon service");
    itAssignsAnIdThatMatchesTheLabelId("service");
    itSubmitsExistingValue("service", "Cut");
    itSubmitsNewValue("service", "Blow-dry");

    it("lists all salon services", () => {
      renderWithStore(
        <AppointmentForm
          {...testProps}
          selectableServices={services}
        />
      );

      expect(labelsOfAllOptions(field("service"))).toEqual(
        expect.arrayContaining(services)
      );
    });
  });

  describe("stylist field", () => {
    itRendersAsASelectBox("stylist");
    itInitiallyHasABlankValueChosen("stylist");
    itPreselectsExistingValue("stylist", "Jo");
    itRendersALabel("stylist", "Stylist");
    itAssignsAnIdThatMatchesTheLabelId("stylist");
    itSubmitsExistingValue("stylist", "Jo");
    itSubmitsNewValue("stylist", "Jo");

    it("lists only stylists that can perform the selected service", () => {
      const selectableServices = ["1", "2"];
      const selectableStylists = ["A", "B", "C"];
      const serviceStylists = {
        1: ["A", "B"],
      };

      const appointment = { service: "1" };

      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={appointment}
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      expect(labelsOfAllOptions(field("stylist"))).toEqual(
        expect.arrayContaining(["A", "B"])
      );
    });
  });

  describe("time slot table", () => {
    it("renders a table for time slots with an id", () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      expect(element("table#time-slots")).not.toBeNull();
    });

    it("renders a time slot for every half an hour between open and close times", () => {
      renderWithStore(
        <AppointmentForm
          {...testProps}
          salonOpensAt={9}
          salonClosesAt={11}
        />
      );
      const timesOfDayHeadings = elements("tbody >* th");
      expect(timesOfDayHeadings[0]).toContainText("09:00");
      expect(timesOfDayHeadings[1]).toContainText("09:30");
      expect(timesOfDayHeadings[3]).toContainText("10:30");
    });

    it("renders an empty cell at the start of the header row", () => {
      renderWithStore(<AppointmentForm {...testProps} />);
      const headerRow = element("thead > tr");
      expect(headerRow.firstChild).toContainText("");
    });

    it("renders a week of available dates", () => {
      const specificDate = new Date(2018, 11, 1);
      renderWithStore(
        <AppointmentForm {...testProps} today={specificDate} />
      );
      const dates = elements("thead >* th:not(:first-child)");
      expect(dates).toHaveLength(7);
      expect(dates[0]).toContainText("Sat 01");
      expect(dates[1]).toContainText("Sun 02");
      expect(dates[6]).toContainText("Fri 07");
    });

    const cellsWithRadioButtons = () =>
      elements("input[type=radio]").map((el) =>
        elements("td").indexOf(el.parentNode)
      );

    it("renders radio buttons in the correct table cell positions", () => {
      const availableTimeSlots = [
        {
          startsAt: todayAt(9),
          stylists: ["Ashley"],
        },
        {
          startsAt: todayAt(9, 30),
          stylists: ["Ashley"],
        },
        {
          startsAt: tomorrowAt(9, 30),
          stylists: ["Ashley"],
        },
      ];

      renderWithStore(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );
      expect(cellsWithRadioButtons()).toEqual([0, 7, 8]);
    });

    it("does not render radio buttons for unavailable time slots", () => {
      renderWithStore(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={[]}
        />
      );
      expect(elements("input[type=radio]")).toHaveLength(0);
    });

    it("sets radio button values to the startsAt value of the corresponding appointment", () => {
      renderWithStore(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );
      const allRadioValues = elements("input[type=radio]").map(
        ({ value }) => parseInt(value)
      );
      const allSlotTimes = availableTimeSlots.map(
        ({ startsAt }) => startsAt
      );
      expect(allRadioValues).toEqual(allSlotTimes);
    });

    it("pre-selects the existing value", () => {
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };
      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={appointment}
          availableTimeSlots={availableTimeSlots}
        />
      );
      expect(startsAtField(1).checked).toEqual(true);
    });

    it("saves existing value when submitted", async () => {
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };
      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject({
        startsAt: appointment.startsAt,
      });
    });

    it("saves new value when submitted", async () => {
      const appointment = {
        startsAt: availableTimeSlots[0].startsAt,
      };
      renderWithStore(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );
      await clickAndWait(startsAtField(1));
      await clickAndWait(submitButton());

      expect(bodyOfLastFetchRequest()).toMatchObject({
        startsAt: availableTimeSlots[1].startsAt,
      });
    });

    it("filters appointments by selected stylist", () => {
      const availableTimeSlots = [
        {
          startsAt: todayAt(9),
          stylists: ["Ashley"],
        },
        {
          startsAt: todayAt(9, 30),
          stylists: ["Jo"],
        },
      ];

      renderWithStore(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );

      change(field("stylist"), "Jo");

      expect(cellsWithRadioButtons()).toEqual([7]);
    });
  });
});
