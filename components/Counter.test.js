/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import {
  expectSetItem,
  expectSetItemNotCalled,
  mockGetItem,
  mockSetItem,
} from 'tests/mock-local-storage';
import { buildStateItem, buildState } from 'tests/counter-state';

import Counter from 'app/components/Counter';
import CounterPageObject from 'app/components/Counter.po';

const FOO_CAT1_ID = 'foo-cat-1-id';
const FOO_CAT1_NAME = 'Foo Category 1';
const FOO_CAT2_ID = 'foo-cat-2-id';
const FOO_CAT2_NAME = 'Foo Category 2';
const FOO_ITEM_1A = {
  id: 'item-a-id',
  name: 'Item A',
  categoryId: FOO_CAT1_ID,
};
const FOO_ITEM_1B = {
  id: 'item-b-id',
  name: 'Item B',
  categoryId: FOO_CAT1_ID,
};
const FOO_ITEM_1C = {
  id: 'item-c-id',
  name: 'Item C',
  categoryId: FOO_CAT1_ID,
};
const FOO_ITEM_2D = {
  id: 'item-d-id',
  name: 'Item D',
  categoryId: FOO_CAT2_ID,
};
const FOO_PRESET = {
  id: 'foo-preset',
  name: 'Foo Counter',
  categories: [
    { id: FOO_CAT1_ID, name: FOO_CAT1_NAME },
    { id: FOO_CAT2_ID, name: FOO_CAT2_NAME },
  ],
  items: [FOO_ITEM_1A, FOO_ITEM_1B, FOO_ITEM_1C, FOO_ITEM_2D],
};
const FOO_STATE = buildState(FOO_PRESET);

const BAR_CAT3_ID = 'bar-cat-3-id';
const BAR_CAT3_NAME = 'Bar Category 3';
const BAR_ITEM_3E = {
  id: 'item-e-id',
  name: 'Item F',
  categoryId: BAR_CAT3_ID,
};
const BAR_ITEM_3F = {
  id: 'item-f-id',
  name: 'Item G',
  categoryId: BAR_CAT3_ID,
};
const BAR_PRESET = {
  id: 'bar-preset',
  name: 'Bar Counter',
  categories: [{ id: BAR_CAT3_ID, name: BAR_CAT3_NAME }],
  items: [BAR_ITEM_3E, BAR_ITEM_3F],
};

const BAZ_PRESET = {
  id: 'baz-preset',
  name: 'Baz Counter',
  categories: [],
  items: [],
};

const NEW_NAME = 'New Thing';
const NOW_DATE = 1234567890;

function doRender({ clearMocks = true } = {}) {
  const { container } = render(<Counter />);

  if (clearMocks) {
    // Clear getItem & setItem calls that run on initial render
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  }

  return new CounterPageObject({ scope: container });
}

function mockStoredData({ presets, state } = {}) {
  mockGetItem(key => {
    if (key === 'counterState') {
      return JSON.stringify(state || null);
    }

    if (key === 'counterPresets') {
      return JSON.stringify(presets || null);
    }

    throw new Error('Unexpected localStorage lookup');
  });
}

beforeEach(() => {
  mockSetItem();
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  jest.spyOn(window, 'prompt').mockReturnValue(NEW_NAME);
  jest.spyOn(Date, 'now').mockReturnValue(NOW_DATE);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('initial load', () => {
  it('does not clear existing presets', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    doRender({ clearMocks: false });

    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'counterPresets',
      '[]'
    );
  });

  it('does not clear existing state', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    doRender({ clearMocks: false });

    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'counterState',
      expect.stringContaining('"items":[]')
    );
  });

  // This should not happen; need redux saga or thunk to avoid this
  it('resaves existing presets', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    doRender({ clearMocks: false });

    expectSetItem(localStorage.setItem, 'counterPresets', [FOO_PRESET]);
  });

  // This should not happen; need redux saga or thunk to avoid this
  it('resaves existing state', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    doRender({ clearMocks: false });

    expectSetItem(localStorage.setItem, 'counterState', FOO_STATE);
  });

  it('can restore state with unsaved category changes', () => {
    const unsavedCategories = FOO_STATE.categories.concat({
      id: 'unsaved-category',
      name: 'Unsaved Category',
    });
    mockStoredData({
      state: { ...FOO_STATE, categories: unsavedCategories },
      presets: [FOO_PRESET],
    });

    const view = doRender({ clearMocks: false });

    expect(view.isSaveButtonDisabled).toEqual(false);
    expect(view.categoryLabels).toEqual([
      FOO_CAT1_NAME,
      FOO_CAT2_NAME,
      'Unsaved Category',
    ]);
  });

  it('can restore state with unsaved item changes', () => {
    const unsavedItems = FOO_STATE.items.concat({
      id: 'unsaved-item',
      name: 'Unsaved Item',
      categoryId: FOO_CAT2_ID,
      count: 0,
    });
    mockStoredData({
      state: { ...FOO_STATE, items: unsavedItems },
      presets: [FOO_PRESET],
    });

    const view = doRender({ clearMocks: false });

    expect(view.isSaveButtonDisabled).toEqual(false);
    expect(view.itemNamesForCategory(FOO_CAT2_NAME)).toEqual([
      FOO_ITEM_2D.name,
      'Unsaved Item',
    ]);
  });
});

