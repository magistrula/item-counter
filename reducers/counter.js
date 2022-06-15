import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import without from 'lodash/without';

import { FOOD_BANK_PRESET } from '../constants/presets';

const DEFAULT_PRESETS = [FOOD_BANK_PRESET];

export function buildCounterState({
  allPresets = [],
  currPreset = null,
  isInitialized = false,
}) {
  return {
    isInitialized,
    isCurrPresetSaved: true,
    presets: sortBy(allPresets, ['name']),
    name: currPreset ? currPreset.name : null,
    categories: currPreset ? currPreset.categories : [],
    items: initItems(currPreset ? currPreset.items : []),
    error: null,
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
  return items.map(item => Object.assign({}, item, { count: 0 }));
}

function updateItems(state, updatedItems, extraStateProps) {
  return Object.assign({}, state, { items: updatedItems }, extraStateProps);
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

function areItemsEqual(itemsA, itemsB) {
  if (itemsA.length !== itemsB.length) {
    return false;
  }

  return isEqualWith(itemsA, itemsB, (item, otherItem) => {
    // Compare everything except item counts
    return (
      item.categoryId === otherItem.categoryId &&
      item.id === otherItem.id &&
      item.name === otherItem.name
    );
  });
}

/**
 * CATEGORY UTILS
 */

function updateCategories(state, updatedCategories) {
  return Object.assign({}, state, {
    categories: updatedCategories,
    isCurrPresetSaved: false,
  });
}

function findCategory(state, catName) {
  const lowerName = catName.toLowerCase();
  return state.categories.find(({ name }) => {
    return name.toLowerCase() === lowerName;
  });
}

function buildCategory(name) {
  return { name, id: `cat-${Date.now()}` };
}

/**
 * PRESET UTILS
 */

function presetExistsWithName(presets, name) {
  return presets.some(preset => preset.name === name);
}

/**
 * ACTION HANDLERS
 */

const ACTION_HANDLERS = {
  init: (state, { presets, savedState }) => {
    const savedName = savedState ? savedState.name : null;
    const currPreset = savedName
      ? find(presets, { name: savedName })
      : presets[0];
    const newState = buildCounterState({
      currPreset,
      allPresets: presets,
      isInitialized: true,
    });

    if (savedState) {
      Object.assign(newState, {
        name: savedState.name,
        categories: savedState.categories,
        items: savedState.items,
        isCurrPresetSaved: savedState.isCurrPresetSaved,
      });
    }

    return newState;
  },

  'use-preset': (state, { preset }) => {
    return Object.assign({}, state, {
      name: preset.name,
      categories: preset.categories,
      items: initItems(preset.items),
      isCurrPresetSaved: true,
    });
  },

  'create-preset': (state, { name }) => {
    if (presetExistsWithName(state.presets, name)) {
      return Object.assign({}, state, {
        error: `Counter "${name}" already exists`,
      });
    }

    const newPreset = {
      name,
      id: `preset-${Date.now()}`,
      categories: [],
      items: [],
    };

    return Object.assign({}, state, {
      presets: state.presets.concat([newPreset]),
      name: newPreset.name,
      categories: newPreset.categories,
      items: newPreset.items,
      isCurrPresetSaved: true,
    });
  },

  'rename-curr-preset': (state, { name }) => {
    const isNoop = name === state.name;
    if (isNoop) {
      return state;
    }

    const isNameConflict = presetExistsWithName(state.presets, name);
    if (isNameConflict) {
      return Object.assign({}, state, {
        error: `Counter "${name}" already exists`,
      });
    }

    const isCurrPresetStored = presetExistsWithName(state.presets, state.name);
    if (isCurrPresetStored) {
      const presets = state.presets.map(preset => {
        return preset.name === state.name
          ? Object.assign({}, preset, { name })
          : preset;
      });

      return Object.assign({}, state, { name, presets });
    }

    return Object.assign({}, state, { name });
  },

  'save-curr-preset': state => {
    const categories = state.categories;
    const items = initItems(state.items);

    const presets = state.presets.map(preset => {
      return preset.name === state.name
        ? Object.assign({}, preset, { categories, items })
        : preset;
    });

    return Object.assign({}, state, { presets });
  },

  'delete-curr-preset': state => {
    const currPresetName = state.name;
    const presets = state.presets.filter(pre => pre.name !== currPresetName);

    return buildCounterState({
      allPresets: presets,
      currPreset: presets[0],
      isInitialized: true,
    });
  },

  'did-store-presets': state => {
    const currPreset = find(state.presets, { name: state.name });
    if (
      currPreset &&
      areItemsEqual(state.items, currPreset.items) &&
      isEqual(state.categories, currPreset.categories)
    ) {
      return Object.assign({}, state, { isCurrPresetSaved: true });
    }

    return Object.assign({}, state, { isCurrPresetSaved: false });
  },

  'clear-counts': state => {
    return updateItems(state, initItems(state.items));
  },

  'clear-categories': state => {
    return Object.assign({}, state, {
      categories: [],
      items: [],
      isCurrPresetSaved: false,
    });
  },

  'clear-error': state => {
    return Object.assign({}, state, { error: null });
  },

  'add-category': (state, { name }) => {
    if (findCategory(state, name)) {
      return Object.assign({}, state, {
        error: `Category "${name}" already exists`,
      });
    }

    const updatedCategories = state.categories.concat([buildCategory(name)]);
    return updateCategories(state, updatedCategories);
  },

  'rename-category': (state, { catId, newName }) => {
    const trimmedName = newName.trim();
    const existingCategory = findCategory(state, trimmedName);

    const isUnchanged = !!existingCategory && existingCategory.id === catId;
    if (isUnchanged) {
      return state;
    }

    const isNameConflict = !!existingCategory && existingCategory.id !== catId;
    if (isNameConflict) {
      return Object.assign({}, state, {
        error: `Category "${trimmedName}" already exists`,
      });
    }

    const updatedCategories = state.categories.map(category => {
      return category.id === catId
        ? Object.assign({}, category, { name: trimmedName })
        : category;
    });
    return updateCategories(state, updatedCategories);
  },

  'remove-category': (state, { catId }) => {
    const category = find(state.categories, { id: catId });
    const updatedCategories = without(state.categories, category);
    return updateCategories(state, updatedCategories);
  },

  'add-item': (state, { catId, name }) => {
    const item = buildItem(name.toLowerCase(), catId);
    const updatedItems = [...state.items, item];
    return updateItems(state, updatedItems, { isCurrPresetSaved: false });
  },

  'rename-item': (state, { itemId, newName }) => {
    const isUnchanged = !!find(state.items, { id: itemId, name: newName });
    if (isUnchanged) {
      return state;
    }

    const updatedItems = [...state.items];
    const item = find(updatedItems, { id: itemId });
    item.name = newName;
    return updateItems(state, updatedItems, { isCurrPresetSaved: false });
  },

  'remove-item': (state, { itemId }) => {
    const item = find(state.items, { id: itemId });
    const updatedItems = without(state.items, item);
    return updateItems(state, updatedItems, { isCurrPresetSaved: false });
  },

  'increment-item': (state, { itemId, increment }) => {
    const updatedItems = [...state.items];
    const item = find(updatedItems, { id: itemId });
    item.count = (item.count || 0) + increment;
    return updateItems(state, updatedItems);
  },
};

export default function reducer(state, action) {
  if (ACTION_HANDLERS[action.type]) {
    console.log('Received action', action.type);
    return ACTION_HANDLERS[action.type](state, action.payload);
  }

  throw new Error('Unhandled action');
}
