import isEmpty from 'lodash/isEmpty';

export function saveState(state) {
  localStorage.setItem('counterState', JSON.stringify(state));
}

export function retrieveState() {
  const savedState = JSON.parse(localStorage.getItem('counterState'));

  if (savedState && !isEmpty(savedState.categories)) {
    return savedState;
  }

  return null;
}
