import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import without from 'lodash/without';

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
 * TODO: implement using a selector after switch to redux
 */

export function buildItemsByCategory(categories, items) {
  const validCategoryIds = (categories || []).map(cat => cat.id);
  return pick(groupBy(items, 'categoryId'), validCategoryIds);
}

export function hasNonZeroItemCounts(items) {
  return items.some(item => item.count > 0);
}

/**
 * ITEM UTILS
 */

function initItems(items) {
  return items.map(item => ({ ...item, count: 0 }));
}

function updateItems(state, updatedItems, extraStateProps) {
  return { ...state, items: updatedItems, ...extraStateProps };
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

function findItemInCategory(state, itemName, catId) {
  const lowerName = itemName.toLowerCase();
  return state.items.find(item => {
    return item.name.toLowerCase() === lowerName && item.categoryId === catId;
  });
}

/**
 * CATEGORY UTILS
 */

function updateCategories(state, updatedCategories) {
  return {
    ...state,
    categories: updatedCategories,
    isCurrPresetSaved: false,
  };
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
      });
    }

    return newState;
  },

  'use-preset': (state, { preset }) => {
    return {
      ...state,
      name: preset.name,
      categories: preset.categories,
      items: initItems(preset.items),
      isCurrPresetSaved: true,
    };
  },

  'create-preset': (state, { name }) => {
    if (presetExistsWithName(state.presets, name)) {
      return { ...state, error: `Counter "${name}" already exists` };
    }

    const newPreset = {
      name,
      id: `preset-${Date.now()}`,
      categories: [],
      items: [],
    };

    return {
      ...state,
      presets: state.presets.concat([newPreset]),
      name: newPreset.name,
      categories: newPreset.categories,
      items: newPreset.items,
      isCurrPresetSaved: true,
    };
  },

  'rename-curr-preset': (state, { name }) => {
    const isNoop = name === state.name;
    if (isNoop) {
      return state;
    }

    const isNameConflict = presetExistsWithName(state.presets, name);
    if (isNameConflict) {
      return { ...state, error: `Counter "${name}" already exists` };
    }

    const presets = state.presets.map(preset => {
      return preset.name === state.name ? { ...preset, name } : preset;
    });

    return { ...state, name, presets };
  },

  'save-curr-preset': state => {
    const categories = state.categories;
    const items = state.items.map(item => omit(item, ['count']));

    const presets = state.presets.map(preset => {
      return preset.name === state.name
        ? { ...preset, categories, items }
        : preset;
    });

    return { ...state, presets };
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
      return { ...state, isCurrPresetSaved: true };
    }

    return { ...state, isCurrPresetSaved: false };
  },

  'clear-counts': state => {
    return updateItems(state, initItems(state.items));
  },

  'clear-categories': state => {
    return {
      ...state,
      categories: [],
      items: [],
      isCurrPresetSaved: false,
    };
  },

  'clear-error': state => {
    return { ...state, error: null };
  },

  'add-category': (state, { name }) => {
    if (findCategory(state, name)) {
      return { ...state, error: `Category "${name}" already exists` };
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
      return { ...state, error: `Category "${trimmedName}" already exists` };
    }

    const updatedCategories = state.categories.map(category => {
      return category.id === catId
        ? { ...category, name: trimmedName }
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
    if (findItemInCategory(state, name, catId)) {
      return {
        ...state,
        error: `Item "${name}" already exists in this category`,
      };
    }

    const item = buildItem(name, catId);
    const updatedItems = [...state.items, item];
    return updateItems(state, updatedItems, { isCurrPresetSaved: false });
  },

  'rename-item': (state, { itemId, newName }) => {
    const item = find(state.items, { id: itemId });
    const isSameName = item.name.toLowerCase() === newName.toLowerCase();

    if (!isSameName && findItemInCategory(state, newName, item.categoryId)) {
      return {
        ...state,
        error: `Item "${newName}" already exists in this category`,
      };
    }

    const updatedItems = state.items.map(item => {
      return item.id === itemId ? { ...item, name: newName } : item;
    });
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
    // console.log('Received action', action.type);
    return ACTION_HANDLERS[action.type](state, action.payload);
  }

  throw new Error('Unhandled action');
}
