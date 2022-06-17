import find from 'lodash/find';

import BasePO from 'tests/page-objects/Base.po';
import CounterCategoryPO from 'app/components/Counter/CounterCategory.po';
import CounterHeaderPO from 'app/components/Counter/CounterHeader.po';

const TEST_IDS = {
  COUNTER_CATEGORY: 'CounterCategory',
  BLANK_STATE_CREATE_BUTTON: 'Counter-createNew',

};

export default class CounterPO extends BasePO {
  constructor() {
    super(...arguments);

    // Related Components
    this.header = new CounterHeaderPO({ scope: this.scope });
  }

  get categories() {
    return this.collection(TEST_IDS.COUNTER_CATEGORY, {
      PageObject: CounterCategoryPO,
    });
  }

  // Header

  get headerTitleText() {
    return this.header.titleText;
  }
  get isSaveButtonDisabled() {
    return this.header.isSaveButtonDisabled;
  }
  addCategory() {
    this.header.addCategory();
  }
  renameViaHeaderButton() {
    this.header.clickRenameButton();
  }
  saveViaHeaderButton() {
    this.header.clickSaveButton();
  }
  deleteViaHeaderButton() {
    this.header.clickDeleteButton();
  }

  // Header Dropdown Menu

  get menuPresetOptionLabels() {
    return this.header.presetTitles;
  }
  get saveMenuOption() {
    return this.header.saveMenuOption;
  }
  clearAllCategories() {
    this.header.clearCategories();
  }
  clearItemCounts() {
    this.header.clearItemCounts();
  }
  selectPreset(presetName) {
    this.header.selectPreset(presetName);
  }
  renameViaMenuOption() {
    this.header.clickRenameMenuOption();
  }
  saveViaMenuOption() {
    this.header.clickSaveMenuOption();
  }
  deleteViaMenuOption() {
    this.header.clickDeleteMenuOption();
  }

  // Blank State

  get isBlankStateVisible() {
    return this.isTestIdVisible(TEST_IDS.BLANK_STATE_CREATE_BUTTON);
  }
  createNewCounterFromBlankState() {
    this.clickByTestId(TEST_IDS.BLANK_STATE_CREATE_BUTTON);
  }

  // Categories

  get categoryLabels() {
    return this.categories.map(item => item.nameText);
  }
  itemCountsForCategory(categoryName) {
    return this._findCategory(categoryName).itemCounts;
  }

  _findCategory(categoryName) {
    return find(this.categories, { nameText: categoryName });
  }
}
