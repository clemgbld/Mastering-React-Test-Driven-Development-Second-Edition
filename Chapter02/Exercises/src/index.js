import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./Appointment";
import { sampleAppointments } from "./sampleData";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppointmentsDayView appointments={sampleAppointments} />
);
