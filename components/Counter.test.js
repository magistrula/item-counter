/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { mockGetItem, mockSetItem } from 'tests/mock-local-storage';
import { buildStateFromPreset } from 'tests/counter-state';

import Counter from 'app/components/Counter';
import CounterPageObject from 'app/components/Counter.po';

const FOO_PRESET_NAME = 'Foo Counter';
const FOO_CAT1_ID = 'foo-cat-1-id';
const FOO_CAT1_NAME = 'Foo Category 1';
const FOO_CAT2_ID = 'foo-cat-2-id';
const FOO_CAT2_NAME = 'Foo Category 2';
const FOO_ITEM_1A = { id: 'item-a-id', name: 'Item A', categoryId: FOO_CAT1_ID };
const FOO_ITEM_1B = { id: 'item-b-id', name: 'Item B', categoryId: FOO_CAT1_ID };
const FOO_ITEM_1C = { id: 'item-c-id', name: 'Item C', categoryId: FOO_CAT1_ID };
const FOO_ITEM_2D = { id: 'item-d-id', name: 'Item D', categoryId: FOO_CAT2_ID };
const FOO_PRESET = {
  id: 'foo-preset',
  name: FOO_PRESET_NAME,
  categories: [
    { id: FOO_CAT1_ID, name: FOO_CAT1_NAME },
    { id: FOO_CAT2_ID, name: FOO_CAT2_NAME },
  ],
  items: [FOO_ITEM_1A, FOO_ITEM_1B, FOO_ITEM_1C, FOO_ITEM_2D],
};
const FOO_STATE = buildStateFromPreset(FOO_PRESET);

const BAR_PRESET_NAME = 'Bar Counter';
const BAR_CAT3_ID = 'bar-cat-3-id';
const BAR_CAT3_NAME = 'Bar Category 3';
const BAR_ITEM_3E = { id: 'item-e-id', name: 'Item F', categoryId: BAR_CAT3_ID };
const BAR_ITEM_3F = { id: 'item-f-id', name: 'Item G', categoryId: BAR_CAT3_ID };
const BAR_PRESET = {
  id: 'bar-preset',
  name: BAR_PRESET_NAME,
  categories: [{ id: BAR_CAT3_ID, name: BAR_CAT3_NAME }],
  items: [BAR_ITEM_3E, BAR_ITEM_3F],
};

const BAZ_PRESET_NAME = 'Baz Counter';
const BAZ_PRESET = {
  id: 'baz-preset',
  name: BAZ_PRESET_NAME,
  categories: [],
  items: [],
};

function doRender() {
  const { container } = render(<Counter />);
  return new CounterPageObject({ scope: container });
}

function mockLocalStorage({ presets, state } = {}) {
  mockGetItem(key => {
    if (key === 'counterState') {
      return JSON.stringify(state || null)
    }

    if (key === 'counterPresets') {
      return JSON.stringify(presets || null);
    }

    throw new Error('Unexpected localStorage lookup');
  });

  mockSetItem();
}

beforeEach(() => {
  mockLocalStorage();
  jest.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('blank state', () => {
  it('shows blank state if stored presets is an empty array', () => {
    mockLocalStorage({ presets: [] });

    const view = doRender();

    expect(view.isBlankStateVisible).toEqual(true);
  });

  it('shows blank state if stored presets is null', () => {
    mockLocalStorage({ presets: null });

    const view = doRender();

    expect(view.isBlankStateVisible).toEqual(true);
  });

  it('hides blank state if stored preset is available', () => {
    mockLocalStorage({ presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.isBlankStateVisible).toEqual(false);
  });

  it('can create a new counter from blank state', () => {
    mockLocalStorage({ presets: [] });
    jest.spyOn(window, 'prompt').mockReturnValue('My Counter');

    const view = doRender();
    view.createNewCounterFromBlankState();

    expect(view.headerTitleText).toEqual('My Counter');
  });
});

describe('header interactions', () => {
  it('shows current preset title', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();

    expect(view.headerTitleText).toEqual(FOO_PRESET_NAME);
  });

  it('can add a category', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });
    jest.spyOn(window, 'prompt').mockReturnValue('New Category');

    const view = doRender();
    view.addCategory();

    expect(view.categoryLabels).toEqual([
      FOO_CAT1_NAME,
      FOO_CAT2_NAME,
      'New Category',
    ]);
  });

  it('can rename current counter', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });
    jest.spyOn(window, 'prompt').mockReturnValue('New Counter Name');

    const view = doRender();
    view.renameViaHeaderButton();

    expect(view.headerTitleText).toEqual('New Counter Name');
  });

  it('can save current counter if there are changes', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });
    jest.spyOn(window, 'prompt').mockReturnValue('New Category');

    const view = doRender();
    view.addCategory();
    expect(view.isSaveButtonDisabled).toEqual(false);

    view.saveViaHeaderButton();
    expect(view.isSaveButtonDisabled).toEqual(true);
  });

  it('disables save button if there are no changes', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.isSaveButtonDisabled).toEqual(true);
  });

  it('shows blank state after deleting one and only preset', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.deleteViaHeaderButton();

    expect(view.isBlankStateVisible).toEqual(true);
  });

  it('shows first alphabetical preset after deleting one of many', () => {
    mockLocalStorage({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET]
    });

    const view = doRender();
    view.deleteViaHeaderButton();

    expect(view.headerTitleText).toEqual(BAR_PRESET_NAME);
  });
});

