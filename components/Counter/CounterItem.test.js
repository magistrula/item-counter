/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import CounterItem from 'app/components/Counter/CounterItem';
import CounterItemPO from 'app/components/Counter/CounterItem.po';

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

  return new CounterItemPO({ scope: container });
}

it('displays item name', () => {
  const view = doRender({ itemName: 'My Item' });
  expect(view.nameText).toEqual('My Item');
});

it('displays item counts', () => {
  const view = doRender({ itemCount: 7 });
  expect(view.countTextL).toEqual('7');
  expect(view.countTextR).toEqual('7');
});

it('can increment item count', () => {
  const incrementStub = jest.fn();

  const view = doRender({ increment: incrementStub });
  view.clickMainButton();

  expect(incrementStub).toHaveBeenCalledWith(ITEM_ID, 1);
});

it('disables decrement button if count = 0', () => {
  const incrementStub = jest.fn();

  const view = doRender({ itemCount: 0, increment: incrementStub });
  view.decrementCount();

  expect(incrementStub).not.toHaveBeenCalled();
});

it('can decrement item count if count > 0', () => {
  const incrementStub = jest.fn();

  const view = doRender({ itemCount: 5, increment: incrementStub });
  view.decrementCount();

  expect(incrementStub).toHaveBeenCalledWith(ITEM_ID, -1);
});

it('hides clear count option if count = 0', async () => {
  const view = doRender({ itemCount: 0 });
  expect(view.hasClearItemCountOption).toEqual(false);
});

it('can clear count if count is > 0', async () => {
  const incrementStub = jest.fn();

  const view = doRender({ increment: incrementStub, itemCount: 5 });
  view.clearItemCount();

  expect(incrementStub).toHaveBeenCalledWith(ITEM_ID, -5);
});

it('can rename item', async () => {
  const renameStub = jest.fn();

  const view = doRender({ itemCount: 5, rename: renameStub });
  view.renameItem();

  expect(renameStub).toHaveBeenCalledWith(ITEM_ID, ITEM_NAME);
});

it('can remove item', async () => {
  const removeStub = jest.fn();

  const view = doRender({ itemCount: 5, remove: removeStub });
  view.removeItem();

  expect(removeStub).toHaveBeenCalledWith(ITEM_ID, ITEM_NAME);
});
