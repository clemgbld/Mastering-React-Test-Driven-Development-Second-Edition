import React, { useCallback } from "react";
import { Route, Link, Switch } from "react-router-dom";
import { AppointmentFormLoader } from "./AppointmentFormLoader";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
import { CustomerSearchRoute } from "./CustomerSearchRoute";
import { connect } from "react-redux";

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

export const App = ({ history, setCustomerForAppointment }) => {
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

const mapDispatchToProps = {
  setCustomerForAppointment: (customer) => ({
    type: "CUSTOMER_SELECTED",
    customer,
  }),
};

export const ConnectedApp = connect(
  null,
  mapDispatchToProps
)(App);
