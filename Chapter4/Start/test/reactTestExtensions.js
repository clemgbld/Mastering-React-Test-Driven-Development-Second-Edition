import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";

export let container;

export const initializeReactContainer = () =>
  (container = document.createElement("div"));

export const render = (component) =>
  act(() => ReactDOM.createRoot(container).render(component));

export const click = (element) =>
  act(() => Simulate.click(element));

export const element = (selector) =>
  container.querySelector(selector);

export const elements = (selector) =>
  Array.from(container.querySelectorAll(selector));

export const typesOf = (elements) =>
  elements.map((element) => element.type);

export const textOf = (elements) =>
  elements.map((element) => element.textContent);