describe('blank state', () => {
  it('shows blank state if stored presets is an empty array', () => {
    mockStoredData({ presets: [] });

    const view = doRender();

    expect(view.isBlankStateVisible).toEqual(true);
  });

  it('shows blank state if stored presets is null', () => {
    mockStoredData({ presets: null });

    const view = doRender();

    expect(view.isBlankStateVisible).toEqual(true);
  });

  it('hides blank state if stored preset is available', () => {
    mockStoredData({ presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.isBlankStateVisible).toEqual(false);
  });

  it('can create a new counter from blank state', () => {
    mockStoredData({ presets: [] });

    const view = doRender();
    view.createNewCounterViaBlankState();

    expect(view.headerTitleText).toEqual(NEW_NAME);
  });
});

describe('header interactions', () => {
  it('shows current preset title', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();

    expect(view.headerTitleText).toEqual(FOO_PRESET.name);
  });

  it('can add a category', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.addCategory();

    expect(view.categoryLabels).toEqual([
      FOO_CAT1_NAME,
      FOO_CAT2_NAME,
      NEW_NAME,
    ]);
  });

  it('can rename current counter', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.renameCounterViaHeaderButton();

    expect(view.headerTitleText).toEqual(NEW_NAME);
  });

  it('disables save button if there are no changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.isSaveButtonDisabled).toEqual(true);
  });

  it('can save current counter if there are changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeCategory(FOO_CAT1_NAME);
    expect(view.isSaveButtonDisabled).toEqual(false);

    view.saveCounterViaHeaderButton();
    expect(view.isSaveButtonDisabled).toEqual(true);
  });

  it('shows blank state after deleting one and only preset', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.deleteCounterViaHeaderButton();

    expect(view.isBlankStateVisible).toEqual(true);
  });

  it('shows first alphabetical preset after deleting one of many presets', () => {
    mockStoredData({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET],
    });

    const view = doRender();
    view.deleteCounterViaHeaderButton();

    expect(view.headerTitleText).toEqual(BAR_PRESET.name);
  });
});

describe('header menu interactions', () => {
  it('can clear all categories', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.clearAllCategories();

    expect(view.categoryLabels).toEqual([]);
  });

  it('can clear all item counts', () => {
    const state = buildState(FOO_PRESET, {
      itemCounts: {
        [FOO_ITEM_1A.id]: 5,
        [FOO_ITEM_1B.id]: 0,
        [FOO_ITEM_1C.id]: 10,
        [FOO_ITEM_2D.id]: 3,
      },
    });
    mockStoredData({ state, presets: [FOO_PRESET] });

    const view = doRender();
    view.clearItemCounts();

    expect(view.itemCountsForCategory(FOO_CAT1_NAME)).toEqual(['0', '0', '0']);
    expect(view.itemCountsForCategory(FOO_CAT2_NAME)).toEqual(['0']);
  });

  it('shows preset options in alphabetical order', () => {
    mockStoredData({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET],
    });

    const view = doRender();

    expect(view.menuPresetOptionLabels).toEqual([
      BAR_PRESET.name,
      BAZ_PRESET.name,
      FOO_PRESET.name,
    ]);
  });

  it('can select a counter', async () => {
    mockStoredData({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET],
    });

    const view = doRender();
    await view.selectPreset(BAR_PRESET.name);

    expect(view.headerTitleText).toEqual(BAR_PRESET.name);
    expect(view.categoryLabels).toEqual([BAR_CAT3_NAME]);
  });

  it('can create a new counter', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.createNewCounterViaMenuOption();

    expect(view.headerTitleText).toEqual(NEW_NAME);
  });

  it('can rename current counter', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });
    const view = doRender();
    view.renameViaMenuOption();

    expect(view.headerTitleText).toEqual(NEW_NAME);
  });

  it('disables save option if there are no changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.saveMenuOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('can save current counter if there are changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeCategory(FOO_CAT1_NAME);
    expect(view.saveMenuOption).toHaveAttribute('aria-disabled', 'false');

    view.saveViaMenuOption();
    expect(view.saveMenuOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('can delete current counter', async () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.deleteViaMenuOption();

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/delete counter/i)
    );
    expect(view.headerTitleText).toEqual(BAR_PRESET.name);
  });
});

