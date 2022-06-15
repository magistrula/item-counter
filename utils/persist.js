import isEmpty from 'lodash/isEmpty';

export function storeState(state) {
  localStorage.setItem(
    'counterState',
    JSON.stringify({
      categories: state.categories,
      items: state.items,
      name: state.name,
      isCurrPresetSaved: state.isCurrPresetSaved,
    })
  );
}

export function retrieveState() {
  return JSON.parse(localStorage.getItem('counterState'));
}

export function storePresets(presets) {
  localStorage.setItem('counterPresets', JSON.stringify(presets));
}

export function retrievePresets() {
  const presets = JSON.parse(localStorage.getItem('counterPresets'));
  return presets || [];
}
