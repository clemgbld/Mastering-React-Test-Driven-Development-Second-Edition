import React from "react";
import {
  initializeReactContainer,
  container,
  render,
  element,
} from "../reactTestExtensions";
import { Link } from "react-router-dom";
import { RouterButton } from "../../src/CustomerSearch/RouterButton";

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ children }) => (
    <div id="Link">{children}</div>
  )),
}));

describe("RouterButton", () => {
  const pathname = "/path";
  const queryParams = { a: "123", b: "234" };

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a Link", () => {
    render(
      <RouterButton
        pathname={pathname}
        queryParams={queryParams}
      />
    );
    expect(container.firstChild).toEqual(element("#Link"));
    expect(Link).toBeRenderedWithProps({
      className: "button",
      to: {
        pathname: "/path",
        search: "?a=123&b=234",
      },
    });
  });

  it("renders children", () => {
    render(
      <RouterButton queryParams={queryParams}>
        child text
      </RouterButton>
    );
    expect(element("#Link")).toContainText("child text");
  });

  it("adds disabled class if disabled prop is true", () => {
    render(
      <RouterButton disabled={true} queryParams={queryParams} />
    );
    expect(Link).toBeRenderedWithProps(
      expect.objectContaining({
        className: expect.stringMatching("disabled"),
      })
    );
  });
});