describe('categories', () => {
  it('shows category names', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();

    expect(view.categoryLabels).toEqual([FOO_CAT1_NAME, FOO_CAT2_NAME]);
  });

  it('can rename a category', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.renameCategory(FOO_CAT1_NAME);

    expect(view.categoryLabels).toEqual([NEW_NAME, FOO_CAT2_NAME]);
  });

  it('can delete a category', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeCategory(FOO_CAT1_NAME);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/delete category/i)
    );
    expect(view.categoryLabels).toEqual([FOO_CAT2_NAME]);
  });
});

describe('items', () => {
  it('shows item names', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();

    expect(view.itemNamesForCategory(FOO_CAT1_NAME)).toEqual([
      FOO_ITEM_1A.name,
      FOO_ITEM_1B.name,
      FOO_ITEM_1C.name,
    ]);
    expect(view.itemNamesForCategory(FOO_CAT2_NAME)).toEqual([
      FOO_ITEM_2D.name,
    ]);
  });

  it('shows item counts', () => {
    const state = buildState(FOO_PRESET, {
      itemCounts: {
        [FOO_ITEM_1A.id]: 1,
        [FOO_ITEM_1B.id]: 2,
        [FOO_ITEM_1C.id]: 0,
        [FOO_ITEM_2D.id]: 3,
      },
    });
    mockStoredData({ state, presets: [FOO_PRESET] });

    const view = doRender();

    expect(view.itemCountsForCategory(FOO_CAT1_NAME)).toEqual(['1', '2', '0']);
    expect(view.itemCountsForCategory(FOO_CAT2_NAME)).toEqual(['3']);
  });

  it('can add an item', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.addItemForCategory(NEW_NAME, FOO_CAT2_NAME);

    expect(view.itemNamesForCategory(FOO_CAT1_NAME)).toEqual([
      FOO_ITEM_1A.name,
      FOO_ITEM_1B.name,
      FOO_ITEM_1C.name,
    ]);
    expect(view.itemNamesForCategory(FOO_CAT2_NAME)).toEqual([
      FOO_ITEM_2D.name,
      NEW_NAME,
    ]);
  });

  it('can increment item', () => {
    const state = buildState(FOO_PRESET, {
      itemCounts: { [FOO_ITEM_1A.id]: 1 },
    });
    mockStoredData({ state, presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.itemCountsForCategory(FOO_CAT1_NAME)).toEqual(['1', '0', '0']);

    view.incrementItemForCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);
    expect(view.itemCountsForCategory(FOO_CAT1_NAME)).toEqual(['2', '0', '0']);
  });

  it('can rename item', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.renameItemInCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);

    expect(view.itemNamesForCategory(FOO_CAT1_NAME)).toEqual([
      NEW_NAME,
      FOO_ITEM_1B.name,
      FOO_ITEM_1C.name,
    ]);
  });

  it('can delete item', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeItemInCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/delete item/i)
    );
    expect(view.itemNamesForCategory(FOO_CAT1_NAME)).toEqual([
      FOO_ITEM_1B.name,
      FOO_ITEM_1C.name,
    ]);
  });
});

describe('unsaved content warnings', () => {
  it('warns before switching counters when there are item counts', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.incrementItemForCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);
    view.selectPreset(BAR_PRESET.name);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/discard.*counts/i)
    );
  });

  it('warns before switching counters when there are unsaved preset changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.addItemForCategory(NEW_NAME, FOO_CAT1_NAME);
    view.selectPreset(BAR_PRESET.name);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/without saving changes/i)
    );
  });

  it('warns before switching counters when there are item counts & unsaved preset changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.incrementItemForCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);
    view.addItemForCategory(NEW_NAME, FOO_CAT1_NAME);
    view.selectPreset(BAR_PRESET.name);

    expect(window.confirm).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/discard.*counts/i)
    );
    expect(window.confirm).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/without saving changes/i)
    );
  });

  it('warns before creating counter when there are item counts', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.incrementItemForCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);
    view.createNewCounterViaMenuOption(BAR_PRESET.name);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/discard.*counts/i)
    );
  });

  it('warns before creating counter when there are unsaved preset changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.addItemForCategory(NEW_NAME, FOO_CAT1_NAME);
    view.createNewCounterViaMenuOption(BAR_PRESET.name);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringMatching(/without saving changes/i)
    );
  });

  it('warns before creating counter when there are item counts & unsaved preset changes', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.incrementItemForCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);
    view.addItemForCategory(NEW_NAME, FOO_CAT1_NAME);
    view.createNewCounterViaMenuOption(BAR_PRESET.name);

    expect(window.confirm).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/discard.*counts/i)
    );
    expect(window.confirm).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/without saving changes/i)
    );
  });
});

