import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import pick from 'lodash/pick';
import without from 'lodash/without';

import { FOOD_BANK_PRESET } from '../constants/presets';

export function init(preset = {}) {
  return {
    error: null,
    name: preset.name || 'Custom',
    categories: preset.categories || [],
    items: initItems(preset.items),
    presets: [FOOD_BANK_PRESET],
  };
}

/**
 * DERIVED DATA UTILS
 */

// TODO: implement using a selector after switch to redux
export function buildItemsByCategory(categories, items) {
  const validCategoryIds = (categories || []).map(cat => cat.id);
  return pick(groupBy(items, 'categoryId'), validCategoryIds);
}

/**
 * ITEM UTILS
 */

function initItems(items) {
  return (items || []).map(item => Object.assign({}, item, { count: 0 }));
}

function updateItems(state, updatedItems) {
  return Object.assign({}, state, { items: updatedItems });
}

function itemExists(state, name) {
  return name.toLowerCase() in state.items;
}

function buildItem(name, categoryId) {
  return { categoryId, name, id: `item-${Date.now()}`, count: 0 };
}

/**
 * CATEGORY UTILS
 */

 function updateCategories(state, updatedCategories) {
  return Object.assign({}, state, { categories: updatedCategories });
 }

 function categoryExists(state, catName) {
   const lowerName = catName.toLowerCase();
   return state.categories.find(({ name }) => {
     return name.toLowerCase() === lowerName;
   });
 }

 function buildCategory(name) {
   return { name, id: `cat-${new Date()}` };
 }

/**
 * ACTION HANDLERS
 */

function usePreset(state, preset) {
  return init(preset);
}

function restoreState(state, savedState) {
  return Object.assign({}, init(), savedState);
}

function clearCategories() {
  return init({
    categories: [],
    itemCounts: {},
    itemsByCategory: {},
  });
}

function clearError(state) {
  return Object.assign({}, state, { error: null });
}

function clearCounts(state) {
  return updateItems(state, initItems(state.items));
}

function addCategory(state, name) {
  if (categoryExists(state, name)) {
    return Object.assign({}, state, { error: 'Category already exists' });
  }

  const updatedCategories = state.categories.concat([buildCategory(name)]);
  return updateCategories(state, updatedCategories);
}

function renameCategory(state, { catId, newName }) {
  if (categoryExists(state, newName)) {
    return Object.assign({}, state, { error: 'Category already exists' });
  }

  const updatedCategories = [...state.categories];
  const category = find(updatedCategories, { id: catId });
  category.name = newName;
  return updateCategories(state, updatedCategories);
}

function removeCategory(state, catId) {
  const category = find(state.categories, { id: catId });
  const updatedCategories = without(state.categories, category);
  return updateCategories(state, updatedCategories);
}

function addItem(state, { catId, itemName }) {
  if (itemExists(state, itemName)) {
    return Object.assign({}, state, { error: 'Item already exists' });
  }

  const item = buildItem(itemName.toLowerCase(), catId);
  const updatedItems = [...state.items, item];
  return updateItems(state, updatedItems);
}

function renameItem(state, { itemId, newName }) {
  const isNotNameChange = !!find(state.items, { id: itemId, name: newName });
  if (isNotNameChange) {
    return state;
  }

  if (itemExists(state, newName)) {
    return Object.assign({}, state, { error: 'Item already exists' });
  }

  const updatedItems = [...state.items];
  const item = find(updatedItems, { id: itemId });
  item.name = newName;
  return updateItems(state, updatedItems);
}

function removeItem(state, { itemId }) {
  const item = find(state.items, { id: itemId });
  const updatedItems = without(state.items, item);
  return updateItems(state, updatedItems);
}

function incrementItem(state, { itemId, increment }) {
  const updatedItems = [...state.items];
  const item = find(updatedItems, { id: itemId });
  item.count = (item.count || 0) + increment;
  return updateItems(state, updatedItems);
}

export default function reducer(state, action) {
  switch (action.type) {
    case 'restore-state':
      return restoreState(state, action.payload);
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
    case 'rename-category':
      return renameCategory(state, action.payload);
    case 'remove-category':
      return removeCategory(state, action.payload);
    case 'add-item':
      return addItem(state, action.payload);
    case 'rename-item':
      return renameItem(state, action.payload);
    case 'remove-item':
      return removeItem(state, action.payload);
    case 'increment-item':
      return incrementItem(state, action.payload);
    default:
      throw new Error();
  }
}
