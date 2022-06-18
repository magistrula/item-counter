export function buildState(preset, { itemCounts = {} } = {}) {
  const items = preset.items.map(item => ({
    ...item,
    count: itemCounts[item.id] || 0,
  }));

  return {
    items,
    name: preset.name,
    categories: preset.categories,
  };
}

export function buildStateItem(presetItem, extraProps = {}) {
  return { ...presetItem, count: 0, ...extraProps };
}
