expect.extend({
  toContainText(received, expectedTextContent) {
    const options = {};
    const pass = received.textContent.includes(
      expectedTextContent
    );
    if (pass) {
      return {
        message: () =>
          this.utils.matcherHint(
            "toContainText",
            undefined,
            undefined,
            options
          ) +
          "\n\n" +
          `Expected: not to contain ${this.utils.printExpected(
            expectedTextContent
          )}\n` +
          `Received: ${this.utils.printReceived(
            received.textContent
          )}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          this.utils.matcherHint(
            "toContainText",
            undefined,
            undefined,
            options
          ) +
          "\n\n" +
          `Expected: to contain text ${this.utils.printExpected(
            expectedTextContent
          )}\n` +
          `Received: ${this.utils.printReceived(
            received.textContent
          )}`,
        pass: false,
      };
    }
  },
});

const inputTagWithType = (type) => `<input type=${type}>`;
const inputOrUnknownTag = (element) =>
  element.tagName === "INPUT"
    ? `<input type=${element.type}>`
    : `<${element.tagName.toLowerCase()}>`;

expect.extend({
  toBeInputFieldOfType(received, expectedType) {
    const options = {};
    const pass =
      received !== null &&
      received.tagName === "INPUT" &&
      received.type === expectedType;
    const elString = inputTagWithType(expectedType);
    if (pass) {
      return {
        message: () =>
          this.utils.matcherHint(
            "toBeInputFieldOfType",
            undefined,
            undefined,
            options
          ) +
          "\n\n" +
          `Expected: element not to match ${this.utils.printExpected(
            elString
          )}\n` +
          `Received: ${this.utils.printReceived(elString)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          this.utils.matcherHint(
            "toBeInputFieldOfType",
            undefined,
            undefined,
            options
          ) +
          "\n\n" +
          `Expected: element to match ${this.utils.printExpected(
            elString
          )}\n` +
          `Received: ${this.utils.printReceived(
            inputOrUnknownTag(received)
          )}`,
        pass: false,
      };
    }
  },
});
