import React, { useState, useCallback } from "react";
import { Route, Link, Switch } from "react-router-dom";
import { AppointmentFormLoader } from "./AppointmentFormLoader";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
import { CustomerSearchRoute } from "./CustomerSearchRoute";

const blankCustomer = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const blankAppointment = {
  service: "",
  stylist: "",
  startsAt: null,
};

export const MainScreen = () => (
  <>
    <menu>
      <li>
        <Link to="/addCustomer" role="button">
          Add customer and appointment
        </Link>
      </li>
      <li>
        <Link to="/searchCustomers" role="button">
          Search customers
        </Link>
      </li>
    </menu>
    <AppointmentsDayViewLoader />
  </>
);

export const App = ({ history }) => {
  const [customer, setCustomer] = useState();

  const transitionToAddAppointment = useCallback(
    (customer) => {
      setCustomer(customer);
      history.push("/addAppointment");
    },
    [history]
  );

  const transitionToDayView = useCallback(
    () => history.push("/"),
    [history]
  );

  const searchActions = (customer) => (
    <button
      onClick={() => transitionToAddAppointment(customer)}
    >
      Create appointment
    </button>
  );

  return (
    <Switch>
      <Route
        path="/addCustomer"
        render={() => (
          <CustomerForm
            original={blankCustomer}
            onSave={transitionToAddAppointment}
          />
        )}
      />
      <Route
        path="/addAppointment"
        render={() => (
          <AppointmentFormLoader
            original={{
              ...blankAppointment,
              customer: customer.id,
            }}
            onSave={transitionToDayView}
          />
        )}
      />
      <Route
        path="/searchCustomers"
        render={(props) => (
          <CustomerSearchRoute
            {...props}
            renderCustomerActions={searchActions}
          />
        )}
      />
      <Route component={MainScreen} />
    </Switch>
  );
};
