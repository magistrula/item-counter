export function promptCounterName(defaultName) {
  return (window.prompt('Enter name for counter.', defaultName) || '').trim();
}

export function promptCategoryName(defaultName) {
  return (window.prompt('Enter category name.', defaultName) || '').trim();
}

export function promptItemName(defaultName) {
  return (window.prompt('Enter item name.', defaultName) || '').trim();
}

export function confirmDeleteCounter(name) {
  return window.confirm(`Delete counter "${name}"?`);
}

export function confirmDeleteCategory(name) {
  return window.confirm(`Delete category "${name}"?`);
}

export function confirmDeleteItem(name) {
  return window.confirm(`Delete item "${name}"?`)
}

export function confirmLeaveCurrPreset({ hasCounts, isSaved, items, name }) {
  if (hasCounts && !window.confirm(`Discard "${name}" counts?`)) {
    return false;
  }

  if (
    !isSaved &&
    !window.confirm(`Proceed without saving changes to "${name}" config?`)
  ) {
    return false;
  }

  return true;
}
