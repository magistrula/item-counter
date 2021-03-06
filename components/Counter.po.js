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
  // TODO: Come up with a way to alias properties & methods of
  // related components (e.g., this.header) to make the code below less verbose

  get headerTitleText() {
    return this.header.titleText;
  }
  get isSaveButtonDisabled() {
    return this.header.isSaveButtonDisabled;
  }
  addCategory() {
    this.header.addCategory();
  }
  renameCounterViaHeaderButton() {
    this.header.clickRenameButton();
  }
  saveCounterViaHeaderButton() {
    this.header.clickSaveButton();
  }
  deleteCounterViaHeaderButton() {
    this.header.clickDeleteButton();
  }

  // Header Dropdown Menu
  // TODO: Come up with a way to alias properties & methods of
  // related components (e.g., this.header) to make the code below less verbose

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
  createNewCounterViaMenuOption() {
    this.header.clickNewCounterMenuOption();
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
  createNewCounterViaBlankState() {
    this.clickByTestId(TEST_IDS.BLANK_STATE_CREATE_BUTTON);
  }

  // Categories

  get categoryLabels() {
    return this.categories.map(item => item.nameText);
  }
  renameCategory(currName) {
    this._findCategory(currName).renameCategory();
  }
  removeCategory(currName) {
    this._findCategory(currName).removeCategory();
  }
  _findCategory(categoryName) {
    return find(this.categories, { nameText: categoryName });
  }

  //  Items

  itemCountsForCategory(categoryName) {
    return this._findCategory(categoryName).itemCounts;
  }
  itemNamesForCategory(categoryName) {
    return this._findCategory(categoryName).itemNames;
  }
  addItemForCategory(itemName, categoryName) {
    const category = this._findCategory(categoryName);
    category.addItem(itemName);
  }
  incrementItemForCategory(itemName, categoryName) {
    const category = this._findCategory(categoryName);
    category.incrementItemCount(itemName);
  }
  renameItemInCategory(itemName, categoryName) {
    const category = this._findCategory(categoryName);
    category.renameItem(itemName);
  }
  removeItemInCategory(itemName, categoryName) {
    const category = this._findCategory(categoryName);
    category.removeItem(itemName);
  }
}
