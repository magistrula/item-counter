import { fireEvent, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';

function query(queryMethod) {
  return function (testId, { resetScope } = {}) {
    return resetScope ?
      screen[queryMethod](testId) :
      within(this.scope)[queryMethod](testId);
  }
}

export default class BasePageObject {
  constructor({ scope }) {
    if (!scope) {
      throw new Error('Must specify scope for Page Object');
    }

    this.scope = scope;
    this.getByTestId = query('getByTestId');
    this.queryByTestId = query('queryByTestId');
    this.findByTestId = query('findByTestId');
    this.getAllByTestId = query('getAllByTestId');
    this.queryAllByTestId = query('queryAllByTestId');
    this.findAllByTestId = query('findAllByTestId');
  }

  collection(testId, { PageObject, resetScope = false } = {}) {
    return this.queryAllByTestId(testId, { resetScope }).map(element => (
      new PageObject({ scope: element })
    ));
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

  textForTestId(testId, { resetScope = false } = {}) {
    return this.getByTestId(testId, { resetScope}).textContent;
  }
}
