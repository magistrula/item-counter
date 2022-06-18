export function mockGetItem(implementationFn) {
  jest
    .spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
    .mockImplementation(implementationFn || (() => {}));
}

export function mockSetItem(implementationFn) {
  jest
    .spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')
    .mockImplementation(implementationFn || (() => {}));
}

export function expectSetItem(mockFn, localStorageKey, expected) {
  const calls = mockFn.mock.calls.filter(call => call[0] === localStorageKey);
  if (calls.length === 0) {
    expect(mockFn).toHaveBeenCalledWith(
      expected,
      `mock not called with ${localStorageKey}`
    );
  }

  for (let i = 0; i < calls.length; i++) {
    try {
      const parsedJSON = JSON.parse(calls[i][1]);
      expect(parsedJSON).toStrictEqual(expected);
      return;
    } catch (e) {
      if (i < calls.length - 1) {
        continue;
      } else {
        expect(mockFn).toHaveBeenCalledWith(
          expected,
          `${localStorageKey} not set with stringified version of this content`
        );
      }
    }
  }
}

export function expectSetItemNotCalled(mockFn, localStorageKey) {
  expect(mockFn).not.toHaveBeenCalledWith(localStorageKey, expect.anything());
}
