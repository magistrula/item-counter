import BasePO from 'tests/page-objects/Base.po';
import MoreMenuPO from 'app/components/MoreMenu.po';

const TEST_IDS = {
  CLEAR_OPTION: 'CounterItem-reset',
  COUNT_TEXT_L: 'CounterItem-countL',
  COUNT_TEXT_R: 'CounterItem-countR',
  DECREMENT_BUTTON: 'CounterItem-decrement',
  MAIN_BUTTON: 'CounterItem-mainButton',
  MORE_MENU: 'MoreMenu',
  NAME_TEXT: 'CounterItem-name',
  REMOVE_OPTION: 'CounterItem-remove',
  RENAME_OPTION: 'CounterItem-rename',
};

export default class CounterItemPO extends BasePO {
  constructor() {
    super(...arguments);

    // Related Components
    this.moreMenu = new MoreMenuPO({
      scope: this.getByTestId(TEST_IDS.MORE_MENU),
    });
  }

  // Main Button

  get nameText() {
    return this.textForTestId(TEST_IDS.NAME_TEXT);
  }
  get countTextL() {
    return this.textForTestId(TEST_IDS.COUNT_TEXT_L);
  }
  get countTextR() {
    return this.textForTestId(TEST_IDS.COUNT_TEXT_R);
  }
  clickMainButton() {
    this.clickByTestId(TEST_IDS.MAIN_BUTTON);
  }
  decrementCount() {
    this.clickByTestId(TEST_IDS.DECREMENT_BUTTON);
  }

  // More Menu

  get hasClearItemCountOption() {
    this.moreMenu.toggleMenu();
    return this.isTestIdVisible(TEST_IDS.CLEAR_OPTION, { resetScope: true });
  }
  removeItem() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.REMOVE_OPTION, { resetScope: true });
  }
  renameItem() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.RENAME_OPTION, { resetScope: true });
  }
  clearItemCount() {
    this.moreMenu.toggleMenu();
    this.clickByTestId(TEST_IDS.CLEAR_OPTION, { resetScope: true });
  }
}
