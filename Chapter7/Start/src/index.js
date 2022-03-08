import React from "react";
import ReactDOM from "react-dom";
import { AppointmentForm } from "./AppointmentForm";
import {
  sampleAppointments,
  sampleAvailableTimeSlots,
} from "./sampleData";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppointmentForm
    original={{}}
    availableTimeSlots={sampleAvailableTimeSlots}
    appointments={sampleAppointments}
    onSave={() => {}}
  />
);