describe('header menu interactions', () => {
  it('can clear all categories', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    view.clearAllCategories();

    expect(view.categoryLabels).toEqual([]);
  });

  it('can clear all item counts', () => {
    const state = buildStateFromPreset(FOO_PRESET, {
      itemCounts: {
        [FOO_ITEM_1A.id]: 5,
        [FOO_ITEM_1B.id]: 0,
        [FOO_ITEM_1C.id]: 10,
        [FOO_ITEM_2D.id]: 3,
      }
    });
    mockLocalStorage({ state, presets: [FOO_PRESET] });

    const view = doRender();
    view.clearItemCounts();

    expect(view.itemCountsForCategory(FOO_CAT1_NAME)).toEqual(['0', '0', '0']);
    expect(view.itemCountsForCategory(FOO_CAT2_NAME)).toEqual(['0']);
  });

  it('shows preset options in alphabetical order', () => {
    mockLocalStorage({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET]
    });

    const view = doRender();

    expect(view.menuPresetOptionLabels).toEqual([
      BAR_PRESET_NAME,
      BAZ_PRESET_NAME,
      FOO_PRESET_NAME,
    ]);
  });

  it('can select a preset', async () => {
    mockLocalStorage({
      state: FOO_STATE,
      presets: [BAZ_PRESET, FOO_PRESET, BAR_PRESET]
    });

    const view = doRender();
    await view.selectPreset(BAR_PRESET_NAME);

    expect(view.headerTitleText).toEqual(BAR_PRESET_NAME);
    expect(view.categoryLabels).toEqual([BAR_CAT3_NAME]);
  });

  it('can rename current preset', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });
    jest.spyOn(window, 'prompt').mockReturnValue('New Counter Name');

    const view = doRender();
    view.renameViaMenuOption();

    expect(view.headerTitleText).toEqual('New Counter Name');
  });

  it('can save current counter if there are changes', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });
    jest.spyOn(window, 'prompt').mockReturnValue('New Category');

    const view = doRender();
    view.addCategory();
    expect(view.saveMenuOption).toHaveAttribute('aria-disabled', "false");

    view.saveViaMenuOption();
    expect(view.saveMenuOption).toHaveAttribute('aria-disabled', "true");
  });

  it('disables save option if there are no changes', () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET] });

    const view = doRender();
    expect(view.saveMenuOption).toHaveAttribute('aria-disabled', "true");
  });

  it('can delete current preset', async () => {
    mockLocalStorage({ state: FOO_STATE, presets: [FOO_PRESET, BAR_PRESET] });

    const view = doRender();
    view.deleteViaMenuOption();

    expect(view.headerTitleText).toEqual(BAR_PRESET_NAME);
  });
});

describe('items', () => {
  it('can shows item counts', () => {
    const state = buildStateFromPreset(FOO_PRESET, {
      itemCounts: {
        [FOO_ITEM_1A.id]: 1,
        [FOO_ITEM_1B.id]: 2,
        [FOO_ITEM_1C.id]: 0,
        [FOO_ITEM_2D.id]: 3,
      }
    });
    mockLocalStorage({ state, presets: [FOO_PRESET] });

    const view = doRender();

    expect(view.itemCountsForCategory(FOO_CAT1_NAME)).toEqual(['1', '2', '0']);
    expect(view.itemCountsForCategory(FOO_CAT2_NAME)).toEqual(['3']);
  });
});