describe('persisting state & presets', () => {
  it('persists state & presets on create new counter', () => {
    mockStoredData({ presets: [] });

    const view = doRender();
    view.createNewCounterViaBlankState();

    expectSetItem(localStorage.setItem, 'counterState', {
      name: NEW_NAME,
      items: [],
      categories: [],
    });
    expectSetItem(localStorage.setItem, 'counterPresets', [
      { name: NEW_NAME, id: `preset-${NOW_DATE}`, items: [], categories: [] },
    ]);
  });

  it('persists state & presets on rename current counter', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.renameCounterViaHeaderButton();

    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      name: NEW_NAME,
    });
    expectSetItem(localStorage.setItem, 'counterPresets', [
      { ...FOO_PRESET, name: NEW_NAME },
    ]);
  });

  it('persists state & presets on save current counter', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeCategory(FOO_CAT1_NAME);
    view.saveCounterViaHeaderButton();

    const updatedCategories = [{ id: FOO_CAT2_ID, name: FOO_CAT2_NAME }];
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      categories: updatedCategories,
    });
    expectSetItem(localStorage.setItem, 'counterPresets', [
      { ...FOO_PRESET, categories: updatedCategories },
    ]);
  });

  it('persists state & presets on delete current counter', () => {
    mockStoredData({
      state: FOO_STATE,
      presets: [FOO_PRESET, BAR_PRESET],
    });

    const view = doRender();
    view.deleteCounterViaHeaderButton();

    expectSetItem(localStorage.setItem, 'counterState', buildState(BAR_PRESET));
    expectSetItem(localStorage.setItem, 'counterPresets', [BAR_PRESET]);
  });

  it('persists state on select counter', async () => {
    mockStoredData({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET],
    });

    const view = doRender();
    await view.selectPreset(BAR_PRESET.name);

    expectSetItem(localStorage.setItem, 'counterState', buildState(BAR_PRESET));
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on add new category', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.addCategory();

    const updatedCategories = FOO_STATE.categories.concat([
      { name: NEW_NAME, id: `cat-${NOW_DATE}` },
    ]);
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      categories: updatedCategories,
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on rename category', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.renameCategory(FOO_CAT1_NAME);

    const updatedCategories = [
      { id: FOO_CAT1_ID, name: NEW_NAME },
      { id: FOO_CAT2_ID, name: FOO_CAT2_NAME },
    ];
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      categories: updatedCategories,
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on delete category', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeCategory(FOO_CAT1_NAME);

    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      categories: [{ id: FOO_CAT2_ID, name: FOO_CAT2_NAME }],
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on clear all categories', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.clearAllCategories();

    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      categories: [],
      items: [],
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on add item', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.addItemForCategory(NEW_NAME, FOO_CAT2_NAME);

    const updatedItems = FOO_STATE.items.concat([
      {
        id: `item-${NOW_DATE}`,
        name: NEW_NAME,
        categoryId: FOO_CAT2_ID,
        count: 0,
      },
    ]);
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      items: updatedItems,
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on increment item', () => {
    const state = buildState(FOO_PRESET, {
      itemCounts: { [FOO_ITEM_1A.id]: 1 },
    });
    mockStoredData({ state, presets: [FOO_PRESET] });

    const view = doRender();
    view.incrementItemForCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);

    const updatedItems = [
      buildStateItem(FOO_ITEM_1A, { count: 2 }),
      buildStateItem(FOO_ITEM_1B),
      buildStateItem(FOO_ITEM_1C),
      buildStateItem(FOO_ITEM_2D),
    ];
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      items: updatedItems,
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on rename item', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.renameItemInCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);

    const updatedItems = [
      buildStateItem(FOO_ITEM_1A, { name: NEW_NAME }),
      buildStateItem(FOO_ITEM_1B),
      buildStateItem(FOO_ITEM_1C),
      buildStateItem(FOO_ITEM_2D),
    ];
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      items: updatedItems,
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on delete item', () => {
    mockStoredData({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.removeItemInCategory(FOO_ITEM_1A.name, FOO_CAT1_NAME);

    const updatedItems = FOO_STATE.items.filter(
      item => item.name !== FOO_ITEM_1A.name
    );
    expectSetItem(localStorage.setItem, 'counterState', {
      ...FOO_STATE,
      items: updatedItems,
    });
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });

  it('persists state on clear all item counts', () => {
    const state = buildState(FOO_PRESET, {
      itemCounts: { [FOO_ITEM_1A.id]: 5 },
    });
    mockStoredData({ state, presets: [FOO_PRESET] });

    const view = doRender();
    view.clearItemCounts();

    const stateWithClearedCounts = buildState(FOO_PRESET);
    expectSetItem(localStorage.setItem, 'counterState', stateWithClearedCounts);
    expectSetItemNotCalled(localStorage.setItem, 'counterPresets');
  });
});
