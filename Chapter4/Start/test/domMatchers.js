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
