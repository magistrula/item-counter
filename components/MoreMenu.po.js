import BasePO from 'tests/page-objects/Base.po';

const TEST_IDS = {
  TOGGLE_BUTTON: 'MoreMenu-toggle',
};

export default class MoreMenuPO extends BasePO {
  toggleMenu() {
    this.clickByTestId(TEST_IDS.TOGGLE_BUTTON);
  }
}
