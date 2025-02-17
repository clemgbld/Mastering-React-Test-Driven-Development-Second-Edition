import {
  matcherHint,
  printExpected,
  printReceived,
} from "jest-matcher-utils";
import { equals } from "expect/build/jasmineUtils.js";

export const toBeRenderedWithProps = (
  mockedComponent,
  expectedProps
) => {
  const mockedCall =
    mockedComponent.mock.calls[
      mockedComponent.mock.calls.length - 1
    ];
  const actualProps = mockedCall ? mockedCall[0] : null;
  const pass = equals(actualProps, expectedProps);

  return { pass };
};
