import { fireEvent, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';

export default class BasePageObject {
  constructor({ scope }) {
    if (!scope) {
      throw new Error('Must specify scope for Page Object');
    }

    this.scope = scope;
  }

  getByTestId(testId, { resetScope } = {}) {
    if (resetScope) {
      return screen.getByTestId(testId);
    }

    return within(this.scope).getByTestId(testId);
  }

  queryByTestId(testId, { resetScope } = {}) {
    if (resetScope) {
      return screen.queryByTestId(testId);
    }

    return within(this.scope).queryByTestId(testId);
  }

  fireEventOnTestId(eventName, testId, { resetScope = false } = {}) {
    fireEvent[eventName](this.getByTestId(testId, { resetScope }));
  }

  clickByTestId(testId, { resetScope = false } = {}) {
    fireEvent.click(this.getByTestId(testId, { resetScope }));
  }

  isTestIdVisible(testId, { resetScope = false } = {}) {
    return this.queryByTestId(testId, { resetScope }) !== null;
  }
}
