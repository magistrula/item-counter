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

function findItem(state, itemName) {
  const lowerName = itemName.toLowerCase();
  return state.items.find(({ name }) => {
    return name.toLowerCase() === lowerName;
  });
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

 function findCategory(state, catName) {
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

const ACTION_HANDLERS = {
  'use-preset': (state, preset) => {
    return init(preset);
  },

  'restore-state': (state, savedState) => {
    return Object.assign({}, init(), savedState);
  },

  'clear-counts': (state) => {
    return updateItems(state, initItems(state.items));
  },

  'clear-categories': () => {
    return init({
      categories: [],
      itemCounts: {},
      itemsByCategory: {},
    });
  },

  'clear-error': (state) => {
    return Object.assign({}, state, { error: null });
  },

  'add-category': (state, name) => {
    if (findCategory(state, name)) {
      return Object.assign({}, state, {
        error: `Category "${name}" already exists`
      });
    }

    const updatedCategories = state.categories.concat([buildCategory(name)]);
    return updateCategories(state, updatedCategories);
  },

  'rename-category': (state, { catId, newName }) => {
    const isUnchanged = !!find(state.categories, { id: catId, name: newName });
    if (isUnchanged) {
      return state;
    }

    const existingCategory = findCategory(state, newName);
    if (existingCategory && existingCategory.id !== catId) {
      return Object.assign({}, state, {
        error: `Category "${newName}" already exists`
      });
    }

    const updatedCategories = [...state.categories];
    const category = find(updatedCategories, { id: catId });
    category.name = newName;
    return updateCategories(state, updatedCategories);
  },

  'remove-category': (state, catId) => {
    const category = find(state.categories, { id: catId });
    const updatedCategories = without(state.categories, category);
    return updateCategories(state, updatedCategories);
  },

  'add-item': (state, { catId, itemName }) => {
    if (findItem(state, itemName)) {
      return Object.assign({}, state, {
        error: `Item "${itemName}" already exists`
      });
    }

    const item = buildItem(itemName.toLowerCase(), catId);
    const updatedItems = [...state.items, item];
    return updateItems(state, updatedItems);
  },

  'rename-item': (state, { itemId, newName }) => {
    const isUnchanged = !!find(state.items, { id: itemId, name: newName });
    if (isUnchanged) {
      return state;
    }

    const existingItem = findItem(state, newName);
    if (existingItem && existingItem.id !== itemId) {
      return Object.assign({}, state, {
        error: `Item "${newName}" already exists`
      });
    }

    const updatedItems = [...state.items];
    const item = find(updatedItems, { id: itemId });
    item.name = newName;
    return updateItems(state, updatedItems);
  },

  'remove-item': (state, { itemId }) => {
    const item = find(state.items, { id: itemId });
    const updatedItems = without(state.items, item);
    return updateItems(state, updatedItems);
  },

  'increment-item': (state, { itemId, increment }) => {
    const updatedItems = [...state.items];
    const item = find(updatedItems, { id: itemId });
    item.count = (item.count || 0) + increment;
    return updateItems(state, updatedItems);
  }
};

export default function reducer(state, action) {
  if (ACTION_HANDLERS[action.type]) {
    return ACTION_HANDLERS[action.type](state, action.payload);
  }

  throw new Error('Unhandled action');
}
