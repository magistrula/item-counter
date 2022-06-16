/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import CounterItem from 'Components/Counter/CounterItem';
import CIPO from 'PageObjects/components/Counter/CounterItem';

const ITEM_ID = 'foo-id';
const ITEM_NAME = 'Foo Item';

function doRender({
  itemId = ITEM_ID,
  itemName = ITEM_NAME,
  itemCount = 0,
  increment,
  remove,
  rename,
}) {
  const { container } = render(
    <CounterItem
      itemId={itemId}
      itemName={itemName}
      itemCount={itemCount}
      incrementItem={increment || jest.fn()}
      removeItem={remove || jest.fn()}
      renameItem={rename || jest.fn()}
    />
  );

  return new CIPO({ scope: container });
}

it('displays item name', () => {
  const page = doRender({ itemName: 'My Item' });
  expect(page.nameText).toEqual('My Item');
});

it('displays item counts', () => {
  const page = doRender({ itemCount: 7 });
  expect(page.countTextL).toEqual('7');
  expect(page.countTextR).toEqual('7');
});

it('can increment item count', () => {
  const increment = jest.fn();

  const page = doRender({ increment });
  page.clickMainButton();

  expect(increment).toHaveBeenCalledWith(ITEM_ID, 1);
});

it('disables decrement button if count = 0', () => {
  const increment = jest.fn();

  const page = doRender({ increment, itemCount: 0 });
  page.decrementCount();

  expect(increment).not.toHaveBeenCalled();
});

it('can decrement item count if count > 0', () => {
  const increment = jest.fn();

  const page = doRender({ increment, itemCount: 5 });
  page.decrementCount();

  expect(increment).toHaveBeenCalledWith(ITEM_ID, -1);
});

it('hides clear count option if count = 0', async () => {
  const increment = jest.fn();

  const page = doRender({ increment, itemCount: 0 });

  expect(page.hasClearItemCountOption).toEqual(false);
});

it('can clear count if count is > 0', async () => {
  const increment = jest.fn();

  const page = doRender({ increment, itemCount: 5 });
  page.clearItemCount();

  expect(increment).toHaveBeenCalledWith(ITEM_ID, -5);
});

it('can rename item', async () => {
  const rename = jest.fn();

  const page = doRender({ rename, itemCount: 5 });
  page.renameItem();

  expect(rename).toHaveBeenCalledWith(ITEM_ID, ITEM_NAME);
});

it('can remove item', async () => {
  const remove = jest.fn();

  const page = doRender({ remove, itemCount: 5 });
  page.removeItem();

  expect(remove).toHaveBeenCalledWith(ITEM_ID, ITEM_NAME);
});
