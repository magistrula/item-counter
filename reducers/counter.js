import { map, without, union } from 'lodash';

export function init(preset) {
  return {
    error: null,
    preset: preset.name || 'Custom',
    categories: preset.categories || [],
    itemCounts: initItemCounts(preset.categories),
  };
}

function initItemCounts(categories) {
  const allItems = union(...map(categories || [], 'items'));
  return allItems.reduce((acc, itemName) => {
    acc[itemName] = 0;
    return acc;
  }, {});
}

function categoryExists(state, catName) {
  const lowerName = catName.toLowerCase();
  return state.categories.find(({ name }) => {
    return name.toLowerCase() === lowerName;
  });
};

function itemExists(state, name) {
  return name.toLowerCase() in state.itemCounts;
};

function usePreset(state, preset) {
  return init(preset);
}

function clearCategories() {
  return init({ categories: [] });
}

function clearError(state) {
  return Object.assign({}, state, { error: null });
}

function clearCounts(state) {
  return updateItemCounts(state, initItemCounts(state.categories));
}

function addCategory(state, name) {
  if (categoryExists(state, name)) {
    return Object.assign({}, state, { error: 'Category already exists' });
  }

  const updatedCategories = state.categories.concat([makeCategory(name)]);
  return updateCategories(state, updatedCategories);
}

function editCategory(state, { catIdx, newName }) {
  if (categoryExists(state, newName)) {
    return Object.assign({}, state, { error: 'Category already exists' });
  }

  const updatedCategories = [...state.categories];
  updatedCategories[catIdx].name = newName;
  return updateCategories(state, updatedCategories);
}

function removeCategory(state, catIdx) {
  const updatedCategories = without(state.categories, state.categories[catIdx]);
  return updateCategories(state, updatedCategories);
}

function addItem(state, { catIdx, itemName }) {
  if (itemExists(state, itemName)) {
    return Object.assign({}, state, { error: 'Item already exists' });
  }

  const lowerName = itemName.toLowerCase();
  const updatedCategories = [...state.categories];
  updatedCategories[catIdx].items = updatedCategories[catIdx].items.concat([lowerName]);
  const newState = updateCategories(state, updatedCategories);

  const updatedCounts = assignItemCount(newState, lowerName, 0);
  return updateItemCounts(newState, updatedCounts);
}

function editItem(state, { catIdx, oldName, newName }) {
  if (itemExists(state, newName)) {
    return Object.assign({}, state, { error: 'Item already exists' });
  }

  const updatedCategories = [...state.categories];
  const items = updatedCategories[catIdx].items;
  items[items.indexOf(oldName)] = newName;
  const newState = updateCategories(state, updatedCategories);

  const count = state.itemCounts[oldName.toLowerCase()] || 0;
  const updatedCounts = assignItemCount(newState, newName, count);
  delete updatedCounts[oldName];
  return updateItemCounts(newState, updatedCounts);
}

function removeItem(state, { catIdx, itemName }) {
  const updatedCategories = [...state.categories];
  updatedCategories[catIdx].items = without(
    updatedCategories[catIdx].items,
    itemName
  );
  const newState = updateCategories(state, updatedCategories);

  const updatedCounts = Object.assign({}, state.itemCounts);
  delete updatedCounts[itemName.toLowerCase()];
  return updateItemCounts(newState, updatedCounts);
}

function incrementItem(state, { itemName, increment }) {
  const count = (state.itemCounts[itemName.toLowerCase()] || 0) + increment;
  const updatedCounts = assignItemCount(state, itemName, count);
  return updateItemCounts(state, updatedCounts);
}

function makeCategory(name) {
  return { name, items: [] };
}

function updateCategories(state, updatedCategories) {
  return Object.assign({}, state, { categories: updatedCategories });
}

function updateItemCounts(state, updatedCounts) {
  return Object.assign({}, state, { itemCounts: updatedCounts });
}

function assignItemCount(state, itemName, itemCount) {
  return Object.assign({}, state.itemCounts, {
    [itemName.toLowerCase()]: itemCount >= 0 ? itemCount : 0
  });
}

export default function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return init(action.payload);
    case 'clear-error':
      return clearError(state);
    case 'use-preset':
      return usePreset(state, action.payload);
    case 'clear-categories':
      return clearCategories(state);
    case 'clear-counts':
      return clearCounts(state);
    case 'add-category':
      return addCategory(state, action.payload);
    case 'edit-category':
      return editCategory(state, action.payload);
    case 'remove-category':
      return removeCategory(state, action.payload);
    case 'add-item':
      return addItem(state, action.payload);
    case 'edit-item':
      return editItem(state, action.payload);
    case 'remove-item':
      return removeItem(state, action.payload);
    case 'increment-item':
      return incrementItem(state, action.payload);
    default:
      throw new Error();
  }
}
