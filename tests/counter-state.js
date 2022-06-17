export function buildStateFromPreset(preset, {
  itemCounts = {},
  isCurrPresetSaved = true
} = {}) {
  const items = preset.items.map(item => (
    Object.assign({}, item, { count: itemCounts[item.id] || 0 })
  ));
  return {
    isCurrPresetSaved,
    items,
    name: preset.name,
    categories: preset.categories,
  };
}
