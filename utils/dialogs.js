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
