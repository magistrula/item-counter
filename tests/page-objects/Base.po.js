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

    // Map react testing library query methods onto page object
    ['get', 'find', 'query'].forEach((verb) => {
      ['TestId', 'Text'].forEach((target) => {
        this[`${verb}By${target}`] = query(`${verb}By${target}`);
        this[`${verb}AllBy${target}`] = query(`${verb}AllBy${target}`);
      });
    });
  }

  collection(testId, { PageObject, resetScope = false } = {}) {
    return this.queryAllByTestId(testId, { resetScope }).map(element => (
      new PageObject({ scope: element })
    ));
  }

  fireEventOnTestId(eventName, testId, options = {}) {
    const { resetScope, ...eventProps } = options;
    fireEvent[eventName](this.getByTestId(testId, { resetScope }), eventProps);
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
