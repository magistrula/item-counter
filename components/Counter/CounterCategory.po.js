import find from 'lodash/find';

import BasePO from 'tests/page-objects/Base.po';
import CounterItemPO from 'app/components/Counter/CounterItem.po';

const TEST_IDS = {
  COUNTER_ITEM: 'CounterItem',
  ITEM_INPUT: 'CounterCategory-itemInput',
  NAME_TEXT: 'CounterCategory-name',
  REMOVE_BUTTON: 'CounterCategory-remove',
  RENAME_BUTTON: 'CounterCategory-rename',
};

export default class CounterCategoryPO extends BasePO {
  // Category Controls

  get nameText() {
    return this.textForTestId(TEST_IDS.NAME_TEXT);
  }
  renameCategory() {
    this.clickByTestId(TEST_IDS.RENAME_BUTTON);
  }
  removeCategory() {
    this.clickByTestId(TEST_IDS.REMOVE_BUTTON);
  }

  // Items

  get items() {
    return this.collection(TEST_IDS.COUNTER_ITEM, {
      PageObject: CounterItemPO,
    });
  }
  get itemNames() {
    return this.items.map(item => item.nameText);
  }
  get itemCounts() {
    return this.items.map(item => item.countTextL);
  }
  addItem(itemName) {
    this.fireEventOnTestId('change', TEST_IDS.ITEM_INPUT, {
      target: { value: itemName }
    });
    this.fireEventOnTestId('keyDown', TEST_IDS.ITEM_INPUT, {
      keyCode: 13
    });
  }
  incrementItemCount(itemName) {
    this._findItem(itemName).clickMainButton();
  }
  decrementItemCount(itemName) {
    this._findItem(itemName).decrementCount();
  }
  removeItem(itemName) {
    this._findItem(itemName).removeItem();
  }
  renameItem(itemName) {
    this._findItem(itemName).renameItem();
  }
  clearItemCount(itemName) {
    this._findItem(itemName).clearItemCount();
  }
  _findItem(itemName) {
    return find(this.items, { nameText: itemName });
  }
}
