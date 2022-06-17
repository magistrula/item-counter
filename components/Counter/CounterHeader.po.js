import { act } from '@testing-library/react';
import find from 'lodash/find';

import BasePO from 'tests/page-objects/Base.po';
import MoreMenuPO from 'app/components/MoreMenu.po';

const TEST_IDS = {
  ADD_CATEGORY_BUTTON: 'CounterHeader-addCategory',
  CLEAR_CATEGORIES_MENU_OPTION: 'CounterHeaderMenu-clearCategories',
  CLEAR_COUNTS_MENU_OPTION: 'CounterHeaderMenu-clearCounts',
  CREATE_NEW_MENU_OPTION: 'CounterHeaderMenu-createNew',
  DELETE_BUTTON: 'CounterHeader-delete',
  DELETE_MENU_OPTION: 'CounterHeaderMenu-delete',
  MORE_MENU: 'CounterHeaderMenu-MoreMenu',
  PRESET_MENU_OPTION: 'CounterHeaderMenu-presetItem',
  RENAME_BUTTON: 'CounterHeader-rename',
  RENAME_MENU_OPTION: 'CounterHeaderMenu-rename',
  SAVE_BUTTON: 'CounterHeader-save',
  SAVE_MENU_OPTION: 'CounterHeaderMenu-save',
  TITLE_TEXT: 'CounterHeader-title',
};

export default class CounterHeaderPO extends BasePO {
  constructor() {
    super(...arguments);

    // Related Components
    this.moreMenu = new MoreMenuPO({
      scope: this.getByTestId(TEST_IDS.MORE_MENU),
    });
  }

  // Top Bar

  get titleText() {
    return this.textForTestId(TEST_IDS.TITLE_TEXT);
  }
  get isSaveButtonDisabled() {
    return this.getByTestId(TEST_IDS.SAVE_BUTTON).disabled;
  }
  addCategory() {
    this.clickByTestId(TEST_IDS.ADD_CATEGORY_BUTTON);
  }
  clickRenameButton() {
    this.clickByTestId(TEST_IDS.RENAME_BUTTON);
  }
  clickSaveButton() {
    this.clickByTestId(TEST_IDS.SAVE_BUTTON);
  }
  clickDeleteButton() {
    this.clickByTestId(TEST_IDS.DELETE_BUTTON);
  }

  // More Menu

  get presetMenuOptions() {
    this.moreMenu.toggleMenu();
    return this.getAllByTestId(TEST_IDS.PRESET_MENU_OPTION, {
      resetScope: true,
    });
  }
  get presetTitles() {
    this.moreMenu.toggleMenu();
    return this.presetMenuOptions.map(item => item.textContent);
  }
  get saveMenuOption() {
    this.moreMenu.toggleMenu();
    return this.queryByTestId(TEST_IDS.SAVE_MENU_OPTION, {
      resetScope: true,
    });
  }
  clearCategories() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.CLEAR_CATEGORIES_MENU_OPTION, {
      resetScope: true,
    });
  }
  clearItemCounts() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.CLEAR_COUNTS_MENU_OPTION, {
      resetScope: true,
    });
  }
  async selectPreset(presetName) {
    this.moreMenu.toggleMenu();
    await act(() => {
      this._findPreset(presetName).click();
    });
  }
  clickRenameMenuOption() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.RENAME_MENU_OPTION, {
      resetScope: true,
    });
  }
  clickSaveMenuOption() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.SAVE_MENU_OPTION, {
      resetScope: true,
    });
  }
  clickDeleteMenuOption() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.DELETE_MENU_OPTION, {
      resetScope: true,
    });
  }
  _findPreset(presetName) {
    return find(this.presetMenuOptions, { textContent: presetName });
  }
}
