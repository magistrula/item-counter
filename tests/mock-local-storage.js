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
